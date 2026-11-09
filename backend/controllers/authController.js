import { timingSafeEqual, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const jwtSecret = process.env.JWT_SECRET;

function signToken(user) {
  return jwt.sign(
    { email: user.email, role: 'admin' },
    jwtSecret,
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
  );
}

export async function login(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password;
    if (!email || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await pool.execute(
      'SELECT id, email, password_hash FROM admin_users WHERE email = ? LIMIT 1',
      [email],
    );
    const user = users[0];
    const passwordMatches = user && await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) return res.status(401).json({ error: 'Invalid email or password' });

    return res.json({
      token: signToken(user),
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
}

export async function registerFirstAdmin(req, res, next) {
  try {
    const setupKey = process.env.ADMIN_SETUP_KEY;
    const suppliedKey = req.get('x-admin-setup-key') || '';
    if (!setupKey || Buffer.byteLength(setupKey) !== Buffer.byteLength(suppliedKey) ||
        !timingSafeEqual(Buffer.from(setupKey), Buffer.from(suppliedKey))) {
      return res.status(403).json({ error: 'Admin setup is not authorized' });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ error: 'Provide a valid email and a password of at least 12 characters' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [users] = await connection.execute('SELECT id FROM admin_users LIMIT 1 FOR UPDATE');
      if (users.length) {
        await connection.rollback();
        return res.status(409).json({ error: 'An admin account already exists' });
      }

      const user = { id: randomUUID(), email };
      const passwordHash = await bcrypt.hash(password, 12);
      await connection.execute(
        'INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.id, user.email, passwordHash, 'admin'],
      );
      await connection.commit();

      return res.status(201).json({
        token: signToken(user),
        user,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return next(error);
  }
}

export function currentAdmin(req, res) {
  return res.json({ id: req.user.id, email: req.user.email });
}
