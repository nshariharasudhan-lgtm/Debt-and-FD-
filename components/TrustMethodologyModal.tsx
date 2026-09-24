'use client';

import React from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Scale, 
  FileText, 
  Calendar, 
  AlertCircle, 
  ExternalLink,
  Award,
  Building2
} from 'lucide-react';

interface TrustMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrustMethodologyModal({ isOpen, onClose }: TrustMethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-modal-title"
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>YIELDNEST Editorial Independence & Verification Policy</span>
          </div>

          <h2 id="trust-modal-title" className="text-xl sm:text-2xl font-bold font-serif text-white">
            How We Verify Rates & Maintain 100% Unbiased Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Guaranteed transparency for Indian depositors and senior citizens. No sponsored ranking bias.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* Pillar 1: Daily Direct Scraping & Bank Circulars */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>Daily Primary Source Rate Tracking</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Updated Daily</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We track rate schedules directly from official bank websites, RBI notifications, and public gazettes. Rates are not sourced from third-party broker feeds or affiliate aggregators. Each rate entry cites the exact effective circular date.
              </p>
            </div>
          </div>

          {/* Pillar 2: DICGC Deposit Insurance Verification */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>Statutory DICGC Insurance Auditing (₹5 Lakhs/Bank)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Under Section 16(1) of the DICGC Act 1961, all Scheduled Commercial Banks, Public Sector Banks, and Small Finance Banks carry identical sovereign insurance protection up to ₹5,00,000 per depositor. We verify each institution’s scheduled bank status against RBI’s Second Schedule.
              </p>
            </div>
          </div>

          {/* Pillar 3: Editorial Independence & Zero Bias */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>Strict Editorial Independence (Zero Paid Placement)</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">100% Unbiased</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Banks cannot pay to appear higher in our rankings or tables. Sorting is mathematically deterministic based strictly on annual percentage yield (APY), credit rating safety, or tenure. No sponsored products skew the results.
              </p>
            </div>
          </div>

          {/* Pillar 4: Senior Citizen Tax Modeling (Sec 80TTB & Form 15H) */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 font-bold text-sm">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>Tailored Senior Citizen Yield Calculations</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                All returns account for quarterly compounding conventions followed by Indian scheduled banks. For senior citizens (60+), our calculators model the ₹50,000 exemption under Section 80TTB and provide actionable Form 15H guidance to eliminate unnecessary 10% TDS deductions.
              </p>
            </div>
          </div>

          {/* Statutory Disclaimer Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Statutory Investor Notice</span>
            </div>
            <p className="leading-relaxed">
              YIELDNEST is an independent analytical research portal and does not collect deposits or issue financial products. Always verify final terms on the issuing bank or post office application form before remitting funds.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Standard: RBI Master Circular FIDD.MSME & DICGC 2026</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            I Understand — View Rates
          </button>
        </div>

      </div>
    </div>
  );
}
