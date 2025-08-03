export interface Drone {
  id: string;
  name: string;
  model: string;
  status: 'available' | 'in-mission' | 'idle' | 'maintenance';
  batteryLevel: number;
  location: {
    lat: number;
    lng: number;
  };
  gpsSignal: number;
  temperature: number;
  lastMaintenance: Date;
  currentMissionId?: string;
  specifications: {
    maxAltitude: number;
    maxSpeed: number;
    maxFlightTime: number;
    sensors: string[];
  };
}

export interface Mission {
  id: string;
  name: string;
  droneId: string;
  status: 'planned' | 'starting' | 'in-progress' | 'paused' | 'completed' | 'aborted';
  surveyArea: {
    center: { lat: number; lng: number };
    bounds: { lat: number; lng: number }[];
  };
  flightPath: {
    waypoints: { lat: number; lng: number; altitude: number }[];
    pattern: 'crosshatch' | 'perimeter' | 'custom';
  };
  parameters: {
    altitude: number;
    speed: number;
    overlapPercentage: number;
    dataCollectionFrequency: number;
    sensors: string[];
  };
  progress: {
    percentage: number;
    currentWaypoint: number;
    estimatedTimeRemaining: number;
  };
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface OrganizationStats {
  totalMissions: number;
  totalFlightTime: number;
  totalDistance: number;
  totalAreaCovered: number;
  averageMissionDuration: number;
  mostActiveDrone: string;
  missionSuccessRate: number;
  lastUpdated: Date;
}

export interface Waypoint {
  lat: number;
  lng: number;
  altitude: number;
  action?: 'capture' | 'hover' | 'turn';
}
