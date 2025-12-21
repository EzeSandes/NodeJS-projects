import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

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
  const token = req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied: You are not logged in' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded; // We add the user to the request.
    next();
  } catch (error) {
    res.clearCookie('token');
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

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: 'Incorrect credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Save the token in a cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1hs(in ms)
  });

  res.json({ message: 'Login successfull', token });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({ message: 'Logout successful' });
});

// Route to verify if the user is loggedin
app.get('/me', authenticateJWT, (req, res) => {
  res.json(req.user);
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
