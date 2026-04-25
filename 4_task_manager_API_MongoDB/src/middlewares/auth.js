import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import env from '../../env.js';
import User from '../models/User.js';

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

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**
 * isLoggedIn Middleware
 *
 * Checks if a user is logged in by verifying the JWT token from httpOnly cookie.
 * Unlike the 'protect' middleware, this one does NOT block the request if the user
 * is not authenticated. Instead, it sets req.user = null and continues execution.
 *
 * Use cases:
 * - Public routes that behave differently for logged-in vs guest users
 * - Displaying user-specific data optionally (e.g. "Welcome back, John")
 * - Conditional UI elements in frontend (via API response)
 * - Routes like /me, dashboard preview, or public pages with personalization
 *
 * This middleware is optional but highly recommended for flexibility.
 */
export const isLoggedIn = async (req, res, nect) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        env.JWT_SECRET,
      );

      // 2 - Check if the user still exists.
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      res.locals.user = currentUser;
    } catch (error) {
      return next();
    }
  }

  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    next();
  };
};
