import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/database.js';

export async function migrateDatabase() {
  const schemaUrl = new URL('../sql/schema.sql', import.meta.url);
  const schema = await readFile(schemaUrl, 'utf8');
  const statements = schema.split(';').map(statement => statement.trim()).filter(Boolean);

  if (!statements.length) {
    throw new Error('Database schema is empty');
  }

  for (const statement of statements) {
    await pool.query(statement);
  }

  console.log(`Database schema is up to date (${statements.length} statements).`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  migrateDatabase()
    .catch(error => {
      console.error('Database migration failed:', error);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
