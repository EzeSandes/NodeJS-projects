import Task from '../models/Task.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/AppError.js';

export const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.findByUser(req.user.id);

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks },
  });
});

export const createTask = catchAsync(async (req, res, next) => {
  const taskData = {
    ...req.body,
    userId: req.user.id,
  };

  const newTask = await Task.create(taskData);

  res.status(201).json({
    status: 'success',
    data: { task: newTask },
  });
});
