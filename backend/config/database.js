import mysql from 'mysql2/promise';

function readBooleanSetting(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`${name} must be "true" or "false"`);
}

const requiredDatabaseSettings = ['DB_HOST', 'DB_NAME', 'DB_USER'];
const missingSettings = requiredDatabaseSettings.filter(name => !process.env[name]);

if (process.env.DB_PASSWORD === undefined) {
  missingSettings.push('DB_PASSWORD');
}

if (missingSettings.length) {
  throw new Error(`Missing required database settings: ${missingSettings.join(', ')}`);
}

const useSsl = readBooleanSetting('DB_SSL', false);
const rejectUnauthorized = readBooleanSetting('DB_SSL_REJECT_UNAUTHORIZED', true);

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true,
  ...(useSsl ? { ssl: { rejectUnauthorized } } : {}),
});
