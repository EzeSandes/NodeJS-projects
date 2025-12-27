import { readJSON, writeJSON } from '../utils/fileHandler.js';
import crypto from 'crypto';

/*
|--------------------------------------------------------------------------
| Book model
|--------------------------------------------------------------------------
*/
class BookModel {
  // Get all books
  static async findAll() {
    const data = await readJSON();
    return data.books;
  }

  // create a new Book
  static async create(bookData) {
    const data = await readJSON();

    const newBook = {
      id: crypto.randomUUID(),
      ...bookData,
      available: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.books.push(newBook);
    await writeJSON(data);

    return newBook;
  }
}

export default BookModel;
