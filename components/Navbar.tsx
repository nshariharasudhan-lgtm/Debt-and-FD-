'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { YieldNestLogo } from './YieldNestLogo';
import { 
  Landmark, 
  Calculator, 
  ShieldCheck, 
  Menu, 
  X, 
  Award,
  Type
} from 'lucide-react';

interface NavbarProps {
  onOpenNewsletter?: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
  isSeniorCitizen?: boolean;
  onToggleSeniorCitizen?: (isSenior: boolean) => void;
  isLargeText?: boolean;
  onToggleLargeText?: () => void;
}

export function Navbar({ 
  onOpenNewsletter, 
  activeSection, 
  onNavigateSection,
  isSeniorCitizen = true,
  onToggleSeniorCitizen,
  isLargeText = false,
  onToggleLargeText
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-2xs">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-22 sm:h-26 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand identity & Logo Placeholder */}
        <Link 
          href="/" 
          className="flex items-center group focus:outline-none shrink-0"
          id="nav-brand-logo"
          aria-label="YIELDNEST.ONLINE - Return to Homepage"
        >
          <div 
            id="nav-logo-placeholder" 
            className="h-16 sm:h-20 md:h-22 w-64 sm:w-80 md:w-96 lg:w-[420px] max-w-[70vw] sm:max-w-none flex items-center justify-start shrink-0 transition-all duration-200"
          >
            <YieldNestLogo 
              variant="full" 
              height={74} 
              priority={true} 
              className="w-full h-full flex items-center justify-start"
              imgClassName="object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
          <Link
            href="/fd-rates"
            id="nav-link-fd-rates"
            className="px-3.5 py-2 rounded-xl transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 text-slate-700"
          >
            <Landmark className="w-4 h-4 text-blue-600" />
            <span>FD Rate Tables</span>
          </Link>

          <Link
            href="/guide"
            id="nav-link-blog"
            className="px-3.5 py-2 rounded-xl transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 text-slate-700"
          >
            <span>Knowledge Base / Blog</span>
            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full">New</span>
          </Link>
        </nav>

        {/* Quick Accessibility & Senior Citizen Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Senior Citizen Toggle */}
          {onToggleSeniorCitizen && (
            <button
              onClick={() => onToggleSeniorCitizen(!isSeniorCitizen)}
              id="header-senior-toggle"
              className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 border shadow-2xs cursor-pointer ${
                isSeniorCitizen
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold ring-2 ring-amber-300/60'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Toggle between Senior Citizen (60+) rates and General citizen rates"
            >
              <Award className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSeniorCitizen ? 'text-slate-950' : 'text-amber-600'}`} />
              <span className="whitespace-nowrap hidden sm:inline">
                {isSeniorCitizen ? 'Senior Citizen (60+)' : 'General Rates'}
              </span>
              <span className="whitespace-nowrap sm:hidden text-[11px]">
                {isSeniorCitizen ? '60+ Senior' : 'General'}
              </span>
            </button>
          )}

          {/* Large Reading Font Mode Toggle for Seniors */}
          {onToggleLargeText && (
            <button
              onClick={onToggleLargeText}
              id="header-font-size-toggle"
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                isLargeText 
                  ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-200' 
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
              title="Toggle Large / Comfortable Reading Font for Senior Citizens"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono hidden sm:inline">{isLargeText ? 'A+ Large' : 'A Normal'}</span>
              <span className="text-[11px] font-mono sm:hidden">{isLargeText ? 'A+' : 'A'}</span>
            </button>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu with direct links to all dedicated pages */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>Deposit &amp; FD Directory</span>
            <span className="text-xs text-slate-500">Live Rates</span>
          </Link>
          
          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>ROI &amp; Yield Calculator</span>
            <span className="text-xs text-blue-600 font-bold">Sec 80TTB</span>
          </Link>

          <Link
            href="/pension-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>Monthly Cashflow Planner</span>
            <span className="text-xs text-slate-500">Retirement Payouts</span>
          </Link>

          <Link
            href="/compare-rates"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>Compare Rates &amp; Bonds</span>
            <span className="text-xs text-slate-500">Side-by-Side</span>
          </Link>

          <Link
            href="/tax-rules-80ttb"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>Deposit Rules &amp; 80TTB Guide</span>
            <span className="text-xs text-slate-500">DICGC &amp; Limits</span>
          </Link>

          <Link
            href="/fd-rates"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between text-slate-800 hover:bg-slate-50"
          >
            <span>Top Bank FD Rates Table</span>
            <span className="text-xs text-emerald-600 font-bold">Up to 9.50%</span>
          </Link>

          <Link
            href="/guide"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between hover:bg-slate-50 text-slate-800"
          >
            <span>Knowledge Base &amp; Blog</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">New</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {onToggleSeniorCitizen && (
              <button
                onClick={() => onToggleSeniorCitizen(!isSeniorCitizen)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-center border ${
                  isSeniorCitizen
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isSeniorCitizen ? '👴 Senior Citizen View (60+)' : 'Standard General View'}
              </button>
            )}
            {onOpenNewsletter && (
              <button
                onClick={onOpenNewsletter}
                className="w-full py-2 px-3 bg-blue-600 text-white rounded-xl text-xs font-semibold text-center"
              >
                Weekly Pulse
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
