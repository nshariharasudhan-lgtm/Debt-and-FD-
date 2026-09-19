'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MarketTicker } from '@/components/MarketTicker';
import { SeniorCitizenSpecialBanner } from '@/components/SeniorCitizenSpecialBanner';
import { InstrumentDirectory } from '@/components/InstrumentDirectory';
import { SeniorCitizenAnalytics } from '@/components/SeniorCitizenAnalytics';
import { RetirementCashflowPlanner } from '@/components/RetirementCashflowPlanner';
import { YieldComparator } from '@/components/YieldComparator';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { SEOContentSection } from '@/components/SEOContentSection';
import { Footer } from '@/components/Footer';
import { FeatureTabBar, FeatureTabKey } from '@/components/FeatureTabBar';
import { 
  initialBenchmarks, 
  initialDebtInstruments, 
  DebtInstrument, 
  MarketBenchmark 
} from '@/lib/debt-data';
import { 
  ShieldCheck, 
  Landmark, 
  Award, 
  TrendingUp, 
  Calculator, 
  ArrowDown, 
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Building2,
  Calendar,
  Scale,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark>(initialBenchmarks);
  const [instruments, setInstruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(true); // Senior citizen default
  const [isLargeText, setIsLargeText] = useState<boolean>(false); // Senior comfortable reading mode
  const [selectedInstrumentForCalc, setSelectedInstrumentForCalc] = useState<DebtInstrument | null>(null);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<FeatureTabKey>('directory');

  useEffect(() => {
    // Safely hydrate client-side saved state from localStorage after mount in next tick
    const timer = setTimeout(() => {
      try {
        const savedBench = localStorage.getItem('bharat_debt_benchmarks');
        if (savedBench) setBenchmarks(JSON.parse(savedBench));

        const savedInst = localStorage.getItem('bharat_debt_instruments');
        if (savedInst) setInstruments(JSON.parse(savedInst));
      } catch (e) {
        console.error(e);
      }
    }, 0);

    // Listen for rate changes synced from Admin Dashboard
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('bharat_debt_instruments');
        if (saved) setInstruments(JSON.parse(saved));
        const savedBench = localStorage.getItem('bharat_debt_benchmarks');
        if (savedBench) setBenchmarks(JSON.parse(savedBench));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSelectTab = (tab: FeatureTabKey) => {
    setActiveTab(tab);
    // Smoothly scroll to the feature container
    const contentArea = document.getElementById('feature-content-area');
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectInstrumentForCalc = (inst: DebtInstrument) => {
    setSelectedInstrumentForCalc(inst);
    setActiveTab('calculator');
    const contentArea = document.getElementById('feature-content-area');
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateSection = (sectionKey: string) => {
    if (sectionKey === 'directory' || sectionKey === 'directory-section') {
      setActiveTab('directory');
    } else if (sectionKey === 'calculator' || sectionKey === 'analytics-calculator-section') {
      setActiveTab('calculator');
    } else if (sectionKey === 'pension' || sectionKey === 'pension-planner-section') {
      setActiveTab('pension');
    } else if (sectionKey === 'compare' || sectionKey === 'comparison-section') {
      setActiveTab('compare');
    } else if (sectionKey === 'guides' || sectionKey === 'guides-section') {
      setActiveTab('guides');
    } else if (sectionKey === 'senior-citizen-section') {
      setIsSeniorCitizen(true);
      setActiveTab('directory');
    } else {
      setActiveTab('all');
    }

    const contentArea = document.getElementById('feature-content-area');
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-900 antialiased font-sans selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden ${
      isLargeText ? 'text-base' : 'text-sm'
    }`}>
      
      {/* Header & Sticky Navigation Bar */}
      <Navbar 
        onOpenNewsletter={() => setNewsletterModalOpen(true)}
        activeSection={activeTab}
        onNavigateSection={handleNavigateSection}
        isSeniorCitizen={isSeniorCitizen}
        onToggleSeniorCitizen={setIsSeniorCitizen}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
      />

      {/* Clean Live Benchmark Ribbon */}
      <MarketTicker benchmarks={benchmarks} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6 w-full max-w-full overflow-hidden" id="feature-content-area">
        
        {/* TAB NAVIGATION BAR: Prominent Feature Buttons below header */}
        <FeatureTabBar 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab} 
          isLargeText={isLargeText}
        />

        {/* ========================================================================= */}
        {/* SUBPAGE 1: Bank & Deposit Directory */}
        {/* ========================================================================= */}
        {(activeTab === 'directory' || activeTab === 'all') && (
          <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Streamlined Hero Section */}
            <section className="pt-1 pb-1 w-full max-w-full overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-8 shadow-xs w-full max-w-full overflow-hidden">
                <div className="space-y-2.5 max-w-2xl min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                    <Landmark className="w-3.5 h-3.5 text-blue-700" />
                    <span>Pan-India Fixed Income & Bond Portal</span>
                  </div>

                  <h1 className={`${isLargeText ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'} font-bold font-serif text-slate-900 tracking-tight leading-tight`}>
                    Find Safe Bank FDs &amp; Sovereign Bonds in India
                  </h1>

                  <p className={`${isLargeText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} text-slate-600 leading-relaxed`}>
                    Compare certified interest rates up to <strong className="text-slate-900 font-bold">9.40% p.a.</strong> across scheduled banks with statutory DICGC ₹5 Lakh deposit insurance, 8.20% Govt SCSS, and CRISIL AAA corporate deposits.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs text-slate-700">
                    <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      DICGC ₹5 Lakh Insured
                    </span>
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      Sec 80TTB ₹50,000 Tax-Free
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      Quarterly Compounding
                    </span>
                  </div>
                </div>

                {/* Quick Status / Callout Box */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 w-full sm:w-auto sm:min-w-[280px] shrink-0 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider">Browsing Mode</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                      isSeniorCitizen 
                        ? 'bg-amber-400 text-slate-950 font-extrabold' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSeniorCitizen ? 'Senior (60+)' : 'General'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 block">Top Insured Bank FD</span>
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {isSeniorCitizen ? '9.50%' : '9.00%'} <span className="text-xs text-slate-500 font-normal">p.a.</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
                    id="hero-toggle-senior-btn"
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSeniorCitizen
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>{isSeniorCitizen ? 'Switch to General Rates (<60)' : 'Switch to Senior Rates (60+)'}</span>
                  </button>
                </div>
              </div>

              {/* Front-Loaded Direct Answer Capsule (Checklist Item 7 & 6) */}
              <div 
                data-content-capsule="true"
                className="mt-4 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Direct Fixed Income Answers (Verified Sept 2026)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Highest Insured Bank FD</span>
                    <p className="text-white font-medium"><strong>Unity SFB (9.50% Senior / 9.00% Gen)</strong> for 1001 days, 100% DICGC insured up to ₹5 Lakhs.</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Top Sovereign Scheme</span>
                    <p className="text-white font-medium"><strong>SCSS (8.20% p.a.)</strong> with quarterly direct bank payouts, ₹30 Lakh cap, and zero default risk.</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Senior Tax Shield</span>
                    <p className="text-white font-medium"><strong>Section 80TTB</strong> provides ₹50,000 tax-free interest annually; submit Form 15H to waive TDS.</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Floating Rate Sovereign</span>
                    <p className="text-white font-medium"><strong>RBI FRSB (8.05% p.a.)</strong> resets semi-annually at NSC + 35 bps with no upper investment ceiling.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Senior Citizen High-Yield Alert Banner */}
            <SeniorCitizenSpecialBanner 
              onExploreSeniorDeals={() => {
                setIsSeniorCitizen(true);
                handleSelectTab('directory');
              }}
              onOpenCalculator={() => {
                setIsSeniorCitizen(true);
                handleSelectTab('calculator');
              }}
              isSeniorCitizen={isSeniorCitizen}
            />

            {/* Indian Debt Instrument Directory */}
            <InstrumentDirectory 
              instruments={instruments}
              isSeniorCitizen={isSeniorCitizen}
              onToggleSeniorCitizen={setIsSeniorCitizen}
              onSelectInstrumentForCalc={handleSelectInstrumentForCalc}
              isLargeText={isLargeText}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBPAGE 2: Yield & Section 80TTB Tax-Shield Calculator */}
        {/* ========================================================================= */}
        {(activeTab === 'calculator' || activeTab === 'all') && (
          <div className="space-y-6">
            <SeniorCitizenAnalytics 
              selectedInstrument={selectedInstrumentForCalc}
              isSeniorCitizen={isSeniorCitizen}
              onToggleSeniorCitizen={setIsSeniorCitizen}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBPAGE 3: Retirement Cashflow & Monthly Pension Planner */}
        {/* ========================================================================= */}
        {(activeTab === 'pension' || activeTab === 'all') && (
          <div className="space-y-6">
            <RetirementCashflowPlanner />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBPAGE 4: Multi-Instrument Yield Comparator */}
        {/* ========================================================================= */}
        {(activeTab === 'compare' || activeTab === 'all') && (
          <div className="space-y-6">
            <YieldComparator 
              instruments={instruments}
              isSeniorCitizen={isSeniorCitizen}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBPAGE 5: Tax Handbooks, DICGC Rules, & FAQs */}
        {/* ========================================================================= */}
        {(activeTab === 'guides' || activeTab === 'all') && (
          <div className="space-y-6">
            <SEOContentSection />
            <NewsletterSignup />
          </div>
        )}

        {/* Quick Cross-Feature Navigation Footer Bar */}
        {activeTab !== 'all' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Quick Tool Switcher
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                Explore other fixed income calculation &amp; planning tools
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {activeTab !== 'directory' && (
                <button
                  onClick={() => handleSelectTab('directory')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>FD Directory</span>
                </button>
              )}

              {activeTab !== 'calculator' && (
                <button
                  onClick={() => handleSelectTab('calculator')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  <span>ROI Calculator</span>
                </button>
              )}

              {activeTab !== 'pension' && (
                <button
                  onClick={() => handleSelectTab('pension')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pension Planner</span>
                </button>
              )}

              {activeTab !== 'compare' && (
                <button
                  onClick={() => handleSelectTab('compare')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-purple-600" />
                  <span>Compare Rates</span>
                </button>
              )}

              {activeTab !== 'guides' && (
                <button
                  onClick={() => handleSelectTab('guides')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                  <span>Guides &amp; 80TTB</span>
                </button>
              )}

              <button
                onClick={() => handleSelectTab('all')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Newsletter Modal */}
      {newsletterModalOpen && (
        <NewsletterSignup 
          isModal={true}
          onClose={() => setNewsletterModalOpen(false)}
        />
      )}
    </div>
  );
}
