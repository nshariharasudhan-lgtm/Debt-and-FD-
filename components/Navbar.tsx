'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { YieldNestLogo } from './YieldNestLogo';
import { 
  Landmark, 
  Calculator, 
  Menu, 
  X, 
  Award,
  Type,
  Scale,
  BookOpen
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
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Fixed Income Rates', icon: Landmark, exact: true },
    { href: '/calculator', label: 'Calculators', icon: Calculator },
    { href: '/compare-rates', label: 'Compare Rates', icon: Scale },
    { href: '/resources', label: 'Resources (Insights & Guides)', icon: BookOpen },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/90 shadow-2xs">
      
      {/* 1. TOP TIER: Center-Aligned Official Logo (Without the removed badge) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 border-b border-slate-100 flex items-center justify-between">
        
        {/* Left Side: Clean spacing spacer to guarantee perfect dead-center alignment */}
        <div className="hidden md:flex w-1/4" />

        {/* CENTER: Prominent Centered Brand Logo */}
        <div className="flex-1 flex justify-center items-center">
          <Link 
            href="/" 
            className="flex items-center justify-center group focus:outline-none"
            id="nav-brand-logo"
            aria-label="YIELDNEST.ONLINE - Return to Homepage"
          >
            <div 
              id="nav-logo-placeholder" 
              className="h-16 sm:h-18 md:h-20 w-64 sm:w-80 md:w-96 max-w-[75vw] flex items-center justify-center transition-all duration-200"
            >
              <YieldNestLogo 
                variant="full" 
                height={70} 
                priority={true} 
                className="w-full h-full flex items-center justify-center"
                imgClassName="object-center"
              />
            </div>
          </Link>
        </div>

        {/* Right Side: Senior Citizen & Accessibility Controls */}
        <div className="flex items-center justify-end gap-2 w-auto md:w-1/4 shrink-0">
          {/* Senior Citizen Toggle */}
          {onToggleSeniorCitizen && (
            <button
              onClick={() => onToggleSeniorCitizen(!isSeniorCitizen)}
              id="header-senior-toggle"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                isSeniorCitizen
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold ring-2 ring-amber-300/60'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Toggle between Senior Citizen (60+) rates and General citizen rates"
            >
              <Award className={`w-3.5 h-3.5 ${isSeniorCitizen ? 'text-slate-950' : 'text-amber-600'}`} />
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
              className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
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

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. LOWER TIER: Dedicated Tab Bar for Individual Pages (No scrollbar!) */}
      <div className="hidden md:flex justify-center bg-slate-50/70 border-t border-slate-100 px-4 py-1.5">
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/90 font-bold'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Navigate Pages
          </div>
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </span>
                {active && <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">Current</span>}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
