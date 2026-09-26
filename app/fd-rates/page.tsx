import React from 'react';
import type { Metadata } from 'next';
import { FdRatesClient } from './FdRatesClient';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Top Bank Fixed Deposit (FD) Rates India 2026 | Up to 9.50% & DICGC Guide',
  description: 'Verified interest rate tables for Indian Public Sector Banks, Private Banks, and Small Finance Banks. DICGC ₹5 Lakh deposit insurance rules and laddering strategy.',
  alternates: {
    canonical: 'https://yieldnest.online/fd-rates',
  },
  openGraph: {
    title: 'Top Bank Fixed Deposit (FD) Rates India 2026 | Up to 9.50% & DICGC Guide',
    description: 'Verified interest rate tables for Indian Public Sector Banks, Private Banks, and Small Finance Banks.',
    url: 'https://yieldnest.online/fd-rates',
    type: 'article',
  },
};

export default function FdRatesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    'about': 'Indian Bank Fixed Deposit Interest Rates 2026',
    'name': 'Top Indian Bank FD Interest Rates Matrix',
    'description': 'Comparison of interest rates for senior citizens and general public across Indian Scheduled Commercial Banks and Small Finance Banks.',
    'publisher': {
      '@type': 'Organization',
      'name': 'YIELDNEST.ONLINE',
      'url': 'https://yieldnest.online'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans w-full max-w-full overflow-x-hidden flex flex-col justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* Centered Logo Navigation */}
        <Navbar />

        {/* Dedicated Rates Directory Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bank &amp; Deposit Directory: Live Interest Rates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Filter by tenure, institution type, senior citizen rates, and search across scheduled commercial banks.
            </p>
          </div>

          <FdRatesClient />
        </main>
      </div>

      <Footer />
    </div>
  );
}
