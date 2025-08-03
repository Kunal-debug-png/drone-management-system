'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Monitoring() {
  const router = useRouter();

  useEffect(() => {
    router.push('/real-time-monitoring');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
    </div>
  );
}
