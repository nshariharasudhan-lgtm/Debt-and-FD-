// Comprehensive Indian Debt Instrument Financial Mathematics
// Implements RBI Quarterly Compounding, Section 80TTB Annual Allocation, and Fisher Real Return

export interface CalculationInput {
  principal: number; // in INR
  tenureYears: number; // e.g. 1, 2, 3, 5, 7, 10
  interestRate: number; // annual percentage e.g. 8.20
  isSeniorCitizen: boolean;
  payoutMode: 'cumulative' | 'monthly' | 'quarterly' | 'annual';
  taxBracket: number; // 0, 0.05, 0.10, 0.15, 0.20, 0.30
  inflationRate: number; // e.g. 5.10
  instrumentType: 'bank_fd' | 'corporate_fd' | 'rbi_govt' | 'ncd_bond';
  hasSubmitted15H?: boolean;
}

export interface AnnualBreakdownRow {
  year: number;
  grossInterest: number; // Interest earned specifically in this year
  cumulativeGrossInterest: number; // Running total of gross interest
  section80ttbDeduction: number; // 80TTB deduction applied for this specific FY (capped at ₹50k for seniors)
  taxableInterest: number; // Taxable interest in this FY
  taxLiability: number; // Income tax + 4% cess in this FY
  netInterest: number; // Net post-tax interest in this FY
  cumulativeNetInterest: number; // Running total of net post-tax interest
  yearEndBalance: number; // Cumulative corpus or Principal returned
  totalPeriodicPayoutReceived?: number; // Total periodic payouts accumulated
}

export interface CalculationResult {
  principal: number;
  tenureYears: number;
  payoutMode: 'cumulative' | 'monthly' | 'quarterly' | 'annual';
  
  // Principal and Payout amounts
  maturityPrincipalReturned: number; // Principal returned at tenure end
  totalGrossInterest: number; // Total interest earned across all years
  annualGrossInterest: number; // Average annual gross interest
  monthlyPayoutAmount: number; // If monthly payout mode
  quarterlyPayoutAmount: number; // If quarterly payout mode
  totalPeriodicPayoutsPaid: number; // Total interest paid out periodically during tenure
  
  // Tax metrics (calculated Financial Year by Financial Year)
  section80ttbExemption: number; // Sum of annual 80TTB deductions across tenure
  taxableInterest: number; // Sum of taxable interest across tenure
  totalTaxLiability: number; // Total income tax liability (including 4% cess)
  netPostTaxInterest: number; // totalGrossInterest - totalTaxLiability
  totalCashRealized: number; // Principal + netPostTaxInterest
  netMaturityAmount: number; // Net check at maturity (Principal + Net Interest for cumulative, Principal for payout)
  tdsDeducted: number; // TDS withheld at source (0 if Form 15H submitted)
  
  // 4 Distinct Yield Metrics (Audited & Disclosed)
  annualNominalRate: number; // Declared card rate (e.g. 8.20% p.a.)
  effectiveAnnualYield: number; // Pre-tax annualized APY (e.g. 8.46% for quarterly compounding)
  postTaxAnnualizedReturn: number; // Post-tax CAGR / annualized return
  inflationAdjustedAnnualReturn: number; // Real return using Fisher equation: (1 + postTax) / (1 + inflation) - 1
  
  // Real Purchasing Power
  effectivePurchasingPower: number; // Present purchasing power of total cash realized
  
  // Year-by-year reconciliation table
  yearlyBreakdown: AnnualBreakdownRow[];
  
  // Senior citizen advantage breakdown
  seniorAdvantage: {
    eligible: boolean;
    rateSpreadPercent: number;
    interestGainFromRateSpread: number;
    taxSavedFrom80TTB: number;
    totalNetAdvantage: number;
  };
}

/**
 * Calculates Indian Fixed Deposit & Bond yields strictly following RBI & Indian Income Tax Act norms.
 * Reconciles annual breakdowns Financial Year by Financial Year.
 */
