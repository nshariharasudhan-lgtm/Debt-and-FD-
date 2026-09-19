import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ShieldCheck, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { RetirementCashflowPlanner } from '@/components/RetirementCashflowPlanner';

export const metadata: Metadata = {
  title: 'Senior Citizen Retirement Cashflow & Monthly Pension Planner India 2026',
  description: 'Plan steady monthly retirement cashflow across 8.20% Govt SCSS, 8.05% RBI Floating Rate Bonds, and high-yield DICGC insured bank fixed deposits.',
  alternates: {
    canonical: 'https://yieldnest.online/pension-planner',
  },
  openGraph: {
    title: 'Senior Citizen Retirement Cashflow & Monthly Pension Planner India 2026',
    description: 'Plan steady monthly retirement cashflow across 8.20% Govt SCSS, 8.05% RBI Floating Rate Bonds, and high-yield DICGC insured bank fixed deposits.',
    url: 'https://yieldnest.online/pension-planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senior Citizen Retirement Cashflow & Monthly Pension Planner | YIELDNEST.ONLINE',
    description: 'Plan steady monthly income from SCSS, RBI Bonds, and bank fixed deposits.',
  }
};

export default function PensionPlannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'YIELDNEST.ONLINE Retirement Cashflow & Monthly Pension Planner',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'All',
    'description': 'Simulate monthly retirement income from sovereign guaranteed debt instruments and insured bank deposits in India.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How to generate monthly income from SCSS and RBI Bonds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'SCSS pays interest quarterly on the first working day of April, July, October, and January. RBI Floating Rate Savings Bonds pay interest half-yearly on January 1 and July 1. By combining SCSS, RBI Bonds, and monthly-payout bank fixed deposits, retirees can ensure predictable, month-by-month cashflow into their bank accounts.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the maximum investment limit in Senior Citizen Savings Scheme (SCSS)?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The maximum deposit limit in SCSS is ₹30 Lakhs per individual. A senior citizen couple can invest up to ₹60 Lakhs in total by maintaining individual accounts.'
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50/60 text-slate-900 pb-16 font-sans w-full max-w-full overflow-x-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to YIELDNEST.ONLINE Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Retirement Cashflow Planner</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-8 w-full max-w-full overflow-hidden">
        {/* Page Hero Title */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sovereign &amp; Insured Monthly Income Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
              Retirement Cashflow &amp; Monthly Pension Planner
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Design a reliable monthly pension stream from your retirement corpus. Balance high-yield 8.20% Govt SCSS, 8.05% RBI Floating Rate Bonds, and DICGC ₹5 Lakh insured bank deposits.
            </p>
          </div>
        </section>

        {/* Interactive Pension Planner Engine */}
        <RetirementCashflowPlanner />

        {/* Knowledge & Asset Allocation Guide */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Strategic Fixed Income Allocation for Indian Retirees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Tier 1: Sovereign Core (SCSS)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Senior Citizen Savings Scheme (SCSS) offers an 8.20% sovereign-guaranteed quarterly payout backed by the Government of India. Maximum individual limit is ₹30 Lakhs.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Tier 2: RBI Floating Rate Bonds</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                RBI FRSB 2020 bonds offer an inflation hedge pegged at NSC + 0.35% (currently 8.05%). There is no upper investment cap, and interest is paid semi-annually.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Tier 3: Monthly Bank FDs</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled commercial and small finance banks offer monthly non-cumulative interest payouts up to 8.50% - 9.15%, protected under statutory DICGC ₹5 Lakh deposit insurance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
