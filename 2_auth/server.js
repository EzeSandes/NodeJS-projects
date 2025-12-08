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

//////////////////////////////// SERVER
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
