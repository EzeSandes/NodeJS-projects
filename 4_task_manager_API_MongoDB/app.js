import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { isDev, env } from './env.js';
import globalErrorHandler from './src/controllers/errorController.js';
import AppError from './src/errors/AppError.js';
import testRoutes from './src/routes/testRoutes.js';

const app = express();

/*
|--------------------------------------------------------------------------
| Security & Utilities
|--------------------------------------------------------------------------
*/

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ======= Development logging
if (isDev()) app.use(morgan('dev'));

// ======= Rate Limiting
if (!isDev()) {
  // **Doc: https://express-rate-limit.mintlify.app/quickstart/usage
  const limiter = rateLimit({
    limit: env.RATE_LIMIT_MAX,
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 100,
    message: 'Too many requests from this IP, please try again later.',
  });

  app.use('/api', limiter);
}

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use('/api/v1/test', testRoutes); // ← Agrega esta línea

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Task Manager API is running' });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(globalErrorHandler);

export default app;
