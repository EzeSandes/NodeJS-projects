import { Router } from 'express';
const router = Router();

import { getPosts, getPostBySlug } from '../utils/posts.js';

// Main page
router.get('/', (req, res) => {
  const posts = getPosts()
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('index', {
    title: 'My Blog',
    posts,
  });
});

export default router;
