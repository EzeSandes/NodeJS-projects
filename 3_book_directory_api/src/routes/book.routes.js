import { Router } from 'express';
import { getAllBooks, createBook } from '../controllers/book.controller.js';

const router = Router();

router.get('/', getAllBooks).post('/', createBook);

export default router;
