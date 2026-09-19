'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  HelpCircle,
  Clock,
  Building2,
  Percent,
  Check,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Form15HModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Form15HModal({ isOpen, onClose }: Form15HModalProps) {
  // Quick eligibility checklist state
  const [ageCheck, setAgeCheck] = useState<boolean>(true);
  const [residentCheck, setResidentCheck] = useState<boolean>(true);
  const [nilTaxCheck, setNilTaxCheck] = useState<boolean>(true);
  const [panLinkedCheck, setPanLinkedCheck] = useState<boolean>(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEligible = ageCheck && residentCheck && nilTaxCheck && panLinkedCheck;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-15h-modal-title"
    >
      {/* Click outside to close backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />

      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150 my-auto"
        id="form-15h-eligibility-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
          <div className="pr-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Tax Deducted at Source (TDS) Guidance</span>
            </div>
            <h2 id="form-15h-modal-title" className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-tight">
              Form 15H Eligibility & Zero-TDS Guide
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Statutory self-declaration under Section 197A(1C) of the Income Tax Act for Indian senior citizens.
            </p>
          </div>
          <button
            onClick={onClose}
            id="btn-close-form15h-modal"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 p-2 rounded-xl text-xl font-bold transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 divide-y divide-slate-100">
          {/* Executive Summary Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-950 text-sm">
                  What is Form 15H and why does it matter?
                </h3>
                <p className="text-amber-900/90 mt-1 leading-relaxed text-xs sm:text-sm">
                  Banks in India are mandated under <strong>Section 194A</strong> to deduct <strong>10% TDS</strong> if interest paid across all branches exceeds <strong>₹50,000 per financial year</strong> for senior citizens (₹40,000 for general depositors). 
                  If your estimated total tax liability is nil, submitting <strong>Form 15H</strong> legally instructs the bank not to deduct TDS, keeping your monthly or quarterly retirement cashflow intact.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 4-Point Eligibility Checker */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interactive Eligibility Checker
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Toggle checks to verify your status
              </span>
            </div>

            <div className="space-y-2">
              {/* Check 1: Age */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  ageCheck ? 'bg-slate-50/90 border-slate-300' : 'bg-red-50/40 border-red-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={ageCheck} 
                  onChange={(e) => setAgeCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    1. Age 60 years or older
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    You must be aged 60 or above at any time during the relevant financial year (FY 2025-26 / 2026-27). If under 60, Form 15G applies instead.
                  </span>
                </div>
              </label>

              {/* Check 2: Resident Status */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  residentCheck ? 'bg-slate-50/90 border-slate-300' : 'bg-red-50/40 border-red-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={residentCheck} 
                  onChange={(e) => setResidentCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    2. Resident Indian Individual
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    Only resident Indian individuals qualify. Non-Resident Indians (NRIs), OCIs, HUFs, and corporate entities are legally excluded.
                  </span>
                </div>
              </label>

              {/* Check 3: Nil Tax Liability */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  nilTaxCheck ? 'bg-slate-50/90 border-slate-300' : 'bg-red-50/40 border-red-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={nilTaxCheck} 
                  onChange={(e) => setNilTaxCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    3. Estimated final tax on total taxable income is NIL
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    Your calculated tax on total annual income must be ₹0 after accounting for <strong>Section 80TTB</strong> (up to ₹50,000 tax-free interest for seniors) and <strong>Section 87A rebate</strong> (zero tax up to ₹7 Lakhs taxable income under New Tax Regime).
                  </span>
                </div>
              </label>

              {/* Check 4: Valid PAN */}
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  panLinkedCheck ? 'bg-slate-50/90 border-slate-300' : 'bg-red-50/40 border-red-200'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={panLinkedCheck} 
                  onChange={(e) => setPanLinkedCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    4. Valid PAN registered and linked with Aadhaar
                  </span>
                  <span className="text-slate-500 block mt-0.5">
                    If your PAN is invalid or inoperative under Section 206AA, the bank is legally required to deduct TDS at <strong>20%</strong> instead of 10%.
                  </span>
                </div>
              </label>
            </div>

            {/* Verdict Box */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
              isEligible 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              {isEligible ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block text-emerald-900">You are eligible to submit Form 15H!</span>
                    <span className="text-emerald-800">You can submit Form 15H at each bank holding your deposits to receive 100% of your interest without TDS deductions.</span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block text-amber-900">Condition unmet for Form 15H</span>
                    <span className="text-amber-800">All 4 statutory criteria above must be satisfied. If you have taxable income, bank TDS will be deducted and can be adjusted when filing your ITR.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form 15H vs Form 15G Key Difference */}
          <div className="pt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Crucial Advantage: Form 15H vs Form 15G
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                    <th className="p-2.5">Statutory Condition</th>
                    <th className="p-2.5 text-blue-900 font-extrabold bg-blue-50/70">Form 15H (Senior 60+)</th>
                    <th className="p-2.5 text-slate-700">Form 15G (Under 60)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Age Requirement</td>
                    <td className="p-2.5 bg-blue-50/30 font-bold text-blue-950">60 years or older</td>
                    <td className="p-2.5 text-slate-600">Below 60 years</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Can Interest Exceed Basic Exemption?</td>
                    <td className="p-2.5 bg-blue-50/30 font-bold text-emerald-700">
                      YES! Permitted if final tax is ₹0
                    </td>
                    <td className="p-2.5 text-red-600 font-semibold">
                      NO (Strictly barred if interest exceeds basic exemption)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Bank TDS Exemption (Sec 194A)</td>
                    <td className="p-2.5 bg-blue-50/30 font-bold text-slate-900">Up to ₹50,000 / bank / year</td>
                    <td className="p-2.5 text-slate-600">Up to ₹40,000 / bank / year</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Tax Shield Section</td>
                    <td className="p-2.5 bg-blue-50/30 font-bold text-amber-900">Section 80TTB (₹50,000 deduction)</td>
                    <td className="p-2.5 text-slate-600">Section 80TTA (₹10,000 savings only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 italic leading-normal">
              *Note: Even if a senior citizen earns ₹3.5 Lakhs in annual FD interest, they can legitimately submit Form 15H as long as their total taxable income incurs zero final tax under Section 87A rebate and Section 80TTB deductions.
            </p>
          </div>

          {/* How & When to Submit Step-by-Step */}
          <div className="pt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              When & How to Submit Form 15H
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Best Timing</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Submit in the <strong>first week of April</strong> at the beginning of each financial year. If booking a new fixed deposit mid-year, submit Form 15H at the time of booking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Per-Bank Rule</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Form 15H must be submitted to <strong>each bank</strong> where you hold deposits exceeding the threshold. A submission at SBI does not cover deposits at HDFC or ICICI.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
              <h4 className="font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-700" />
                <span>Paperless 2-Minute Net Banking Steps</span>
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-blue-900/90 leading-relaxed">
                <li>Log in to your bank&apos;s Internet Banking or Mobile Banking app (SBI, HDFC, ICICI, etc.).</li>
                <li>Navigate to <strong>Service Requests &rarr; Tax Services &rarr; Submit Form 15G/15H</strong>.</li>
                <li>Select <strong>Form 15H</strong>, verify your auto-fetched PAN and address details.</li>
                <li>Enter your estimated total income and submit using OTP authentication. Download the acknowledgment receipt (UIN).</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <Link
            href="/guide/form-15g-form-15h-zero-tds-bank-fd-interest-guide"
            onClick={onClose}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Read Complete Form 15G/15H Statutory Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={onClose}
            id="btn-dismiss-form15h-modal"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Understood, Close
          </button>
        </div>
      </div>
    </div>
  );
}
