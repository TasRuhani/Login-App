# Login App

A full-stack authentication application with a React client and an Express/MongoDB server.

## Features

- User registration and login
- JWT-based authentication
- Protected profile and password pages
- Profile updates
- OTP-based password recovery
- Signup and recovery email delivery through Ethereal SMTP
- MongoDB persistence with Mongoose

## Tech Stack

- **Frontend:** React 18, React Router, Formik, Axios, Zustand, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt
- **Database:** MongoDB Atlas
- **Email:** Nodemailer and Ethereal

## Project Structure

```text
client/    React frontend
server/    Express API, authentication, database, and mailer
```

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB Atlas connection string
- An Ethereal email account, or another SMTP account with matching settings

## Configuration

The server imports values from `server/config.js`. This file is intentionally ignored by Git because it contains credentials. Create it locally with this shape:

```js
export default {
  JWT_SECRET: "replace-with-a-long-random-secret",
  EMAIL: "your-smtp-user",
  PASSWORD: "your-smtp-password",
  ATLAS_URI: "mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority",
};
```

Do not commit database, SMTP, or JWT credentials. For production, use environment variables and a production-grade SMTP provider.

## Installation

Install dependencies separately for the client and server:

```bash
cd client
npm install

cd ../server
npm install
```

The frontend reads the API base URL from `REACT_APP_SERVER_DOMAIN`. Create `client/.env` when the API is not running at the default development URL:

```env
REACT_APP_SERVER_DOMAIN=http://localhost:8080
```

## Running Locally

Start the API first:

```bash
cd server
npm start
```

The server listens on `http://localhost:8080` and connects to MongoDB before accepting requests.

In a second terminal, start the React client:

```bash
cd client
npm start
```

Open `http://localhost:3000` in a browser.

## Available Scripts

### Client

| Command | Description |
| --- | --- |
| `npm start` | Start the React development server |
| `npm test` | Run the test runner |
| `npm run build` | Create a production build |

### Server

| Command | Description |
| --- | --- |
| `npm start` | Start the Express API with Nodemon |

## API Overview

All API routes are prefixed with `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Create a user account |
| `POST` | `/login` | Authenticate and receive a JWT |
| `POST` | `/authenticate` | Check whether a username exists |
| `GET` | `/user/:username` | Fetch a user profile |
| `PUT` | `/updateuser` | Update the authenticated profile |
| `GET` | `/generateOTP` | Generate a password-recovery OTP |
| `GET` | `/verifyOTP` | Verify an OTP |
| `GET` | `/createResetSession` | Create a password-reset session |
| `PUT` | `/resetPassword` | Set a new password |
| `POST` | `/registerMail` | Send an account email |

## Frontend Routes

- `/` - Username and login flow
- `/register` - Registration
- `/profile` - Authenticated profile
- `/password` - Password management
- `/recovery` - Account recovery
- `/reset` - Password reset

## Notes

- The API uses port `8080` and the React development server uses port `3000`.
- Login tokens expire after 24 hours.
- The server currently connects to MongoDB Atlas. The included in-memory MongoDB dependency is not used by the active connection code.
