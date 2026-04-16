import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';

class Task {
  static async create(taskData) {
    const db = getDB();
    const task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.tasks.push(task);
    await db.write();

    return task;
  }

  static async findByUser(userId) {
    const db = getDB();
    return db.data.tasks.filter(task => task.userId === userId);
  }

  static async findById(id) {
    const db = getDB();
    return db.data.tasks.find(task => task.id === id);
  }
}

export default Task;
