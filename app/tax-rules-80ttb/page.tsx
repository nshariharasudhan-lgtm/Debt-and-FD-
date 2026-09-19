import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, BookOpen, ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';
import { SEOContentSection } from '@/components/SEOContentSection';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'DICGC Insurance & Section 80TTB Tax Rules Guide | TDS & Form 15H 2026',
  description: 'Comprehensive statutory guide to DICGC ₹5,00,000 bank deposit insurance coverage, Section 80TTB ₹50,000 tax deduction for senior citizens, and Form 15G / 15H TDS rules in India.',
  alternates: {
    canonical: 'https://yieldnest.online/tax-rules-80ttb',
  },
  openGraph: {
    title: 'DICGC Insurance & Section 80TTB Tax Rules Guide | TDS & Form 15H 2026',
    description: 'Comprehensive statutory guide to DICGC ₹5,00,000 bank deposit insurance coverage, Section 80TTB ₹50,000 tax deduction for senior citizens, and Form 15G / 15H TDS rules.',
    url: 'https://yieldnest.online/tax-rules-80ttb',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DICGC Insurance & Section 80TTB Tax Rules Guide | YIELDNEST.ONLINE',
    description: 'Statutory guide on DICGC bank insurance, Section 80TTB exemptions, and Form 15H rules for Indian depositors.',
  }
};

export default function TaxRules80TTBPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Comprehensive Guide to DICGC Deposit Insurance and Section 80TTB Tax Rules in India',
    'description': 'Understanding RBI DICGC ₹5 Lakh statutory deposit insurance per bank and Section 80TTB ₹50,000 tax deduction for senior citizens.',
    'author': {
      '@type': 'Organization',
      'name': 'YIELDNEST.ONLINE Intelligence Editorial Desk'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'YIELDNEST.ONLINE',
      'url': 'https://yieldnest.online'
    },
    'datePublished': '2026-01-01',
    'dateModified': '2026-04-01'
  };

  return (
    <main className="min-h-screen bg-slate-50/60 text-slate-900 pb-16 font-sans w-full max-w-full overflow-x-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Tax &amp; Safety Handbook</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 space-y-8 w-full max-w-full overflow-hidden">
        {/* Page Hero Title */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Statutory Compliance &amp; Depositor Protection</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
              DICGC Deposit Insurance &amp; Section 80TTB Tax Guide
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Official regulatory rules for the ₹5,00,000 DICGC insurance ceiling, Section 80TTB ₹50,000 tax deduction, Section 194A TDS thresholds, and Form 15H/15G procedures for Indian depositors.
            </p>
          </div>
        </section>

        {/* Detailed Explanatory Sections */}
        <SEOContentSection />

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </main>
  );
}
