'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Scale,
  ExternalLink,
  CheckCircle2,
  Building,
  Landmark,
  CalendarCheck,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';

export function SEOContentSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What is Section 80TTB and who is eligible for the ₹50,000 tax deduction?',
      a: 'Section 80TTB of the Income Tax Act 1961 is available exclusively to resident senior citizens aged 60 years or above. It permits an annual deduction of up to ₹50,000 on interest earned from bank savings accounts, fixed deposits (FDs), recurring deposits (RDs), and post office schemes. The deduction is evaluated financial year by financial year and cannot be pooled across multi-year deposits. Corporate FDs and NBFC deposits are excluded from Section 80TTB.'
    },
    {
      q: 'How does DICGC deposit insurance work, and what are its limits?',
      a: 'The Deposit Insurance and Credit Guarantee Corporation (DICGC), a statutory subsidiary of the Reserve Bank of India, insures bank deposits up to ₹5,00,000 per depositor per insured bank under Section 16(1) of the DICGC Act 1961. This ₹5 Lakh limit includes both principal and accrued interest held in the same right and capacity across all branches of that specific bank. If your cumulative deposit plus accrued interest exceeds ₹5 Lakhs, only up to ₹5 Lakhs is protected under the insurance claim.'
    },
    {
      q: 'How does sovereign backing compare to bank deposit insurance and corporate ratings?',
      a: 'Sovereign instruments (such as SCSS, RBI Floating Rate Savings Bonds, and Treasury G-Secs) are direct obligations of the Union Government of India under Article 292 of the Constitution, carrying zero credit default risk without any statutory ₹5 Lakh ceiling. Bank fixed deposits carry commercial credit risk mitigated by statutory DICGC insurance up to ₹5 Lakhs per bank. Corporate fixed deposits (e.g. Bajaj Finance, Shriram Finance) are unsecured company borrowings rated by agencies like CRISIL and ICRA; they carry corporate credit risk and have zero DICGC insurance coverage.'
    },
    {
      q: 'What is the exact purpose of submitting Form 15H?',
      a: 'Form 15H is a statutory self-declaration under Section 197A(1C) for resident senior citizens (aged 60+) whose estimated total tax liability for the financial year will be nil. Submitting Form 15H instructs the bank not to withhold 10% TDS under Section 194A. However, if your total taxable income from all sources actually exceeds the basic exemption limit, income tax remains legally payable when you file your Income Tax Return.'
    },
    {
      q: 'Why do Small Finance Banks offer higher interest rates than large PSU banks?',
      a: 'Small Finance Banks (SFBs) operate focused lending models with higher borrowing yields in semi-urban and priority sectors, allowing them to offer deposit rates 100 to 150 basis points higher to attract retail liability deposits. Because scheduled SFBs are regulated by the Reserve Bank of India and covered under DICGC, individual depositors enjoy the same statutory ₹5 Lakh insurance per bank as depositors in major public or private banks.'
    },
    {
      q: 'How are RBI Floating Rate Savings Bonds (FRSB 2020) rates reset?',
      a: 'RBI Floating Rate Savings Bonds carry a variable coupon reset semi-annually on January 1st and July 1st. By statutory formula, the interest rate is pegged at 35 basis points (0.35%) above the prevailing National Savings Certificate (NSC) rate. At the current NSC rate of 7.70%, RBI Floating Rate Bonds yield 8.05% p.a. payable semi-annually with 100% sovereign security.'
    }
  ];

  return (
    <section id="seo-guides-section" className="scroll-mt-24 py-8 border-t border-slate-200 space-y-10">
      
      {/* Header & Verification Metadata */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Senior Citizen Education &amp; Statutory Rules</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-300">
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
            <span>Last Verified: September 2026 • Based on Official Circulars</span>
          </div>
        </div>

        {/* Shortened plain-language title */}
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
          FD, Bond &amp; Tax Guide for Senior Citizens
        </h2>
        <p className="text-slate-700 text-base sm:text-lg mt-2 max-w-3xl leading-relaxed">
          Clear, objective explanations of bank deposit insurance, Government of India small savings schemes, and tax provisions under the Income Tax Act 1961.
        </p>

        {/* Dedicated Guides Hub Links */}
        <div className="flex flex-wrap gap-3 pt-5">
          <Link 
            href="/senior-citizen-savings-scheme"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-sm font-bold transition-colors"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span>SCSS 8.20% Government Scheme Guide &rarr;</span>
          </Link>
          <Link 
            href="/fd-rates"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 text-sm font-bold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Bank FD Rates &amp; DICGC Matrix &rarr;</span>
          </Link>
          <Link 
            href="/rbi-floating-rate-bonds"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-sm font-bold transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>RBI Floating Rate Bonds (8.05%) &rarr;</span>
          </Link>
        </div>
      </div>

      {/* 3 Pillars of Senior Fixed Income */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Section 80TTB */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-lg font-serif text-slate-900">
            Section 80TTB Tax Exemption
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Resident senior citizens (aged 60+) can claim up to ₹50,000 of interest income as a deduction each financial year under Section 80TTB. This applies to bank fixed deposits, savings accounts, and post office time deposits. Non-senior citizens receive only ₹10,000 under Section 80TTA and only for savings accounts.
          </p>
          <div className="text-xs font-bold text-blue-800 pt-1">
            Saves up to ₹15,600/year for seniors in the 30% tax slab
          </div>
        </div>

        {/* Pillar 2: DICGC Deposit Insurance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-bold text-lg font-serif text-slate-900">
            DICGC Deposit Insurance
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Deposits across all scheduled commercial banks (PSU, Private, and Small Finance Banks) are insured up to ₹5,00,000 per depositor per bank by DICGC under Section 16(1) of the DICGC Act 1961. This limit includes both principal and accrued interest across all accounts held in the same capacity.
          </p>
          <div className="text-xs font-bold text-emerald-800 pt-1">
            Statutory protection covering principal + accrued interest up to ₹5 Lakhs
          </div>
        </div>

        {/* Pillar 3: Sovereign vs Corporate Safety */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-lg font-serif text-slate-900">
            Sovereign vs. Corporate Safety
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Sovereign instruments like SCSS (8.20%) and RBI Floating Rate Bonds (8.05%) are backed directly by the Government of India and carry zero credit default risk. Corporate FDs offer higher yields but carry corporate credit risk evaluated by agencies like CRISIL without any DICGC insurance cover.
          </p>
          <div className="text-xs font-bold text-slate-800 pt-1">
            Always distinguish sovereign guarantees from corporate ratings
          </div>
        </div>

      </div>

      {/* Practical Operational Guidance: Managing Deposit Limits & Form 15H */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
          <FileText className="w-4 h-4 text-blue-700" />
          <span>Practical Operational Guidance</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Managing Deposit Allocation &amp; Form 15H Submissions
        </h3>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          When structuring a retirement fixed-income portfolio across commercial banks and government schemes, keep these verified statutory principles in mind:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-sm text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="block text-slate-900 font-bold">1. Account for Accrued Interest</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Do not deposit the full ₹5 Lakhs in a multi-year cumulative FD at a single bank. At 8.50% quarterly compounding, ₹5 Lakhs grows to ₹7.6 Lakhs in 5 years, leaving ₹2.6 Lakhs unprotected. Keep initial principal around ₹3.5 to ₹3.8 Lakhs per bank to ensure the entire maturity corpus remains under the ₹5 Lakh DICGC ceiling.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="block text-slate-900 font-bold">2. Timely Form 15H Submissions</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Submit Form 15H during the first month of the financial year (April) at every bank branch or net banking portal where your annual interest exceeds ₹50,000. If submitted late after the quarterly tax cycle, TDS already deducted cannot be refunded by the bank and must be claimed via your ITR.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="block text-slate-900 font-bold">3. Compounding vs. Monthly Cashflow</strong>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Monthly non-cumulative interest payouts offer immediate cash flow for living expenses, but the effective annual yield equals the nominal rate because interest is withdrawn rather than reinvested. Choose cumulative mode only for funds not required for regular living expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQs Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <HelpCircle className="w-4 h-4 text-blue-700" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-2xl font-bold font-serif text-slate-900">
          Frequently Asked Questions on Senior Citizen Fixed Income
        </h3>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif leading-snug">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Honest Editorial Methodology & Source Policy (Checklist Item 5 & 8) */}
      <div 
        id="author-methodology"
        className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Landmark className="w-4 h-4 text-blue-700" />
          <span>YIELDNEST.ONLINE Editorial Policy &amp; Sourcing Standards</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Editorial Independence &amp; Data Sourcing
        </h3>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          YIELDNEST.ONLINE is an independent, reader-supported research platform committed to delivering accurate, objective fixed-income information for Indian seniors and conservative debt investors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="block text-slate-900 font-bold">1. Primary Source Grounding</strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rates and regulatory terms are drawn from Reserve Bank of India notifications, Ministry of Finance small savings circulars, DICGC statutory guidelines, and official commercial bank card rate sheets.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="block text-slate-900 font-bold">2. Zero Affiliate Bias</strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              We do not accept commercial commissions, referral bounties, or sponsor payments to rank or feature any bank, NBFC, or debt product over another.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <strong className="block text-slate-900 font-bold">3. Transparent Mathematics</strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              All financial formulas, compounding frequencies, Section 80TTB annual allocations, and Fisher inflation adjustments are openly documented and verifiable.
            </p>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <span>Editorial Contact: <a href="mailto:editorial@yieldnest.online" className="text-blue-700 hover:underline">editorial@yieldnest.online</a></span>
          <span>Readers are encouraged to report rate changes or text discrepancies for immediate verification.</span>
        </div>
      </div>

    </section>
  );
}
