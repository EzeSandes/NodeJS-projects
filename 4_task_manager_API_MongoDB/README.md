# Task Manager API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A REST API for task management with authentication, built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication**: Signup, login, logout, protected routes, and support for both httpOnly cookies and Bearer tokens.
- **Full Task CRUD**: Create, list, retrieve, update, and delete tasks with user-specific ownership checks.
- **Advanced Querying**: Search, filter, sort, field selection, and pagination for task collections.
- **Task Fields**: Support for title, content, priority, due date, tags, and completion status.
- **Request Validation**: Joi schemas for auth and task payloads with clear validation rules.
- **Password Security**: Password hashing before persistence and secure credential verification.
- **Security Middleware**: Helmet, CORS, JSON body limits, cookie parsing, and rate limiting in production.
- **Centralized Error Handling**: Consistent API error responses through a global error handler.
- **Operational Routes**: Health check route and validation test route for quick diagnostics.
- **Developer Experience**: Morgan request logging in development and modular ES Modules structure.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) + cookies
- **Validation**: Joi
- **Security**: Helmet, express-rate-limit, CORS, cookie-parser
- **Utilities**: Morgan

## Installation

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
   Create a `.env` file in the root directory using `.env.example` as a template.

   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
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

## Usage

### API Endpoints

#### Authentication

- `POST /api/v1/auth/signup` - Register a new user.
  - Body: `{ "name": "string", "email": "string", "password": "string", "passwordConfirm": "string", "role": "user|admin" }`
- `POST /api/v1/auth/login` - Authenticate a user.
  - Body: `{ "email": "string", "password": "string" }`
- `POST /api/v1/auth/logout` - Logout the current user and clear the JWT cookie.

#### Tasks (Protected Routes)

- `GET /api/v1/tasks` - Retrieve all tasks for the authenticated user.
- `POST /api/v1/tasks` - Create a new task.
  - Body: `{ "title": "string", "content": "string", "priority": "low|medium|high", "dueDate": "ISO string", "tags": ["array of strings"], "isCompleted": false }`
- `GET /api/v1/tasks/:id` - Retrieve a single task if it belongs to the authenticated user.
- `PATCH /api/v1/tasks/:id` - Update task fields such as title, content, priority, dueDate, tags, or isCompleted.
- `DELETE /api/v1/tasks/:id` - Delete a task if it belongs to the authenticated user.

#### Utility Routes

- `GET /health` - Basic health check.
- `POST /api/v1/test/test-validation` - Validation testing endpoint.

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","passwordConfirm":"password123"}'
```

## Task Endpoints

### Get All Tasks (Advanced Filtering)

**GET** `/api/v1/tasks`

This endpoint supports filtering, searching, sorting, field selection, and pagination.

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

## Versions

### Version 1.0.0 (JSON Database)

[Download](https://github.com/EzeSandes/NodeJS-projects/tree/v1.0.0-json)

**Features**:

- User authentication with JWT
- Basic task creation and retrieval
- JSON file-based storage
- Security middlewares and validation

### Version 2.0.0 (Current - MongoDB Enhanced)

[Download](https://github.com/EzeSandes/NodeJS-projects/releases/tag/v2.0.0-mongodb)

**Enhanced Features**:

- MongoDB database integration
- Full task CRUD operations with user-specific access control
- JWT authentication with httpOnly cookies and Bearer token support
- Advanced task querying with filtering, search, sorting, field selection, and pagination
- Request validation and password hashing for stronger security
- Production-ready middleware setup with rate limiting, CORS, Helmet, and centralized error handling

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
