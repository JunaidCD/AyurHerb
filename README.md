# AyurHerb - Ayurvedic Herb Collection Management System

A modern web application for managing ayurvedic herb collections with offline capabilities, real-time synchronization, and comprehensive data tracking.

## 🌿 Overview

AyurHerb is a full-stack web application designed for ayurvedic herb collectors to efficiently manage their collection data. The application provides a seamless experience for recording herb collection details, including GPS coordinates, quality grades, moisture content, and photos, with robust offline support and automatic synchronization.

## ✨ Features

### Core Functionality
- **Collection Form**: Comprehensive form for recording herb collection data
- **Collections View**: Grid-based display of all submitted collections with search functionality
- **Offline Support**: Full offline functionality with local data storage using IndexedDB
- **Real-time Sync**: Automatic synchronization when connection is restored
- **Photo Upload**: Image capture and storage for herb specimens
- **GPS Integration**: Automatic location capture with accuracy tracking

### User Experience
- **Authentication System**: Secure login with session management
- **Responsive Design**: Mobile-first design with optimal viewing on all devices
- **Search & Filter**: Advanced filtering by species name, batch ID, or collector ID
- **Quality Grading**: Visual badges for different quality grades (Premium, Standard, Commercial, Low)
- **Real-time Clock**: Live digital clock display
- **Toast Notifications**: User-friendly feedback for all actions

### Technical Features
- **Progressive Web App (PWA)**: Installable web application
- **TypeScript Support**: Type-safe development with TypeScript
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Database Integration**: PostgreSQL with Drizzle ORM
- **File Upload**: Multer-based file handling for photos
- **WebSocket Support**: Real-time communication capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Wouter** - Lightweight routing library
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Dexie** - IndexedDB wrapper for offline storage
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling
- **WebSocket (ws)** - Real-time communication

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **Drizzle Kit** - Database migration tool
- **Cross-env** - Cross-platform environment variables
- **TSX** - TypeScript execution environment

## 📁 Project Structure

```
AyurHerb/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   ├── app-header.jsx
│   │   │   ├── collection-form.jsx
│   │   │   ├── digital-clock.jsx
│   │   │   ├── logout-button.jsx
│   │   │   ├── pending-sync-list.jsx
│   │   │   └── protected-route.jsx
│   │   ├── contexts/          # React contexts
│   │   │   └── auth-context.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Application pages
│   │   │   ├── collection.jsx
│   │   │   ├── collections-view.jsx
│   │   │   └── login.jsx
│   │   ├── App.jsx            # Main application component
│   │   └── main.jsx           # Application entry point
│   ├── public/                # Static assets
│   └── index.html             # HTML template
├── server/                     # Backend application
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # File storage handling
│   └── vite.ts                # Vite development setup
├── shared/                     # Shared code between client and server
│   └── schema.ts              # Database schema definitions
├── migrations/                 # Database migration files
├── package.json               # Project dependencies and scripts
├── drizzle.config.ts          # Database configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.ts             # Vite configuration
└── components.json            # Shadcn/ui configuration
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- PostgreSQL database

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AyurHerb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ayurherb
   SESSION_SECRET=your-session-secret-key
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

### Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
   
   **Note**: If the page doesn't load properly, perform a hard refresh using `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).

3. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 📱 Usage

### Getting Started
1. **Login**: Access the application through the login page
2. **New Collection**: Use the main form to record herb collection data
3. **View Collections**: Navigate to the collections view to see all recorded data
4. **Search**: Use the search functionality to filter collections
5. **Offline Mode**: The application works offline and syncs when connection is restored

### Collection Form Fields
- **Species Name**: Name of the ayurvedic herb
- **Batch ID**: Unique identifier for the collection batch
- **Collector ID**: Identifier for the person collecting
- **Quality Grade**: Premium, Standard, Commercial, or Low
- **Weight**: Weight of the collected herbs (in grams)
- **Moisture Content**: Moisture percentage (optional)
- **GPS Coordinates**: Automatically captured location data
- **Photos**: Upload images of the herb specimens
- **Notes**: Additional observations or comments

### Collections View Features
- **Grid Layout**: Card-based display of all collections
- **Search & Filter**: Filter by species name, batch ID, or collector ID
- **Quality Badges**: Visual indicators for quality grades
- **Sync Status**: Shows whether data is synced or pending
- **Photo Display**: View uploaded images
- **GPS Coordinates**: Location information with accuracy

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Collections
- `GET /api/collections` - Retrieve all collections
- `POST /api/collections` - Create new collection
- `GET /api/collections/:id` - Get specific collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### File Upload
- `POST /api/upload` - Upload collection photos

## 🗄️ Database Schema

### Collections Table
```sql
collections (
  id: UUID (Primary Key)
  batch_id: TEXT (Not Null)
  collector_id: TEXT (Not Null)
  species_name: TEXT (Not Null)
  latitude: REAL (Not Null)
  longitude: REAL (Not Null)
  accuracy: REAL
  quality_grade: TEXT (Not Null)
  moisture_content: REAL
  weight: REAL (Not Null)
  notes: TEXT
  photo_url: TEXT
  timestamp: TIMESTAMP (Default: now())
  synced: BOOLEAN (Default: false)
)
```

## 🔄 Offline Functionality

The application provides comprehensive offline support:

1. **Local Storage**: Uses IndexedDB via Dexie for client-side data storage
2. **Offline Forms**: All form submissions work offline and queue for sync
3. **Sync Indicator**: Visual indicators show sync status
4. **Automatic Sync**: Data syncs automatically when connection is restored
5. **Conflict Resolution**: Handles data conflicts during synchronization

## 🎨 UI Components

The application uses a modern component library built on:
- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Smooth animations

## 🧪 Development Scripts

```bash
# Development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push
```

## 🚀 Deployment

The application is configured for deployment on platforms like:
- **Netlify**: Frontend deployment
- **Vercel**: Full-stack deployment
- **Railway**: Backend deployment
- **Heroku**: Traditional deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Page not loading**: Perform a hard refresh with `Ctrl+Shift+R`
2. **Database connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
3. **Build errors**: Clear node_modules and reinstall dependencies
4. **TypeScript errors**: Run `npm run check` to identify type issues

### Support

For support and questions, please open an issue in the repository or contact the development team.

---


