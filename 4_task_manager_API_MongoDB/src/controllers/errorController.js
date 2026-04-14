import AppError from '../errors/AppError.js';
import { isDev, isProd } from '../../env.js';

/*
|--------------------------------------------------------------------------
| Error Handlers
|--------------------------------------------------------------------------
*/

const sendErrorDev = (err, req, res) => {
  ////// API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  ////// API
  if (req.originalUrl.startsWith('/api')) {
    //   A) Operational, trusted error: send message to the client.
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    //   B) Programming or other unknown error: don't leak error details
    console.log('Error ⛔', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

/*
|--------------------------------------------------------------------------
| Global Error
|--------------------------------------------------------------------------
*/

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (isDev()) {
    sendErrorDev(err, req, res);
  } else if (isProd()) {
    let error = { ...err };
    error.message = err.message;

    sendErrorProd(error, req, res);
  }
};
