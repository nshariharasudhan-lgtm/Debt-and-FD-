'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { MarketTicker } from '@/components/MarketTicker';
import { Footer } from '@/components/Footer';
import { InstrumentDirectory } from '@/components/InstrumentDirectory';
import { 
  initialBenchmarks, 
  initialDebtInstruments, 
  DebtInstrument, 
  MarketBenchmark 
} from '@/lib/debt-data';

export default function HomePage() {
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark>(initialBenchmarks);
  const [instruments, setInstruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(true);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Hydrate persistent state from server API and localStorage
    async function loadLiveData() {
      try {
        const res = await fetch('/api/admin/data');
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.instruments) && data.instruments.length > 0) {
            setInstruments(data.instruments);
          }
          if (data.benchmarks) {
            setBenchmarks(data.benchmarks);
          }
        }
      } catch (e) {
        console.error('API load note:', e);
      }

      try {
        const savedInst = localStorage.getItem('bharat_debt_instruments');
        if (savedInst) {
          const parsed = JSON.parse(savedInst);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInstruments(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadLiveData();

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('bharat_debt_instruments');
        if (saved) setInstruments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSelectInstrumentForCalc = (instrument: DebtInstrument) => {
    // Navigate to dedicated calculator page with selected instrument info
    router.push(`/calculator?instrument=${encodeURIComponent(instrument.id)}`);
  };

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white ${
      isLargeText ? 'text-base' : 'text-sm'
    }`}>
      {/* Centered Logo Navigation */}
      <Navbar 
        isSeniorCitizen={isSeniorCitizen}
        onToggleSeniorCitizen={setIsSeniorCitizen}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
      />

      {/* Live Market Benchmark Ribbon (Without horizontal scrollbar) */}
      <MarketTicker benchmarks={benchmarks} />

      {/* LANDING PAGE: ONLY RATES DISPLAYED (Dedicated Rates Directory) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Clean Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Indian Fixed Income &amp; Deposit Rates Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified card rates across Scheduled Commercial Banks, Small Finance Banks, Corporate NBFCs, and Sovereign Schemes. Updated directly from official notices.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
              <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {instruments.length} Instruments Active
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Rates Directory Component */}
        <InstrumentDirectory
          instruments={instruments}
          isSeniorCitizen={isSeniorCitizen}
          onToggleSeniorCitizen={setIsSeniorCitizen}
          onSelectInstrumentForCalc={handleSelectInstrumentForCalc}
          isLargeText={isLargeText}
        />
      </main>

      <Footer />
    </div>
  );
}
