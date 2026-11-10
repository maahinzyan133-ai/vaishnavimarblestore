
import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { pool } from './config/database.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import catalogRoutes from './routes/catalog.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { requireAdmin } from './middleware/auth.js';
import { uploadDir } from './middleware/upload.js';
import { migrateDatabase } from './scripts/migrate.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Frontend build directory
const frontendDistDir = resolve(__dirname, '../frontend/dist');
const frontendIndexFile = resolve(frontendDistDir, 'index.html');

// Server configuration
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const origins = (
  process.env.CLIENT_ORIGIN ||
  process.env.CORS_ORIGIN ||
  'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.disable('x-powered-by');

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// CORS
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin.replace(/\/+$/, ''))) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  })
);

// Request parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Uploaded images
app.use('/uploads', express.static(uploadDir));

// Frontend static assets
if (existsSync(frontendIndexFile)) {
  app.use(express.static(frontendDistDir));
} else {
  console.error(
    `Frontend build not found: ${frontendIndexFile}`
  );
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      frontend: existsSync(frontendIndexFile)
        ? 'available'
        : 'missing',
      environment: NODE_ENV,
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', requireAdmin, uploadRoutes);
app.use('/api', catalogRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// React Router fallback
app.get('*', (req, res, next) => {
  if (
    req.path === '/api' ||
    req.path.startsWith('/api/') ||
    req.path.startsWith('/uploads/')
  ) {
    return next();
  }

  if (!existsSync(frontendIndexFile)) {
    return res.status(503).send(
      'Frontend build is missing. Please rebuild and redeploy the application.'
    );
  }

  return res.sendFile(frontendIndexFile, error => {
    if (error) {
      next(error);
    }
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    error: 'Route not found',
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS origin not allowed',
    });
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'A record with that name or slug already exists',
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'The selected parent record does not exist',
    });
  }

  const status = Number(error.status) || 500;

  if (status >= 500) {
    console.error('API request failed:', error);
  }

  return res.status(status).json({
    error: status >= 500
      ? 'Internal server error'
      : error.message,
  });
});

// Server instance
let server;
let shuttingDown = false;

// Graceful shutdown
async function shutdown(signal) {
  if (shuttingDown) return;

  shuttingDown = true;
  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close(error => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await pool.end();

    console.log('Server shutdown completed.');
    process.exit(0);
  } catch (error) {
    console.error('Shutdown error:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Start application
async function startServer() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('Invalid PORT configuration');
  }

  const autoMigrate = process.env.AUTO_MIGRATE;

  if (
    autoMigrate !== undefined &&
    !['true', 'false'].includes(autoMigrate.toLowerCase())
  ) {
    throw new Error('AUTO_MIGRATE must be "true" or "false"');
  }

  // Check frontend build
  if (!existsSync(frontendIndexFile)) {
    console.error(
      `WARNING: Frontend build missing at ${frontendIndexFile}`
    );
  } else {
    console.log('Frontend build found successfully.');
  }

  // Verify database
  await pool.query('SELECT 1');
  console.log('MySQL database connected successfully.');

  // Optional database migrations
  if (autoMigrate?.toLowerCase() === 'true') {
    console.log('Running database migrations...');
    await migrateDatabase();
    console.log('Database migrations completed.');
  }

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vaishnavi Marble API running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Frontend directory: ${frontendDistDir}`);
  });

  server.on('error', error => {
    console.error('Server startup error:', error);
    process.exit(1);
  });
}

startServer().catch(async error => {
  console.error('Failed to start Vaishnavi Marble API:', error);

  try {
    await pool.end();
  } catch (dbError) {
    console.error('Database shutdown error:', dbError);
  }

  process.exit(1);
});
