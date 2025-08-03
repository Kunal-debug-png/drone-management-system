'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Drone, Mission } from '@/types';
import { droneService, missionService } from '@/services/mockFirebase';

export default function Dashboard() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function fetchData() {
      try {
        const drones = await droneService.getAllDrones();
        const missions = await missionService.getAllMissions();

        setDrones(drones);
        setMissions(missions);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fleet Overview & Analytics
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Monitor your drone operations and get insights into mission performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Missions</h3>
            <p className="text-3xl font-bold text-blue-600">
              {missions.filter(mission => ['planned', 'starting', 'in-progress', 'paused'].includes(mission.status)).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Drones</h3>
            <p className="text-3xl font-bold text-green-600">
              {drones.filter(drone => drone.status === 'available').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Flight Hours</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(missions.reduce((total, mission) => {
                // Calculate based on estimated time remaining for active missions
                if (['starting', 'in-progress', 'paused'].includes(mission.status)) {
                  return total + (mission.progress?.estimatedTimeRemaining || 0);
                }
                return total;
              }, 0) / 60)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/mission-planning" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan New Mission</h3>
            <p className="text-gray-600">Create and configure new drone survey missions</p>
          </Link>
          <Link href="/fleet-management" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Fleet</h3>
            <p className="text-gray-600">View and manage your drone inventory</p>
          </Link>
          <Link href="/monitoring" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitor Flights</h3>
            <p className="text-gray-600">Track active missions in real-time</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
