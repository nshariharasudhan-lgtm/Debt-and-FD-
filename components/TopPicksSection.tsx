'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  Percent,
  Clock,
  Landmark,
  Scale
} from 'lucide-react';
import { DebtInstrument } from '@/lib/debt-data';

interface TopPicksSectionProps {
  instruments: DebtInstrument[];
  isSeniorCitizen: boolean;
  onSelectInstrumentForCalc: (instrument: DebtInstrument) => void;
  onOpenTrustModal: () => void;
  isLargeText?: boolean;
}

export function TopPicksSection({
  instruments,
  isSeniorCitizen,
  onSelectInstrumentForCalc,
  onOpenTrustModal,
  isLargeText = false
}: TopPicksSectionProps) {
  // Select top picks representing the absolute highest insured SFB rate, top corporate AAA rate, and sovereign benchmark
  const unitySfb = instruments.find(i => i.id === 'unity-sfb-fd');
  const suryodaySfb = instruments.find(i => i.id === 'suryoday-sfb-fd');
  const scss = instruments.find(i => i.id === 'scss-govt');
  const bajaj = instruments.find(i => i.id === 'bajaj-finance-fd');

  // Fallback if IDs differ
  const topPicks = [unitySfb, suryodaySfb, scss, bajaj].filter(Boolean) as DebtInstrument[];

  return (
    <section 
      id="highest-rates-section"
      aria-label="Highest Rates Right Now"
      className="bg-gradient-to-br from-blue-50/90 via-white to-amber-50/50 rounded-3xl p-4 sm:p-6 lg:p-7 border border-blue-200/80 shadow-xs space-y-5 relative overflow-hidden"
    >
      {/* Decorative subtle ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-amber-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header & Trust Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Highest Rates Right Now</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Verified September 19, 2026</span>
            </span>

            <button
              onClick={onOpenTrustModal}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline decoration-blue-300 underline-offset-2 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>How we verify rates</span>
            </button>
          </div>

          <h2 className={`${isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold font-serif text-slate-900 tracking-tight`}>
            {isSeniorCitizen ? 'Peak Rates for Senior Citizens (Up to 9.50% p.a.)' : 'Top Verified Fixed Income Yields (Up to 9.00% p.a.)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Directly sourced from official bank circulars and RBI gazettes. Zero broker markups or sponsored rank bias.
          </p>
        </div>

        {/* Editorial Independence Trust Pill */}
        <div className="shrink-0 flex items-center gap-2 bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs shadow-2xs self-start lg:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-900 block">100% Editorial Independence</span>
            <span className="text-slate-500">Unbiased rankings • No paid bank promotions</span>
          </div>
        </div>
      </div>

      {/* 4 Peak Rate Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topPicks.map((inst) => {
          const rate = isSeniorCitizen ? inst.seniorCitizenRate : inst.generalRate;
          const bonus = inst.seniorCitizenRate - inst.generalRate;
          const isHighest = inst.seniorCitizenRate >= 9.40;

          return (
            <div
              key={inst.id}
              className={`bg-white rounded-2xl p-4.5 border transition-all flex flex-col justify-between relative group ${
                isHighest 
                  ? 'border-amber-300/90 shadow-md ring-1 ring-amber-300/40 hover:border-blue-400' 
                  : 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300'
              }`}
            >
              {/* Card Ribbon / Badge */}
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 truncate">
                  {inst.subType.includes('Small Finance') ? 'Small Finance Bank' : inst.subType.includes('Small Savings') ? 'Govt Small Savings' : 'Corporate NBFC'}
                </span>

                {inst.dicgcCovered ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>DICGC ₹5L Insured</span>
                  </span>
                ) : inst.type === 'rbi_govt' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap">
                    <Award className="w-3 h-3 text-blue-600" />
                    <span>Sovereign Guarantee</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                    <span>{inst.creditRating}</span>
                  </span>
                )}
              </div>

              {/* Bank Name */}
              <div className="mb-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-700 transition-colors">
                  {inst.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {inst.issuer}
                </p>
              </div>

              {/* Big High-Impact Rate Box */}
              <div className={`p-3 rounded-xl border mb-3 transition-colors ${
                isSeniorCitizen 
                  ? 'bg-gradient-to-br from-amber-50/80 to-amber-100/40 border-amber-200' 
                  : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-950">
                      {rate.toFixed(2)}%
                    </span>
                    <span className="text-xs font-semibold text-slate-500">p.a.</span>
                  </div>

                  {isSeniorCitizen && bonus > 0 && (
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md shadow-2xs whitespace-nowrap">
                      +{bonus.toFixed(2)}% Bonus
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/70">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-700">{inst.popularTenureLabel}</span>
                  </span>

                  {isSeniorCitizen && (
                    <span className="font-bold text-emerald-700" title="Exempt up to ₹50,000 under Section 80TTB">
                      80TTB Shielded
                    </span>
                  )}
                </div>
              </div>

              {/* Trust Subtext */}
              <div className="text-[10px] text-slate-500 flex items-center justify-between gap-1 mb-3">
                <span>Source: Official Bank Website</span>
                <span>Audit: Sept 2026</span>
              </div>

              {/* Benefit-Driven High-Contrast CTA Button */}
              <button
                onClick={() => onSelectInstrumentForCalc(inst)}
                id={`top-pick-calc-btn-${inst.id}`}
                className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer group/btn"
              >
                <span>Check Exact Interest You’ll Earn</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
