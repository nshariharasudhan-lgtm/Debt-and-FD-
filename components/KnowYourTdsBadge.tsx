'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, FileText, ChevronRight, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface KnowYourTdsBadgeProps {
  onOpenModal: () => void;
  variant?: 'card-chip' | 'table-header' | 'banner' | 'inline';
  isSenior?: boolean;
}

export function KnowYourTdsBadge({
  onOpenModal,
  variant = 'card-chip',
  isSenior = true
}: KnowYourTdsBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (variant === 'banner') {
    return (
      <div className="w-full bg-gradient-to-r from-amber-50 via-blue-50/60 to-slate-50 border border-amber-200/90 rounded-xl p-3 sm:p-3.5 mb-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0 mt-0.5 sm:mt-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block sm:inline">
              Know your TDS on Interest:
            </span>{' '}
            <span className="text-slate-600">
              Banks deduct 10% TDS if interest &gt; ₹50,000 for Seniors (₹40,000 for General). Submit <strong>Form 15H</strong> to legally prevent TDS if your total tax is nil.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          id="banner-btn-form15h"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-700 font-bold border border-blue-200/90 shadow-2xs transition-colors cursor-pointer text-xs self-start sm:self-auto"
        >
          <span>Check Form 15H Eligibility</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (variant === 'table-header') {
    return (
      <div className="relative inline-block" ref={containerRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100/80 hover:bg-blue-200 text-blue-900 transition-colors cursor-pointer"
          title="Know your TDS & Form 15H Rules"
          aria-label="Know your TDS on interest rates"
          aria-expanded={isOpen}
        >
          <span>TDS</span>
          <HelpCircle className="w-3 h-3" />
        </button>

        {isOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-3.5 text-xs z-40 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Interest TDS (Sec 194A)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5"
                aria-label="Close tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed mb-2.5">
              Banks deduct 10% TDS on FD interest exceeding ₹50,000/yr (₹40,000 for regular depositors). Seniors with nil tax liability can submit Form 15H.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenModal();
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Form 15H Eligibility & Rules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default: 'card-chip' used next to interest rate fields in cards
  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100/90 hover:bg-amber-100 hover:text-amber-950 border border-slate-200/80 transition-all cursor-pointer whitespace-nowrap"
        aria-label="Know your TDS on this interest rate"
        aria-expanded={isOpen}
      >
        <span className="text-slate-500 font-semibold">TDS:</span>
        <span className="text-blue-700 font-bold">Know Rules</span>
        <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-amber-700" />
      </button>

      {isOpen && (
        <div 
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 sm:right-auto sm:left-0 top-full mt-1.5 w-64 sm:w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-3 text-xs z-30 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Know your TDS on Interest</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
            Banks deduct <strong>10% TDS</strong> if interest across branches exceeds <strong>₹50,000</strong> (Seniors) or <strong>₹40,000</strong> (General).
          </p>

          <div className="bg-amber-50/80 border border-amber-200/70 rounded-lg p-2 text-[10px] text-amber-900 mb-2.5">
            Eligible seniors with nil total tax liability can submit <strong>Form 15H</strong> to avoid TDS deductions entirely.
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenModal();
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
          >
            <span>Check Form 15H Eligibility</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
