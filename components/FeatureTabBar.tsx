'use client';

import React from 'react';
import { 
  Building2, 
  Calculator, 
  Calendar, 
  Scale, 
  BookOpen, 
  LayoutGrid,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type FeatureTabKey = 'directory' | 'calculator' | 'pension' | 'compare' | 'guides' | 'all';

interface FeatureTabBarProps {
  activeTab: FeatureTabKey;
  onSelectTab: (tab: FeatureTabKey) => void;
  isLargeText?: boolean;
}

export function FeatureTabBar({
  activeTab,
  onSelectTab,
  isLargeText = false
}: FeatureTabBarProps) {
  const tabs: {
    id: FeatureTabKey;
    label: string;
    badge?: string;
    badgeColor?: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    {
      id: 'directory',
      label: 'Bank & Deposit Directory',
      badge: 'Live Rates',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Building2,
      description: 'Compare interest rates across scheduled commercial banks, small finance banks & sovereign bonds'
    },
    {
      id: 'calculator',
      label: 'ROI & Tax Calculator',
      badge: 'Sec 80TTB',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Calculator,
      description: 'Simulate compounding returns, inflation-adjusted purchasing power, and ₹50,000 senior tax savings'
    },
    {
      id: 'pension',
      label: 'Retirement Cashflow',
      badge: 'Monthly Pension',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Calendar,
      description: 'Plan steady monthly interest inflows using SCSS, RBI Floating Rate Bonds, and fixed deposits'
    },
    {
      id: 'compare',
      label: 'Compare Rates',
      icon: Scale,
      description: 'Side-by-side comparison of risk, credit ratings, DICGC insurance, and net returns'
    },
    {
      id: 'guides',
      label: 'Tax & Safety Guides',
      badge: 'DICGC & 15H',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: BookOpen,
      description: 'Learn statutory ₹5 Lakh insurance limits, TDS rules, and Form 15H submission guidelines'
    },
    {
      id: 'all',
      label: 'All Features',
      icon: LayoutGrid,
      description: 'View the complete portal on a single scrollable page'
    }
  ];

  const currentTabInfo = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 sm:p-3 mb-6">
      {/* Top Header Row for Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-2 pt-1 pb-2.5 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Portal Features &amp; Tools</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-600 font-medium hidden md:inline">
            Click any button below to view that dedicated tool
          </span>
        </div>

        {activeTab !== 'all' && (
          <button
            onClick={() => onSelectTab('all')}
            id="tab-view-all-shortcut-btn"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>View All on One Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Responsive Horizontal Tab Buttons */}
      <div 
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin touch-pan-x overscroll-x-contain w-full max-w-full" 
        role="tablist"
        aria-label="Website Feature Tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold ring-2 ring-slate-900/20'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200/90 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-blue-600'
              }`} />
              
              <span className={isLargeText ? 'text-sm' : 'text-xs'}>
                {tab.label}
              </span>

              {tab.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${
                  isActive 
                    ? 'bg-slate-800 text-amber-300 border-slate-700' 
                    : tab.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Informational Status Bar */}
      {activeTab !== 'all' && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold text-slate-900">Current View:</span>
            <span className="text-slate-700">{currentTabInfo.description}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tab {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length - 1}
          </div>
        </div>
      )}
    </div>
  );
}
