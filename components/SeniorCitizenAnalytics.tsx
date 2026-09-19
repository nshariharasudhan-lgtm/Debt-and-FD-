'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { calculateDebtReturns, formatINR, formatCompactINR } from '@/lib/debt-calculations';
import { DebtInstrument } from '@/lib/debt-data';
import { 
  Calculator, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  Percent, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Clock
} from 'lucide-react';

interface SeniorAnalyticsProps {
  selectedInstrument: DebtInstrument | null;
  isSeniorCitizen: boolean;
  onToggleSeniorCitizen: (isSenior: boolean) => void;
  isLargeText?: boolean;
}

export function SeniorCitizenAnalytics({
  selectedInstrument,
  isSeniorCitizen,
  onToggleSeniorCitizen,
  isLargeText = false
}: SeniorAnalyticsProps) {
  // Input states
  const [principal, setPrincipal] = useState<number>(500000); // ₹5,00,000 default
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 Years default
  const [interestRate, setInterestRate] = useState<number>(8.20); // Default to SCSS
  const [payoutMode, setPayoutMode] = useState<'cumulative' | 'monthly' | 'quarterly' | 'annual'>('cumulative');
  const [taxBracket, setTaxBracket] = useState<number>(0.10); // 10% tax slab
  const [inflationRate, setInflationRate] = useState<number>(5.10); // Latest CPI inflation benchmark
  const [hasForm15H, setHasForm15H] = useState<boolean>(true);
  const [instrumentType, setInstrumentType] = useState<'bank_fd' | 'corporate_fd' | 'rbi_govt' | 'ncd_bond'>('bank_fd');
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  // Sync with selected instrument when passed from directory
  useEffect(() => {
    if (selectedInstrument) {
      queueMicrotask(() => {
        setInterestRate(isSeniorCitizen ? selectedInstrument.seniorCitizenRate : selectedInstrument.generalRate);
        setInstrumentType(selectedInstrument.type);
        if (selectedInstrument.type === 'rbi_govt' && selectedInstrument.id === 'scss-govt') {
          setTenureYears(5);
          setPayoutMode('quarterly');
        } else if (selectedInstrument.payoutFrequency.includes('cumulative')) {
          setPayoutMode('cumulative');
        } else if (selectedInstrument.payoutFrequency.includes('monthly')) {
          setPayoutMode('monthly');
        }
        if (selectedInstrument.minInvestment) {
          setPrincipal(prev => Math.max(prev, selectedInstrument.minInvestment || 0));
        }
      });
    }
  }, [selectedInstrument, isSeniorCitizen]);

  // Toggle senior citizen mode
  const handleSeniorToggle = (senior: boolean) => {
    onToggleSeniorCitizen(senior);
    if (selectedInstrument) {
      setInterestRate(senior ? selectedInstrument.seniorCitizenRate : selectedInstrument.generalRate);
    } else {
      setInterestRate(prev => senior ? Number((prev + 0.50).toFixed(2)) : Math.max(4, Number((prev - 0.50).toFixed(2))));
    }
  };

  // Perform calculations (memoized to prevent performance bottlenecks)
  const calcResult = useMemo(() => calculateDebtReturns({
    principal,
    tenureYears,
    interestRate,
    isSeniorCitizen,
    payoutMode,
    taxBracket,
    inflationRate,
    instrumentType,
    hasSubmitted15H: hasForm15H
  }), [principal, tenureYears, interestRate, isSeniorCitizen, payoutMode, taxBracket, inflationRate, instrumentType, hasForm15H]);

  return (
    <section id="analytics-calculator-section" className="scroll-mt-24 py-4 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Section Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4 text-blue-700" />
                <span>Verified Return &amp; Tax Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                Fixed Deposit &amp; Bond Return Calculator
              </h2>
              <p className="text-slate-700 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
                Calculate quarterly compounding, periodic pension payouts, annual Section 80TTB tax deductions, and inflation-adjusted real purchasing power.
              </p>
            </div>

            {/* Senior Mode Toggle Controls */}
            <div className="bg-white p-1 rounded-xl border border-slate-300 flex items-center gap-1 self-start md:self-auto shadow-2xs">
              <button
                onClick={() => handleSeniorToggle(false)}
                id="calc-regular-toggle"
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  !isSeniorCitizen 
                    ? 'bg-slate-900 text-white shadow-xs font-bold' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                General (&lt;60)
              </button>
              <button
                onClick={() => handleSeniorToggle(true)}
                id="calc-senior-toggle"
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSeniorCitizen 
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs' 
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Senior Citizen (60+)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 w-full max-w-full overflow-hidden">
          
          {/* Controls Panel (Left, 5 cols) */}
          <div className="lg:col-span-5 min-w-0 p-4 sm:p-7 space-y-6 bg-slate-50/40">
            
            {/* Selected Scheme Banner */}
            {selectedInstrument && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <span className="text-blue-800 block text-xs uppercase font-bold">Selected Scheme</span>
                  <span className="font-bold text-slate-900 text-base">{selectedInstrument.name}</span>
                </div>
                <span className="font-mono font-extrabold text-blue-900 text-lg">
                  {(isSeniorCitizen ? selectedInstrument.seniorCitizenRate : selectedInstrument.generalRate).toFixed(2)}%
                </span>
              </div>
            )}

            {/* Principal Investment Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="calc-principal-slider" className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Deposit Amount (Principal)
                </label>
                <span className="font-mono text-xl font-extrabold text-blue-950">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                id="calc-principal-slider"
                type="range"
                min={25000}
                max={5000000}
                step={25000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                aria-label="Deposit Principal Amount"
                className="w-full accent-blue-700 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 text-xs">
                {[100000, 500000, 1500000, 3000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPrincipal(preset)}
                    className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer text-xs ${
                      principal === preset
                        ? 'bg-blue-700 text-white border-blue-700 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
                    }`}
                  >
                    {preset === 3000000 ? '₹30L (Govt SCSS Cap)' : formatCompactINR(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Interest Rate */}
              <div>
                <label htmlFor="calc-rate-input" className="block text-sm font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Interest Rate (% p.a.)
                </label>
                <div className="relative">
                  <input
                    id="calc-rate-input"
                    type="number"
                    step="0.05"
                    min="4"
                    max="15"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full min-h-[44px] py-2 px-3 text-base font-bold font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">%</span>
                </div>
                {/* Rate Presets */}
                <div className="flex flex-wrap gap-1 mt-2 text-xs">
                  {[
                    { label: 'SBI 7.75%', val: 7.75 },
                    { label: 'RBI 8.05%', val: 8.05 },
                    { label: 'SCSS 8.20%', val: 8.20 },
                    { label: 'Unity 9.40%', val: 9.40 }
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setInterestRate(p.val)}
                      className="px-2 py-1 rounded bg-slate-200 hover:bg-blue-700 hover:text-white text-slate-800 font-mono font-medium transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Years */}
              <div>
                <label htmlFor="calc-tenure-select" className="block text-sm font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Tenure
                </label>
                <select
                  id="calc-tenure-select"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full min-h-[44px] py-2 px-3 text-sm font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value={1}>1 Year (12 Months)</option>
                  <option value={2}>2 Years (24 Months)</option>
                  <option value={3}>3 Years (36 Months)</option>
                  <option value={4}>4 Years (48 Months)</option>
                  <option value={5}>5 Years (60 Months - SCSS)</option>
                  <option value={7}>7 Years (RBI Floating Bond)</option>
                  <option value={10}>10 Years (Benchmark G-Sec)</option>
                </select>
                <span className="text-xs text-slate-500 block mt-1">
                  Full annual financial years modeled
                </span>
              </div>
            </div>

            {/* Payout Frequency Mode */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-slate-800 block mb-2">
                Payout Frequency Mode
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setPayoutMode('cumulative')}
                  id="mode-cumulative-btn"
                  className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMode === 'cumulative'
                      ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">Cumulative</span>
                  <span className="text-xs opacity-90">Compounded Qtly</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMode('monthly')}
                  id="mode-monthly-btn"
                  className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMode === 'monthly'
                      ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">Monthly</span>
                  <span className="text-xs opacity-90">Monthly Inflow</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMode('quarterly')}
                  id="mode-quarterly-btn"
                  className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payoutMode === 'quarterly'
                      ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold">Quarterly</span>
                  <span className="text-xs opacity-90">SCSS Standard</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {payoutMode === 'cumulative' 
                  ? 'Interest is reinvested quarterly and paid out in a lump sum at tenure end.' 
                  : 'Interest is credited directly into your bank account periodically. Principal is returned intact at tenure end.'}
              </p>
            </div>

            {/* Income Tax Slab & Section 80TTB */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Investor Tax Bracket
                </label>
                <span className="text-xs text-slate-600 font-medium">+4% Cess Included</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
                {[
                  { label: '0% (Nil)', val: 0 },
                  { label: '10%', val: 0.10 },
                  { label: '20%', val: 0.20 },
                  { label: '30%', val: 0.30 }
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTaxBracket(item.val)}
                    className={`min-h-[42px] py-2 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                      taxBracket === item.val
                        ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Form 15H / 15G Selection */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="form-15h-checkbox"
                    checked={hasForm15H}
                    onChange={(e) => setHasForm15H(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                  />
                  <label htmlFor="form-15h-checkbox" className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Submitted Form 15H (Senior 60+) / Form 15G
                  </label>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  Prevents 10% TDS withholding at source under Section 194A. Note: Submitting Form 15H does not erase your statutory tax liability if your total taxable income exceeds the exemption slab.
                </p>
              </div>
            </div>

            {/* Expected CPI Inflation */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="calc-inflation-slider" className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Expected CPI Inflation Rate
                </label>
                <span className="font-mono text-sm font-bold text-slate-900">{inflationRate}%</span>
              </div>
              <input
                id="calc-inflation-slider"
                type="range"
                min={3}
                max={9}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full accent-slate-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-600 block mt-1">
                Used to compute the real inflation-adjusted return via the Fisher equation.
              </span>
            </div>

          </div>

          {/* Results Panel (Right, 7 cols) */}
          <div className="lg:col-span-7 min-w-0 p-4 sm:p-8 space-y-6 bg-white w-full max-w-full overflow-hidden">
            
            {/* 4 Distinct Yield Metric Cards (Checklist Requirement 6) */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Yield &amp; Return Metrics (Audited &amp; Standardized)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. Annual Nominal Interest Rate */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase block">1. Annual Rate</span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-0.5">
                    {calcResult.annualNominalRate.toFixed(2)}%
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Nominal Card Rate</span>
                </div>

                {/* 2. Effective Annual Yield (APY) */}
                <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">2. Effective Yield</span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-blue-900 mt-0.5">
                    {calcResult.effectiveAnnualYield.toFixed(2)}%
                  </div>
                  <span className="text-[11px] text-blue-700 block mt-0.5">
                    {payoutMode === 'cumulative' ? 'Quarterly APY' : 'Payout APY'}
                  </span>
                </div>

                {/* 3. Post-Tax Annualized Return */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">3. Post-Tax CAGR</span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-900 mt-0.5">
                    {calcResult.postTaxAnnualizedReturn.toFixed(2)}%
                  </div>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">After 80TTB &amp; Tax</span>
                </div>

                {/* 4. Inflation-Adjusted Real Return */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase block">4. Real Return</span>
                  <div className={`text-lg sm:text-xl font-bold font-mono mt-0.5 ${
                    calcResult.inflationAdjustedAnnualReturn >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {calcResult.inflationAdjustedAnnualReturn > 0 ? '+' : ''}
                    {calcResult.inflationAdjustedAnnualReturn.toFixed(2)}%
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Fisher Real Return</span>
                </div>

              </div>
            </div>

            {/* Primary Return Display Banner */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {payoutMode === 'cumulative' 
                      ? 'Total Maturity Corpus (At Tenure End)' 
                      : 'Periodic Pension Cash Flow'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white mt-1">
                    {payoutMode === 'cumulative'
                      ? formatINR(calcResult.netMaturityAmount)
                      : `${formatINR(calcResult.monthlyPayoutAmount)} / month`}
                  </div>
                  <span className="text-xs text-slate-300 block mt-1">
                    {payoutMode === 'cumulative'
                      ? `Includes original principal of ${formatINR(calcResult.principal)} plus net compounded interest.`
                      : `Principal of ${formatINR(calcResult.principal)} returned intact at tenure end.`}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold">Total Cash Inflow</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {formatINR(calcResult.totalCashRealized)}
                  </div>
                  <span className="text-xs text-slate-400">Principal + Net Interest</span>
                </div>
              </div>

              {/* Tax & Deduction Details Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Total Gross Interest</span>
                  <span className="font-extrabold text-white font-mono text-sm sm:text-base">
                    {formatINR(calcResult.totalGrossInterest)}
                  </span>
                </div>

                <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/60">
                  <span className="text-amber-400 block text-[11px] uppercase font-bold">Sec 80TTB Tax Relief</span>
                  <span className="font-extrabold text-amber-300 font-mono text-sm sm:text-base">
                    {formatINR(calcResult.section80ttbExemption)}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Total Tax Liability</span>
                  <span className="font-extrabold text-slate-200 font-mono text-sm sm:text-base">
                    {formatINR(calcResult.totalTaxLiability)}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Net Post-Tax Interest</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm sm:text-base">
                    {formatINR(calcResult.netPostTaxInterest)}
                  </span>
                </div>
              </div>
            </div>

            {/* Senior Citizen Advantage Callout */}
            {isSeniorCitizen && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="font-bold text-emerald-950 text-base">
                    Senior Citizen Advantage: +{formatINR(calcResult.seniorAdvantage.totalNetAdvantage)} Extra Realized
                  </span>
                </div>
                <p className="text-emerald-900 leading-relaxed pl-7">
                  Compared to an investor under 60 with the same deposit, you gain an extra <strong>+{formatINR(calcResult.seniorAdvantage.interestGainFromRateSpread)}</strong> from the +0.50% interest rate bonus and save <strong>+{formatINR(calcResult.seniorAdvantage.taxSavedFrom80TTB)}</strong> in income taxes via Section 80TTB deductions.
                </p>
              </div>
            )}

            {/* Annual Breakdown Table (Reconciled to the Last Rupee) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm w-full max-w-full">
              <div className="bg-slate-100 px-3.5 sm:px-4 py-2.5 sm:py-3 font-bold text-slate-900 flex flex-wrap justify-between items-center gap-1 border-b border-slate-200">
                <span>Annual Cashflow &amp; Tax Breakdown (Reconciled)</span>
                <span className="text-xs font-normal text-slate-600">All values in INR (₹)</span>
              </div>
              <div className="sm:hidden px-3 py-1 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 flex justify-between">
                <span>Swipe table horizontally to view all columns</span>
                <span>&rarr;</span>
              </div>
              <div className="overflow-x-auto touch-pan-x overscroll-x-contain w-full max-w-full">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Gross Interest</th>
                      <th className="py-2.5 px-3">80TTB Deduction</th>
                      <th className="py-2.5 px-3">Tax Liability</th>
                      <th className="py-2.5 px-3">Net Interest</th>
                      <th className="py-2.5 px-3">
                        {payoutMode === 'cumulative' ? 'Cumulative Corpus' : 'Principal Returned'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-xs">
                    {calcResult.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Year {row.year}</td>
                        <td className="py-2.5 px-3 font-bold">{formatINR(row.grossInterest)}</td>
                        <td className="py-2.5 px-3 text-amber-800">
                          {row.section80ttbDeduction > 0 ? `-${formatINR(row.section80ttbDeduction)}` : '₹0'}
                        </td>
                        <td className="py-2.5 px-3 text-rose-800">
                          {row.taxLiability > 0 ? formatINR(row.taxLiability) : '₹0'}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-800 font-bold">{formatINR(row.netInterest)}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-900">
                          {payoutMode === 'cumulative' ? formatINR(row.yearEndBalance) : `${formatINR(row.yearEndBalance)} + periodic`}
                        </td>
                      </tr>
                    ))}
                    {/* Reconciled Totals Row */}
                    <tr className="bg-slate-100/80 font-bold text-slate-950 border-t-2 border-slate-300">
                      <td className="py-3 px-3 font-sans">Total ({calcResult.tenureYears} Yrs)</td>
                      <td className="py-3 px-3">{formatINR(calcResult.totalGrossInterest)}</td>
                      <td className="py-3 px-3 text-amber-900">{formatINR(calcResult.section80ttbExemption)}</td>
                      <td className="py-3 px-3 text-rose-900">{formatINR(calcResult.totalTaxLiability)}</td>
                      <td className="py-3 px-3 text-emerald-900">{formatINR(calcResult.netPostTaxInterest)}</td>
                      <td className="py-3 px-3 text-blue-950 font-extrabold">{formatINR(calcResult.totalCashRealized)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchasing Power Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">
                  Inflation-Adjusted Purchasing Power
                </span>
                <p className="text-slate-600 text-xs leading-relaxed max-w-md">
                  Accounting for {inflationRate}% CPI inflation over {tenureYears} years, your total cash realization of {formatINR(calcResult.totalCashRealized)} will possess the equivalent purchasing power today of:
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <div className="font-mono font-extrabold text-slate-950 text-xl">
                  {formatINR(calcResult.effectivePurchasingPower)}
                </div>
                <span className="text-xs text-slate-500">In present-day value</span>
              </div>
            </div>

            {/* Expandable Assumptions & Methodology Section */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowMethodology(!showMethodology)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-slate-900 text-sm">
                    Assumptions &amp; Calculation Methodology
                  </span>
                </div>
                {showMethodology ? (
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {showMethodology && (
                <div className="p-5 text-xs sm:text-sm text-slate-700 bg-white space-y-4 border-t border-slate-200 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">1. Compounding Convention (RBI Norms)</h4>
                    <p>
                      Indian Scheduled Commercial Banks and NBFCs follow quarterly compounding for cumulative deposits: <code>A = P &times; (1 + r/4)^(4t)</code>. In monthly or quarterly payout modes, interest is paid periodically and not compounded into principal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">2. Section 80TTB Annual Evaluation</h4>
                    <p>
                      Under Section 80TTB of the Income Tax Act 1961, resident senior citizens (aged 60+) can deduct up to ₹50,000 of interest earned from banks and post office deposits. This deduction applies <strong>per financial year (April 1 to March 31)</strong> and cannot be pooled or carried forward across multi-year tenures. Corporate FDs and NBFC deposits are excluded from Section 80TTB.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">3. Fisher Real Return Equation</h4>
                    <p>
                      Inflation-adjusted returns are calculated strictly using the exact Fisher equation: <code>(1 + Nominal Post-Tax Return) / (1 + CPI Inflation) - 1</code>, where rates are expressed as decimals.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">4. Form 15H vs. Tax Liability</h4>
                    <p>
                      Submitting Form 15H waives Tax Deducted at Source (TDS) under Section 194A (threshold ₹50,000 for seniors in banks). However, submitting Form 15H does not exempt an investor from final tax liability if their total annual income exceeds the basic tax exemption limit.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">5. Statutory Health &amp; Education Cess</h4>
                    <p>
                      All income tax slab computations include the mandatory 4% Health &amp; Education Cess enacted under the Finance Act.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
