import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check if token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, env.JWT_SECRET);

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = decoded;
  next();
});
