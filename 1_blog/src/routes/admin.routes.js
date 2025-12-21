import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getPosts, savePosts } from '../utils/posts.js';

const router = new Router();

// Dashboard
router.get('/', isAuthenticated, (req, res) => {
  const posts = getPosts().sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('admin/dashboard', {
    title: 'Dashboard',
    posts,
  });
});

router.get('/new', isAuthenticated, (req, res) => {
  res.render('admin/form', { title: 'New Post', post: null });
});

router.post('/new', isAuthenticated, (req, res) => {
  const posts = getPosts();

  console.log('aqui');

  const newPost = {
    id: Date.now().toString(),
    title: req.body.title.trim(),
    slug: req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    content: req.body.content.trim(),
    date: new Date().toISOString(),
    published: req.body.published === 'on',
  };

  posts.push(newPost);
  savePosts(posts);
  res.redirect('/admin');
});

router.get('/edit/:id', isAuthenticated, (req, res) => {
  const posts = getPosts();
  const post = posts.find(p => p.id === req.params.id);

  if (!post) return res.status(404).render('404', { title: 'Post not found' });

  res.render('admin/form', { title: 'Edit post', post });
});

router.post('/edit/:id', isAuthenticated, (req, res) => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).send('Post no encontrado');

  posts[index] = {
    ...posts[index],
    title: req.body.title.trim(),
    slug: req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    content: req.body.content.trim(),
    published: req.body.published === 'on',
  };

  savePosts(posts);
  res.redirect('/admin');
});

router.post('/delete/:id', isAuthenticated, (req, res) => {
  let posts = getPosts();

  posts = posts.filter(p => p.id !== req.params.id);
  savePosts(posts);
  res.redirect('/admin');
});

export default router;
