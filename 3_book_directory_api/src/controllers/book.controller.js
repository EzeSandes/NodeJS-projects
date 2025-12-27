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
