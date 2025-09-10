# Overview

ClinicCare is a comprehensive healthcare management platform built with React and Express.js that connects patients, doctors, and clinics. The application provides appointment scheduling, telemedicine capabilities, real-time chat communication, and an AI-powered health assistant. It features role-based dashboards for different user types and integrates modern web technologies for a seamless healthcare experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with WebSocket support for real-time features
- **File Structure**: Monorepo structure with shared types and schemas
- **Development**: Hot module replacement via Vite integration

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Migration**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless PostgreSQL

## Authentication & User Management
- **Provider**: Firebase Authentication for user management
- **Session Management**: Firebase Admin SDK for server-side verification
- **Role-Based Access**: Three user roles (patient, doctor, clinic) with dedicated dashboards

## Real-Time Communication
- **WebSocket Server**: Native WebSocket implementation for chat and telemedicine
- **Chat System**: Real-time messaging for telemedicine sessions
- **Video Calling**: Integration points for telemedicine video sessions

## AI Integration
- **Provider**: OpenAI GPT-5 for health assistance
- **Use Cases**: General health questions, symptom guidance, and appointment assistance
- **Safety**: Built-in guardrails to recommend professional medical consultation

# External Dependencies

## Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Firebase**: Authentication, user profiles, and push notifications
- **OpenAI**: AI-powered health assistant using GPT-5

## Development Tools
- **Replit**: Development environment with hot reload capabilities
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across frontend and backend

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library

## Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management and validation

## Real-Time Features
- **WebSocket**: Native browser WebSocket API for real-time communication
- **TanStack React Query**: Server state synchronization