import React from 'react';
import type { Metadata } from 'next';
import { Scale } from 'lucide-react';
import { CompareRatesClient } from './CompareRatesClient';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Compare Bank FDs, Corporate FDs, SCSS & RBI Bonds | Yield & Safety Matrix 2026',
  description: 'Compare certified interest rates, credit ratings, DICGC ₹5 Lakh insurance, and liquidity across Public Sector Banks, Private Banks, Small Finance Banks, and Corporate FDs.',
  alternates: {
    canonical: 'https://yieldnest.online/compare-rates',
  },
  openGraph: {
    title: 'Compare Bank FDs, Corporate FDs, SCSS & RBI Bonds | Yield & Safety Matrix 2026',
    description: 'Compare certified interest rates, credit ratings, DICGC ₹5 Lakh insurance, and liquidity across Indian fixed income instruments.',
    url: 'https://yieldnest.online/compare-rates',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Bank FDs, Corporate FDs, SCSS & RBI Bonds | YIELDNEST.ONLINE',
    description: 'Compare yields, credit safety, DICGC insurance, and tax efficiency across Indian debt instruments.',
  }
};

export default function CompareRatesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'YIELDNEST.ONLINE Multi-Instrument Yield & Risk Comparator',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'All',
    'description': 'Side-by-side comparison of Indian Fixed Deposits, Small Savings Schemes, and RBI Sovereign Bonds.',
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

        {/* Content Container: ONLY COMPARE TOOL */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page Hero Title */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-purple-700" />
                <span>Side-by-Side Yield &amp; Risk Matrix</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Compare Bank FDs, Corporate FDs, SCSS &amp; Sovereign Bonds
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Analyze interest yields, statutory insurance coverage, credit safety ratings (AAA vs DICGC), liquidity terms, and tax implications side-by-side.
              </p>
            </div>
          </div>

          {/* Interactive Comparator Component */}
          <CompareRatesClient />
        </main>
      </div>

      <Footer />
    </div>
  );
}
