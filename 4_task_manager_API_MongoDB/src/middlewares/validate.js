import Joi from 'joi';
import AppError from '../errors/AppError.js';

// #DOC: https://joi.dev/api/18.x.x
export const validate = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      console.log(error);
      return next(new AppError(`${error.name} - ${message}`, 400));
    }

    next();
  };
};
