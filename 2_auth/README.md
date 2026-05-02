# Express JWT Authentication API

## Summary

This project is a small Express.js API that demonstrates authentication and role-based authorization with JSON Web Tokens (JWT). Users log in with an email and password, receive a signed JWT, and the token is stored in an HTTP-only cookie for protected requests.

The API uses in-memory demo users, bcrypt password hashing, cookie parsing, and middleware-based access control for authenticated and role-restricted routes.

## Highlights

- Express.js server using ES modules.
- JWT-based authentication with 1-hour token expiration.
- HTTP-only cookie storage for the auth token.
- Password verification with bcrypt.
- Protected routes for authenticated users.
- Role-based authorization for `user` and `admin` access.
- Demo users stored in memory for quick local testing.

## Tech Stack

- Node.js
- Express
- JSON Web Token
- bcryptjs
- cookie-parser
- body-parser
- nodemon

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## Demo Users

```text
User:
email: user@example.com
password: password123
role: user

Admin:
email: admin@example.com
password: adminpass
role: admin
```

## API Endpoints

### Login

```http
POST /login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Logs in a valid user, creates a JWT, and stores it in an HTTP-only cookie.

### Logout

```http
POST /logout
```

Clears the authentication cookie.

### Current User

```http
GET /me
```

Returns the decoded JWT payload for the currently authenticated user.

### Protected Route

```http
GET /protected
```

Requires a valid JWT cookie.

### Admin Route

```http
GET /admin
```

Requires a valid JWT cookie and the `admin` role.

### User Route

```http
GET /user
```

Requires a valid JWT cookie and allows both `user` and `admin` roles.

## Notes

This project is intended as a learning example. For production use, move the JWT secret to environment variables, use a persistent database, improve error messages, and add stronger security configuration around cookies, CORS, and deployment settings.
