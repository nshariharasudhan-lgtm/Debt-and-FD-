import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ExternalLink,
  Calendar,
  IndianRupee,
  FileCheck2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Senior Citizen Savings Scheme (SCSS 2026) | 8.20% Interest Rate & Tax Guide',
  description: 'Complete guide to the Senior Citizen Savings Scheme (SCSS) in India. Current 8.20% quarterly interest rate, ₹30 Lakh maximum limit, Section 80C & Section 80TTB tax benefits.',
  alternates: {
    canonical: 'https://bharatfixed.in/senior-citizen-savings-scheme',
  },
  openGraph: {
    title: 'Senior Citizen Savings Scheme (SCSS 2026) | 8.20% Interest Rate & Tax Guide',
    description: 'Current 8.20% quarterly interest rate, ₹30 Lakh maximum limit, Section 80C & Section 80TTB tax benefits.',
    url: 'https://bharatfixed.in/senior-citizen-savings-scheme',
    type: 'article',
  },
};

export default function ScssPage() {
  const maxInvestment = 3000000; // 30 Lakhs
  const annualInterest = maxInvestment * 0.082; // ₹2,46,000
  const quarterlyInterest = annualInterest / 4; // ₹61,500

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Top Breadcrumb Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BharatFixed Portal</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Current Q2 Rate: 8.20% p.a.</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Content Capsule: Front-loaded answer */}
        <section 
          data-content-capsule="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Sovereign Small Savings Scheme · Ministry of Finance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
            Senior Citizen Savings Scheme (SCSS): 8.20% Government Guaranteed Fixed Income
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            The <strong>Senior Citizen Savings Scheme (SCSS)</strong> is a statutory central government scheme offering an <strong>8.20% annual interest rate</strong> with quarterly compounding and mandatory quarterly interest payouts directly credited to the depositor&apos;s bank savings account. It carries an unconditional sovereign guarantee, meaning there is zero capital or credit risk.
          </p>

          {/* Key Facts Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Interest Rate</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-serif">8.20%</span>
              <span className="text-[11px] text-slate-500 block">Quarterly payout</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Max Deposit</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-serif">₹30 Lakh</span>
              <span className="text-[11px] text-slate-500 block">Per senior individual</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tenure</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-serif">5 Years</span>
              <span className="text-[11px] text-slate-500 block">+3 yrs extension</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Safety Tier</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-serif">Sovereign</span>
              <span className="text-[11px] text-slate-500 block">100% GoI Backed</span>
            </div>
          </div>
        </section>

        {/* Real Experience & Calculation Walkthrough */}
        <section 
          data-content-capsule="true"
          className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-2xs space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
            <FileCheck2 className="w-4 h-4 text-amber-800" />
            <span>Practitioner Field Notes: How SCSS Cashflow Works in Practice</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Real Cashflow at Maximum ₹30 Lakh Deposit
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            When a retiree deposits the full ₹30,00,000 threshold in SCSS, the government pays out exactly <strong>₹61,500 every single quarter</strong> (on the first working day of April, July, October, and January). Over the 5-year tenure, the investor earns a guaranteed <strong>₹12,30,000 in interest</strong> while the entire ₹30,00,000 principal remains intact.
          </p>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-xs text-slate-500 block">Quarterly Payout</span>
              <span className="text-lg sm:text-xl font-bold text-slate-900">₹61,500</span>
              <span className="text-[11px] text-emerald-700 block">Direct bank credit</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Annual Payout</span>
              <span className="text-lg sm:text-xl font-bold text-slate-900">₹2,46,000</span>
              <span className="text-[11px] text-slate-500 block">₹20,500 / month equiv.</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Sec 80TTB Tax-Free Portion</span>
              <span className="text-lg sm:text-xl font-bold text-blue-700">₹50,000 / year</span>
              <span className="text-[11px] text-slate-500 block">Saves up to ₹15,600 tax</span>
            </div>
          </div>
        </section>

        {/* Detailed Statutory Guidelines & Tax Interaction */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Taxation & Section 80TTB Interplay
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong>Section 80C Deduction at Entry:</strong> The initial investment in SCSS qualifies for a tax deduction of up to ₹1.5 Lakh under Section 80C in the financial year of deposit (under the Old Tax Regime).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong>Section 80TTB Deduction on Interest:</strong> Senior citizens can deduct up to ₹50,000 of interest earned across SCSS, Bank FDs, and Post Office deposits under Section 80TTB.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong>TDS and Form 15H:</strong> TDS of 10% under Section 194A is deducted if interest exceeds ₹50,000 annually. Submitting Form 15H at your bank or post office prevents TDS if your estimated net income is below the taxable threshold.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Statutory source: Ministry of Finance Notification G.S.R. 841(E) & CBDT guidelines.
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
            >
              <span>Compare SCSS vs Top Bank FDs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
