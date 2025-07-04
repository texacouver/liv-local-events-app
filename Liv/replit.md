# Liv - Local Events & Deals Platform

## Overview

Liv is a mobile-first web application that helps users discover local events and deals in their area. Built with React and Express.js, it provides a modern, responsive interface for browsing restaurant deals, events, and retail offers with location-based features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot reload with Vite integration

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Data Layer
- **Database**: PostgreSQL with listings table storing events and deals
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Zod validation for runtime type checking
- **Storage Interface**: Abstracted storage layer with in-memory fallback

### API Layer
- **REST API**: Express.js routes for CRUD operations
- **Endpoints**: 
  - `/api/listings` - Get all listings
  - `/api/listings/:id` - Get specific listing
  - `/api/listings/type/:type` - Filter by type
  - `/api/listings/search` - Search functionality

### Frontend Features
- **Responsive Design**: Mobile-first approach with touch-friendly interface
- **Location Services**: Geolocation integration for distance calculations
- **Category Filtering**: Filter by events, restaurant deals, retail deals
- **Search Functionality**: Real-time search with debouncing
- **QR Code Display**: Individual QR codes for deal redemption
- **Theme Switching**: Full light/dark mode with persistent preferences
- **Interactive Maps**: Leaflet-powered maps with custom markers and popups
- **Micro-animations**: Comprehensive animation system with hover effects, transitions, and feedback

## Data Flow

1. **User Interaction**: User browses listings through category tabs or search
2. **API Request**: Frontend makes REST API calls using TanStack Query
3. **Data Processing**: Backend queries PostgreSQL database via Drizzle ORM
4. **Response**: Formatted data returned with proper error handling
5. **UI Update**: React components re-render with new data
6. **Location Enhancement**: Distance calculations performed client-side

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production
- **Drizzle-Kit**: Database migration and schema management

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot module replacement
- **API Integration**: Express server with Vite middleware
- **Database**: PostgreSQL connection via environment variables

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Static Assets**: Served directly from Express in production
- **Database**: Neon Database for serverless PostgreSQL hosting
- **Environment**: Production configuration via NODE_ENV

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **TypeScript**: Strict mode enabled with path mapping
- **Build Output**: Optimized bundles in dist/ directory

## Changelog
- July 04, 2025. Initial setup
- July 04, 2025. Fixed query client configuration - resolved TanStack Query errors by properly importing the configured queryClient instead of creating a new instance
- July 04, 2025. Enhanced UI with vibrant, colorful design - added gradient backgrounds, category-specific colors (purple for events, orange for restaurants, green for retail), improved typography, glowing effects, and emojis for a more fun and engaging experience
- July 04, 2025. Added functional Favorites, Map, and Profile sections with authentic Vancouver venue data including Cactus Club, The Commodore Ballroom, Science World, Granville Island Brewery, Nordstrom, Aritzia, and Tim Hortons. Implemented full navigation between all sections.
- July 04, 2025. Implemented interactive maps using Leaflet - replaced "Map integration coming soon" placeholders with fully functional interactive maps featuring custom markers, popups, and category-specific styling. Maps now show on both the main Map page and individual listing detail pages.
- July 04, 2025. Added comprehensive micro-animations for delightful user interactions - implemented fade-in animations, hover effects, button press feedback, staggered animations, and smooth transitions throughout the app. Features include card hover lift, scale animations, icon animations, and responsive feedback on all interactive elements.
- July 04, 2025. Fixed production server startup - added missing server.listen() call for production mode to properly expose port 5000, resolving deployment failures
- July 04, 2025. Implemented Personalized Event Recommendation Engine with user preferences tracking, interaction learning, and dynamic scoring algorithm. Added database schema for userPreferences, userInteractions, and recommendationScores tables.
- July 04, 2025. Restructured Profile page with tabs (Overview, Preferences, Settings) and integrated PreferencesSetup component. Fixed authentication issues by adding mock user system for development. Created README.md for GitHub deployment.

## User Preferences

Preferred communication style: Simple, everyday language.