'use client';

import Link from 'next/link';
import { Plane, Activity, BarChart3, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Drone Survey Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Autonomous Drone Survey Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan, manage, and monitor drone surveys across multiple global sites with our comprehensive management system.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/dashboard" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-300">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-600 text-sm">Overview of fleet status, active missions, and key metrics</p>
            </div>
          </Link>

          <Link href="/fleet-management" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-green-300">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Plane className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600 text-sm">Manage drone inventory, status, and maintenance schedules</p>
            </div>
          </Link>

          <Link href="/mission-planning" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-purple-300">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Map className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission Planning</h3>
              <p className="text-gray-600 text-sm">Plan survey areas, flight paths, and mission parameters</p>
            </div>
          </Link>

          <Link href="/monitoring" className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-orange-300">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Monitoring</h3>
              <p className="text-gray-600 text-sm">Monitor active missions with live tracking and controls</p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Advanced Flight Planning</h4>
              <p className="text-gray-600">Support for crosshatch and perimeter patterns with customizable parameters</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Tracking</h4>
              <p className="text-gray-600">Live mission monitoring with progress tracking and control capabilities</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Analytics</h4>
              <p className="text-gray-600">Detailed reporting and organization-wide statistics</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
