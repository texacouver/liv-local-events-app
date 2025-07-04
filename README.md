# Liv - Local Events & Deals Platform

A mobile-first web application that helps users discover local events and deals in Vancouver with personalized recommendations powered by machine learning.

## Screenshots

### Home Page with Personalized Recommendations
![Home Page](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Browse events, restaurant deals, and retail offers with personalized recommendations at the top*

### Interactive Map View
![Map View](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop)
*Explore Vancouver venues on an interactive map with custom markers and popups*

### Listing Details with QR Codes
![Detail View](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop)
*Detailed venue information with QR codes for easy deal redemption*

### Profile & Preferences
![Profile View](https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop)
*Manage your preferences, view achievements, and customize your experience*

### Category Filtering
![Categories](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop)
*Filter by events, restaurant deals, or retail offers with vibrant category-specific colors*

## Live Demo Features

### Recommendation Engine in Action
The app learns from your behavior and provides increasingly personalized suggestions:
- Browse restaurant deals → Get more food recommendations
- Check out Science World → See similar educational attractions
- Save events to favorites → Discover concerts and cultural events

### Real Vancouver Venues
Experience authentic local data including:
- **Restaurants**: Cactus Club Cafe, Granville Island Brewery, Tim Hortons
- **Events**: The Commodore Ballroom concerts, Queen Elizabeth Theatre shows
- **Attractions**: Science World exhibits, VanDusen Botanical Garden tours
- **Retail**: Nordstrom sales, Aritzia collections, Lululemon activewear

### Interactive Features
- Tap venue markers on the map to see instant previews
- Swipe through recommendation cards with smooth animations
- Scan QR codes for immediate deal activation
- Toggle between light and dark themes
- Set your preferred maximum distance for venue suggestions

## Key Features Showcase

### 🎯 Smart Discovery Experience
- **Personalized Recommendations**: AI-powered suggestion engine learns from your interactions
- **Real Vancouver Data**: Authentic venues including Cactus Club, Science World, The Commodore Ballroom
- **Interactive Maps**: Leaflet-powered mapping with custom markers and venue clustering
- **QR Code Integration**: Instant deal redemption with unique QR codes for each offer
- **Intelligent Search**: Real-time search with fuzzy matching and category filtering

### 🤖 Advanced Recommendation Engine
- **Preference Learning**: Tracks category preferences (events, restaurants, retail)
- **Behavioral Analysis**: Learns from clicks, views, and favorite interactions
- **Dynamic Scoring**: Real-time recommendation recalculation based on activity
- **Location Awareness**: Distance-based filtering with customizable radius
- **Price Range Matching**: Budget-conscious recommendations ($, $$, $$$, $$$$)

### 🎨 Premium User Experience
- **Mobile-First Design**: Optimized for iOS and Android with touch-friendly interfaces
- **Vibrant Visual Design**: Category-specific gradients (purple for events, orange for restaurants, green for retail)
- **Micro-Animations**: Smooth transitions, hover effects, staggered loading animations
- **Accessibility**: Screen reader friendly with proper ARIA labels and semantic HTML
- **Theme Support**: Seamless dark/light mode switching with system preference detection

### 📱 Complete App Ecosystem
- **Bottom Navigation**: Easy access to Home, Map, Favorites, Profile, and QR scanner
- **Profile Management**: User achievements, statistics tracking, and preference customization
- **Favorites System**: Save and organize preferred venues and events
- **Real-time Updates**: Live data synchronization with instant UI updates

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