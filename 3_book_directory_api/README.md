# Book Directory API

A RESTful API for managing a book directory with cover image uploads. This project is part of my Node.js learning journey, focusing on building a complete CRUD API with file handling, error management, and clean architecture patterns.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, and Delete books
- **Image Upload**: Upload and manage book cover images using Multer
- **File Management**: Automatic file cleanup when books are updated or deleted
- **Error Handling**: Custom error handling middleware with proper HTTP status codes
- **RESTful Design**: Clean and consistent API endpoints
- **Static File Serving**: Serve uploaded images through Express static middleware

## 📋 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** (v5.2.1) - Web framework
- **Multer** (v2.0.2) - File upload middleware
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing
- **Nodemon** - Development server with auto-reload

## 📁 Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── controllers/           # Request handlers
│   └── book.controller.js
├── models/                # Data access layer
│   └── book.model.js
├── routes/                # Route definitions
│   └── book.routes.js
├── middlewares/           # Custom middlewares
│   └── errorHandler.js
├── errors/                # Custom error classes
│   └── AppError.js
├── utils/                 # Utility functions
│   ├── asyncHandler.js
│   ├── fileHandler.js
│   ├── fileRemover.js
│   └── upload.js
├── data/                  # JSON database
│   └── books.json
└── public/                # Static files
    └── images/
        └── books/
```

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/EzeSandes/NodeJS-projects.git
cd 3_book_directory_api
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## 📚 API Endpoints

### Base URL

```
http://localhost:3000/api/v1/books
```

### Get All Books

```http
GET /api/v1/books
```

**Response:**

```json
{
  "total": 2,
  "data": [
    {
      "id": "uuid",
      "title": "Book Title",
      "author": "Author Name",
      "coverImage": "/images/books/filename.webp",
      "available": true,
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get Book by ID

```http
GET /api/v1/books/:id
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    "coverImage": "/images/books/filename.webp",
    "available": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

### Create Book

```http
POST /api/v1/books
Content-Type: multipart/form-data
```

**Body (form-data):**

- `title` (string, required) - Book title
- `author` (string, required) - Book author
- `cover` (file, optional) - Book cover image (max 2MB, formats: jpeg, png, jpg, webp)

**Response:**

```json
{
  "message": "Book created successfully",
  "data": {
    "id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    "coverImage": "/images/books/filename.webp",
    "available": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

### Update Book

```http
PUT /api/v1/books/:id
Content-Type: multipart/form-data
```

**Body (form-data):**

- `title` (string, optional) - Book title
- `author` (string, optional) - Book author
- `cover` (file, optional) - New cover image (replaces existing)

**Response:**

```json
{
  "message": "Book updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "author": "Updated Author",
    "coverImage": "/images/books/new-filename.webp",
    "available": true,
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-02T12:00:00.000Z"
  }
}
```

### Delete Book

```http
DELETE /api/v1/books/:id
```

**Response:**

```json
{
  "message": "Book deleted succesfully",
  "data": [...]
}
```

## 🔧 Key Concepts & Learning Points

### 1. **MVC Architecture**

- Separation of concerns with controllers, models, and routes
- Models handle data operations, controllers handle request/response logic

### 2. **File Upload with Multer**

- Disk storage configuration for saving files
- File filtering (only images allowed)
- File size limits (2MB max)
- Automatic UUID-based filename generation

### 3. **Error Handling**

- Custom `AppError` class for operational errors
- Global error handling middleware
- Proper HTTP status codes and error messages
- Error handling for Multer upload errors

### 4. **Async/Await Pattern**

- Custom `asyncHandler` utility to catch async errors
- Clean async code without try-catch blocks in controllers

### 5. **File System Operations**

- Reading and writing JSON files as a simple database
- File deletion utilities for cleanup
- Static file serving for images

### 6. **Express Middleware**

- Global middlewares (CORS, JSON parser)
- Route-specific middlewares (file upload)
- Error handling middleware (always last)

### 7. **RESTful API Design**

- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent URL patterns
- Proper status codes

## 📝 Environment Variables

The server uses the following environment variables (optional):

- `PORT` - Server port (default: 3000)

## 🗄️ Data Storage

The project uses a JSON file (`src/data/books.json`) for data persistence. Each book includes:

- `id` - UUID generated automatically
- `title` - Book title
- `author` - Book author
- `coverImage` - Path to cover image
- `available` - Availability status (default: true)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🖼️ Image Handling

- Uploaded images are stored in `src/public/images/books/`
- Images are accessible via `/images/books/{filename}`
- Old images are automatically deleted when a book's cover is updated
- Supported formats: JPEG, PNG, JPG, WEBP
- Maximum file size: 2MB

## ⚠️ Error Responses

The API returns standardized error responses:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

Common error status codes:

- `400` - Bad Request (validation errors, invalid file type)
- `404` - Not Found (book not found, route not found)
- `500` - Internal Server Error

## 🚦 Example Usage

### Using cURL

**Create a book:**

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -F "title=The Great Gatsby" \
  -F "author=F. Scott Fitzgerald" \
  -F "cover=@/path/to/image.jpg"
```

**Get all books:**

```bash
curl http://localhost:3000/api/v1/books
```

**Update a book:**

```bash
curl -X PUT http://localhost:3000/api/v1/books/{id} \
  -F "title=Updated Title" \
  -F "cover=@/path/to/new-image.jpg"
```

**Delete a book:**

```bash
curl -X DELETE http://localhost:3000/api/v1/books/{id}
```

## 📚 What I Learned

This project helped me understand:

- Building RESTful APIs with Express.js
- Handling file uploads and file system operations
- Implementing proper error handling patterns
- Organizing code with MVC architecture
- Working with JSON as a simple database
- Using middleware for cross-cutting concerns
- Managing static files in Express applications

## 🔮 Future Improvements

Potential enhancements for this project:

- [ ] Add a real database (MongoDB, PostgreSQL)
- [ ] Implement authentication and authorization
- [ ] Add pagination for book listings
- [ ] Add search and filtering capabilities
- [ ] Implement unit and integration tests
- [ ] Add API documentation with Swagger
- [ ] Implement rate limiting
- [ ] Add book categories/tags
- [ ] Implement image optimization/resizing

## 📄 License

ISC

## 👨‍💻 Author

Part of my Node.js learning portfolio project series.
