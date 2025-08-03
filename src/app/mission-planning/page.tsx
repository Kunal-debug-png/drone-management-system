'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';

// Dynamically import the MissionPlanner to avoid SSR issues with Leaflet
const MissionPlanner = dynamic(
  () => import('@/components/MissionPlanner'),
  { ssr: false }
);

export default function MissionPlanning() {
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
              <Plane className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Mission Planning</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Configure and create new drone survey missions by defining survey areas, 
            setting flight paths, waypoints, and custom parameters for efficient data collection.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        }>
          <MissionPlanner />
        </Suspense>
      </main>
    </div>
  );
}
