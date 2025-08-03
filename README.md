# Drone Survey System

A comprehensive web application for managing drone survey missions, built with Next.js 15, React, and TypeScript.

## 🚁 Features

- **Drone Fleet Management**: Monitor and manage multiple drones with real-time status updates
- **Mission Planning**: Create and configure survey missions with interactive map-based planning
- **Flight Path Generation**: Automatic waypoint generation with multiple flight patterns
- **Real-time Monitoring**: Track active missions with live progress updates
- **Analytics Dashboard**: Comprehensive statistics and reporting
- **Data Collection**: Manage sensor data and flight reports

## 🗂️ Project Structure

```
drone-survey-system/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── fleet-management/   # Drone fleet management
│   │   ├── mission-planning/   # Mission planning interface
│   │   ├── monitoring/         # Mission monitoring
│   │   └── real-time-monitoring/ # Real-time flight tracking
│   ├── components/            # Reusable React components
│   │   ├── FleetManager.tsx   # Drone fleet management
│   │   ├── MissionPlanner.tsx # Interactive mission planning
│   │   ├── RealTimeMonitor.tsx# Real-time flight monitoring
│   │   └── MapEventHandler.tsx# Map interaction handler
│   ├── services/              # Business logic and data services
│   │   └── mockFirebase.ts    # localStorage service layer
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Main type definitions
│   └── styles/                # Global styles and Tailwind config
├── public/                    # Static assets
└── package.json              # Project dependencies and scripts
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.4.5**: React framework with App Router and Turbopack
- **React 19.1.0**: UI library with latest features
- **TypeScript 5**: Type safety and development experience

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Recharts 3.1.0**: Data visualization and charts

### Maps & Geospatial
- **Leaflet 1.9.4**: Open-source interactive maps
- **React Leaflet 5.0.0**: React components for Leaflet
- **OpenStreetMap**: Map tile provider (no API key required)

### Data & State Management
- **Browser localStorage**: Complete client-side data persistence
- **Mock Firebase Service**: localStorage-based service layer with CRUD operations
- **No External Database**: All data stored locally in browser

### Development Tools
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Date-fns**: Date manipulation utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drone-survey-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🗺️ External Dependencies & APIs

### Maps Integration
- **Service**: OpenStreetMap (OSM)
- **Library**: Leaflet + React Leaflet
- **API Key**: Not required (uses free OSM tiles)
- **Tile Server**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Attribution**: OpenStreetMap contributors

### Icon Assets
- **Leaflet Markers**: CDN-hosted marker icons
- **Icons**: Lucide React icon library (self-contained)

### No External Dependencies Required
This project is designed to work completely offline after initial load:
- Maps use free OpenStreetMap tiles (cached by browser)
- All data is stored locally using browser localStorage
- No backend server or database required
- No API keys or external services needed

## 🎯 Application Flow

### 1. Dashboard Overview
- View fleet status and active missions
- Monitor key metrics and statistics
- Quick access to all major features

### 2. Drone Management
- **Add New Drones**: Register drones with specifications
- **Monitor Status**: Battery, GPS signal, temperature
- **Maintenance Tracking**: Last maintenance dates and alerts
- **Real-time Updates**: Live status monitoring

### 3. Mission Planning Workflow

#### Step 1: Mission Configuration
- Enter mission name and description
- Select available drone from fleet
- Choose flight pattern (Crosshatch, Perimeter, Custom)
- Set flight parameters (altitude, speed, overlap)
- Select sensors for data collection

#### Step 2: Survey Area Definition
- Click on interactive map to define boundary points
- Minimum 3 points required for valid survey area
- Visual polygon overlay shows survey boundaries

#### Step 3: Waypoint Generation
- **Manual**: Click "Generate Flight Path" button
- **Automatic**: System auto-generates if not manually created
- **Patterns Available**:
  - **Crosshatch**: Grid pattern for comprehensive coverage
  - **Perimeter**: Follow boundary edges
  - **Custom**: User-defined waypoints

#### Step 4: Mission Creation
- Review mission summary and estimated duration
- Assign drone to mission (status changes to 'in-mission')
- Mission saved with all parameters and waypoints

### 4. Mission Execution & Monitoring
- Track mission progress in real-time
- Monitor current waypoint and completion percentage
- View estimated time remaining
- Access mission details and flight path

### 5. Data & Analytics
- Generate flight reports after mission completion
- View organizational statistics and metrics
- Export mission data for analysis
- Track drone utilization and performance

## 📊 Data Management

### localStorage Schema
```javascript
// Storage Keys
STORAGE_KEYS = {
  DRONES: 'drone_survey_drones',
  MISSIONS: 'drone_survey_missions'
}
```

### Data Persistence Strategy
- **Pure localStorage**: All data stored in browser localStorage
- **No External Database**: No backend server or database required
- **Session Persistence**: Data survives browser refreshes and sessions
- **Export Functionality**: Built-in data export for backup
- **Fresh Start**: System begins with empty arrays, users add their own data

### localStorage Service Layer
The `mockFirebase.ts` service provides:
- Complete CRUD operations for drones and missions
- Automatic localStorage synchronization
- Date object serialization/deserialization
- Error handling and data validation
- Unique ID generation with timestamps
- No external dependencies or API calls

## 🔧 Configuration

### Environment Setup
No environment variables required for basic operation. All external dependencies use free services.

### Customization Options
- **Map Center**: Default coordinates in `MissionPlanner.tsx`
- **Flight Parameters**: Min/max values in form inputs
- **Sensor Types**: Available sensors array in components
- **Initial Data**: System starts empty - users create their own drones and missions

## 🐛 Troubleshooting

### Common Issues

1. **Turbopack HMR JSON Import Error**
   - **Issue**: `[Turbopack HMR] Expected module to match pattern`
   - **Solution**: JSON imports work correctly despite console warning
   - **Alternative**: Convert JSON to TypeScript exports if needed

2. **Map Not Loading**
   - **Check**: Internet connection for tile downloads
   - **Verify**: No ad blockers blocking OpenStreetMap
   - **Solution**: Map tiles load from CDN, ensure network access

3. **Waypoints Not Generating**
   - **Requirement**: Define at least 3 survey area points
   - **Action**: Click "Generate Flight Path" or use auto-generation
   - **Check**: Console logs for debugging information

4. **Data Not Persisting**
   - **localStorage**: Verify browser localStorage is enabled
   - **Storage Space**: Check available browser storage space
   - **Privacy Mode**: localStorage doesn't persist in incognito/private mode
   - **Browser Support**: Ensure browser supports localStorage API

### Development Issues

1. **Module Resolution**
   - Ensure TypeScript paths are configured correctly
   - Check `tsconfig.json` path mapping for `@/*`

2. **Leaflet SSR Issues**
   - Component uses `dynamic` import with `ssr: false`
   - Map components only render on client-side

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
- Works on any Node.js hosting platform
- Static export possible with `next export` (limited features)
- Ensure Node.js 18+ support

## Acknowledgments

- **OpenStreetMap**: Free map data and tiles
- **Leaflet**: Excellent mapping library
- **Next.js Team**: Outstanding React framework
- **Tailwind CSS**: Beautiful utility-first styling
- **Lucide**: Clean and consistent icons

