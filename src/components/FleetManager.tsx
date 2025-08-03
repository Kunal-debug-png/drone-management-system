'use client';

import React, { useState, useEffect } from 'react';
import { Drone } from '@/types';
import { Battery, Thermometer, Signal, Settings, Plus, AlertTriangle, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { droneService } from '@/services/mockFirebase';

export default function FleetManager() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDrone, setShowAddDrone] = useState(false);
  const [newDrone, setNewDrone] = useState({
    name: '',
    model: '',
    maxAltitude: 400,
    maxSpeed: 20,
    maxFlightTime: 30,
    sensors: ['RGB Camera']
  });

const fetchDrones = async () => {
    try {
      const drones = await droneService.getAllDrones();
      setDrones(drones);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch drones:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDrones, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'in-mission': return 'text-blue-600 bg-blue-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

const toggleMaintenanceStatus = async (droneId: string, currentStatus: string) => {
    try {
      // Only allow toggling between 'available' and 'maintenance'
      // Don't allow toggling if drone is in mission or idle
      if (!['available', 'maintenance'].includes(currentStatus)) {
        alert('Cannot change status while drone is in mission or idle.');
        return;
      }

      const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
      
      // Update the drone status using the service
      await droneService.updateDrone(droneId, {
        status: newStatus as Drone['status'],
        // Update lastMaintenance date if switching to maintenance
        lastMaintenance: newStatus === 'maintenance' ? new Date() : undefined
      });
      
      // Refresh the drones list
      await fetchDrones();
      
    } catch (error) {
      console.error('Error updating drone status:', error);
      alert('Error updating drone status. Please try again.');
    }
  };

const addDrone = async () => {
    try {
      const newDroneData: Omit<Drone, 'id'> = {
        ...newDrone,
        status: 'available',
        batteryLevel: 100,
        location: { lat: 40.7128, lng: -74.0060 }, // Default NYC location
        gpsSignal: 95,
        temperature: 25,
        lastMaintenance: new Date(),
        specifications: {
          maxAltitude: newDrone.maxAltitude,
          maxSpeed: newDrone.maxSpeed,
          maxFlightTime: newDrone.maxFlightTime,
          sensors: newDrone.sensors
        }
      };
      
      // Create new drone using the service
      await droneService.createDrone(newDroneData);
      
      // Refresh the drones list
      await fetchDrones();
      
      setShowAddDrone(false);
      setNewDrone({
        name: '',
        model: '',
        maxAltitude: 400,
        maxSpeed: 20,
        maxFlightTime: 30,
        sensors: ['RGB Camera']
      });
      
      alert('Drone added successfully!');
    } catch (error) {
      console.error('Error adding drone:', error);
      alert('Error adding drone. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drones</p>
              <p className="text-2xl font-bold text-gray-900">{drones.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {drones.filter(d => d.status === 'available').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Mission</p>
              <p className="text-2xl font-bold text-gray-900">
                {drones.filter(d => d.status === 'in-mission').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">
                {drones.filter(d => d.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Fleet Inventory</h2>
        <button
          onClick={() => setShowAddDrone(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Drone
        </button>
      </div>

      {/* Drone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drones.map((drone) => (
          <div key={drone.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{drone.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
                  {drone.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{drone.model}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(drone.batteryLevel)}`} />
                    <span className="text-sm text-gray-600">Battery</span>
                  </div>
                  <span className={`text-sm font-medium ${getBatteryColor(drone.batteryLevel)}`}>
                    {drone.batteryLevel}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Signal className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">GPS Signal</span>
                  </div>
                  <span className="text-sm text-gray-900">{drone.gpsSignal}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <span className="text-sm text-gray-900">{drone.temperature}°C</span>
                </div>

              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Maintenance</span>
                  <span className="text-sm text-gray-900">
                    {format(new Date(drone.lastMaintenance), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Specifications</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Max Altitude: {drone.specifications.maxAltitude}m</p>
                  <p>Max Speed: {drone.specifications.maxSpeed}m/s</p>
                </div>
              </div>

              {/* Maintenance Toggle */}
              {['available', 'maintenance'].includes(drone.status) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleMaintenanceStatus(drone.id, drone.status)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      drone.status === 'maintenance'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                    {drone.status === 'maintenance' ? 'Mark as Available' : 'Send to Maintenance'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Drone Modal */}
      {showAddDrone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Drone</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newDrone.name}
                  onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Drone name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={newDrone.model}
                  onChange={(e) => setNewDrone({ ...newDrone, model: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Drone model"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Altitude (m)</label>
                  <input
                    type="number"
                    value={newDrone.maxAltitude}
                    onChange={(e) => setNewDrone({ ...newDrone, maxAltitude: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Speed (m/s)</label>
                  <input
                    type="number"
                    value={newDrone.maxSpeed}
                    onChange={(e) => setNewDrone({ ...newDrone, maxSpeed: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddDrone(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addDrone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Drone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

