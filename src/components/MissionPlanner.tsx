'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import { Drone, Mission, Waypoint } from '@/types';
import { droneService, missionService } from '@/services/mockFirebase';
import MapEventHandler from './MapEventHandler';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MissionPlanner() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [selectedDrone, setSelectedDrone] = useState<string>('');
  const [missionName, setMissionName] = useState('');
  const [flightPattern, setFlightPattern] = useState<'crosshatch' | 'perimeter' | 'custom'>('crosshatch');
  const [altitude, setAltitude] = useState(100);
  const [speed, setSpeed] = useState(10);
  const [overlapPercentage, setOverlapPercentage] = useState(20);
  const [dataCollectionFrequency, setDataCollectionFrequency] = useState(1);
  const [selectedSensors, setSelectedSensors] = useState<string[]>(['RGB Camera']);
  const [surveyArea, setSurveyArea] = useState<{ lat: number; lng: number }[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(false);

  const availableSensors = ['RGB Camera', 'Thermal Camera', 'LiDAR', 'Multispectral', 'Infrared'];

  useEffect(() => {
    loadDrones();
  }, []);

  const loadDrones = async () => {
    try {
      const dronesData = await droneService.getAllDrones();
      setDrones(dronesData.filter(drone => drone.status === 'available'));
    } catch (error) {
      console.error('Error loading drones:', error);
    }
  };

  const generateWaypoints = () => {
    if (surveyArea.length < 3) {
      alert('Please define at least 3 points for the survey area');
      return;
    }

    let generatedWaypoints: Waypoint[] = [];

    if (flightPattern === 'perimeter') {
      generatedWaypoints = surveyArea.map(point => ({
        ...point,
        altitude,
        action: 'capture' as const
      }));
    } else if (flightPattern === 'crosshatch') {
      // Simple crosshatch pattern generation
      const bounds = {
        minLat: Math.min(...surveyArea.map(p => p.lat)),
        maxLat: Math.max(...surveyArea.map(p => p.lat)),
        minLng: Math.min(...surveyArea.map(p => p.lng)),
        maxLng: Math.max(...surveyArea.map(p => p.lng))
      };

      const stepLat = (bounds.maxLat - bounds.minLat) / 5;
      const stepLng = (bounds.maxLng - bounds.minLng) / 5;

      // Horizontal lines
      for (let i = 0; i <= 5; i++) {
        const lat = bounds.minLat + i * stepLat;
        generatedWaypoints.push({
          lat,
          lng: bounds.minLng,
          altitude,
          action: 'capture'
        });
        generatedWaypoints.push({
          lat,
          lng: bounds.maxLng,
          altitude,
          action: 'capture'
        });
      }

      // Vertical lines
      for (let i = 0; i <= 5; i++) {
        const lng = bounds.minLng + i * stepLng;
        generatedWaypoints.push({
          lat: bounds.minLat,
          lng,
          altitude,
          action: 'capture'
        });
        generatedWaypoints.push({
          lat: bounds.maxLat,
          lng,
          altitude,
          action: 'capture'
        });
      }
    }

    setWaypoints(generatedWaypoints);
  };

  const handleMapClick = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setSurveyArea(prev => [...prev, { lat, lng }]);
  };

  const clearSurveyArea = () => {
    setSurveyArea([]);
    setWaypoints([]);
  };

  const createMission = async () => {
    if (!selectedDrone || !missionName || surveyArea.length < 3) {
      alert('Please fill all required fields and define survey area');
      return;
    }

    // Auto-generate waypoints if none exist
    let finalWaypoints = waypoints;
    if (waypoints.length === 0) {
      alert('No waypoints generated. Auto-generating waypoints for the mission.');
      if (flightPattern === 'custom') {
        // For custom pattern, create perimeter waypoints as fallback
        finalWaypoints = surveyArea.map(point => ({
          ...point,
          altitude,
          action: 'capture' as const
        }));
      } else {
        // Use the existing generate function logic
        let generatedWaypoints: Waypoint[] = [];
        
        if (flightPattern === 'perimeter') {
          generatedWaypoints = surveyArea.map(point => ({
            ...point,
            altitude,
            action: 'capture' as const
          }));
        } else if (flightPattern === 'crosshatch') {
          const bounds = {
            minLat: Math.min(...surveyArea.map(p => p.lat)),
            maxLat: Math.max(...surveyArea.map(p => p.lat)),
            minLng: Math.min(...surveyArea.map(p => p.lng)),
            maxLng: Math.max(...surveyArea.map(p => p.lng))
          };
          
          const stepLat = (bounds.maxLat - bounds.minLat) / 3;
          const stepLng = (bounds.maxLng - bounds.minLng) / 3;
          
          // Generate a simple grid pattern
          for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
              generatedWaypoints.push({
                lat: bounds.minLat + i * stepLat,
                lng: bounds.minLng + j * stepLng,
                altitude,
                action: 'capture'
              });
            }
          }
        }
        finalWaypoints = generatedWaypoints;
      }
      setWaypoints(finalWaypoints);
    }

    setLoading(true);
    try {
      const mission: Omit<Mission, 'id'> = {
        name: missionName,
        droneId: selectedDrone,
        status: 'planned',
        surveyArea: {
          center: {
            lat: surveyArea.reduce((sum, p) => sum + p.lat, 0) / surveyArea.length,
            lng: surveyArea.reduce((sum, p) => sum + p.lng, 0) / surveyArea.length
          },
          bounds: surveyArea
        },
        flightPath: {
          waypoints: finalWaypoints.map(wp => ({ ...wp, altitude })),
          pattern: flightPattern
        },
        parameters: {
          altitude,
          speed,
          overlapPercentage,
          dataCollectionFrequency,
          sensors: selectedSensors
        },
        progress: {
          percentage: 0,
          currentWaypoint: 0,
          estimatedTimeRemaining: Math.ceil(finalWaypoints.length * 60 / speed) // rough estimate
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const missionId = await missionService.createMission(mission);
      
      // Update drone status to 'in-mission' and assign mission ID
      await droneService.updateDrone(selectedDrone, {
        status: 'in-mission',
        currentMissionId: missionId
      });
      
      // Reload available drones to reflect the status change
      await loadDrones();
      
      // Reset form
      setMissionName('');
      setSelectedDrone('');
      setSurveyArea([]);
      setWaypoints([]);
      
      alert('Mission created successfully! Drone has been assigned to mission.');
      
    } catch (error) {
      console.error('Error creating mission:', error);
      alert('Error creating mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Mission Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mission Name
              </label>
              <input
                type="text"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mission name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Drone
              </label>
              <select
                value={selectedDrone}
                onChange={(e) => setSelectedDrone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a drone</option>
                {drones.map(drone => (
                  <option key={drone.id} value={drone.id}>
                    {drone.name} - {drone.model} (Battery: {drone.batteryLevel}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flight Pattern
              </label>
              <div className="flex space-x-4">
                {(['crosshatch', 'perimeter', 'custom'] as const).map(pattern => (
                  <label key={pattern} className="flex items-center">
                    <input
                      type="radio"
                      name="pattern"
                      value={pattern}
                      checked={flightPattern === pattern}
                      onChange={(e) => setFlightPattern(e.target.value as 'crosshatch' | 'perimeter' | 'custom')}
                      className="mr-2"
                    />
                    <span className="capitalize">{pattern}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altitude (m)
                </label>
                <input
                  type="number"
                  value={altitude}
                  onChange={(e) => setAltitude(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speed (m/s)
                </label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="25"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlap (%)
                </label>
                <input
                  type="number"
                  value={overlapPercentage}
                  onChange={(e) => setOverlapPercentage(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Frequency (Hz)
                </label>
                <input
                  type="number"
                  value={dataCollectionFrequency}
                  onChange={(e) => setDataCollectionFrequency(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sensors
              </label>
              <div className="space-y-2">
                {availableSensors.map(sensor => (
                  <label key={sensor} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSensors.includes(sensor)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSensors(prev => [...prev, sensor]);
                        } else {
                          setSelectedSensors(prev => prev.filter(s => s !== sensor));
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{sensor}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={generateWaypoints}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Generate Flight Path
            </button>
            <button
              onClick={clearSurveyArea}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Area
            </button>
            <button
              onClick={createMission}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Mission'}
            </button>
          </div>
        </div>

        {/* Mission Summary */}
        {waypoints.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Mission Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Waypoints:</strong> {waypoints.length}</p>
              <p><strong>Estimated Duration:</strong> {Math.ceil(waypoints.length * 60 / speed)} minutes</p>
              <p><strong>Pattern:</strong> {flightPattern}</p>
              <p><strong>Coverage Area:</strong> {surveyArea.length} boundary points</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-96 lg:h-full">
          <MapContainer
            center={[40.7128, -74.0060]} // Default to NYC
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEventHandler onMapClick={handleMapClick} />
            
            {/* Survey Area */}
            {surveyArea.length > 0 && (
              <>
                {surveyArea.map((point, index) => (
                  <Marker key={index} position={[point.lat, point.lng]}>
                    <Popup>Survey Point {index + 1}</Popup>
                  </Marker>
                ))}
                {surveyArea.length > 2 && (
                  <Polygon
                    positions={surveyArea.map(p => [p.lat, p.lng])}
                    pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.3 }}
                  />
                )}
              </>
            )}

            {/* Waypoints */}
            {waypoints.map((waypoint, index) => (
              <Marker 
                key={`waypoint-${index}`} 
                position={[waypoint.lat, waypoint.lng]}
                icon={new Icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                  iconSize: [15, 20],
                  iconAnchor: [7, 20],
                })}
              >
                <Popup>
                  Waypoint {index + 1}<br />
                  Altitude: {waypoint.altitude}m<br />
                  Action: {waypoint.action}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Click on the map to define survey area boundary points. Generate flight path after defining the area.
          </p>
        </div>
      </div>
    </div>
  );
}
