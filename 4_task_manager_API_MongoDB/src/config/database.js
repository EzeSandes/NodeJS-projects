import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../data/db.json');

//# DOC: https://github.com/typicode/lowdb?tab=readme-ov-file#classes
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

export const initDB = async () => {
  await db.read();

  db.data ||= { users: [], notes: [] };

  await db.write();
  return db;
};

export const getDB = () => db;

export const validateEnv = () => {
  const required = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_COOKIE_EXPIRES_IN',
    'RATE_LIMIT_MAX',
    'RATE_LIMIT_WINDOW_MS',
  ];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.log(`❌ Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};
