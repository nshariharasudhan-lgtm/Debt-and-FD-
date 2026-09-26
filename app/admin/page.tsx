'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/master-dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 font-mono">Securing internal admin console...</p>
      </div>
    </div>
  );
}
