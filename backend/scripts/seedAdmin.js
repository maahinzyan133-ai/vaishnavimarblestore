import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { migrateDatabase } from './migrate.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const seedLockName = 'vaishnavimarble_initial_admin_seed';

async function seedInitialAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!emailPattern.test(email || '') || email.length > 254) {
    throw new Error('ADMIN_EMAIL must be a valid email address');
  }
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters');
  }

  const autoMigrate = process.env.AUTO_MIGRATE;
  if (autoMigrate !== undefined && !['true', 'false'].includes(autoMigrate.toLowerCase())) {
    throw new Error('AUTO_MIGRATE must be "true" or "false"');
  }
  if (autoMigrate?.toLowerCase() === 'true') {
    await migrateDatabase();
  }

  const connection = await pool.getConnection();
  let lockAcquired = false;
  let transactionStarted = false;

  try {
    const [lockRows] = await connection.execute(
      'SELECT GET_LOCK(?, 10) AS acquired',
      [seedLockName],
    );
    if (lockRows[0].acquired !== 1) {
      throw new Error('Could not acquire the initial-admin setup lock');
    }
    lockAcquired = true;

    await connection.beginTransaction();
    transactionStarted = true;
    const [admins] = await connection.execute('SELECT id FROM admin_users LIMIT 1 FOR UPDATE');

    if (admins.length) {
      await connection.commit();
      transactionStarted = false;
      console.log('An admin account already exists; no account was changed.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      'INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [randomUUID(), email, passwordHash, 'admin'],
    );
    await connection.commit();
    transactionStarted = false;
    console.log(`Created the initial admin account for ${email}. Remove ADMIN_PASSWORD from the environment now.`);
  } catch (error) {
    if (transactionStarted) await connection.rollback();
    throw error;
  } finally {
    if (lockAcquired) {
      await connection.execute('SELECT RELEASE_LOCK(?)', [seedLockName]);
    }
    connection.release();
  }
}

try {
  await seedInitialAdmin();
} catch (error) {
  console.error('Admin seed failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
