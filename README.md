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
│   │   ├── drones/            # Drone management pages
│   │   ├── mission-planning/   # Mission planning interface
│   │   ├── missions/          # Mission management pages
│   │   ├── reports/           # Analytics and reports
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   ├── MissionPlanner.tsx # Interactive mission planning
│   │   ├── DroneCard.tsx      # Drone status display
│   │   └── MapEventHandler.tsx# Map interaction handler
│   ├── services/              # Business logic and data services
│   │   └── mockFirebase.ts    # Mock data service (simulates backend)
│   ├── data/                  # Static data and configurations
│   │   └── dummyData.json     # Sample data for development
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
- **Local Storage**: Client-side data persistence
- **Mock Firebase Service**: Simulated backend with CRUD operations
- **UUID**: Unique identifier generation

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

### No External API Keys Required
This project is designed to work without any external API keys or paid services:
- Maps use free OpenStreetMap tiles
- All data is stored locally using browser LocalStorage
- Mock backend service simulates real database operations

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

### Local Storage Schema
```javascript
// Storage Keys
STORAGE_KEYS = {
  DRONES: 'drone_survey_drones',
  MISSIONS: 'drone_survey_missions', 
  REPORTS: 'drone_survey_reports'
}
```

### Data Persistence
- **Client-side**: Browser LocalStorage for data persistence
- **Sync**: Automatic JSON file updates via API routes
- **Backup**: Data export functionality available
- **Reset**: Restore to default sample data option

### Mock Backend Service
The `mockFirebase.ts` service simulates a real backend with:
- CRUD operations for drones, missions, and reports
- Real-time data subscriptions
- Data validation and error handling
- Automatic ID generation and timestamps

## 🔧 Configuration

### Environment Setup
No environment variables required for basic operation. All external dependencies use free services.

### Customization Options
- **Map Center**: Default coordinates in `MissionPlanner.tsx`
- **Flight Parameters**: Min/max values in form inputs
- **Sensor Types**: Available sensors array in components
- **Sample Data**: Modify `dummyData.json` for different demo data

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
   - **Storage**: Verify browser LocalStorage is enabled
   - **Space**: Check available storage space
   - **Privacy**: Ensure not in incognito/private mode

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

## 🙏 Acknowledgments

- **OpenStreetMap**: Free map data and tiles
- **Leaflet**: Excellent mapping library
- **Next.js Team**: Outstanding React framework
- **Tailwind CSS**: Beautiful utility-first styling
- **Lucide**: Clean and consistent icons

