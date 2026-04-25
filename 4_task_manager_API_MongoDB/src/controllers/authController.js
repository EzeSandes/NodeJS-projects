import AppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import env from '../../env.js';
import User from '../models/User.js';

const signToken = id => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output (if exists)
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  // Everything is supposed to be validated here already.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    active: req.body.active,
  });

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and pass exist.
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) Check if user exists & if password is correct
  const user = await User.findOne({ email }).select('+password');
  /* 
    Find the user by email and explicitly include the 'password' field.
    Since 'password' is defined with 'select: false' in the schema,
    it is excluded by default in queries. Using '+password' overrides
    this behavior and includes it in the result.
 */

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

export const logout = (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 1 * 1000),
  //   httpOnly: true,
  // });

  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