export function calculateDebtReturns(input: CalculationInput): CalculationResult {
  const {
    principal,
    tenureYears,
    interestRate,
    isSeniorCitizen,
    payoutMode,
    taxBracket,
    inflationRate,
    instrumentType,
    hasSubmitted15H = false
  } = input;

  const r = interestRate / 100;
  const t = Math.max(1, Math.round(tenureYears)); // Model discrete full financial years for reconciliation
  const effectiveTaxRate = taxBracket * 1.04; // Standard Indian Income Tax includes 4% Health & Education Cess

  const yearlyBreakdown: AnnualBreakdownRow[] = [];
  let cumulativeGrossInterest = 0;
  let cumulativeNetInterest = 0;
  let totalGrossInterest = 0;
  let totalTaxLiability = 0;
  let total80ttbExemption = 0;

  // Monthly and quarterly periodic cash flows
  const monthlyPayoutAmount = (principal * r) / 12;
  const quarterlyPayoutAmount = (principal * r) / 4;
  const annualPayoutAmount = principal * r;

  for (let yr = 1; yr <= t; yr++) {
    let yearGrossInterest = 0;

    if (payoutMode === 'cumulative') {
      // RBI Standard Quarterly Compounding Convention:
      // A_yr = P * (1 + r/4)^(4 * yr)
      // Interest accrued in Year yr = A_yr - A_(yr-1)
      const balanceEndPrev = principal * Math.pow(1 + r / 4, 4 * (yr - 1));
      const balanceEndCurr = principal * Math.pow(1 + r / 4, 4 * yr);
      yearGrossInterest = balanceEndCurr - balanceEndPrev;
    } else if (payoutMode === 'monthly') {
      yearGrossInterest = monthlyPayoutAmount * 12;
    } else if (payoutMode === 'quarterly') {
      yearGrossInterest = quarterlyPayoutAmount * 4;
    } else {
      yearGrossInterest = annualPayoutAmount;
    }

    // Section 80TTB Tax Exemption:
    // In India, Section 80TTB applies per Financial Year (capped at ₹50,000 per FY)
    // Only available to resident senior citizens (60+) on deposits with Banks and Post Offices.
    // Corporate FDs and market NCDs are NOT eligible for Section 80TTB.
    let year80ttbDeduction = 0;
    if (isSeniorCitizen && (instrumentType === 'bank_fd' || instrumentType === 'rbi_govt')) {
      year80ttbDeduction = Math.min(yearGrossInterest, 50000);
    }

    const yearTaxableInterest = Math.max(0, yearGrossInterest - year80ttbDeduction);
    const yearTax = yearTaxableInterest * effectiveTaxRate;
    const yearNetInterest = yearGrossInterest - yearTax;

    cumulativeGrossInterest += yearGrossInterest;
    cumulativeNetInterest += yearNetInterest;
    totalGrossInterest += yearGrossInterest;
    totalTaxLiability += yearTax;
    total80ttbExemption += year80ttbDeduction;

    const yearEndBalance = (payoutMode === 'cumulative')
      ? principal + cumulativeGrossInterest
      : principal;

    yearlyBreakdown.push({
      year: yr,
      grossInterest: Math.round(yearGrossInterest),
      cumulativeGrossInterest: Math.round(cumulativeGrossInterest),
      section80ttbDeduction: Math.round(year80ttbDeduction),
      taxableInterest: Math.round(yearTaxableInterest),
      taxLiability: Math.round(yearTax),
      netInterest: Math.round(yearNetInterest),
      cumulativeNetInterest: Math.round(cumulativeNetInterest),
      yearEndBalance: Math.round(yearEndBalance),
      totalPeriodicPayoutReceived: payoutMode !== 'cumulative' ? Math.round(cumulativeGrossInterest) : undefined
    });
  }

  const netPostTaxInterest = totalGrossInterest - totalTaxLiability;
  const totalPeriodicPayoutsPaid = payoutMode === 'cumulative' ? 0 : totalGrossInterest;
  const maturityPrincipalReturned = principal;
  const totalCashRealized = principal + netPostTaxInterest;
  const netMaturityAmount = payoutMode === 'cumulative'
    ? principal + netPostTaxInterest
    : principal;

  // TDS Withholding logic:
  // Under Section 194A, banks deduct 10% TDS if annual interest exceeds ₹50,000 (seniors) or ₹40,000 (general).
  // Submitting Form 15H / 15G waives the TDS withholding (tdsDeducted = 0),
  // but does NOT alter the statutory tax liability.
  const annualTdsThreshold = instrumentType === 'corporate_fd'
    ? 5000
    : (isSeniorCitizen ? 50000 : 40000);
  const avgAnnualInterest = totalGrossInterest / t;
  let tdsDeducted = 0;
  if (!hasSubmitted15H && avgAnnualInterest > annualTdsThreshold && taxBracket > 0) {
    tdsDeducted = Math.round(totalGrossInterest * 0.10);
  }

  // --- The 4 Distinct Yield Metrics ---
  // 1. Annual Nominal Interest Rate
  const annualNominalRate = interestRate;

  // 2. Effective Annual Pre-Tax Yield (APY):
  // For quarterly compounding cumulative: (1 + r/4)^4 - 1
  // For periodic payout modes: equals nominal rate because interest is withdrawn periodically.
  const effectiveAnnualYield = payoutMode === 'cumulative'
    ? (Math.pow(1 + r / 4, 4) - 1) * 100
    : annualNominalRate;

  // 3. Post-Tax Annualized Return (Post-Tax CAGR):
  // For cumulative: ((Principal + Net Interest) / Principal)^(1/t) - 1
  // For payout: Net Interest / (Principal * t)
  const postTaxAnnualizedReturn = payoutMode === 'cumulative'
    ? (Math.pow((principal + netPostTaxInterest) / principal, 1 / t) - 1) * 100
    : (netPostTaxInterest / (principal * t)) * 100;

  // 4. Inflation-Adjusted Annual Return (Real Return):
  // Calculated using the Fisher Equation: (1 + Nominal Post-Tax Return) / (1 + Inflation) - 1
  const nominalPostTaxDec = postTaxAnnualizedReturn / 100;
  const inflationDec = inflationRate / 100;
  const inflationAdjustedAnnualReturn = ((1 + nominalPostTaxDec) / (1 + inflationDec) - 1) * 100;

  // Real purchasing power of total cash realized at maturity
  const effectivePurchasingPower = Math.round(totalCashRealized / Math.pow(1 + inflationDec, t));

  // --- Senior Citizen Advantage Calculation ---
  // Compare against an equivalent non-senior investor:
  // - Receives (interestRate - 0.50)% interest
  // - Receives ₹0 Section 80TTB deduction
  // - Same principal, tenure, and tax bracket
  const generalRate = Math.max(1, interestRate - 0.50);
  const generalR = generalRate / 100;
  let generalGrossInterest = 0;
  for (let yr = 1; yr <= t; yr++) {
    if (payoutMode === 'cumulative') {
      const gPrev = principal * Math.pow(1 + generalR / 4, 4 * (yr - 1));
      const gCurr = principal * Math.pow(1 + generalR / 4, 4 * yr);
      generalGrossInterest += (gCurr - gPrev);
    } else {
      generalGrossInterest += (principal * generalR);
    }
  }
  const generalTax = generalGrossInterest * effectiveTaxRate; // No 80TTB for non-senior
  const generalNetInterest = generalGrossInterest - generalTax;

  const interestGainFromRateSpread = isSeniorCitizen ? Math.round(totalGrossInterest - generalGrossInterest) : 0;
  const taxSavedFrom80TTB = isSeniorCitizen ? Math.round(total80ttbExemption * effectiveTaxRate) : 0;
  const totalNetAdvantage = isSeniorCitizen ? Math.max(0, Math.round(netPostTaxInterest - generalNetInterest)) : 0;

  return {
    principal,
    tenureYears: t,
    payoutMode,
    maturityPrincipalReturned,
    totalGrossInterest: Math.round(totalGrossInterest),
    annualGrossInterest: Math.round(totalGrossInterest / t),
    monthlyPayoutAmount: Math.round(monthlyPayoutAmount),
    quarterlyPayoutAmount: Math.round(quarterlyPayoutAmount),
    totalPeriodicPayoutsPaid: Math.round(totalPeriodicPayoutsPaid),
    section80ttbExemption: Math.round(total80ttbExemption),
    taxableInterest: Math.round(Math.max(0, totalGrossInterest - total80ttbExemption)),
    totalTaxLiability: Math.round(totalTaxLiability),
    netPostTaxInterest: Math.round(netPostTaxInterest),
    totalCashRealized: Math.round(totalCashRealized),
    netMaturityAmount: Math.round(netMaturityAmount),
    tdsDeducted,
    annualNominalRate: Number(annualNominalRate.toFixed(2)),
    effectiveAnnualYield: Number(effectiveAnnualYield.toFixed(2)),
    postTaxAnnualizedReturn: Number(postTaxAnnualizedReturn.toFixed(2)),
    inflationAdjustedAnnualReturn: Number(inflationAdjustedAnnualReturn.toFixed(2)),
    effectivePurchasingPower,
    yearlyBreakdown,
    seniorAdvantage: {
      eligible: isSeniorCitizen,
      rateSpreadPercent: 0.50,
      interestGainFromRateSpread,
      taxSavedFrom80TTB,
      totalNetAdvantage
    }
  };
}

/**
 * Format Indian Rupee currency with standard Indian grouping (Lakhs & Crores)
 * e.g. 1500000 -> "₹15,00,000"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  const str = absAmount.toString();
  if (str.length <= 3) {
    return (isNegative ? '-' : '') + '₹' + str;
  }

  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + '₹' + formattedOther + ',' + lastThree;
}

/**
 * Format compact Indian denomination (e.g. 5.5 Lakhs, 1.2 Crore)
 */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount}`;
}
