import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Scale, ShieldCheck, Award, Building2, CheckCircle2 } from 'lucide-react';
import { CompareRatesClient } from './CompareRatesClient';

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do Bank FDs compare against Corporate FDs in safety?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Scheduled commercial and small finance bank fixed deposits are backed by statutory DICGC deposit insurance up to ₹5 Lakh per depositor per bank. Corporate FDs are uncollateralized unsecured deposits rated by agencies like CRISIL/ICRA (e.g. AAA or AA+); they offer higher yield (up to 8.85%) but do not carry DICGC insurance.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is SCSS or Bank FD better for senior citizens?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'SCSS currently offers 8.20% p.a. guaranteed sovereign interest with Section 80C tax deduction benefits on investment up to ₹1.5 Lakh and ₹30 Lakh cap. Bank FDs offer higher liquidity, loan facilities against deposit, and tenure flexibility ranging from 7 days to 10 years.'
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold">
              <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
              <span>Multi-Asset Comparator</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-8 w-full max-w-full overflow-hidden">
        {/* Page Hero Title */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-indigo-700" />
              <span>Side-by-Side Yield &amp; Risk Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
              Compare Bank FDs, Corporate FDs, SCSS &amp; Sovereign Bonds
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Analyze interest yields, statutory insurance coverage, credit safety ratings (AAA vs DICGC), liquidity terms, and tax implications side-by-side.
            </p>
          </div>
        </section>

        {/* Interactive Comparison Client Engine */}
        <CompareRatesClient />

        {/* Informational Guidance on Safety Tiers */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Understanding Fixed Income Safety Tiers in India
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Tier 1: Absolute Sovereign</span>
              <h3 className="font-bold text-slate-900">Govt of India / RBI Bonds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SCSS and RBI Floating Rate Savings Bonds carry direct sovereign backing with zero credit or default risk. Repayment of principal and interest is a direct obligation of the Central Government.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Tier 2: Statutory DICGC Insured</span>
              <h3 className="font-bold text-slate-900">Scheduled Commercial &amp; SFBs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deposits up to ₹5,00,000 per depositor per bank are fully insured by the Reserve Bank of India’s subsidiary, DICGC. By dividing funds across multiple scheduled banks, multi-crore portfolios can remain 100% insured.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">Tier 3: Credit Rated Corporates</span>
              <h3 className="font-bold text-slate-900">CRISIL / ICRA AAA NBFCs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Top-tier NBFCs like Bajaj Finance and Mahindra Finance carry CRISIL AAA ratings denoting highest safety. They pay higher yields (up to 8.85%) to compensate for lack of DICGC coverage.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
