import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import globalErrorHandler from './controllers/errorController.js';
import { connectDB } from './config/db.js';
import env from './env.js';
import authRoutes from './routes/authRoutes.js';
import { socketHandler } from './controllers/socketHandler.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  }),
);
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

// Socket.io handler
socketHandler(io);

// Connect DB and start server
connectDB().then(() => {
  const PORT = env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(globalErrorHandler);
