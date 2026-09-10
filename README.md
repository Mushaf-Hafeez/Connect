# Connect

Connect is a full-stack real-time communication app built for messaging, friend management, online presence, file attachments, and call coordination. The project combines a React + Vite frontend with an Express + Socket.IO backend and a Prisma-managed PostgreSQL data layer.

## Overview

Connect is designed as a modern social messaging platform where users can:

- Sign up and verify their email address
- Log in securely with JWT-based session cookies
- Search for users and send/accept friend requests
- Start direct conversations with approved friends
- Send text messages and media attachments
- Track delivery and read states in real time
- See online presence and typing indicators
- Receive email-based password reset links
- Use call history and socket-powered call flows

This repository includes both the frontend and backend in one workspace, making it easy to run the application locally or deploy it with separate frontend and API services.

---

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- Zustand for state management
- Tailwind CSS
- Axios
- Socket.IO client
- Lucide icons

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT authentication
- Zod validation
- Cloudinary upload integration
- Nodemailer SMTP mailer

### Data & Infrastructure

- PostgreSQL via Prisma
- Neon-compatible Prisma adapter
- Cloudinary for media uploads
- SMTP service for email verification and password resets

---

## Project Structure

```text
Connect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── handlers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── templates/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── index.ts
│   │   └── socket.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma.config.ts
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── README.md
├── readmd.md
└── ...
```

---

## Core Features

### Authentication

- User signup with validation
- Email verification sent via email link
- Login using email and password
- JWT-based auth cookie
- Protected routes and middleware checks
- Password change and reset flow
- Logout and session cleanup

### Social Features

- Search users by username or display name
- Send friendship requests
- Accept, reject, cancel, and remove requests
- Restrict messaging to accepted friends only
- One-to-one conversations only in the current schema, with group chat support defined for future growth

### Messaging

- Direct message conversations
- Real-time delivery and read receipts
- Typing indicators
- Unread message counts
- Attachment uploads via Cloudinary
- Message update and delete support

### Presence & Real-Time Events

- Online user tracking
- Socket-based notifications for new messages and status updates
- Batched delivery sync for missed events
- Real-time connection lifecycle updates

### Calls

- Call records stored in the database
- Call history retrieval endpoint
- Real-time call session handling via Socket.IO
- Support for call state tracking and session cleanup

---

## Database Schema

The backend uses Prisma with the following primary models:

- User
- Friendship
- Conversation
- ConversationParticipant
- Message
- MessageStatus
- Call

Important schema details:

- Users have unique username and email values
- Friend requests use a friendship status state machine: PENDING and ACCEPTED
- Messages can include attachments as Cloudinary URLs
- Message status is tracked per recipient for delivery and read updates
- Calls keep caller/receiver records and duration metadata

---

## Environment Variables

### Backend (.env)

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173

MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER_NAME=connect
```

### Frontend (.env)

Create a `.env` file inside the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:3000
```

> The frontend uses `VITE_BACKEND_URL` to build the API base URL for requests to the backend.

---

## Installation

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

---

## Database Setup

From the backend directory:

```bash
npx prisma generate
npx prisma migrate dev
```

This will generate the Prisma client and apply migrations to your PostgreSQL database.

If you are deploying to production or using an already-prepared database, use:

```bash
npm run migrate:deploy
```

---

## Running the App

### Start the backend

```bash
cd backend
npm run dev
```

The Express API runs on the configured backend port, typically `http://localhost:3000`.

### Start the frontend

```bash
cd frontend
npm run dev
```

The Vite app runs in development mode, typically at `http://localhost:5173`.

---

## Available Scripts

### Backend scripts

```bash
npm run dev
npm run build
npm run start
npm run migrate:deploy
```

### Frontend scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run preview
```

---

## API Overview

The backend exposes routing under `/api/v1`.

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `PUT /api/v1/auth/verify-email`
- `PUT /api/v1/auth/forgot-password`
- `PUT /api/v1/auth/reset-password`
- `PUT /api/v1/auth/change-password`
- `GET /api/v1/auth/check-auth`
- `GET /api/v1/auth/logout`

### Friends

- `POST /api/v1/friends/request/:userId`
- `PUT /api/v1/friends/accept/:friendshipId`
- `DELETE /api/v1/friends/reject/:friendshipId`
- `DELETE /api/v1/friends/cancel/:friendshipId`
- `DELETE /api/v1/friends/remove/:friendshipId`
- `GET /api/v1/friends/`
- `GET /api/v1/friends/pending`
- `GET /api/v1/friends/sent`

### Users

- `GET /api/v1/users/search`
- `PUT /api/v1/users/update-profile`
- `PUT /api/v1/users/`
- `DELETE /api/v1/users/`

### Conversations

- `POST /api/v1/conversations/:userId`
- `GET /api/v1/conversations/`
- `GET /api/v1/conversations/:conversationId`
- `GET /api/v1/conversations/:conversationId/messages`
- `POST /api/v1/conversations/:conversationId/messages`
- `PUT /api/v1/conversations/:conversationId/messages/:messageId`
- `DELETE /api/v1/conversations/:conversationId/messages/:messageId`

### Calls

- `GET /api/v1/calls/`

---

## Security Notes

The application includes several important protections:

- Passwords are hashed with `bcryptjs`
- JWT tokens are stored in HTTP-only cookies
- Protected routes require valid authentication
- Email verification is required before login
- Password reset links expire after a short TTL
- User input is validated using `zod`
- Global Express error handling keeps API responses consistent

---

## Production Build

### Backend

```bash
cd backend
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## Notes for Deployment

When deploying, ensure the following are configured correctly:

- Production database URL in `DATABASE_URL`
- Correct `FRONTEND_URL` for email redirect links and CORS
- Valid SMTP credentials for email sending
- Cloudinary credentials for file upload support
- Secure `JWT_SECRET` value for production environments
- `NODE_ENV=production` when appropriate

---

## License

This project is currently unlicensed unless you explicitly add a license file for your own usage. If you are distributing or deploying it commercially, add an appropriate open-source or proprietary licensing decision before release.

---

## Summary

Connect is a practical full-stack messaging application with a strong focus on real-time communication, friend-based social workflows, and polished UX. It is structured for easy extension and supports the core features expected from a modern chat platform.

If you are working from this repository locally, the expected development flow is:

1. Set up PostgreSQL and required environment variables
2. Run Prisma migrations
3. Launch the backend
4. Launch the frontend
5. Sign up, verify email, add friends, and start chatting
