# Rating System - ROXILER

A full-stack web application for managing product ratings and stores. This project includes a React TypeScript frontend and an Express TypeScript backend with PostgreSQL database integration.

## Project Structure

The project is organized into two main directories:

- **client/**: React TypeScript frontend application
- **server/**: Express TypeScript backend server

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (version 20.19 or higher)
- pnpm (version 10.25.0)
- PostgreSQL (for database)

## Getting Started

### 1. Install Dependencies

For the client:
```bash
cd client
pnpm install
```

For the server:
```bash
cd server
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the server directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/rating_system
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
```

### 3. Database Setup

Run Prisma migrations to set up the database:

```bash
cd server
pnpm dlx prisma migrate deploy
```

### 4. Running the Application

In separate terminals, run:

Server (runs on port 4000):
```bash
cd server
pnpm start
```

Client (runs on port 5173 by default):
```bash
cd client
pnpm run dev
```

## Available Scripts

### Client Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the production bundle
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview the production build

### Server Scripts

- `pnpm start` - Start the server with tsx
- `pnpm run test` - Run tests (not configured yet)

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TypeScript for type safety
- Axios for API requests

### Backend
- Express.js for HTTP server
- TypeScript for type safety
- Prisma ORM for database management
- PostgreSQL as database
- José for JWT authentication
- bcryptjs for password hashing
- Zod for schema validation
- Morgan for HTTP logging

## Features

- User authentication and authorization
- Product rating management
- Store management
- User management
- REST API with TypeScript
- Type-safe database operations with Prisma

## Architecture

The application follows a client-server architecture with clear separation of concerns:

### Frontend Architecture

The React frontend is organized into logical components:

```
client/
  components/
    - Modal.tsx: Reusable modal component
    - Table.tsx: Data table display component
    - UI.tsx: General UI components
  pages/
    - Auth.tsx: Authentication page
    - Dashboard.tsx: Main dashboard view
    - Stores.tsx: Store management page
    - Users.tsx: User management page
  hooks/
    - useAuth.ts: Authentication logic
    - useDashboard.ts: Dashboard state management
    - useRatings.ts: Ratings data handling
    - useStores.ts: Stores data handling
    - useUsers.ts: Users data handling
  services/
    - api.ts: Axios API client configuration
```

The frontend communicates with the backend via REST API calls through the API service layer. Custom hooks manage data fetching, state management, and business logic, while components handle UI rendering.

### Backend Architecture

The Express backend is structured in layers:

```
server/src/
  controller/
    - auth.controller.ts: Authentication endpoints
    - rating.controller.ts: Rating endpoints
    - store.controller.ts: Store endpoints
    - user.controller.ts: User endpoints
  service/
    - auth.service.ts: Authentication business logic
    - rating.service.ts: Rating business logic
    - store.service.ts: Store business logic
    - user.service.ts: User business logic
  lib/
    - error.ts: Error definitions
    - error.handler.ts: Global error handler
    - prisma.ts: Prisma client configuration
    - tokens.ts: JWT token management
  middlwares/
    - auth.ts: Authentication middleware
    - validate.ts: Request validation middleware
  routes/
    - routes.ts: Route definitions
  schemas/
    - index.ts: Zod validation schemas
```

The backend separates concerns into multiple layers:
- Routes handle HTTP request matching
- Controllers manage request/response handling
- Services contain business logic
- Middleware handles cross-cutting concerns like authentication and validation
- Libraries provide utility functions

### Data Flow

1. User interaction in React component
2. Component calls hook or API service
3. API service sends HTTP request to Express backend
4. Backend route matches request and calls controller
5. Controller validates request using Zod schemas
6. Service executes business logic using Prisma ORM
7. Prisma queries PostgreSQL database
8. Response flows back through service to controller to frontend
9. Component updates UI with returned data

### Authentication Flow

- User logs in through the Auth page
- Frontend sends credentials to the auth endpoint
- Backend validates credentials and generates JWT tokens
- Tokens stored in client-side storage
- Authentication middleware validates JWT on protected routes
- Tokens include user identity and role information

## Database Schema

The application uses Prisma with the following main models:

- User: User accounts with authentication
- Store: Store information and management
- Rating: Product ratings and reviews

## API Health Check

To verify the server is running, visit:
```
http://localhost:4000/healthz
```

This should return a JSON response with status "healthy".

## Development Notes

The server uses tsx for TypeScript execution, which provides seamless CommonJS and ES module support. The frontend is built with Vite for fast development and optimized production builds.


