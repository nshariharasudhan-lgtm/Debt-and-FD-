'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface SeniorBannerProps {
  onExploreSeniorDeals: () => void;
  onOpenCalculator: () => void;
  isSeniorCitizen?: boolean;
}

export function SeniorCitizenSpecialBanner({ 
  onExploreSeniorDeals, 
  onOpenCalculator,
  isSeniorCitizen = true
}: SeniorBannerProps) {
  return (
    <div 
      id="senior-citizen-section" 
      className="scroll-mt-24 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50/60 border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs my-4 text-slate-900"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wide">
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Senior Citizen Priority (Ages 60+)</span>
            </span>
            <span className="text-xs font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
              Special Statutory Privileges
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
            Earn up to <span className="text-amber-800 underline decoration-amber-300 font-extrabold">9.40% p.a.</span> with Full ₹50,000 Section 80TTB Tax Exemption
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Indian seniors receive <strong className="text-slate-900 font-bold">+0.50% to +0.75% extra interest</strong> across banks. Plus, the first <strong className="text-slate-900 font-bold">₹50,000 interest is 100% tax-free</strong> under Sec 80TTB, and Form 15H eliminates TDS deduction.
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1 text-xs text-slate-800">
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/60 shadow-2xs font-medium whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Sec 80TTB:</strong> ₹50k Interest Tax-Free</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/60 shadow-2xs font-medium whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Form 15H:</strong> Zero TDS Deductions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/60 shadow-2xs font-medium whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>DICGC:</strong> ₹5 Lakh Insured / Bank</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={onExploreSeniorDeals}
            id="senior-banner-explore-btn"
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
          >
            <span>View Senior Rates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCalculator}
            id="senior-banner-calculator-btn"
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
          >
            <span>Calculate 80TTB Savings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
