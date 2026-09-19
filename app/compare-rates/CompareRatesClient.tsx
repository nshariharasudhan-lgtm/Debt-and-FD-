'use client';

import React, { useState } from 'react';
import { YieldComparator } from '@/components/YieldComparator';
import { initialDebtInstruments } from '@/lib/debt-data';
import { Award } from 'lucide-react';

export function CompareRatesClient() {
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);

  return (
    <div className="space-y-6">
      {/* Senior Citizen Toggle Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {isSeniorCitizen ? 'Comparing Senior Citizen Yields (Age 60+)' : 'Comparing General Public Yields (Below 60)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isSeniorCitizen 
                ? 'Rates include senior citizen premium (+0.25% to +0.75%) across all institutions'
                : 'Rates reflect standard base yield across all bank and corporate tenures'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
            isSeniorCitizen
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          {isSeniorCitizen ? 'Switch to General Citizen (<60)' : 'Switch to Senior Citizen (60+)'}
        </button>
      </div>

      <YieldComparator 
        instruments={initialDebtInstruments}
        isSeniorCitizen={isSeniorCitizen}
      />
    </div>
  );
}
