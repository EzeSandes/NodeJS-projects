import { Router } from 'express';
import {
  getAllBooks,
  createBook,
  getABookById,
  updatebook,
  deleteBook,
} from '../controllers/book.controller.js';

const router = Router();

router
  .get('/', getAllBooks)
  .post('/', createBook)
  .get('/:id', getABookById)
  .put('/:id', updatebook)
  .delete('/:id', deleteBook);

export default router;
