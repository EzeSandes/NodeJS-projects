import { Router } from 'express';
const router = Router();

import { getPosts, getPostBySlug } from '../utils/posts.js';
import { renderMarkdown } from '../utils/markdown.js';

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

// Post Detail
router.get('/post/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug);

  if (!post) return res.status(404).render('404', { title: 'Post not found' });

  post.contentHTML = renderMarkdown(post.content);

  res.render('post', {
    title: post.title,
    post,
  });
});

export default router;
