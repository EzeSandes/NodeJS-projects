import { Router } from 'express';
import {
  getAllBooks,
  createBook,
  getABookById,
  updatebook,
} from '../controllers/book.controller.js';

const router = Router();

router
  .get('/', getAllBooks)
  .post('/', createBook)
  .get('/:id', getABookById)
  .put('/:id', updatebook);

export default router;
