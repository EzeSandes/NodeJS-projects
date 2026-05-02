import mongoose from 'mongoose';
import { env } from '../env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const validateEnv = () => {
  const required = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_COOKIE_EXPIRES_IN',
    'RATE_LIMIT_MAX',
    'RATE_LIMIT_WINDOW_MS',
    'MONGO_URI',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length) {
    console.log(`❌ Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};
