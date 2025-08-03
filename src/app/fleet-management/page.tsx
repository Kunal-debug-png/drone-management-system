'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';

// Dynamically import the FleetManager to avoid SSR issues
const FleetManager = dynamic(
  () => import('@/components/FleetManager'),
  { ssr: false }
);

export default function FleetManagement() {
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
              <Plane className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Manage your drone inventory, monitor real-time status, battery levels, 
            and schedule maintenance across your entire fleet.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        }>
          <FleetManager />
        </Suspense>
      </main>
    </div>
  );
}
