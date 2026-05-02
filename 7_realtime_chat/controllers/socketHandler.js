import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

const onlineUsers = new Map(); // socket.id -> userId

export const socketHandler = io => {
  io.use();
};
