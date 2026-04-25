import Task from '../models/Task.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/AppError.js';

/**
 * Get all tasks belonging to the logged-in user
 */
export const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks },
  });
});

/**
 * Get a single task by ID (only if it belongs to the user)
 */

export const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) return next(new AppError('No task found with that id', 404));

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

/**
 * Create a new task
 */
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

/**
 * Update a task (title, content, priority, dueDate, tags, isCompleted, etc.)
 */

export const updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    {
      new: true, // return the updated document
      runValidators: true, // run schema validators.
    },
  );

  if (!task) return next(new AppError('No task found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

/**
 * Delete a task (only if it belongs to the user)
 */

export const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) return next(new AppError('No task found with that Id', 404));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
