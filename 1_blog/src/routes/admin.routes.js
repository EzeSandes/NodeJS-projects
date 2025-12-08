import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getPosts } from '../utils/posts.js';

const router = new Router();

// Dashboard
router.get('/', isAuthenticated, (req, res) => {
  const posts = getPosts().sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('admin/dashboard', {
    title: 'Dashboard',
    posts,
  });
});

export default router;
