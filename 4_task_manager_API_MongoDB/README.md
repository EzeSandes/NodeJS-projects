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

## Task Endpoints

### Get All Tasks (Advanced Filtering)

**GET** `/api/v1/tasks`

This endpoint supports powerful filtering, searching, sorting, and pagination.

#### Available Query Parameters

| Parameter      | Description                                    | Example                                     |
| -------------- | ---------------------------------------------- | ------------------------------------------- |
| `search`       | Search in title and content (case-insensitive) | `?search=nodejs`                            |
| `isCompleted`  | Filter by completion status                    | `?isCompleted=true` or `?isCompleted=false` |
| `priority`     | Filter by priority level                       | `?priority=high`                            |
| `dueDate[gte]` | Due date greater than or equal to              | `?dueDate[gte]=2026-05-01`                  |
| `dueDate[lte]` | Due date less than or equal to                 | `?dueDate[lte]=2026-06-30`                  |
| `sort`         | Sort results (`-` for descending)              | `?sort=-createdAt` or `?sort=dueDate`       |
| `page`         | Page number for pagination                     | `?page=2`                                   |
| `limit`        | Number of results per page                     | `?limit=10`                                 |
| `fields`       | Select specific fields to return               | `?fields=title,priority,isCompleted`        |

#### Practical Examples

```bash
# 1. Search for tasks containing "backend"
GET /api/v1/tasks?search=backend

# 2. Get only pending high priority tasks
GET /api/v1/tasks?isCompleted=false&priority=high

# 3. Tasks with due date in May 2026
GET /api/v1/tasks?dueDate[gte]=2026-05-01&dueDate[lte]=2026-05-31

# 4. Get all tasks sorted by newest first (default)
GET /api/v1/tasks?sort=-createdAt

# 5. Sort by due date (closest first)
GET /api/v1/tasks?sort=dueDate

# 6. Combined search + filter + pagination
GET /api/v1/tasks?search=project&isCompleted=false&priority=medium&page=1&limit=5

# 7. Return only specific fields
GET /api/v1/tasks?fields=title,content,isCompleted,priority,dueDate
```

## 📦 Versions

### 📦 Version 1.0.0 (JSON Database)

[Download](https://github.com/EzeSandes/NodeJS-projects/tree/v1.0.0-json)

**Features**:

- User authentication with JWT
- Basic task creation and retrieval
- JSON file-based storage
- Security middlewares and validation

### 📦 Version 2.0.0 (Current - MongoDB Enhanced)

[Download](https://github.com/EzeSandes/NodeJS-projects/releases/tag/v2.0.0-mongodb)

**Enhanced Features**:

- MongoDB database integration
- Full task CRUD operations with user-specific access control
- JWT authentication with httpOnly cookies and Bearer token support
- Advanced task querying with filtering, search, sorting, field selection, and pagination
- Request validation and password hashing for stronger security

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.</content>
