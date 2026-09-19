'use client';

import React, { useState } from 'react';
import { DebtInstrument } from '@/lib/debt-data';
import { calculateDebtReturns, formatINR } from '@/lib/debt-calculations';
import { ShieldCheck, ArrowRight, Award, Check, X, Scale } from 'lucide-react';

interface YieldComparatorProps {
  instruments: DebtInstrument[];
  isSeniorCitizen: boolean;
}

export function YieldComparator({ instruments, isSeniorCitizen }: YieldComparatorProps) {
  // Default selections: SCSS, SBI Bank FD, Bajaj Finance Corporate FD
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'scss-govt',
    'sbi-amrit-vrishti',
    'bajaj-finance-fd'
  ]);

  const [compareAmount, setCompareAmount] = useState<number>(1000000); // 10 Lakhs
  const [compareTenure, setCompareTenure] = useState<number>(5); // 5 Years
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number>(0);
  const [mobileDisplayMode, setMobileDisplayMode] = useState<'cards' | 'table'>('cards');

  const selectedInstruments = selectedIds
    .map(id => instruments.find(inst => inst.id === id))
    .filter(Boolean) as DebtInstrument[];

  const handleSelectInstrument = (index: number, newId: string) => {
    setSelectedIds(prev => {
      const next = [...prev];
      next[index] = newId;
      return next;
    });
  };

  return (
    <section id="comparison-section" className="scroll-mt-20 py-8 w-full max-w-full overflow-hidden">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-8 shadow-xs w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Instrument Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
              Fixed Income & Bond Comparator
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              Compare Bank FDs, Corporate Deposits, and Sovereign Bonds across risk ratings, Section 80TTB eligibility, and 5-year post-tax yields.
            </p>
          </div>

          {/* Amount & Tenure Inputs */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="w-full sm:w-auto">
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Benchmark Amount</label>
              <select
                value={compareAmount}
                onChange={(e) => setCompareAmount(Number(e.target.value))}
                className="w-full sm:w-auto py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value={500000}>₹5,00,000 (5 Lakhs)</option>
                <option value={1000000}>₹10,00,000 (10 Lakhs)</option>
                <option value={1500000}>₹15,00,000 (15 Lakhs)</option>
                <option value={3000000}>₹30,00,000 (30 Lakhs)</option>
              </select>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMobileDisplayMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mobileDisplayMode === 'cards'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setMobileDisplayMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mobileDisplayMode === 'table'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE CARDS VIEW (Clean responsive stacked/tabbed comparison without side-scroll) */}
        <div className={`md:hidden ${mobileDisplayMode === 'cards' ? 'block' : 'hidden'}`}>
          {/* Instrument Selector Tabs for Mobile */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 overflow-x-auto">
            {[0, 1, 2].map((idx) => {
              const inst = selectedInstruments[idx];
              const isSelected = mobileActiveIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setMobileActiveIndex(idx)}
                  className={`flex-1 py-2 px-2 text-center rounded-lg text-xs transition-all font-semibold truncate ${
                    isSelected
                      ? 'bg-white text-blue-900 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Slot {idx + 1}: {inst ? inst.name.split(' ')[0] : `Product ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Active Card on Mobile */}
          {selectedInstruments[mobileActiveIndex] && (() => {
            const inst = selectedInstruments[mobileActiveIndex];
            const rate = isSeniorCitizen ? inst.seniorCitizenRate : inst.generalRate;
            const eligible80ttb = inst.type === 'bank_fd' || inst.id === 'scss-govt' || inst.id === 'pomis-postoffice';
            const simResult = calculateDebtReturns({
              principal: compareAmount,
              tenureYears: compareTenure,
              interestRate: isSeniorCitizen ? inst.seniorCitizenRate : inst.generalRate,
              isSeniorCitizen,
              payoutMode: inst.payoutFrequency.includes('cumulative') ? 'cumulative' : 'quarterly',
              taxBracket: 0.10,
              inflationRate: 5.10,
              instrumentType: inst.type,
              hasSubmitted15H: true
            });

            return (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                {/* Selector Dropdown */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Change Instrument {mobileActiveIndex + 1}:
                  </label>
                  <select
                    value={selectedIds[mobileActiveIndex] || ''}
                    onChange={(e) => handleSelectInstrument(mobileActiveIndex, e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    {instruments.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.issuer})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Key Metric Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Interest Rate</span>
                    <span className="text-xl font-mono font-extrabold text-blue-900">{rate.toFixed(2)}%</span>
                    <span className="text-[10px] text-slate-500 block">General: {inst.generalRate.toFixed(2)}%</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Rating & Safety</span>
                    <span className="font-bold text-slate-900 block text-xs truncate mt-0.5">{inst.creditRating}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{inst.safetyLevel}</span>
                  </div>
                </div>

                {/* Statutory & Tax Metrics List */}
                <div className="space-y-2.5 text-xs bg-white p-3.5 rounded-lg border border-slate-200 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-1 first:pt-0">
                    <span className="text-slate-500">Issuer Type</span>
                    <span className="font-semibold text-slate-800 text-right">{inst.issuer} ({inst.subType})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">DICGC Insurance</span>
                    {inst.dicgcCovered ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> ₹5L Insured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-medium text-[11px]">
                        <X className="w-3.5 h-3.5 text-rose-500" /> Corporate Risk
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">Sec 80TTB Tax Relief</span>
                    {eligible80ttb ? (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Eligible (₹50k Free)
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px] flex items-center gap-1">
                        <X className="w-3.5 h-3.5 text-amber-600" /> Slab Rate
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">TDS Threshold</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {inst.tdsThreshold > 1000000 ? 'Zero TDS' : `${formatINR(inst.tdsThreshold)}/yr`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">Payout Options</span>
                    <span className="capitalize text-slate-800 font-medium">{inst.payoutFrequency.join(', ')}</span>
                  </div>
                </div>

                {/* 5-Yr Earnings Card */}
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-xs">
                  <span className="text-blue-900 font-bold block mb-1">
                    5-Year Simulation on {formatINR(compareAmount)}:
                  </span>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-slate-600">Total Interest:</span>
                    <span className="font-extrabold text-blue-950 text-sm">{formatINR(simResult.totalGrossInterest)}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-mono mt-1">
                    <span className="text-emerald-800 font-bold">Maturity Corpus:</span>
                    <span className="font-extrabold text-emerald-900 text-sm">{formatINR(simResult.netMaturityAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Comparison Table Grid (Desktop or Mobile Table Mode) */}
        <div className={`${mobileDisplayMode === 'table' ? 'block' : 'hidden md:block'} w-full max-w-full overflow-hidden`}>
          <div className="md:hidden flex items-center justify-between text-[11px] text-slate-500 pb-2 px-1">
            <span>Scroll horizontally to view all instruments</span>
            <span>&rarr;</span>
          </div>
          <div className="overflow-x-auto w-full max-w-full border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse min-w-[560px] md:min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-3 px-3 text-slate-500 font-bold uppercase w-1/4">Feature / Metric</th>
                  {[0, 1, 2].map(idx => (
                    <th key={idx} className="py-3 px-3 w-1/4">
                      <select
                        value={selectedIds[idx] || ''}
                        onChange={(e) => handleSelectInstrument(idx, e.target.value)}
                        className="w-full py-2 px-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        {instruments.map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Product Type & Issuer */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Issuer / Category</td>
                  {selectedInstruments.map(inst => (
                    <td key={inst.id} className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{inst.issuer}</span>
                      <span className="text-[11px] text-blue-700 font-semibold">{inst.subType}</span>
                    </td>
                  ))}
                </tr>

                {/* Interest Rate */}
                <tr className="bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-500">Interest Rate (p.a.)</td>
                  {selectedInstruments.map(inst => {
                    const rate = isSeniorCitizen ? inst.seniorCitizenRate : inst.generalRate;
                    return (
                      <td key={inst.id} className="py-3 px-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold font-mono text-blue-900">
                            {rate.toFixed(2)}%
                          </span>
                          {isSeniorCitizen && (
                            <span className="text-[10px] text-blue-700 font-bold">
                              (Senior Rate)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">General: {inst.generalRate.toFixed(2)}%</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Safety Rating & Agency */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Credit Rating & Safety</td>
                  {selectedInstruments.map(inst => (
                    <td key={inst.id} className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{inst.creditRating}</span>
                      <span className="text-[10px] text-slate-500">{inst.safetyLevel}</span>
                    </td>
                  ))}
                </tr>

                {/* DICGC Insurance Cover */}
                <tr className="bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-500">DICGC Insurance Cover</td>
                  {selectedInstruments.map(inst => (
                    <td key={inst.id} className="py-3 px-4">
                      {inst.dicgcCovered ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Insured up to ₹5 Lakhs
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                          <X className="w-3.5 h-3.5 text-rose-500" /> Not DICGC covered (Corporate Risk)
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Section 80TTB Tax Exemption */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Section 80TTB (₹50k Relief)</td>
                  {selectedInstruments.map(inst => {
                    const eligible = inst.type === 'bank_fd' || inst.id === 'scss-govt' || inst.id === 'pomis-postoffice';
                    return (
                      <td key={inst.id} className="py-3 px-4">
                        {eligible ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Eligible (First ₹50,000 tax-free)
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1">
                            <X className="w-3.5 h-3.5 text-amber-600" /> Fully Taxable at Slab Rate
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* TDS Threshold */}
                <tr className="bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-500">TDS Deduction Threshold</td>
                  {selectedInstruments.map(inst => (
                    <td key={inst.id} className="py-3 px-4 font-mono font-medium text-slate-700">
                      {inst.tdsThreshold > 1000000 ? 'Zero TDS (100% Tax-Free)' : `${formatINR(inst.tdsThreshold)} / year`}
                    </td>
                  ))}
                </tr>

                {/* Payout Frequency Options */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Interest Payout Frequencies</td>
                  {selectedInstruments.map(inst => (
                    <td key={inst.id} className="py-3 px-4 capitalize text-slate-700">
                      {inst.payoutFrequency.join(', ')}
                    </td>
                  ))}
                </tr>

                {/* 5-Year Estimated Earnings Simulation */}
                <tr className="bg-blue-50/70 border-t-2 border-blue-200">
                  <td className="py-3 px-4 font-bold text-blue-900">
                    Est. 5-Yr Earnings on {formatINR(compareAmount)}
                  </td>
                  {selectedInstruments.map(inst => {
                    const result = calculateDebtReturns({
                      principal: compareAmount,
                      tenureYears: compareTenure,
                      interestRate: isSeniorCitizen ? inst.seniorCitizenRate : inst.generalRate,
                      isSeniorCitizen,
                      payoutMode: inst.payoutFrequency.includes('cumulative') ? 'cumulative' : 'quarterly',
                      taxBracket: 0.10,
                      inflationRate: 5.10,
                      instrumentType: inst.type,
                      hasSubmitted15H: true
                    });

                    return (
                      <td key={inst.id} className="py-3 px-4">
                        <div className="font-mono font-extrabold text-blue-950 text-sm">
                          Interest: {formatINR(result.totalGrossInterest)}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          Maturity: {formatINR(result.netMaturityAmount)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
