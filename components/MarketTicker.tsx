'use client';

import React from 'react';
import { MarketBenchmark } from '@/lib/debt-data';
import { ShieldCheck } from 'lucide-react';

interface MarketTickerProps {
  benchmarks: MarketBenchmark;
}

export function MarketTicker({ benchmarks }: MarketTickerProps) {
  return (
    <div className="w-full bg-slate-100/90 border-b border-slate-200/80 py-2 px-3 sm:px-6 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] tracking-wide uppercase shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Official Benchmarks:</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">RBI Repo Rate:</span>
            <span className="font-bold text-slate-900 font-mono">{benchmarks.rbiRepoRate.toFixed(2)}%</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">10Y Sovereign G-Sec:</span>
            <span className="font-bold text-slate-900 font-mono">{benchmarks.benchmarkGsec10Y.toFixed(2)}%</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Govt SCSS (60+):</span>
            <span className="font-bold text-blue-700 font-mono">{benchmarks.scssRate.toFixed(2)}%</span>
            <span className="text-[10px] bg-blue-100/80 text-blue-800 px-1 rounded font-semibold">Quarterly</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Top Senior Bank FD:</span>
            <span className="font-bold text-emerald-700 font-mono">{benchmarks.highestSfbFdRate.toFixed(2)}%</span>
            <span className="text-[10px] bg-emerald-100/80 text-emerald-800 px-1 rounded font-semibold flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> ₹5L Insured
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">RBI Floating Bonds:</span>
            <span className="font-bold text-slate-800 font-mono">{benchmarks.rbiFrsbRate.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
