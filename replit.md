# AI Chat Application

## Overview

This repository contains a full-stack AI chat application built with React and Express. The application allows users to have conversations with an AI assistant, create new conversations, and manage conversation history.

The architecture follows a modern client-server model with a React frontend and Express backend. The database schema is set up to store conversations and messages, with a clean separation between the client and server code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern web application architecture with distinct frontend and backend components:

### Frontend
- React application built with Vite
- UI components from Radix UI with Shadcn/UI styling
- State management via React Query for API interactions
- Theme support (light/dark mode)
- Responsive design for mobile and desktop

### Backend
- Express.js server handling API routes
- RESTful API design
- PostgreSQL database with Drizzle ORM
- Stateless architecture with database persistence

### Data Flow
1. Client makes requests to server API endpoints
2. Server processes requests, interacts with database via Drizzle ORM
3. Server returns responses to client
4. Client updates UI based on response data

## Key Components

### Frontend Components

1. **Chat Interface**
   - `ChatMessages.tsx`: Displays message history with animations
   - `ChatInput.tsx`: Handles user input with auto-resizing
   - `TypingIndicator.tsx`: Shows when AI is "thinking"
   - `ChatHeader.tsx`: Navigation and theme controls

2. **Onboarding**
   - `WelcomeScreen.tsx`: Initial UI with sample questions and features
   - Feature cards showcasing capabilities

3. **UI Library**
   - Comprehensive collection of UI components from Shadcn/UI
   - Customized theming with dark/light mode support

4. **State Management**
   - React Query for data fetching, caching, and mutations
   - Context for theme management

### Backend Components

1. **API Endpoints**
   - Conversation management (CRUD operations)
   - Message handling

2. **Database Schema**
   - Conversations table
   - Messages table with relation to conversations

3. **Storage Layer**
   - ORM abstraction with Drizzle
   - Interface-based design allowing for different implementations

## Database Schema

The application uses two main tables:

1. **conversations**
   - `id`: Primary key
   - `title`: Conversation title
   - `createdAt`: Timestamp

2. **messages**
   - `id`: Primary key
   - `content`: Message content
   - `sender`: Who sent the message ("user" or "ai")
   - `timestamp`: When the message was sent
   - `conversationId`: Foreign key to conversations

## API Structure

The API follows RESTful conventions:

1. **Conversations**
   - `GET /api/conversations`: List all conversations
   - `POST /api/conversations`: Create a new conversation
   - `GET /api/conversations/:id`: Get a specific conversation
   - `DELETE /api/conversations/:id`: Delete a conversation

2. **Messages**
   - `GET /api/conversations/:id/messages`: Get messages for a conversation
   - `POST /api/conversations/:id/messages`: Add a message to a conversation

## External Dependencies

### Frontend
- **UI**: Radix UI, Shadcn/UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight router)
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation

### Backend
- **Server**: Express.js
- **Database**: Drizzle ORM with PostgreSQL
- **Validation**: Zod with Drizzle-Zod integration

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development**
   - `npm run dev`: Starts the development server with hot reloading

2. **Production Build**
   - `npm run build`: Builds the frontend with Vite and backend with esbuild
   - Frontend assets are compiled to static files in the dist/public directory
   - Backend is bundled into dist/index.js

3. **Production Runtime**
   - `npm run start`: Runs the production build
   - Express serves both the API and static frontend files

The deployment flow includes:
1. Building the application
2. Running the production server
3. Exposing port 5000 for HTTP traffic

## Development Workflow

1. **Start Development Server**
   - Run `npm run dev` to start both client and server in development mode
   - Client runs on Vite's development server with HMR
   - Server runs with tsx for TypeScript execution

2. **Database Operations**
   - Run `npm run db:push` to sync schema changes with the database

3. **Type Checking**
   - Run `npm run check` to verify TypeScript types

## Notes for Implementation

1. The application uses a memory-based storage implementation by default, but is designed to be switched to PostgreSQL persistence when needed.

2. The UI uses a clean, responsive design with both light and dark themes.

3. The server includes logging middleware to track API requests and responses.

4. The project already includes all necessary UI components for building a complete chat interface.

5. API routes follow RESTful conventions for predictable interaction.