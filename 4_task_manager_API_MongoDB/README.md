# Task Manager API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A REST API for task management with authentication, built with Node.js and Express.

## ✨ Features

- 🔐 **User Authentication**: Secure signup, login, logout and protected routes with JWT tokens
- 📝 **Task Management**: Create and retrieve tasks with user-specific access
- ✅ **Input Validation**: Comprehensive validation using Joi schemas
- 🛡️ **Security**: Helmet for security headers, rate limiting, and CORS support
- 🚨 **Error Handling**: Global error handling with environment-aware responses
- 📊 **Logging**: Request logging with Morgan

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: JSON file-based (lowdb)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Security**: Helmet, express-rate-limit, CORS
- **Utilities**: UUID, Morgan, Cookie Parser

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EzeSandes/NodeJS-projects.git
   cd 4_task_manager_API_MongoDB
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables(use .env.example as a template):

   ```
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   ```

4. **Start the server**:

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`.

## 📖 Usage

### API Endpoints

#### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string", "role": "user|admin" }`
- `POST /api/auth/login` - Authenticate user
  - Body: `{ "email": "string", "password": "string" }`
- `POST /api/auth/logout` - Logout user (clears JWT cookie)

#### Tasks (Protected Routes - Require Authentication)

- `GET /api/tasks` - Retrieve all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "string", "content": "string", "priority": "low|medium|high", "dueDate": "ISO string", "tags": ["array of strings"] }`

### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 📦 Versions

### 📦 Version 1.0.0 (Current - JSON Database)

[Download](https://github.com/EzeSandes/NodeJS-projects/releases/tag/v1.0.0)

**Features**:

- User authentication with JWT
- Basic task creation and retrieval
- JSON file-based storage
- Security middlewares and validation

### 📦 Version 2.0.0 (MongoDB Enhanced)

[Download](https://github.com/EzeSandes/NodeJS-projects/releases/tag/v2.0.0) (Coming Soon)

**Enhanced Features**:

- MongoDB database integration
- Full task CRUD operations (create, read, update, delete)
- Password hashing for security
- Improved performance and scalability

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.</content>
<parameter name="filePath">c:\Users\Usuario\Documents\Proyectos\NodeJS\4_task_manager_API_MongoDB\README.md
