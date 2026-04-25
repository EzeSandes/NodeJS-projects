import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import Joi from 'joi';

const router = express.Router();

const authSchema = {
  signup: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin'),
    active: Joi.boolean().default(true),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// ==================== Routes ====================

router.post('/signup', validate(authSchema.signup), signup);
router.post('/login', validate(authSchema.login), login);
router.post('/logout', logout);

export default router;
