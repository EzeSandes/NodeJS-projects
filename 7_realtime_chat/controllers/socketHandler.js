import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Message from '../models/Message.js';
import User from '../models/User.js';
import AppError from '../errors/AppError.js';
import { env } from '../env.js';

const onlineUsers = new Map(); // socket.id -> userId

export const socketHandler = io => {
  // Socket.io Middleware
  io.use((socket, next) => {
    // #DOC: https://socket.io/docs/v4/server-socket-instance/#sockethandshake
    // #DOC: https://socket.io/docs/v4/middlewares/#sending-credentials
    const token = socket.handshake.auth.token;

    if (!token) return next(new AppError('Authentication error', 401));

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (error) {
      next(new AppError('Invalid token', 401));
    }
  });

  // =========================================
  io.on('connection', async socket => {
    console.log(`User connected: ${socket.userId}`);

    // Join general room by default
    socket.join('general');

    // Load previous messages from a room
    socket.on('joinRoom', async ({ room }) => {
      socket.leave('general');
      socket.join(room);

      const messages = await Message.find({ room })
        .populate('sender', 'username')
        .sort({ createdAt: 1 })
        .limit(50);

      socket.emit('roomMessages', messages);
    });

    // ============================= Load previous messages once the user is connectted
    socket.on('joinRoom', async ({ room }) => {
      try {
        // Disconnect from other rooms
        socket.rooms.forEach(r => {
          if (r !== socket.id) socket.leave(r);
        });

        socket.join(room);

        // Receive 50-100 msj from the room
        const messages = await Message.find({ room })
          .populate('sender', 'username avatar')
          .sort({ createdAt: -1 })
          .limit(80);

        // Chronological order (old => new)
        const sortedMessages = messages.reverse();

        // Send the history only to the user who joined
        socket.emit('roomHistory', {
          room,
          messages: sortedMessages,
        });

        // Notify others that someone has joined
        // socket.to(room).emit('userJoined', {
        //   userId: socket.userId,
        //   username: onlineUsers.get(socket.id)?.username,
        //   room,
        // });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ============================= Send message (room or private)
    socket.on('sendMessage', async ({ content, room, receiverId }) => {
      try {
        const messageData = {
          sender: socket.userId,
          content,
        };

        if (receiverId) {
          messageData.receiver = receiverId;
        } else if (room) {
          // If no room => general chat
          messageData.room = room;
        }

        const message = await Message.create(messageData);
        const populatedMessage = await Message.findById(message._id).populate(
          'sender',
          'username',
        );

        if (receiverId) {
          // PrivateMessage => find socket of receiver
          const receiverId = [...onlineUsers.entries()].find(
            ([, data]) => data.userId.toString() === receiverId.toString(),
          );

          if (receiverSocket) {
            io.to(receiverSocket[0]).emit('privateMessage', populatedMessage);
          }

          socket.emit('privateMessage', populatedMessage);
        } else if (room) {
          io.to(room).emit('newMessage', populatedMessage);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // ============================= Typing indicator
    socket.on('typing', ({ room, isTyping }) => {
      socket.to(room).emit('userTyping', {
        userId: socket.userId,
        username: onlineUsers.get(socket.id)?.username,
        isTyping,
      });
    });

    // ============================= Disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      io.emit('usersOnline', Array.from(onlineUsers.values()));
      console.log(`User disconnected: ${socket.userId}`);
    });

    try {
      // Load User and mark him as online after registering socket listeners.
      const user = await User.findById(socket.userId).select('username');

      if (user && socket.connected) {
        onlineUsers.set(socket.id, {
          userId: socket.userId,
          username: user.username,
        });

        io.emit('usersOnline', Array.from(onlineUsers.values()));
      }
    } catch (error) {
      console.error('Error loading connected user:', error);
    }
  });
};
