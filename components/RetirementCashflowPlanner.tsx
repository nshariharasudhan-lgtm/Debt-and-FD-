'use client';

import React, { useState } from 'react';
import { formatINR, formatCompactINR } from '@/lib/debt-calculations';
import { Landmark, ShieldCheck, Award, Calendar, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

export function RetirementCashflowPlanner() {
  const [corpus, setCorpus] = useState<number>(3000000); // ₹30 Lakhs default
  const [scssAllocation, setScssAllocation] = useState<number>(1500000); // 15L
  const [rbiBondAllocation, setRbiBondAllocation] = useState<number>(500000); // 5L
  const [psuFdAllocation, setPsuFdAllocation] = useState<number>(500000); // 5L
  const [sfbFdAllocation, setSfbFdAllocation] = useState<number>(500000); // 5L

  // Standard Senior Citizen Rates
  const scssRate = 0.0820; // 8.20% (Quarterly: Jan, Apr, Jul, Oct)
  const rbiRate = 0.0805; // 8.05% (Half-yearly: Jan, Jul)
  const psuRate = 0.0775; // 7.75% (Monthly payout)
  const sfbRate = 0.0850; // 8.50% (Monthly payout)

  // Annual earnings
  const scssAnnual = scssAllocation * scssRate;
  const rbiAnnual = rbiBondAllocation * rbiRate;
  const psuAnnual = psuFdAllocation * psuRate;
  const sfbAnnual = sfbFdAllocation * sfbRate;

  const totalAnnualCashflow = scssAnnual + rbiAnnual + psuAnnual + sfbAnnual;
  const averageMonthlyCashflow = totalAnnualCashflow / 12;
  const blendedWeightedYield = (totalAnnualCashflow / corpus) * 100;

  // Monthly breakdown array for calendar visualization
  const monthlyInflows = [
    { month: 'Jan', amount: (psuAnnual / 12) + (sfbAnnual / 12) + (scssAnnual / 4) + (rbiAnnual / 2), events: ['SCSS Q4', 'RBI Semi-Annual', 'Monthly FDs'] },
    { month: 'Feb', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Mar', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Apr', amount: (psuAnnual / 12) + (sfbAnnual / 12) + (scssAnnual / 4), events: ['SCSS Q1 Payout', 'Monthly FDs'] },
    { month: 'May', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Jun', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Jul', amount: (psuAnnual / 12) + (sfbAnnual / 12) + (scssAnnual / 4) + (rbiAnnual / 2), events: ['SCSS Q2', 'RBI Semi-Annual', 'Monthly FDs'] },
    { month: 'Aug', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Sep', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Oct', amount: (psuAnnual / 12) + (sfbAnnual / 12) + (scssAnnual / 4), events: ['SCSS Q3 Payout', 'Monthly FDs'] },
    { month: 'Nov', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] },
    { month: 'Dec', amount: (psuAnnual / 12) + (sfbAnnual / 12), events: ['Monthly Bank FDs'] }
  ];

  // Quick preset allocations
  const applyPresetCorpus = (amount: number) => {
    setCorpus(amount);
    if (amount <= 3000000) {
      setScssAllocation(amount * 0.5);
      setRbiBondAllocation(amount * 0.2);
      setPsuFdAllocation(amount * 0.15);
      setSfbFdAllocation(amount * 0.15);
    } else {
      setScssAllocation(3000000); // SCSS max cap is 30L
      const remaining = amount - 3000000;
      setRbiBondAllocation(remaining * 0.4);
      setPsuFdAllocation(remaining * 0.3);
      setSfbFdAllocation(remaining * 0.3);
    }
  };

  return (
    <section id="pension-planner-section" className="scroll-mt-20 py-8 w-full max-w-full overflow-hidden">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-8 shadow-xs w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Retirement Income Architect</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
              Senior Citizen Monthly Cashflow & Pension Planner
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              Distribute your retirement corpus across sovereign debt, RBI bonds, and scheduled banks to generate a predictable monthly income without equity market volatility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[1500000, 3000000, 5000000, 10000000].map(val => (
              <button
                key={val}
                onClick={() => applyPresetCorpus(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  corpus === val
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {formatCompactINR(val)}
              </button>
            ))}
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs font-bold uppercase block">Average Monthly Pension Income</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-900 mt-1">
              {formatINR(averageMonthlyCashflow)} <span className="text-xs text-slate-500 font-normal">/ mo</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Reliable, regular retirement cash flow</span>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs font-bold uppercase block">Total Annual Debt Returns</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">
              {formatINR(totalAnnualCashflow)}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              Effective Portfolio Yield: {blendedWeightedYield.toFixed(2)}% p.a.
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-xs font-bold uppercase block">Sovereign & DICGC Safety Shield</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 mt-1">
              100% Insured
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Govt Sovereign Backing + ₹5L Bank Cover</span>
          </div>
        </div>

        {/* Allocation Sliders & Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-slate-200 w-full max-w-full overflow-hidden">
          <div className="space-y-5 min-w-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Corpus Allocation Strategy
            </h3>

            {/* 1. SCSS */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-1.5 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Senior Citizen Savings Scheme (SCSS)</span>
                  <span className="text-slate-500 text-[10px]">8.20% Sovereign &bull; Quarterly Payout &bull; Max ₹30L</span>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-sm">{formatINR(scssAllocation)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(3000000, corpus)}
                step={50000}
                value={scssAllocation}
                onChange={(e) => setScssAllocation(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Annual Payout: <strong className="text-slate-800">{formatINR(scssAnnual)}</strong></span>
                <span>Quarterly: <strong className="text-blue-800">{formatINR(scssAnnual / 4)}</strong></span>
              </div>
            </div>

            {/* 2. RBI Floating Rate Savings Bonds */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">RBI Floating Rate Savings Bonds (FRSB)</span>
                  <span className="text-slate-500 text-[10px]">8.05% Sovereign &bull; Half-yearly Payout &bull; No Ceiling</span>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-sm">{formatINR(rbiBondAllocation)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={corpus}
                step={50000}
                value={rbiBondAllocation}
                onChange={(e) => setRbiBondAllocation(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Annual Payout: <strong className="text-slate-800">{formatINR(rbiAnnual)}</strong></span>
                <span>Semi-Annual: <strong className="text-blue-800">{formatINR(rbiAnnual / 2)}</strong></span>
              </div>
            </div>

            {/* 3. PSU / D-SIB Bank FD (SBI / HDFC) */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Top PSU Bank FD (SBI / HDFC Bank)</span>
                  <span className="text-slate-500 text-[10px]">7.75% Senior &bull; Monthly Payout &bull; DICGC Insured</span>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-sm">{formatINR(psuFdAllocation)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={corpus}
                step={50000}
                value={psuFdAllocation}
                onChange={(e) => setPsuFdAllocation(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Annual: <strong className="text-slate-800">{formatINR(psuAnnual)}</strong></span>
                <span>Monthly: <strong className="text-emerald-700">{formatINR(psuAnnual / 12)}</strong></span>
              </div>
            </div>

            {/* 4. High-Yield Scheduled SFB (AU SFB / Unity) */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Small Finance Bank Senior FD (AU / Unity)</span>
                  <span className="text-slate-500 text-[10px]">8.50% Senior &bull; Monthly Payout &bull; DICGC Insured up to ₹5L</span>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-sm">{formatINR(sfbFdAllocation)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={corpus}
                step={50000}
                value={sfbFdAllocation}
                onChange={(e) => setSfbFdAllocation(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Annual: <strong className="text-slate-800">{formatINR(sfbAnnual)}</strong></span>
                <span>Monthly: <strong className="text-emerald-700">{formatINR(sfbAnnual / 12)}</strong></span>
              </div>
            </div>
          </div>

          {/* 12-Month Calendar Visualizer */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              12-Month Projected Cashflow Calendar
            </h3>
            <p className="text-xs text-slate-600">
              Because SCSS pays quarterly (Jan, Apr, Jul, Oct) and RBI Bonds pay semi-annually (Jan, Jul), your cash flows peak during reset months while bank FDs provide continuous base sustenance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {monthlyInflows.map((m) => (
                <div
                  key={m.month}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                    m.events.length > 1 
                      ? 'bg-blue-50/80 border-blue-200 text-blue-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-slate-900 font-mono">{m.month}</span>
                    {m.events.length > 1 && (
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold uppercase">
                        Bumper
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-base text-slate-900 font-mono my-1">
                    {formatINR(m.amount)}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {m.events.join(' + ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5 mt-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Default Sovereign Architecture</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                By maintaining Small Finance Bank deposits under ₹5,00,000, 100% of your capital is statutory backed either by the Government of India or the RBI DICGC Deposit Insurance Scheme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
