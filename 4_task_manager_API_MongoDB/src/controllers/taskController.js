import Task from '../models/Task.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/AppError.js';
import APIFeature from '../utils/apiFeature.js';

/**
 * Get all tasks belonging to the logged-in user
 *
 * Examples:
 * GET /api/v1/tasks?search=nodejs
 * GET /api/v1/tasks?isCompleted=false&priority=high
 * GET /api/v1/tasks?dueDate[gte]=2026-05-01
 * GET /api/v1/tasks?sort=-createdAt
 * GET /api/v1/tasks?page=2&limit=10
 * GET /api/v1/tasks?search=backend&isCompleted=false&sort=priority
 */
export const getAllTasks = catchAsync(async (req, res, next) => {
  // Start with tasks that belong ONLY to the logged-in user
  // NOTA: Sin 'await' - query debe ser un objeto Query de Mongoose, no un array ejecutado
  const query = Task.find({ userId: req.user.id });

  const features = new APIFeature(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  /*
    `features.query` is a Mongoose Query object, not the actual data.
    Mongoose queries are "lazy" (they do not execute immediately).
    All chained methods (find, sort, select, skip, limit) only build the query.
    
    When using `await features.query`, the query is executed because
    Mongoose Query objects are "thenable" (they implement `.then()`).
    `await` internally calls `.then()`, which triggers the actual
    database operation in MongoDB.
    
    Equivalent forms:
    await features.query
    await features.query.exec()
    features.query.then(...)

    SQL analogy:
    This is conceptually similar to building a SQL statement without executing it:

    `SELECT * FROM tasks WHERE status = 'done' ORDER BY created_at DESC;`

    At this stage, the query is just defined. The database is only accessed when you explicitly execute it, e.g., through a database driver:

    `db.execute(sqlQuery)`

    In Mongoose:

    - Task.find() + chained methods → builds the query (like writing SQL)
    - await / .then() / .exec() → executes the query (like sending it to the database)
  */
  const tasks = await features.query;
  const total = await Task.countDocuments({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    total,
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
