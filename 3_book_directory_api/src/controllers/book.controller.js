import BookModel from '../models/book.model.js';

/*
|--------------------------------------------------------------------------
| Get all books
|--------------------------------------------------------------------------
*/
export async function getAllBooks(req, res) {
  try {
    const books = await BookModel.findAll();

    res.status(200).json({
      total: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to fetch books',
      error,
    });
  }
}

/*
|--------------------------------------------------------------------------
| Get a book by Id
|--------------------------------------------------------------------------
*/

export async function getABookById(req, res) {
  try {
    const { id } = req.params;

    const book = await BookModel.findById(id);

    if (!book)
      return res.status(404).json({
        message: 'Book not found',
      });

    res.status(200).json({
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch book',
    });
  }
}

/*
|--------------------------------------------------------------------------
| Create a new book
|--------------------------------------------------------------------------
*/

export async function createBook(req, res) {
  try {
    const { title, author, coverImage } = req.body;

    // Basic validation
    if (!title || !author)
      return res.status(400).json({
        message: 'Title and author are required',
      });

    const newBook = await BookModel.create({
      title,
      author,
      coverImage: coverImage || null,
    });

    res.status(201).json({
      message: 'Book created successfully',
      data: newBook,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to create book',
    });
  }
}

/*
|--------------------------------------------------------------------------
| Update book by ID
|--------------------------------------------------------------------------
*/

export async function updatebook(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent ID override
    if (updates.id) delete updates.id;

    const updatedBook = await BookModel.updateById(id, updates);

    if (!updatedBook)
      return res.status(404).json({
        message: 'Book not found',
      });

    res.status(200).json({
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed to update book',
    });
  }
}

/*
|--------------------------------------------------------------------------
| Delete book by ID
|--------------------------------------------------------------------------
*/

export async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    const deletedBook = await BookModel.deleteById(id);

    if (!deletedBook)
      return res.status(404).json({
        message: 'Book not found',
      });

    res.status(200).json({
      message: 'Book deleted succesfully',
      data: deletedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed to delete book',
    });
  }
}
