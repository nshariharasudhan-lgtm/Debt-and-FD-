import React from 'react';
import type { Metadata } from 'next';
import { Award } from 'lucide-react';
import { CalculatorClient } from './CalculatorClient';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fixed Deposit (FD) ROI & Tax Calculator India | Sec 80TTB Deductions 2026',
  description: 'Free Indian Fixed Deposit (FD) ROI & Tax Calculator. Calculate quarterly compounding maturity value, TDS deductions, inflation impact, and ₹50,000 Section 80TTB tax exemptions.',
  alternates: {
    canonical: 'https://yieldnest.online/calculator',
  },
  openGraph: {
    title: 'Fixed Deposit (FD) ROI & Tax Calculator India | Sec 80TTB Deductions 2026',
    description: 'Calculate quarterly compounding maturity value, TDS deductions, inflation impact, and ₹50,000 Section 80TTB tax exemptions.',
    url: 'https://yieldnest.online/calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixed Deposit (FD) ROI & Tax Calculator India | YIELDNEST.ONLINE',
    description: 'Calculate maturity value, compounding returns, TDS deductions, and Section 80TTB tax savings for Indian Fixed Deposits.',
  }
};

export default function CalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'YIELDNEST.ONLINE FD & Section 80TTB Tax Calculator',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'All',
    'description': 'Calculate Indian Bank Fixed Deposit compounding returns, post-tax net yield, and Section 80TTB senior citizen tax deductions.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans w-full max-w-full overflow-x-hidden flex flex-col justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* Centered Logo Navigation */}
        <Navbar />

        {/* Content Container: ONLY CALCULATOR */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page Hero Title */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Section 80TTB Tax-Shield &amp; Compounding Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Bank Fixed Deposit ROI &amp; Tax Calculator
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calculate maturity corpus, net interest returns, quarterly compounding growth, and tax liability under old and new income tax regimes for Indian Banks, NBFCs, and Small Finance Banks.
              </p>
            </div>
          </div>

          {/* Dedicated Calculator Component */}
          <CalculatorClient />
        </main>
      </div>

      <Footer />
    </div>
  );
}
