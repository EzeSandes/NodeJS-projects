import { Router } from 'express';
import {
  getAllBooks,
  createBook,
  getABookById,
  updatebook,
  deleteBook,
} from '../controllers/book.controller.js';

import upload from '../utils/upload.js';

const router = Router();

router
  .get('/', getAllBooks)
  .post('/', upload.single('cover'), createBook)
  .get('/:id', getABookById)
  .put('/:id', upload.single('cover'), updatebook)
  .delete('/:id', deleteBook);

export default router;
