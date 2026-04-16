import express from 'express';
import { getAllTasks, createTask } from '../controllers/taskController.js';

const router = express.Router();

router.route('/').get(getAllTasks).post(createTask);

export default router;
