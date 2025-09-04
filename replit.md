# CloudVault Pro - File Management System

## Overview

CloudVault Pro is a modern cloud-based file management system built with React, TypeScript, and Express.js. The application provides a comprehensive solution for storing, organizing, and managing files with features like folder navigation, file sharing, search functionality, and user account management. The system includes a responsive web interface with dark/light theme support and comprehensive file operations including upload, download, star/favorite, and trash management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing with pages for files, recent, shared, starred, trash, profile, and subscription management
- **State Management**: TanStack Query (React Query) for server state management and caching with custom query client configuration
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Theme System**: Custom theme provider supporting dark/light modes with CSS custom properties
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **File Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot module replacement and development middleware integration

### Data Architecture
- **Database Schema**: Comprehensive schema with users, files, shares, and activities tables
- **File Organization**: Hierarchical folder structure with parent-child relationships
- **Sharing System**: Granular permission-based file sharing with expiration support
- **Activity Tracking**: User activity logging for audit trails and recent file tracking

### Component Architecture
- **Layout System**: Fixed sidebar navigation with responsive mobile drawer
- **File Management**: Grid and list view modes with drag-and-drop upload support
- **Search System**: Real-time file search with query-based filtering
- **File Operations**: Comprehensive CRUD operations with optimistic updates
- **Toast Notifications**: User feedback system for operations and error handling

### Development Setup
- **Configuration**: Unified TypeScript configuration across client, server, and shared modules
- **Path Aliases**: Organized import system with @ prefixes for clean module resolution
- **Code Splitting**: Automatic component and route-based code splitting
- **Error Handling**: Runtime error overlay for development debugging

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL serverless database with connection pooling
- **Drizzle Kit**: Database migration and schema management tooling

### UI and Styling
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library with extensive icon coverage
- **Class Variance Authority**: Component variant management for styling

### Development Tools
- **Replit Integration**: Development environment with live preview and collaboration features
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Utility Libraries
- **React Hook Form**: Form state management with validation support
- **Zod**: Runtime type validation and schema parsing
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Minimalistic routing library for single-page applications

### Development Dependencies
- **TypeScript**: Static type checking and enhanced development experience
- **Vite Plugins**: Development tooling including error overlays and cartographer integration