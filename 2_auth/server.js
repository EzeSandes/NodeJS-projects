import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'MY_very_SECURE_key';

// Users in memory
let users = [
  {
    id: 1,
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: bcrypt.hashSync('adminpass', 10),
    role: 'admin',
  },
];

//////////////////////////////// Middlewares

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res
      .status(401)
      .json({ message: 'Access denied: No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded; // We add the user to the request.
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token or expired' });
  }
}

// Roles
function authorizeRoles(roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Rol' });
    }

    next();
  };
}

//////////////////////////////// Routes

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);

  if (!user) return res.status(401).json({ message: 'User not found' });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'incorrect password' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// protected route(anyone authenticated)
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}! You are ${req.user.role}.` });
});

// protected routes by Role
app.get('/admin', authenticateJWT, authorizeRoles(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

app.get(
  '/user',
  authenticateJWT,
  authorizeRoles(['user', 'admin']),
  (req, res) => {
    res.json({ message: 'Welcome to the user area! Role: ' + req.user.role });
  }
);

//////////////////////////////// SERVER
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
