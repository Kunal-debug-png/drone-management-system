import { Drone, Mission, OrganizationStats } from '@/types';
import dummyData from '@/data/dummyData.json';

// Local storage keys
const STORAGE_KEYS = {
  DRONES: 'drone_survey_drones',
  MISSIONS: 'drone_survey_missions',
};

// Interfaces for raw JSON data
interface RawDrone {
  id: string;
  name: string;
  model: string;
  status: string;
  batteryLevel: number;
  location: { lat: number; lng: number };
  gpsSignal: number;
  temperature: number;
  lastMaintenance: string; // Date as string in JSON
  currentMissionId?: string;
  specifications: {
    maxAltitude: number;
    maxSpeed: number;
    maxFlightTime: number;
    sensors: string[];
  };
}

interface RawMission {
  id: string;
  name: string;
  droneId: string;
  status: string;
  surveyArea: {
    center: { lat: number; lng: number };
    bounds: { lat: number; lng: number }[];
  };
  flightPath: {
    waypoints: { lat: number; lng: number; altitude: number; action?: string }[];
    pattern: string;
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
  startTime?: string; // Date as string in JSON
  endTime?: string; // Date as string in JSON
  createdAt: string; // Date as string in JSON
  updatedAt: string; // Date as string in JSON
}

// Convert date strings to Date objects for dummy data
function processDrones(drones: RawDrone[]): Drone[] {
  if (!Array.isArray(drones) || drones.length === 0) {
    return [];
  }
  return drones.map(drone => ({
    ...drone,
    lastMaintenance: new Date(drone.lastMaintenance),
    currentMissionId: drone.currentMissionId || undefined,
    status: drone.status as Drone['status']
  }));
}

function processMissions(missions: RawMission[]): Mission[] {
  if (!Array.isArray(missions) || missions.length === 0) {
    return [];
  }
  return missions.map(mission => ({
    ...mission,
    createdAt: new Date(mission.createdAt),
    updatedAt: new Date(mission.updatedAt),
    startTime: mission.startTime ? new Date(mission.startTime) : undefined,
    endTime: mission.endTime ? new Date(mission.endTime) : undefined,
    status: mission.status as Mission['status'],
    flightPath: {
      ...mission.flightPath,
      pattern: mission.flightPath.pattern as Mission['flightPath']['pattern']
    }
  }));
}


// Local storage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (key === STORAGE_KEYS.DRONES) {
        if (!Array.isArray(parsed)) return defaultValue;
        return (parsed as Drone[]).map(drone => ({
          ...drone,
          lastMaintenance: new Date(drone.lastMaintenance)
        })) as T;
      }
      if (key === STORAGE_KEYS.MISSIONS) {
        if (!Array.isArray(parsed)) return defaultValue;
        return (parsed as Mission[]).map(mission => ({
          ...mission,
          createdAt: new Date(mission.createdAt),
          updatedAt: new Date(mission.updatedAt),
          startTime: mission.startTime ? new Date(mission.startTime) : undefined,
          endTime: mission.endTime ? new Date(mission.endTime) : undefined
        })) as T;
      }
      return parsed as T;
    }
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
}

// Initialize data (load from storage or use dummy data)
let runtimeDrones = loadFromStorage(STORAGE_KEYS.DRONES, processDrones(dummyData.drones as RawDrone[]));
let runtimeMissions = loadFromStorage(STORAGE_KEYS.MISSIONS, processMissions(dummyData.missions as RawMission[]));

// Drone Services
export const droneService = {
  async getAllDrones(): Promise<Drone[]> {
    return Promise.resolve([...runtimeDrones]);
  },

  async getDroneById(id: string): Promise<Drone | null> {
    const drone = runtimeDrones.find(d => d.id === id);
    return Promise.resolve(drone || null);
  },

  async createDrone(drone: Omit<Drone, 'id'>): Promise<string> {
    const newId = `drone${Date.now()}`;
    const newDrone: Drone = {
      ...drone,
      id: newId
    };
    runtimeDrones.push(newDrone);
    saveToStorage(STORAGE_KEYS.DRONES, runtimeDrones);
    return Promise.resolve(newId);
  },

  async updateDrone(id: string, updates: Partial<Drone>): Promise<void> {
    const index = runtimeDrones.findIndex(d => d.id === id);
    if (index !== -1) {
      runtimeDrones[index] = { ...runtimeDrones[index], ...updates };
      saveToStorage(STORAGE_KEYS.DRONES, runtimeDrones);
    }
    return Promise.resolve();
  },

  async deleteDrone(id: string): Promise<void> {
    runtimeDrones = runtimeDrones.filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DRONES, runtimeDrones);
    return Promise.resolve();
  },

  subscribeToRealTimeUpdates(callback: (drones: Drone[]) => void) {
    // Simulate real-time updates by calling the callback immediately
    callback([...runtimeDrones]);
    
    // Return a mock unsubscribe function
    return () => {};
  }
};

