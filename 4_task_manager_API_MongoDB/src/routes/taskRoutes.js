import express from 'express';
import Joi from 'joi';
import { getAllTasks, createTask } from '../controllers/taskController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 150 characters',
  }),
  content: Joi.string().trim().min(5).max(2000).allow('').default('').messages({
    'string.min': 'Content must be at least 5 characters if provided',
  }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priority must be one of: low, medium, high',
    }),
  dueDate: Joi.date().iso().greater('now').allow(null).messages({
    'date.greater': 'Due date must be in the future!',
  }),
  tags: Joi.array().items(Joi.string().trim().max(30)).max(8).default([]),
  role: Joi.string().valid('user', 'admin'),
  isCompleted: Joi.bool().default(false),
});

// ==================== Routes ====================

router.use(protect); // All routes need auth

router.route('/').get(getAllTasks).post(validate(createTaskSchema), createTask);

export default router;
