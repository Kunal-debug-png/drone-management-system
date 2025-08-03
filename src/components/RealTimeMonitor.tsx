'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Mission, Drone } from '@/types';

// Fix default icons for react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function RealTimeMonitor() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        // Show all missions (including planned ones) for better visibility
        const activeMissions = data.missions.filter((mission: Mission) => 
          ['planned', 'starting', 'in-progress', 'paused'].includes(mission.status)
        );
        setMissions(activeMissions);
        setDrones(data.drones || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
    
    // Poll for updates every 3 seconds for better real-time feel
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMissionColor = (status: string) => {
    switch (status) {
      case 'planned': return 'blue';
      case 'starting': return 'orange';
      case 'in-progress': return 'green';
      case 'paused': return 'red';
      default: return 'gray';
    }
  };

  const getDroneForMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return null;
    return drones.find(d => d.id === mission.droneId) || null;
  };

  return (
    <div className="relative h-screen">
      {/* Mission Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Active Missions</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span>Planned</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-orange-500 mr-2"></div>
            <span>Starting</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-green-500 mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-red-500 mr-2"></div>
            <span>Paused</span>
          </div>
        </div>
        
        {missions.length > 0 && (
          <div className="mt-4 pt-2 border-t">
            <p className="text-xs text-gray-600">Total Active: {missions.length}</p>
            <p className="text-xs text-gray-500">Updates every 3s</p>
          </div>
        )}
      </div>

      <MapContainer 
        center={[40.7128, -74.0060]} 
        zoom={missions.length > 0 ? 8 : 10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render missions */}
        {missions.map((mission) => {
          const drone = getDroneForMission(mission.id);
          const missionColor = getMissionColor(mission.status);
          
          return (
            <div key={mission.id}>
              {/* Survey Area Polygon */}
              {mission.surveyArea.bounds.length > 2 && (
                <Polygon
                  positions={mission.surveyArea.bounds.map(b => [b.lat, b.lng] as LatLngExpression)}
                  pathOptions={{ 
                    color: missionColor, 
                    fillColor: missionColor, 
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <h4 className="font-semibold">{mission.name}</h4>
                      <p><strong>Status:</strong> {mission.status}</p>
                      <p><strong>Drone:</strong> {drone?.name || 'Unknown'}</p>
                      <p><strong>Progress:</strong> {mission.progress.percentage}%</p>
                      <p><strong>Pattern:</strong> {mission.flightPath.pattern}</p>
                      {mission.flightPath.waypoints.length > 0 && (
                        <p><strong>Waypoints:</strong> {mission.flightPath.waypoints.length}</p>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              )}
              
              {/* Flight Path */}
              {mission.flightPath.waypoints.length > 1 && (
                <Polyline
                  positions={mission.flightPath.waypoints.map(wp => [wp.lat, wp.lng] as LatLngExpression)}
                  pathOptions={{
                    color: missionColor,
                    weight: 3,
                    opacity: 0.8,
                    dashArray: mission.status === 'planned' ? '5, 10' : undefined
                  }}
                />
              )}

              {/* Waypoint Markers */}
              {mission.flightPath.waypoints.map((wp, index) => (
                <Marker 
                  key={`${mission.id}-wp-${index}`} 
                  position={[wp.lat, wp.lng]}
                  icon={new Icon({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    iconSize: [12, 18],
                    iconAnchor: [6, 18],
                  })}
                >
                  <Popup>
                    <div className="text-xs">
                      <p><strong>Waypoint {index + 1}</strong></p>
                      <p>Mission: {mission.name}</p>
                      <p>Alt: {wp.altitude}m</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Mission Center Marker */}
              <Marker 
                position={[mission.surveyArea.center.lat, mission.surveyArea.center.lng]}
                icon={new Icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                  iconSize: [25, 35],
                  iconAnchor: [12, 35],
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <h4 className="font-semibold text-center">{mission.name}</h4>
                    <hr className="my-2" />
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs text-white bg-${missionColor}-500`}>{mission.status}</span></p>
                    <p><strong>Drone:</strong> {drone?.name || 'Unknown'}</p>
                    <p><strong>Model:</strong> {drone?.model || 'N/A'}</p>
                    <p><strong>Battery:</strong> {drone?.batteryLevel || 0}%</p>
                    <p><strong>Progress:</strong> {mission.progress.percentage}%</p>
                    <p><strong>Current WP:</strong> {mission.progress.currentWaypoint + 1}/{mission.flightPath.waypoints.length}</p>
                    <p><strong>ETA:</strong> {mission.progress.estimatedTimeRemaining}min</p>
                    <p><strong>Altitude:</strong> {mission.parameters.altitude}m</p>
                    <p><strong>Speed:</strong> {mission.parameters.speed}m/s</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
        
        {/* Show all drones on map */}
        {drones.map((drone) => {
          // Skip drones that are already shown as part of missions
          const isInActiveMission = missions.some(m => m.droneId === drone.id);
          if (isInActiveMission) return null;
          
          return (
            <Marker 
              key={`drone-${drone.id}`}
              position={[drone.location.lat, drone.location.lng]}
              icon={new Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [20, 28],
                iconAnchor: [10, 28],
              })}
            >
              <Popup>
                <div className="text-sm">
                  <h4 className="font-semibold">{drone.name}</h4>
                  <p><strong>Status:</strong> {drone.status}</p>
                  <p><strong>Battery:</strong> {drone.batteryLevel}%</p>
                  <p><strong>GPS:</strong> {drone.gpsSignal}%</p>
                  <p><strong>Temp:</strong> {drone.temperature}°C</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

