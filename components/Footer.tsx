'use client';

import React from 'react';
import Link from 'next/link';
import { YieldNestLogo } from './YieldNestLogo';
import { Landmark, ShieldAlert, Heart, ExternalLink, Award, FileCode, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-2">
            <div id="footer-logo-placeholder" className="bg-white/95 rounded-2xl p-4 sm:p-5 inline-flex items-center justify-start shadow-md w-72 sm:w-84 md:w-96 max-w-full">
              <YieldNestLogo variant="full" height={80} className="w-full h-auto" imgClassName="object-left" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              An independent fixed income intelligence and yield analytics portal dedicated to Indian Bank Fixed Deposits, Corporate FDs, RBI Floating Bonds, and Government Debt Instruments. Built for senior citizens and conservative investors seeking safe, predictable retirement cashflows.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="text-slate-400">DICGC Statutory Insurance Limits Disclosed</span>
              <span>&bull;</span>
              <span className="text-slate-400">Section 80TTB Tax Rules Explained</span>
              <span>&bull;</span>
              <span className="text-slate-400">RBI &amp; MOF Circulars Sourced</span>
            </div>
          </div>

          {/* Dedicated Deep Pages */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Dedicated Service Hubs</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <Link href="/senior-citizen-savings-scheme" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>SCSS 8.20% Government Scheme</span>
                </Link>
              </li>
              <li>
                <Link href="/fd-rates" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Bank FD Rates &amp; DICGC Matrix</span>
                </Link>
              </li>
              <li>
                <Link href="/rbi-floating-rate-bonds" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RBI Floating Rate Bonds (8.05%)</span>
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Research Blog &amp; Guides Hub</span>
                </Link>
              </li>
              <li>
                <a href="#author-methodology" className="hover:text-blue-400 transition-colors">
                  Editorial Independence &amp; Sourcing Standards
                </a>
              </li>
            </ul>
          </div>

          {/* AI Agents & Technical SEO */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">AI Agents &amp; Standards</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <a href="/api/mcp/tools" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>WebMCP Tool Registry (/api/mcp/tools)</span>
                </a>
              </li>
              <li>
                <a href="/llms.txt" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>LLM Context Brief (/llms.txt)</span>
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>LLM Full Spec (/llms-full.txt)</span>
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-blue-400 transition-colors">Sitemap (XML &amp; HTML)</a>
              </li>
              <li>
                <a href="/robots.txt" className="hover:text-blue-400 transition-colors">Robots.txt Crawler Rules</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Disclaimers */}
        <div className="border-t border-slate-800 pt-6 space-y-3 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-start gap-2 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Statutory Disclosure &amp; Disclaimer:</strong> The interest rates, yield metrics, and credit ratings displayed on this portal are gathered from public notifications by the Reserve Bank of India, Indian commercial banks, and credit rating agencies (CRISIL, ICRA, CARE). This website serves solely for educational, analytical, and informational purposes and does not constitute registered investment advice under SEBI (Investment Advisers) Regulations. Bank deposits are insured by DICGC up to ₹5,00,000 per depositor per bank. Corporate FDs are subject to corporate credit risk and are not insured by DICGC. Investors are advised to verify active card rates with their respective banks or issuers prior to booking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} YIELDNEST.ONLINE Debt Intelligence • Last Verified September 2026.
            </div>
            <div className="text-[11px] text-slate-500">
              Crafted for Indian Senior Citizens &amp; Fixed-Income Depositors • Independent Financial Research
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
