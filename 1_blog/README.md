# Node.js Blog App

A lightweight blog project built with Node.js, Express, and EJS. It includes public blog browsing, authenticated admin post management, markdown rendering, and code highlighting.

## Highlights

- **Express 5** server with clean routing and middleware
- **EJS** templating with `express-ejs-layouts`
- **Session-based authentication** for the admin section
- **Admin dashboard** to create, edit, and delete blog posts
- **Markdown support** with `marked`
- **Code syntax highlighting** using `highlight.js`
- **JSON storage** for posts in `src/data/posts.json`
- **Flash messages** for user feedback
- **404 handling** for missing routes and posts

## Summary

This project is a simple blog platform designed for local development and learning. The public site lists only published posts, while the `/admin` area is protected and requires login. Posts are stored in a JSON file and rendered with markdown support, including syntax highlighting for code blocks.

## Getting Started

### Requirements

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm start
```

Or use nodemon for development:

```bash
npm run dev
```

### Default admin login

- Username: `admin`
- Password: `1234`

## Project Structure

- `src/server.js` - application entry point
- `src/routes/index.routes.js` - public blog routes
- `src/routes/auth.routes.js` - login and logout routes
- `src/routes/admin.routes.js` - admin dashboard and post CRUD routes
- `src/middleware/auth.js` - auth guards for protected routes
- `src/utils/posts.js` - JSON post storage and lookup
- `src/utils/markdown.js` - markdown parsing and syntax highlighting
- `src/views/` - EJS templates
- `src/public/` - static assets

## Notes

- The app uses a hard-coded admin account and JSON storage, so it is intended mainly for demonstration or local testing.
- For production use, replace the session secret, enable HTTPS, and migrate storage to a database.
