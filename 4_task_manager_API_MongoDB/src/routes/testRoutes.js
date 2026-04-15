import express from 'express';
import { validate } from '../middlewares/validate.js';
import Joi from 'joi';

const router = express.Router();

// Validation joi
const testSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required - Please provide one',
  }),
  content: Joi.string().min(10).max(1000).required(),
  isPublic: Joi.boolean().default(false),
});

// ======================
// Test Controler
// ======================

const testValidation = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Validation passed successfully!',
    data: {
      receivedData: req.body,
    },
  });
};

// ======================
// Test Route
// ======================

router.route('/test-validation').post(validate(testSchema), testValidation);

export default router;
