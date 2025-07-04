# Liv - Local Events & Deals Platform

A mobile-first web application that helps users discover local events and deals in Vancouver with personalized recommendations powered by machine learning.

![Liv App Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop)

## Features

### 🎯 Core Functionality
- **Event Discovery**: Browse restaurants, events, and retail deals in Vancouver
- **Interactive Maps**: Leaflet-powered maps with custom markers and popups
- **QR Code Redemption**: Individual QR codes for each deal
- **Search & Filter**: Real-time search with category filtering
- **Location Services**: Distance calculations and location-based sorting

### 🤖 Personalized Recommendations
- **Smart Preferences**: User preference tracking for categories, price range, and location
- **Interaction Learning**: Tracks user behavior to improve recommendations
- **Real-time Updates**: Dynamic recommendation scoring based on user activity
- **Customizable**: Adjustable maximum distance and preference settings

### 🎨 Modern Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Vibrant UI**: Gradient backgrounds and category-specific color coding
- **Micro-Animations**: Smooth transitions, hover effects, and loading states
- **Dark/Light Mode**: Full theme switching with persistent preferences

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Leaflet** for interactive maps

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon Database
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/liv-local-events-app.git
cd liv-local-events-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with your database URL
DATABASE_URL=your_postgresql_connection_string
```

4. Push database schema:
```bash
npm run db:push
```

5. Seed the database:
```bash
curl -X POST http://localhost:5000/api/seed
```

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## API Endpoints

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get specific listing
- `GET /api/listings/type/:type` - Filter by type
- `GET /api/listings/search?q=query` - Search listings

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/recommendations/refresh` - Force refresh recommendations

### User Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update user preferences

### Interactions
- `POST /api/interactions` - Track user interaction

## Data

The app includes authentic Vancouver venue data:
- **Restaurants**: Cactus Club, Granville Island Brewery, Tim Hortons
- **Events**: The Commodore Ballroom, Queen Elizabeth Theatre
- **Attractions**: Science World, VanDusen Botanical Garden
- **Retail**: Nordstrom, Aritzia, Lululemon

## Database Schema

### Core Tables
- `listings` - Events, restaurants, and retail deals
- `users` - User profiles and authentication
- `favorites` - User favorite listings

### Recommendation Engine
- `user_preferences` - User preference settings
- `user_interactions` - Tracking user behavior
- `recommendation_scores` - Calculated recommendation scores

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Vancouver venue data and images from authentic sources
- UI components built with shadcn/ui
- Maps powered by Leaflet and OpenStreetMap
- Built with ❤️ for the Vancouver community