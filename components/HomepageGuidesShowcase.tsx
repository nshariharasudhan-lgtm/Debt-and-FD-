'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Percent, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface HomepageGuidesShowcaseProps {
  isLargeText?: boolean;
}

export function HomepageGuidesShowcase({ isLargeText = false }: HomepageGuidesShowcaseProps) {
  const guides = [
    {
      title: 'How to Claim Section 80TTB + Form 15H (Step-by-Step)',
      category: 'Taxation & 80TTB',
      slug: 'section-80ttb-tax-saving-senior-citizens-guide',
      readTime: '6 min read',
      excerpt: 'Learn how senior citizens (60+) can claim up to ₹50,000 tax-free interest annually across bank and post office deposits, plus exact online Form 15H filing procedures to stop 10% TDS deductions.',
      icon: Percent,
      highlight: 'Save ₹5,000 - ₹15,000 in TDS'
    },
    {
      title: 'SCSS vs Bank FD vs RBI Floating Rate Bonds: Which is Better?',
      category: 'Retirement Planning',
      slug: 'rbi-floating-rate-savings-bonds-complete-investor-guide',
      readTime: '8 min read',
      excerpt: 'A comprehensive side-by-side comparison of Government SCSS (8.20%), RBI Floating Rate Bonds (8.05%), and top Bank FDs (9.50%) on safety, liquidity, lock-in rules, and monthly cashflow predictability.',
      icon: FileText,
      highlight: 'Sovereign Yield Matrix'
    },
    {
      title: 'DICGC ₹5 Lakh Insurance: Safe Multi-Bank Tranche Strategy',
      category: 'Bank FDs & Safety',
      slug: 'dicgc-5-lakh-deposit-insurance-rules-bank-fd',
      readTime: '5 min read',
      excerpt: 'How Section 16(1) of the DICGC Act protects your principal and interest up to ₹5,00,000 across Public, Private, and Small Finance Banks, and how to safely allocate ₹20+ Lakhs with zero default risk.',
      icon: ShieldCheck,
      highlight: 'Zero Default Risk Blueprint'
    }
  ];

  return (
    <section 
      id="practical-guides-showcase" 
      aria-label="Practical Senior Citizen Guides"
      className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Senior Citizen Financial Handbooks & Tax Guides</span>
          </div>
          <h2 className={`${isLargeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-bold font-serif text-slate-900 tracking-tight`}>
            Practical Knowledge: Tax Rules, Safety & Maximum Yields
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Clear, jargon-free explanations written specifically for Indian retirees, senior citizens, and conservative savers.
          </p>
        </div>

        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors shrink-0 group self-start sm:self-auto"
        >
          <span>View All Handbooks (5)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3 Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {guides.map((guide, idx) => {
          const Icon = guide.icon;
          return (
            <Link
              key={idx}
              href={`/guide/${guide.slug}`}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80">
                    {guide.category}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{guide.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors mb-2">
                  {guide.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {guide.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {guide.highlight}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-900">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Helpful Trust Banner below guides */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
          <p className="leading-snug">
            <strong>Need customized advice?</strong> All calculations conform to Income Tax Act 1961 (Section 80TTB) and RBI Master Circular FIDD.MSME.
          </p>
        </div>
        <Link
          href="/tax-rules-80ttb"
          className="font-bold text-blue-800 hover:text-blue-950 underline underline-offset-2 shrink-0"
        >
          Check 80TTB Eligibility Rules &rarr;
        </Link>
      </div>
    </section>
  );
}
