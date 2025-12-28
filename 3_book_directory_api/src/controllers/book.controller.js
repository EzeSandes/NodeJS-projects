import BookModel from '../models/book.model.js';
import AppError from '../errors/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { removeFile } from '../utils/fileRemover.js';

/*
|--------------------------------------------------------------------------
| Get all books
|--------------------------------------------------------------------------
*/
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await BookModel.findAll();

  if (!books) throw new AppError('Failed to fetch books', 500);

  res.status(200).json({
    total: books.length,
    data: books,
  });
});

/*
|--------------------------------------------------------------------------
| Get a book by Id
|--------------------------------------------------------------------------
*/

export const getABookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await BookModel.findById(id);

  if (!book) throw new AppError('Failed to fetch books', 404);

  res.status(200).json({
    data: book,
  });
});

/*
|--------------------------------------------------------------------------
| Create a new book
|--------------------------------------------------------------------------
*/

export const createBook = asyncHandler(async (req, res) => {
  const { title, author } = req.body;

  // Basic validation
  if (!title || !author)
    throw new AppError('Title and author are required', 400);

  const coverImage = req.file ? `/images/books/${req.file.filename}` : null;

  const newBook = await BookModel.create({
    title,
    author,
    coverImage: coverImage,
  });

  if (!newBook) throw new AppError('Failed to create book', 500);

  res.status(201).json({
    message: 'Book created successfully',
    data: newBook,
  });
});

/*
|--------------------------------------------------------------------------
| Update book by ID
|--------------------------------------------------------------------------
*/

export const updatebook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent ID override
  if (updates.id) delete updates.id;

  // Fetch existing book
  const existingBook = await BookModel.findById(id);

  if (!existingBook) throw new AppError('Book not found', 404);

  // Handle cover image replacement
  if (req.file) {
    if (existingBook.coverImage) await removeFile(existingBook.coverImage);

    updates.coverImage = `/images/books/${req.file.filename}`;
  }

  const updatedBook = await BookModel.updateById(id, updates);

  if (!updatedBook) throw new AppError('Failed to update book', 500);

  res.status(200).json({
    message: 'Book updated successfully',
    data: updatedBook,
  });
});

/*
|--------------------------------------------------------------------------
| Delete book by ID
|--------------------------------------------------------------------------
*/

export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedBook = await BookModel.deleteById(id);

  if (!deletedBook) throw new AppError('Book not found', 404);

  res.status(200).json({
    message: 'Book deleted succesfully',
    data: deletedBook,
  });
});
