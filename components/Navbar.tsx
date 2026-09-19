'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-2xs">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand identity */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group focus:outline-none shrink-0"
          id="nav-brand-logo"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-2xs font-bold text-lg sm:text-xl border border-blue-800 shrink-0">
            <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-serif block truncate">
              Bharat<span className="text-blue-700">Fixed</span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              RBI Insured Deposits & Sovereign Bonds
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('directory')}
            id="nav-link-directory"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer ${
              activeSection === 'directory' || activeSection === 'directory-section' ? 'text-blue-700 bg-blue-50/80 font-bold' : ''
            }`}
          >
            Bank & FD Directory
          </button>

          <button
            onClick={() => handleNavClick('calculator')}
            id="nav-link-calculator"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer ${
              activeSection === 'calculator' || activeSection === 'analytics-calculator-section' ? 'text-blue-700 bg-blue-50/80 font-bold' : ''
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>ROI Calculator</span>
          </button>

          <button
            onClick={() => handleNavClick('pension')}
            id="nav-link-planner"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer ${
              activeSection === 'pension' || activeSection === 'pension-planner-section' ? 'text-blue-700 bg-blue-50/80 font-bold' : ''
            }`}
          >
            Pension Planner
          </button>

          <button
            onClick={() => handleNavClick('compare')}
            id="nav-link-compare"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer ${
              activeSection === 'compare' || activeSection === 'comparison-section' ? 'text-blue-700 bg-blue-50/80 font-bold' : ''
            }`}
          >
            Compare Rates
          </button>

          <button
            onClick={() => handleNavClick('guides')}
            id="nav-link-guides"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer ${
              activeSection === 'guides' || activeSection === 'guides-section' ? 'text-blue-700 bg-blue-50/80 font-bold' : ''
            }`}
          >
            Rules &amp; 80TTB
          </button>

          <Link
            href="/guide"
            id="nav-link-blog"
            className="px-3 py-1.5 rounded-lg transition-colors hover:text-blue-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1 text-slate-600"
          >
            <span>Knowledge Base / Blog</span>
            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">New</span>
          </Link>
        </nav>

        {/* Quick Accessibility & Senior Citizen Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Senior Citizen Toggle */}
          {onToggleSeniorCitizen && (
            <button
              onClick={() => onToggleSeniorCitizen(!isSeniorCitizen)}
              id="header-senior-toggle"
              className={`px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 border shadow-2xs cursor-pointer ${
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
              className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
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
            className="xl:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('directory')}
            className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between cursor-pointer ${
              activeSection === 'directory' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Deposit & FD Directory</span>
            <span className="text-xs text-slate-500">All Banks & Corporates</span>
          </button>
          
          <button
            onClick={() => handleNavClick('calculator')}
            className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between cursor-pointer ${
              activeSection === 'calculator' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>ROI & Yield Calculator</span>
            <span className="text-xs text-blue-600 font-bold">Sec 80TTB</span>
          </button>

          <button
            onClick={() => handleNavClick('pension')}
            className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between cursor-pointer ${
              activeSection === 'pension' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Monthly Cashflow Planner</span>
            <span className="text-xs text-slate-500">Retirement Payouts</span>
          </button>

          <button
            onClick={() => handleNavClick('compare')}
            className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between cursor-pointer ${
              activeSection === 'compare' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Compare Rates & Bonds</span>
            <span className="text-xs text-slate-500">Side-by-Side</span>
          </button>

          <button
            onClick={() => handleNavClick('guides')}
            className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-between cursor-pointer ${
              activeSection === 'guides' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Deposit Rules & 80TTB FAQs</span>
            <span className="text-xs text-slate-500">DICGC & Limits</span>
          </button>

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
