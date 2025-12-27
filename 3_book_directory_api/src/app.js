import express from 'express';
import cors from 'cors';

import bookRoutes from './routes/book.routes.js';

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
| Not found handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  res.status(404).json({
    error: 'Internal server Error',
  });
});

export default app;
