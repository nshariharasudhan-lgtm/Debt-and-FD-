'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SeniorCitizenAnalytics } from '@/components/SeniorCitizenAnalytics';
import { ArrowLeft, Calculator, ShieldCheck, Award, HelpCircle } from 'lucide-react';

export function CalculatorClient() {
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);

  return (
    <div className="space-y-8">
      {/* Senior Citizen Toggle Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {isSeniorCitizen ? 'Senior Citizen Mode (Age 60+)' : 'General Public Mode (Below 60)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isSeniorCitizen 
                ? 'Applying up to +0.75% higher interest rate and ₹50,000 Sec 80TTB tax deduction'
                : 'Applying standard interest rates and Section 80TTA ₹10,000 savings account limit'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
            isSeniorCitizen
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 ring-2 ring-amber-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          {isSeniorCitizen ? 'Switch to General Citizen (<60)' : 'Switch to Senior Citizen (60+)'}
        </button>
      </div>

      {/* Main Interactive Calculation Engine */}
      <SeniorCitizenAnalytics
        selectedInstrument={null}
        isSeniorCitizen={isSeniorCitizen}
        onToggleSeniorCitizen={setIsSeniorCitizen}
      />
    </div>
  );
}
