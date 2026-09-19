import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calculator, ShieldCheck, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import { CalculatorClient } from './CalculatorClient';

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How is Fixed Deposit interest compounded in Indian banks?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Indian scheduled commercial banks compound interest on fixed deposits every quarter (every 3 months) in accordance with Reserve Bank of India (RBI) guidelines. Quarterly compounding yields a higher effective annual return (APY) than simple annual interest.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is Section 80TTB deduction for Senior Citizens?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Under Section 80TTB of the Indian Income Tax Act, resident senior citizens aged 60 years or above can claim a tax deduction of up to ₹50,000 per financial year on interest income earned from bank fixed deposits, savings accounts, and post office deposits.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is the TDS threshold on bank fixed deposits?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Tax Deducted at Source (TDS) is deducted at 10% if total interest income from all branches of a single bank exceeds ₹40,000 in a financial year for general depositors, or ₹50,000 for senior citizens (Section 194A). Eligible depositors can submit Form 15G or 15H to avoid TDS.'
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>ROI &amp; Tax Calculator</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-8 w-full max-w-full overflow-hidden">
        {/* Page Hero Title */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Section 80TTB Tax-Shield &amp; Compounding Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
              Bank Fixed Deposit ROI &amp; Tax Calculator
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Calculate maturity corpus, net interest returns, quarterly compounding growth, and tax liability under old and new income tax regimes for Indian Banks, NBFCs, and Small Finance Banks.
            </p>
          </div>
        </section>

        {/* Interactive Calculator Client Component */}
        <CalculatorClient />

        {/* SEO & Knowledge Articles Section for Search Engine Indexation */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Understanding Fixed Deposit (FD) Calculations &amp; Tax Rules in India
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Quarterly Compounding Formula</span>
              </h3>
              <p>
                In accordance with Reserve Bank of India (RBI) standards, all scheduled commercial banks compound fixed deposit interest every quarter (4 times per year). The maturity value formula is:
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs font-semibold text-blue-900 text-center">
                A = P × [1 + (r / 400)]^(4 × t)
              </div>
              <p className="text-xs text-slate-600">
                Where <strong>A</strong> is maturity amount, <strong>P</strong> is principal deposit, <strong>r</strong> is annual interest rate in percent, and <strong>t</strong> is tenure in years.
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Section 80TTB Tax Exemption Rules</span>
              </h3>
              <p>
                Under Section 80TTB of the Income Tax Act, resident senior citizens (aged 60 years or older) are entitled to claim up to <strong>₹50,000</strong> per financial year as a tax deduction on interest income earned from:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Bank Fixed Deposits and Recurring Deposits (RDs)</li>
                <li>Savings Account Interest</li>
                <li>Post Office Term Deposits and SCSS</li>
              </ul>
              <p className="text-xs text-slate-600">
                For individuals under 60 years, Section 80TTA provides only up to ₹10,000 exemption, limited solely to savings bank accounts (excluding term deposits).
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Frequently Asked Questions (FAQs)
            </h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">
                  Is interest on Bank FDs subject to TDS?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yes, banks deduct 10% TDS if interest income exceeds ₹40,000 in a financial year for general citizens, or ₹50,000 for senior citizens. If total annual income is below taxable limits, depositors can submit Form 15G (under 60) or Form 15H (60+) to prevent TDS deduction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">
                  Are Small Finance Bank FDs insured by DICGC?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yes. All RBI-scheduled Small Finance Banks (such as AU Small Finance Bank, Suryoday, Equitas, and Unity SFB) are covered under the statutory DICGC scheme up to ₹5,00,000 per depositor (principal + accrued interest), exactly identical to SBI, HDFC, or ICICI Bank.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
