# Overview

This is a Progressive Web Application (PWA) for Ayurvedic herb collection with offline capabilities and GPS tracking. The application allows users to collect and catalog herbs in the field with location data, photos, and quality assessments. It's built as a full-stack TypeScript application with React frontend and Express backend, designed to work offline and sync data when connectivity is restored.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with Vite**: Modern React application built with Vite for fast development and optimized builds
- **TypeScript**: Full type safety across the entire frontend codebase
- **Component System**: Uses shadcn/ui component library with Radix UI primitives for consistent, accessible UI components
- **Styling**: Tailwind CSS with custom design tokens for Ayurvedic theme (earth tones, green color palette)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Progressive Web App**: Service worker implementation for offline functionality and app-like experience

## Backend Architecture
- **Express Server**: RESTful API server with TypeScript
- **Database Integration**: Drizzle ORM configured for PostgreSQL with Neon Database serverless connection
- **File Upload**: Multer middleware for handling image uploads with validation (10MB limit, image files only)
- **Storage Abstraction**: IStorage interface with MemStorage implementation for development, designed to be easily swapped with database storage
- **API Design**: RESTful endpoints for collection CRUD operations with proper error handling and validation

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for production data persistence
- **Offline Storage**: Dexie (IndexedDB wrapper) for client-side offline data storage
- **Schema Design**: Shared schema between client and server using Drizzle and Zod for validation
- **Sync Strategy**: Bidirectional sync system to handle offline data collection and online synchronization

## Authentication and Authorization
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL session storage
- **Security**: CORS configuration and input validation using Zod schemas

## External Dependencies
- **Neon Database**: Serverless PostgreSQL database hosting
- **GPS/Location Services**: Browser Geolocation API for precise location tracking with accuracy measurement
- **Camera Integration**: Browser MediaDevices API for photo capture functionality
- **PWA Features**: Web App Manifest and Service Worker for offline functionality and installability
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling Framework**: Tailwind CSS for utility-first styling
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation
- **Date Handling**: date-fns for date manipulation and formatting