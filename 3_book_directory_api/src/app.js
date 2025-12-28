import express from 'express';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler.js';

import bookRoutes from './routes/book.routes.js';
import AppError from './errors/AppError.js';

const app = express();

/*
|--------------------------------------------------------------------------
| Global middlewares
|--------------------------------------------------------------------------
*/

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Static files (book cover images)
|--------------------------------------------------------------------------
*/

app.use('/images', express.static('src/public/images'));

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
*/

app.use('/api/v1/books', bookRoutes);

/*
|--------------------------------------------------------------------------
| Handle undefined routes
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server.`, 404));
});

/*
|--------------------------------------------------------------------------
| Global error handler
| Always at last

|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
