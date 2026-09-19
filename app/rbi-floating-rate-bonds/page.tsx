import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Percent, 
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'RBI Floating Rate Savings Bonds (FRSB 2020) | 8.05% Yield & Reset Rules',
  description: 'Complete guide to RBI Floating Rate Savings Bonds (FRSB 2020). 8.05% current coupon rate, NSC spread formula, semi-annual payout, and senior citizen liquidity rules.',
  alternates: {
    canonical: 'https://bharatfixed.in/rbi-floating-rate-bonds',
  },
  openGraph: {
    title: 'RBI Floating Rate Savings Bonds (FRSB 2020) | 8.05% Yield & Reset Rules',
    description: '8.05% current coupon rate, NSC spread formula, semi-annual payout, and senior citizen liquidity rules.',
    url: 'https://bharatfixed.in/rbi-floating-rate-bonds',
    type: 'article',
  },
};

export default function RbiBondsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to BharatFixed Portal</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Sovereign Guarantee (RBI)</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <section 
          data-content-capsule="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>RBI Retail Sovereign Debt</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            RBI Floating Rate Savings Bonds (FRSB 2020): 8.05% Sovereign Yield
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            <strong>RBI Floating Rate Savings Bonds (Taxable), 2020</strong> are sovereign debt instruments issued by the Reserve Bank of India on behalf of the Government of India. They carry a <strong>coupon rate of 8.05%</strong> (reset semi-annually), payable every 6 months on 1st January and 1st July. There is <strong>no upper limit</strong> on the investment amount.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Rate</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-serif">8.05%</span>
              <span className="text-[11px] text-slate-500 block">Reset every 6 mos</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Spread Over NSC</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-serif">+35 bps</span>
              <span className="text-[11px] text-slate-500 block">Statutory formula</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Lock-In Tenure</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-serif">7 Years</span>
              <span className="text-[11px] text-slate-500 block">Seniors exit early</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Maximum Limit</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-serif">No Cap</span>
              <span className="text-[11px] text-slate-500 block">Invest any amount</span>
            </div>
          </div>
        </section>

        {/* Real Experience: Senior Citizen Premature Exit Rules */}
        <section 
          data-content-capsule="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Senior Citizen Premature Redemption Window & Penalty Rules
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            While non-senior citizens must remain locked in for the full 7-year term, the RBI Gazette Notification explicitly grants senior citizens early exit privileges based on age tiers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block text-sm">Age 60 to 70 Years</span>
              <p className="mt-1">Eligible for premature redemption after <strong>6 years</strong> from issuance date.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block text-sm">Age 70 to 80 Years</span>
              <p className="mt-1">Eligible for premature redemption after <strong>5 years</strong> from issuance date.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block text-sm">Age 80+ Years (Super Seniors)</span>
              <p className="mt-1">Eligible for premature redemption after <strong>4 years</strong> from issuance date.</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Penalty Clause:</strong> Upon premature exit, a penalty equal to 50% of the interest due and payable for the last six months of the holding period is deducted.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Government Notification No. F.No.4(10)-B(W&M)/2020.</span>
            <Link 
              href="/#planner-section"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              <span>Build a Mixed Retirement Portfolio with SCSS & RBI Bonds &rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
