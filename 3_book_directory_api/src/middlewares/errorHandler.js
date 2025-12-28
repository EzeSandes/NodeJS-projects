import AppError from '../errors/AppError.js';

/*
|--------------------------------------------------------------------------
| Global error handling middleware
|--------------------------------------------------------------------------
*/

const errorHandler = (err, req, res, next) => {
  let error = err;

  /*
  |--------------------------------------------------------------------------
  | Multer errors
  |--------------------------------------------------------------------------
  */

  if (err.name === 'MulterError') error = new AppError(err.message, 400);

  /*
  |--------------------------------------------------------------------------
  | Unknown errors
  |--------------------------------------------------------------------------
  */

  if (!error.isOperational) {
    console.error('UNEXPECTED ERROR: ', err);
    error = new AppError('Internal server error', 500);
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message,
  });
};

export default errorHandler;