// Mission Services
export const missionService = {
  async getAllMissions(): Promise<Mission[]> {
    return Promise.resolve([...runtimeMissions]);
  },

  async getMissionById(id: string): Promise<Mission | null> {
    const mission = runtimeMissions.find(m => m.id === id);
    return Promise.resolve(mission || null);
  },

  async createMission(mission: Omit<Mission, 'id'>): Promise<string> {
    const newId = `mission${Date.now()}`;
    const newMission: Mission = {
      ...mission,
      id: newId
    };
    runtimeMissions.push(newMission);
    saveToStorage(STORAGE_KEYS.MISSIONS, runtimeMissions);
    return Promise.resolve(newId);
  },

  async updateMission(id: string, updates: Partial<Mission>): Promise<void> {
    const index = runtimeMissions.findIndex(m => m.id === id);
    if (index !== -1) {
      runtimeMissions[index] = { 
        ...runtimeMissions[index], 
        ...updates,
        updatedAt: new Date()
      };
      saveToStorage(STORAGE_KEYS.MISSIONS, runtimeMissions);
    }
    return Promise.resolve();
  },

  async getActiveMissions(): Promise<Mission[]> {
    const activeMissions = runtimeMissions.filter(m => 
      ['starting', 'in-progress', 'paused'].includes(m.status)
    );
    return Promise.resolve([...activeMissions]);
  },

  subscribeToActiveMissions(callback: (missions: Mission[]) => void) {
    const activeMissions = runtimeMissions.filter(m => 
      ['starting', 'in-progress', 'paused'].includes(m.status)
    );
    callback([...activeMissions]);
    
    // Return a mock unsubscribe function
    return () => {};
  }
};

// Organization Stats Service
export const organizationService = {
  async getOrganizationStats(): Promise<OrganizationStats | null> {
    // Calculate real stats from current data
    const completedMissions = runtimeMissions.filter(m => m.status === 'completed');
    const totalFlightTime = completedMissions.reduce((sum, m) => {
      if (m.startTime && m.endTime) {
        return sum + (m.endTime.getTime() - m.startTime.getTime()) / (1000 * 60); // in minutes
      }
      return sum;
    }, 0);

    const stats: OrganizationStats = {
      totalMissions: runtimeMissions.length,
      totalFlightTime,
      totalDistance: completedMissions.length * 1250, // Rough estimate
      totalAreaCovered: completedMissions.length * 625, // Rough estimate
      averageMissionDuration: completedMissions.length > 0 ? totalFlightTime / completedMissions.length : 0,
      mostActiveDrone: runtimeDrones[0]?.name || 'N/A',
      missionSuccessRate: runtimeMissions.length > 0 ? (completedMissions.length / runtimeMissions.length) * 100 : 0,
      lastUpdated: new Date()
    };
    return Promise.resolve(stats);
  },

  async updateOrganizationStats(): Promise<void> {
    return Promise.resolve();
  }
};

// Utility functions
export const dataService = {
  // Reset all data to original dummy data
  async resetToDefaults(): Promise<void> {
    runtimeDrones = processDrones(dummyData.drones as RawDrone[]);
    runtimeMissions = processMissions(dummyData.missions as RawMission[]);
    
    saveToStorage(STORAGE_KEYS.DRONES, runtimeDrones);
    saveToStorage(STORAGE_KEYS.MISSIONS, runtimeMissions);
    
  },

  // Clear all localStorage data
  async clearAllData(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.DRONES);
      localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    }
    // Reload from dummy data
    runtimeDrones = processDrones(dummyData.drones as RawDrone[]);
    runtimeMissions = processMissions(dummyData.missions as RawMission[]);
    
  },

  // Export current data as JSON
  exportData(): { drones: Drone[]; missions: Mission[] } {
    return {
      drones: [...runtimeDrones],
      missions: [...runtimeMissions]
    };
  }
};
