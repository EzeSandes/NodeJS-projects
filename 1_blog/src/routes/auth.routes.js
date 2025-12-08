import { Router } from 'express';
import { isNotAuthenticated } from '../middleware/auth.js';
const router = new Router();

const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';

// GET /login
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Login - My Blog',
  });
});

// POST /login
router.post('/login', isNotAuthenticated, (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = { username };
    req.flash('success', `Welcome back, ${username}`);
    return res.redirect('/admin');
  }

  req.flash('error', 'Username or password incorrect');
  res.redirect('/login');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
