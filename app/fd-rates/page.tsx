import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Bank Fixed Deposit (FD) Rates India 2026 | Up to 9.50% & DICGC Guide',
  description: 'Verified interest rate tables for Indian Public Sector Banks, Private Banks, and Small Finance Banks. DICGC ₹5 Lakh deposit insurance rules and laddering strategy.',
  alternates: {
    canonical: 'https://bharatfixed.in/fd-rates',
  },
  openGraph: {
    title: 'Top Bank Fixed Deposit (FD) Rates India 2026 | Up to 9.50% & DICGC Guide',
    description: 'Verified interest rate tables for Indian Public Sector Banks, Private Banks, and Small Finance Banks.',
    url: 'https://bharatfixed.in/fd-rates',
    type: 'article',
  },
};

export default function FdRatesPage() {
  const topBanks = [
    { name: 'Unity Small Finance Bank', category: 'Small Finance Bank (RBI Scheduled)', general: '9.00%', senior: '9.50%', tenure: '1001 Days', dicgc: true },
    { name: 'Suryoday Small Finance Bank', category: 'Small Finance Bank (RBI Scheduled)', general: '8.65%', senior: '9.15%', tenure: '2 Yrs 1 Day', dicgc: true },
    { name: 'AU Small Finance Bank', category: 'Small Finance Bank (RBI Scheduled)', general: '8.00%', senior: '8.50%', tenure: '18 Months', dicgc: true },
    { name: 'State Bank of India (Amrit Kalash)', category: 'Public Sector Bank (D-SIB)', general: '7.10%', senior: '7.60%', tenure: '400 Days', dicgc: true },
    { name: 'Bank of Baroda', category: 'Public Sector Bank', general: '7.15%', senior: '7.65%', tenure: '399 Days', dicgc: true },
    { name: 'HDFC Bank', category: 'Private Sector Bank (D-SIB)', general: '7.25%', senior: '7.75%', tenure: '55 Months', dicgc: true },
    { name: 'ICICI Bank', category: 'Private Sector Bank (D-SIB)', general: '7.20%', senior: '7.75%', tenure: '15 to 18 Mos', dicgc: true },
    { name: 'Bajaj Finance (Corporate FD)', category: 'NBFC (CRISIL AAA)', general: '8.35%', senior: '8.60%', tenure: '44 Months', dicgc: false }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans w-full max-w-full overflow-x-hidden">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BharatFixed Portal</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">DICGC Insured ₹5L</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8 w-full max-w-full overflow-hidden">
        {/* Front-loaded answer capsule */}
        <section 
          data-content-capsule="true"
          className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 w-full max-w-full overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-600" />
            <span>September 2026 Bank FD Rate Matrix</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Top Indian Bank Fixed Deposit Rates: Up to 9.50% with DICGC Insurance
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            Indian Scheduled Commercial Banks are currently offering between <strong>7.10% and 9.00%</strong> for general depositors and up to <strong>9.50%</strong> for senior citizens (aged 60+). All deposits in RBI Scheduled Banks—including Public Sector, Private, and Small Finance Banks—are protected up to <strong>₹5,00,000 per depositor</strong> under the Deposit Insurance and Credit Guarantee Corporation (DICGC) Act.
          </p>

          <div className="sm:hidden px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-center justify-between">
            <span>Swipe table horizontally to see all bank rates</span>
            <span>&rarr;</span>
          </div>

          <div className="overflow-x-auto touch-pan-x overscroll-x-contain w-full max-w-full pt-1">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[540px]">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Bank / Institution</th>
                  <th className="py-2.5 px-3">General (&lt;60)</th>
                  <th className="py-2.5 px-3 text-amber-950 font-extrabold bg-amber-50">Senior (60+)</th>
                  <th className="py-2.5 px-3">Tenure</th>
                  <th className="py-2.5 px-3">DICGC Cover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {topBanks.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{b.name}</span>
                      <span className="text-[11px] text-slate-500">{b.category}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{b.general}</td>
                    <td className="py-2.5 px-3 font-extrabold text-blue-700 bg-amber-50/40">{b.senior}</td>
                    <td className="py-2.5 px-3 text-slate-600">{b.tenure}</td>
                    <td className="py-2.5 px-3">
                      {b.dicgc ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Insured ₹5L</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Corporate / No DICGC</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real Experience: The Laddering Strategy */}
        <section 
          data-content-capsule="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Field Strategy: Risk-Free Laddering Across Small Finance Banks</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            How to Safely Earn 9.15% - 9.50% with Zero Default Risk
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Conservative investors often worry about Small Finance Banks. However, under Section 16(1) of the DICGC Act 1961, SFBs have the exact same legal insurance status as the State Bank of India. The proven strategy is <strong>Tranche Laddering</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Step 1: Cap at ₹4.3 Lakhs</span>
              <p>Deposit max ₹4,20,000 to ₹4,30,000 principal per bank so that quarterly compounding interest never pushes your total balance over ₹5,00,000.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Step 2: Stagger Across 3 SFBs</span>
              <p>Allocate across Unity SFB (9.50%), Suryoday SFB (9.15%), and AU SFB (8.50%) to gain distinct insurance limits in separate legal entities.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Step 3: Submit Form 15H</span>
              <p>Submit Form 15H at each bank online in April so no 10% TDS is deducted, keeping your cashflow uninterrupted.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Legal reference: DICGC Circular Ref. No. DICGC/DO/01/2020.</span>
            <Link 
              href="/#comparator-section"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              <span>Calculate Post-Tax Net Yield on Interactive Comparator &rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
