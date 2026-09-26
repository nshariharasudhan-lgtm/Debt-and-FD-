'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuideRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/resources');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Navigating to Resources Hub...</p>
      </div>
    </div>
  );
}
