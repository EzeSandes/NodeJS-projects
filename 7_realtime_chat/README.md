# Real-time Chat App

A real-time chat application with authentication and message persistence in MongoDB.

## Description

This project is a Node.js server that combines Express and Socket.io to create a real-time chat application. Users can sign up, log in, and connect to the socket server using a JWT token. Messages are stored in MongoDB and can be sent to chat rooms (`room`) or as private messages.

## Features

- User authentication with JWT
- Signup, login, and logout
- Message persistence in MongoDB
- Support for chat rooms and typing notifications
- CORS enabled for local client on `http://localhost:5500`
- Basic global error handling

## Project structure

- `server.js`: Initializes the Express server and Socket.io
- `controllers/authController.js`: Authentication controller
- `controllers/socketHandler.js`: Socket.io logic
- `routes/authRoutes.js`: Authentication routes
- `models/User.js`: User model with hashed password
- `models/Message.js`: Message model
- `config/db.js`: MongoDB connection
- `env.js`: Loads environment variables
- `client-test.html`: Test client to connect to the server

## Technologies

- Node.js
- Express
- Socket.io
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- cors
- validator

## Installation

1. Clone the repository or copy the files to the local directory.
2. Install dependencies:

```bash
npm install
```

3. Create an environment variables file or define the variables in your system.

## Environment variables

Create a `.env` file in the project root with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/realtime-chat
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

Make sure `MONGO_URI` points to your MongoDB instance.

## Running the project

To start the server in development mode:

```bash
npm run dev
```

Or to start normally:

```bash
npm start
```

The server will listen on `http://localhost:5000` or the port configured in `PORT`.

## API routes

### Authentication

- `POST /api/v1/auth/signup`
  - Body: `{ "username": "username", "email": "user@example.com", "password": "password", "passwordConfirm": "password" }`

- `POST /api/v1/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password" }`

- `POST /api/v1/auth/logout`
  - Clears the `jwt` cookie from the client.

## Socket.io events

The server expects a JWT token in `socket.handshake.auth.token` to authenticate the user.

### Main events

- `joinRoom`
  - Payload: `{ room: "room-name" }`
  - Joins the socket to a room, loads message history, and sends `roomHistory`.

- `sendMessage`
  - Payload: `{ content: "text", room: "room-name" }` or `{ content: "text", receiverId: "userId" }`
  - Sends room messages or private messages.

- `typing`
  - Payload: `{ room: "room-name", isTyping: true|false }`
  - Emits `userTyping` to the rest of the room.

### Server emitted events

- `roomHistory`: chat room message history
- `newMessage`: message emitted to the room
- `privateMessage`: private message
- `usersOnline`: list of connected users

## Test client

The project includes `client-test.html` to test the Socket.io connection locally from `http://localhost:5500`.

## Notes

- The server allows CORS origins from `http://localhost:5500` and `http://127.0.0.1:5500`.
- Socket authentication depends on a valid JWT sent during the handshake.

## License

This project uses the ISC license.
