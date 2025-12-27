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

  // Get a Book by Id
  static async findById(id) {
    const data = await readJSON();

    return data.books.find(book => book.id === id) || null;
  }

  // Update book by Id
  static async updateById(id, updates) {
    const data = await readJSON();

    const index = data.books.findIndex(book => book.id === id);

    if (index === -1) return null;

    const updateBook = {
      ...data.books[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    data.books[index] = updateBook;
    await writeJSON(data);

    return updateBook;
  }

  // Delete book by Id
  static async deleteById(id) {
    const data = await readJSON();

    const index = data.books.findIndex(book => book.id === id);

    if (index === -1) return null;

    const deletedBook = data.books.splice(index, 1);
    await writeJSON(data);
    return deletedBook;
  }
}

export default BookModel;
