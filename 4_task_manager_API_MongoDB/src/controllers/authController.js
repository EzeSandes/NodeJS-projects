import AppError from '../errors/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { getDB } from '../config/database.js';
import env from '../../env.js';
import { v4 as uuidv4 } from 'uuid';

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
  const { name, email, password, role = 'user' } = req.body;

  const db = getDB();
  const existingUser = db.data.users.find(user => user.email === email);

  if (existingUser) return next(new AppError('User already exists', 400));

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password, // TODO: Hashed in a future
    role,
  };

  db.data.users.push(newUser);
  await db.write();

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and pass exist.
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) Check if user exists & if password is correct
  const db = getDB();
  const user = db.data.users.find(
    u => u.email === email && u.password === password,
  ); // TODO: HASHED

  if (!user) return next(new AppError('Incorrect email or password', 401));

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
