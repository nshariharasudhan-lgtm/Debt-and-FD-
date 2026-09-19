'use client';

import React, { useState } from 'react';
import { InstrumentDirectory } from '@/components/InstrumentDirectory';
import { initialDebtInstruments, DebtInstrument } from '@/lib/debt-data';
import { useRouter } from 'next/navigation';

export function FdRatesClient() {
  const [instruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);
  const [isLargeText] = useState(false);
  const router = useRouter();

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
