import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import expressEjsLayouts from 'express-ejs-layouts';

import indexRoutes from './routes/index.routes.js';

// Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View configurations
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Here we set where are de Views.
app.use(express.static('src/public'));

// Routes
app.use('/', indexRoutes); // Home and public posts

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page not found' });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
