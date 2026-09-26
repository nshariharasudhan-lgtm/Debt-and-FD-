'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  HelpCircle,
  AlertCircle,
  Building2,
  FileCheck2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { GuideArticle } from '@/lib/articles-data';

export default function ResourcesPage() {
  const [activeSubpage, setActiveSubpage] = useState<'insights' | 'guides'>('insights');
  const [articles, setArticles] = useState<GuideArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(true);
  const [isLargeText, setIsLargeText] = useState(false);

  // Load articles dynamically from persistent storage and backend API
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch from server API
        const res = await fetch('/api/admin/data?type=articles');
        const data = await res.json();
        
        let loaded: GuideArticle[] = [];
        if (data.success && Array.isArray(data.articles)) {
          loaded = data.articles;
        }

        // 2. Also check client localStorage (in case updated locally in admin session)
        const localSaved = localStorage.getItem('bharat_debt_articles');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const map = new Map(loaded.map(a => [a.slug, a]));
              for (const a of parsed) {
                map.set(a.slug, a);
              }
              loaded = Array.from(map.values());
            }
          } catch (e) {
            console.error('Local articles parse note:', e);
          }
        }

        setArticles(loaded.filter(a => a.isPublished !== false));
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    // Listen to storage events from Admin Dashboard
    const handleStorageChange = () => {
      try {
        const localSaved = localStorage.getItem('bharat_debt_articles');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            setArticles(parsed.filter((a: GuideArticle) => a.isPublished !== false));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter articles based on active subpage (Insights vs Guides)
  const insightsList = articles.filter(a => 
    a.resourceType === 'Insights' || 
    a.category === 'Corporate Debt & Ratings' || 
    a.category === 'RBI Sovereign Bonds'
  );

  const guidesList = articles.filter(a => 
    a.resourceType === 'Guides' || 
    a.category === 'Taxation & 80TTB' || 
    a.category === 'Bank FDs & DICGC' || 
    a.category === 'Retirement Planning'
  );

  const currentList = activeSubpage === 'insights' ? insightsList : guidesList;

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white ${
      isLargeText ? 'text-base' : 'text-sm'
    }`}>
      {/* Centered Logo Navigation */}
      <Navbar 
        isSeniorCitizen={isSeniorCitizen}
        onToggleSeniorCitizen={setIsSeniorCitizen}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Knowledge &amp; Regulatory Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resources, Tax Rules &amp; Editorial Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Statutory tax exemptions, DICGC insurance frameworks, and editorial fixed-income analyses. All guides are managed directly via the internal Admin CMS.
          </p>
        </div>

        {/* 2 SUBPAGES: Insights and Guides Tabs */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 shadow-2xs">
              <button
                onClick={() => setActiveSubpage('insights')}
                className={`px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubpage === 'insights'
                    ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${activeSubpage === 'insights' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Subpage 1: Insights</span>
                {insightsList.length > 0 && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {insightsList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSubpage('guides')}
                className={`px-5 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubpage === 'guides'
                    ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeSubpage === 'guides' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Subpage 2: Guides</span>
                {guidesList.length > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {guidesList.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Subpage Content Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeSubpage === 'insights' ? 'Market Insights & Yield Trends' : 'Educational Guides & How-To Articles'}
                </h2>
                <p className="text-xs text-slate-500">
                  {activeSubpage === 'insights' 
                    ? 'Timely analytical perspectives on interest rates, monetary policy, and credit spreads.' 
                    : 'Step-by-step tutorials on booking deposits, claiming tax deductions, and verifying bank safety.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {currentList.length} {currentList.length === 1 ? 'Article' : 'Articles'} Available
              </span>
            </div>

            {/* Articles List or Clean Empty State */}
            {isLoading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : currentList.length === 0 ? (
              /* Clean Empty State as requested: "Do not put your own data, keep the pages without any data, where it can be updated later through Admin Dashboard." */
              <div className="py-12 sm:py-16 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                  {activeSubpage === 'insights' ? (
                    <Sparkles className="w-7 h-7 text-slate-400" />
                  ) : (
                    <FileText className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {activeSubpage === 'insights' ? 'No Insights Published Yet' : 'No Guides Published Yet'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activeSubpage === 'insights' 
                    ? 'Fixed-income intelligence and yield trend analyses will appear here once published from the internal Admin Dashboard CMS.'
                    : 'Educational guides and step-by-step depositor manuals will appear here once published from the internal Admin Dashboard CMS.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentList.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="group bg-slate-50 hover:bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 p-5 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{article.readTimeMinutes} min read</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {article.excerpt || article.metaDescription}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-700">
                      <span>Read Full {activeSubpage === 'insights' ? 'Insight' : 'Guide'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATUTORY TAX & SAFETY DETAILS (Individual Headers on the Resource Page) */}
        {/* ========================================================================= */}
        <section className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              Indian Fixed Income Tax Rules &amp; Statutory Guidelines
            </h2>
            <p className="text-xs text-slate-500">
              Key provisions under the Income Tax Act 1961, Section 80TTB, Form 15H/15G rules, and DICGC insurance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Header 1: Section 80TTB */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-blue-700">
                <FileCheck2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Section 80TTB Tax Exemption (₹50,000 Annual Shield)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resident senior citizens aged 60 years or above are entitled to an exclusive tax deduction of up to <strong>₹50,000 per financial year</strong> on interest earned from bank fixed deposits, recurring deposits, savings accounts, and Post Office schemes (including SCSS).
              </p>
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
                <p><strong>Qualifying:</strong> Scheduled Commercial Banks, Small Finance Banks, Post Office (SCSS, POTD).</p>
                <p><strong>Non-Qualifying:</strong> Corporate FDs, NBFC debentures, Company Bonds (taxed at slab rates).</p>
              </div>
            </div>

            {/* Header 2: Form 15H & 15G */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-600">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Form 15H &amp; Form 15G TDS Self-Declaration Rules
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under Section 194A, banks deduct TDS on interest exceeding ₹50,000 for senior citizens (₹40,000 for general citizens). Depositors whose estimated total annual income tax liability is Nil can submit Form 15H to prevent TDS.
              </p>
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-900 space-y-1">
                <p><strong>Form 15H:</strong> For individuals aged 60+ whose net calculated tax liability for the FY is zero.</p>
                <p><strong>Form 15G:</strong> For individuals below 60 years whose interest and total income remain within the exemption threshold.</p>
              </div>
            </div>

            {/* Header 3: DICGC Insurance Framework */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  DICGC ₹5 Lakh Insurance Framework for Scheduled Banks
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deposits in all RBI Scheduled Commercial Banks and Small Finance Banks are insured by the Deposit Insurance and Credit Guarantee Corporation (a wholly-owned subsidiary of RBI) up to <strong>₹5,00,000</strong> per depositor per bank (covering principal plus accumulated interest).
              </p>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                <p><strong>Coverage:</strong> Savings, Current, Recurring, and Fixed Deposits across all branches of the same bank.</p>
                <p><strong>Strategy:</strong> Diversify deposits across different scheduled banks to enjoy multiple ₹5 Lakh insurance limits.</p>
              </div>
            </div>

            {/* Header 4: Corporate vs Bank FDs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-purple-700">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Corporate NBFC Fixed Deposits vs Scheduled Banks
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Corporate fixed deposits from companies like Bajaj Finance, Shriram Finance, and Mahindra Finance offer higher nominal interest rates (typically 50-100 bps higher) but carry corporate credit risk and are <strong>not insured by DICGC</strong>.
              </p>
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-[11px] text-purple-900 space-y-1">
                <p><strong>Credit Ratings:</strong> Always verify CRISIL, ICRA, or CARE ratings. Prefer AAA or AA+ rated issuers.</p>
                <p><strong>Tax Treatment:</strong> Fully taxable under &apos;Income from Other Sources&apos; without Section 80TTB relief.</p>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
