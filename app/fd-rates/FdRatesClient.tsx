'use client';

import React, { useState, useEffect } from 'react';
import { InstrumentDirectory } from '@/components/InstrumentDirectory';
import { initialDebtInstruments, DebtInstrument } from '@/lib/debt-data';
import { useRouter } from 'next/navigation';

export function FdRatesClient() {
  const [instruments, setInstruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);
  const [isLargeText, setIsLargeText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load persisted rates from server API and localStorage
    async function loadData() {
      try {
        const res = await fetch('/api/admin/data?type=instruments');
        const data = await res.json();
        if (data.success && Array.isArray(data.instruments) && data.instruments.length > 0) {
          setInstruments(data.instruments);
        }
      } catch (e) {
        console.error('Fetch error:', e);
      }

      try {
        const localSaved = localStorage.getItem('bharat_debt_instruments');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInstruments(parsed);
          }
        }
      } catch (e) {
        console.error('Local parse error:', e);
      }
    }

    loadData();

    const handleStorageChange = () => {
      try {
        const localSaved = localStorage.getItem('bharat_debt_instruments');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInstruments(parsed);
          }
        }
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
    <div className="w-full">
      <InstrumentDirectory
        instruments={instruments}
        isSeniorCitizen={isSeniorCitizen}
        onToggleSeniorCitizen={setIsSeniorCitizen}
        onSelectInstrumentForCalc={handleSelectInstrumentForCalc}
        isLargeText={isLargeText}
      />
    </div>
  );
}
