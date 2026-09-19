'use client';

import React, { useState, useMemo } from 'react';
import { DebtInstrument } from '@/lib/debt-data';
import { formatINR } from '@/lib/debt-calculations';
import { 
  Search, 
  ShieldCheck, 
  Award, 
  Building2, 
  Calculator, 
  Info,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export interface InstrumentFaqItem {
  question: string;
  answer: string;
  category: 'withdrawal' | 'tax' | 'safety' | 'payout';
}

export function getInstrumentFaqs(inst: DebtInstrument): InstrumentFaqItem[] {
  const faqs: InstrumentFaqItem[] = [];

  // Question 1: Premature withdrawal
  let withdrawalAnswer = '';
  if (inst.id === 'scss-govt') {
    withdrawalAnswer = 'Premature exit is permitted after 1 year. Penalty: 1.5% of deposit deducted if closed between 1 and 2 years; 1% deducted if closed after 2 years. Fully penalty-free upon 5-year maturity or death.';
  } else if (inst.id === 'rbi-floating-rate') {
    withdrawalAnswer = 'Standard lock-in is 7 years. Premature redemption is permitted ONLY for senior citizens: 60–70 yrs (after 6 yrs), 70–80 yrs (after 5 yrs), and 80+ yrs (after 4 yrs), with 50% of the last coupon deducted as penalty.';
  } else if (inst.id === 'rec-54ec-capital-gains') {
    withdrawalAnswer = 'Strict 5-year lock-in as mandated under Section 54EC of the Income Tax Act. No premature redemption, surrender, or loan pledging is permitted under statutory rules.';
  } else if (inst.id === 'nhai-tax-free-bond' || inst.id === 'tata-capital-ncd' || inst.id === 'gsec-10y-benchmark') {
    withdrawalAnswer = 'Fully liquid via secondary market. Listed and tradable on NSE / BSE stock exchanges. You can sell through your Demat broker anytime during market hours at prevailing secondary market bond prices.';
  } else if (inst.prematureWithdrawalAllowed) {
    withdrawalAnswer = `Yes, premature withdrawal is permitted anytime. ${inst.prematureWithdrawalPenalty || 'A standard penalty of 0.50% to 1.00% is deducted from the contracted interest rate for the actual duration held.'}`;
  } else {
    withdrawalAnswer = `Premature withdrawal is not permitted. ${inst.prematureWithdrawalPenalty || 'Principal remains locked in until designated maturity.'}`;
  }
  faqs.push({
    question: 'Is premature withdrawal allowed?',
    answer: withdrawalAnswer,
    category: 'withdrawal'
  });

  // Question 2: Tax treatment & TDS
  let taxAnswer = '';
  if (inst.id === 'nhai-tax-free-bond') {
    taxAnswer = '100% Tax-Free under Section 10(15)(iv)(h) of the Income Tax Act. Coupon interest is completely exempt from personal income tax in both Old and New Tax Regimes, with zero TDS deducted.';
  } else if (inst.id === 'rec-54ec-capital-gains') {
    taxAnswer = 'Provides 100% long-term capital gains (LTCG) tax exemption on up to ₹50 Lakhs of real estate sale proceeds under Section 54EC. Annual coupon interest (5.25%) is taxable at slab rates; TDS applies if interest exceeds ₹5,000.';
  } else if (inst.id === 'scss-govt') {
    taxAnswer = 'Initial deposit qualifies for up to ₹1.5 Lakh tax deduction under Section 80C. Quarterly interest qualifies for Section 80TTB exemption (up to ₹50,000 tax-free per year for seniors). Submit Form 15H to your bank/post office to prevent TDS.';
  } else if (inst.type === 'bank_fd') {
    taxAnswer = 'Interest is taxed at your income slab. Senior citizens (60+) can claim a tax deduction of up to ₹50,000 per financial year under Section 80TTB across all bank deposits. Submit Form 15H at your bank branch or net banking to avoid TDS.';
  } else {
    taxAnswer = `Interest is taxable at slab rates under 'Income from Other Sources'. TDS of 10% is deducted if annual interest exceeds ${formatINR(inst.tdsThreshold)}. Eligible seniors with nil taxable income can submit Form 15H to prevent TDS.`;
  }
  faqs.push({
    question: 'What is the tax treatment & TDS?',
    answer: taxAnswer,
    category: 'tax'
  });

  // Question 3: Safety & Principal Guarantee
  let safetyAnswer = '';
  if (inst.dicgcCovered && inst.type === 'bank_fd') {
    safetyAnswer = `Insured up to ₹5,00,000 per depositor per bank (both principal and interest) under RBI's Deposit Insurance and Credit Guarantee Corporation (DICGC) Act. Scheduled commercial banks are regulated under strict RBI supervisory norms.`;
  } else if (inst.type === 'rbi_govt') {
    safetyAnswer = 'Backed by an unconditional Sovereign Guarantee from the Government of India and Reserve Bank of India, carrying the highest safety tier with zero credit or default risk.';
  } else {
    safetyAnswer = `Backed by corporate credit standing with a ${inst.creditRating} rating evaluated by ${inst.ratingAgency || 'CRISIL/ICRA'}, indicating high degree of safety regarding timely debt servicing. Note: Corporate deposits are not covered by bank DICGC insurance.`;
  }
  faqs.push({
    question: 'How safe is my principal & returns?',
    answer: safetyAnswer,
    category: 'safety'
  });

  // Question 4: Payout options
  const payoutModes = inst.payoutFrequency
    .map(f => f === 'cumulative' ? 'Cumulative (compounded reinvestment at maturity)' : f.charAt(0).toUpperCase() + f.slice(1))
    .join(', ');
  faqs.push({
    question: 'What payout options are available?',
    answer: `Available payout modes: ${payoutModes}. Monthly and quarterly options credit interest directly into your bank savings account for predictable retirement cashflow.`,
    category: 'payout'
  });

  return faqs;
}

export function formatCategoryBadge(type: string, subType: string): string {
  if (subType.includes('D-SIB') || subType.toLowerCase().includes('systemically')) return 'D-SIB Private Bank';
  if (subType.toLowerCase().includes('public sector') || subType.toLowerCase().includes('psu')) return 'Public Sector Bank';
  if (subType.toLowerCase().includes('small finance')) return 'Small Finance Bank';
  if (subType.toLowerCase().includes('nbfc') || subType.toLowerCase().includes('corporate') || subType.toLowerCase().includes('conglomerate')) {
    return subType.includes('AA+') ? 'AA+ Corporate FD' : 'AAA Corporate FD';
  }
  if (subType.toLowerCase().includes('small savings')) return 'Govt Small Savings';
  if (subType.toLowerCase().includes('floating')) return 'Sovereign Floating Bond';
  if (subType.toLowerCase().includes('54ec')) return 'Sec 54EC Capital Gains';
  if (subType.toLowerCase().includes('tax-free') || subType.toLowerCase().includes('tax free')) return 'Tax-Free PSU Bond';
  if (subType.toLowerCase().includes('postal') || subType.toLowerCase().includes('post office')) return 'Postal Savings Scheme';
  if (subType.toLowerCase().includes('g-sec')) return 'Tradable G-Sec Bond';
  return subType;
}

export function formatCreditRatingBadge(rating: string): string {
  if (rating.toLowerCase().includes('sovereign')) return 'Sovereign Guarantee';
  if (rating.toLowerCase().includes('psu') && rating.toLowerCase().includes('dicgc')) return 'Govt PSU • DICGC';
  if (rating.includes('CRISIL AAA') && rating.includes('DICGC')) return 'CRISIL AAA • DICGC';
  if (rating.includes('ICRA AAA') && rating.includes('DICGC')) return 'ICRA AAA • DICGC';
  if (rating.includes('CRISIL AA+') && rating.includes('DICGC')) return 'CRISIL AA+ • DICGC';
  if (rating.includes('CARE A+') && rating.includes('DICGC')) return 'CARE A+ • DICGC';
  if (rating.includes('CRISIL AAA') && (rating.includes('ICRA') || rating.includes('Stability'))) return 'CRISIL AAA / ICRA AAA';
  if (rating.includes('CRISIL AAA') && rating.includes('India Ratings')) return 'CRISIL AAA / IND AAA';
  if (rating.includes('CRISIL AA+') && rating.includes('India Ratings')) return 'CRISIL AA+ / IND AA+';
  if (rating.includes('CRISIL AAA') && rating.includes('CARE AAA')) return 'CRISIL AAA / CARE AAA';
  return rating;
}

interface InstrumentDirectoryProps {
  instruments: DebtInstrument[];
  isSeniorCitizen: boolean;
  onToggleSeniorCitizen: (isSenior: boolean) => void;
  onSelectInstrumentForCalc: (instrument: DebtInstrument) => void;
  isLargeText?: boolean;
}

export type SortColumn = 'generalRate' | 'seniorCitizenRate' | 'name' | 'minInvestment' | 'rate';
export type SortOrder = 'asc' | 'desc';

export function InstrumentDirectory({
  instruments,
  isSeniorCitizen,
  onToggleSeniorCitizen,
  onSelectInstrumentForCalc,
  isLargeText = false
}: InstrumentDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [safetyFilter, setSafetyFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>(isSeniorCitizen ? 'seniorCitizenRate' : 'rate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedInstrumentDetail, setSelectedInstrumentDetail] = useState<DebtInstrument | null>(null);
  const [expandedFaqCards, setExpandedFaqCards] = useState<Record<string, boolean>>({});

  const toggleCardFaq = (id: string) => {
    setExpandedFaqCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleHeaderSort = (column: 'generalRate' | 'seniorCitizenRate' | 'name' | 'minInvestment') => {
    if (sortColumn === column) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortColumn(column);
      setSortOrder(column === 'name' ? 'asc' : 'desc');
    }
  };

  const renderSortIcon = (column: 'generalRate' | 'seniorCitizenRate' | 'name' | 'minInvestment', accent?: 'amber' | 'blue') => {
    const isActive = sortColumn === column;
    if (!isActive) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover/th:text-slate-600 transition-colors shrink-0" />;
    }
    if (sortOrder === 'desc') {
      return <ArrowDown className={`w-3.5 h-3.5 shrink-0 ${accent === 'amber' ? 'text-amber-950 font-bold' : 'text-blue-700 font-bold'}`} />;
    }
    return <ArrowUp className={`w-3.5 h-3.5 shrink-0 ${accent === 'amber' ? 'text-amber-950 font-bold' : 'text-blue-700 font-bold'}`} />;
  };

  // Filter & Sort Logic
  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => {
      // Category filter
      if (selectedCategory !== 'all' && inst.type !== selectedCategory) {
        return false;
      }

      // Safety filter
      if (safetyFilter === 'sovereign' && inst.safetyLevel !== 'Highest (Sovereign)') {
        return false;
      }
      if (safetyFilter === 'dicgc' && !inst.dicgcCovered) {
        return false;
      }
      if (safetyFilter === 'corporate_aaa' && !inst.creditRating.includes('AAA')) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches = 
          inst.name.toLowerCase().includes(q) ||
          inst.issuer.toLowerCase().includes(q) ||
          inst.subType.toLowerCase().includes(q) ||
          inst.creditRating.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortColumn === 'generalRate') {
        valA = a.generalRate;
        valB = b.generalRate;
      } else if (sortColumn === 'seniorCitizenRate') {
        valA = a.seniorCitizenRate;
        valB = b.seniorCitizenRate;
      } else if (sortColumn === 'name') {
        const comp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comp : -comp;
      } else if (sortColumn === 'minInvestment') {
        valA = a.minInvestment;
        valB = b.minInvestment;
      } else {
        // default rate
        valA = isSeniorCitizen ? a.seniorCitizenRate : a.generalRate;
        valB = isSeniorCitizen ? b.seniorCitizenRate : b.generalRate;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [instruments, selectedCategory, safetyFilter, searchQuery, sortColumn, sortOrder, isSeniorCitizen]);

  const categories = [
    { id: 'all', label: 'All Debt Products' },
    { id: 'bank_fd', label: 'Bank Fixed Deposits' },
    { id: 'corporate_fd', label: 'Corporate NBFC FDs' },
    { id: 'rbi_govt', label: 'Govt & RBI Bonds' },
    { id: 'ncd_bond', label: 'Corporate Bonds & NCDs' }
  ];

  return (
    <section id="directory-section" className="scroll-mt-20 py-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            <Building2 className="w-4 h-4" />
            <span>Bank & Deposit Directory</span>
          </div>
          <h2 className={`${isLargeText ? 'text-2xl sm:text-4xl' : 'text-2xl sm:text-3xl'} font-bold font-serif text-slate-900 tracking-tight`}>
            Fixed Income & Deposit Rates
          </h2>
          <p className={`${isLargeText ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'} text-slate-600 mt-1 max-w-2xl`}>
            Compare live rates, DICGC insurance status, and Sec 80TTB tax shields across scheduled banks and sovereign schemes.
          </p>
        </div>

        {/* View Mode & Senior Citizen Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* Card vs Table toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setViewMode('cards')}
              id="view-mode-cards-btn"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              id="view-mode-table-btn"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Rate Sheet Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table Sheet</span>
            </button>
          </div>

          {/* Senior Citizen Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => onToggleSeniorCitizen(false)}
              id="toggle-regular-citizen-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isSeniorCitizen 
                  ? 'bg-white text-slate-900 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General (&lt;60)
            </button>
            <button
              onClick={() => onToggleSeniorCitizen(true)}
              id="toggle-senior-citizen-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSeniorCitizen 
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs' 
                  : 'text-amber-800 hover:text-amber-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Senior Citizens (60+)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 mb-6 shadow-xs space-y-3 w-full max-w-full overflow-hidden">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs touch-pan-x overscroll-x-contain scrollbar-none w-full max-w-full">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              id={`cat-filter-${cat.id}`}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Safety Filter, and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search bank or company (e.g. Unity, SBI, Shriram, Bajaj, HDFC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="directory-search-input"
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Safety/Guarantee Filter */}
          <div className="sm:col-span-3">
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              id="directory-safety-filter"
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All Safety Profiles</option>
              <option value="sovereign">Sovereign (Govt / RBI Guaranteed)</option>
              <option value="dicgc">DICGC Insured (₹5 Lakhs / Bank)</option>
              <option value="corporate_aaa">CRISIL / ICRA AAA Rated</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={`${sortColumn}:${sortOrder}`}
              onChange={(e) => {
                const [col, ord] = e.target.value.split(':') as [SortColumn, SortOrder];
                setSortColumn(col);
                setSortOrder(ord);
              }}
              id="directory-sort-select"
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="seniorCitizenRate:desc">Sort: Highest Senior Citizen Rate (60+)</option>
              <option value="generalRate:desc">Sort: Highest General Rate (&lt;60)</option>
              <option value="seniorCitizenRate:asc">Sort: Lowest Senior Citizen Rate</option>
              <option value="generalRate:asc">Sort: Lowest General Rate</option>
              <option value="name:asc">Sort: Bank / Issuer Name (A-Z)</option>
              <option value="name:desc">Sort: Bank / Issuer Name (Z-A)</option>
              <option value="minInvestment:asc">Sort: Lowest Minimum Deposit</option>
              <option value="minInvestment:desc">Sort: Highest Minimum Deposit</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Table Sheet View (Senior Citizen Bank Ledger Style) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-6 w-full max-w-full">
          <div className="md:hidden px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Scroll table horizontally to see all columns</span>
            <span>&rarr;</span>
          </div>
          <div className="overflow-x-auto touch-pan-x overscroll-x-contain w-full max-w-full">
            <table className="w-full text-left border-collapse" id="instruments-table-view">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th 
                    scope="col"
                    id="th-sort-bank-name"
                    aria-sort={sortColumn === 'name' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : 'none'}
                    onClick={() => handleHeaderSort('name')}
                    className={`py-3 px-4 cursor-pointer select-none transition-colors group/th ${
                      sortColumn === 'name' ? 'bg-blue-50/80 text-blue-900 font-extrabold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Click to sort alphabetically by Bank / Issuer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Bank / Issuer</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>

                  <th className="py-3 px-3">Safety & Rating</th>

                  <th 
                    scope="col"
                    id="th-sort-general-rate"
                    aria-sort={sortColumn === 'generalRate' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : 'none'}
                    onClick={() => handleHeaderSort('generalRate')}
                    className={`py-3 px-3 cursor-pointer select-none transition-colors group/th ${
                      sortColumn === 'generalRate' 
                        ? 'bg-blue-100/90 text-blue-950 font-extrabold ring-1 ring-blue-300' 
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Click to sort by General Rate (<60)"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>General Rate</span>
                      {renderSortIcon('generalRate', 'blue')}
                    </div>
                  </th>

                  <th 
                    scope="col"
                    id="th-sort-senior-rate"
                    aria-sort={sortColumn === 'seniorCitizenRate' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : 'none'}
                    onClick={() => handleHeaderSort('seniorCitizenRate')}
                    className={`py-3 px-3 cursor-pointer select-none transition-colors group/th ${
                      sortColumn === 'seniorCitizenRate' 
                        ? 'bg-amber-100 text-amber-950 font-extrabold ring-1 ring-amber-400' 
                        : 'bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 font-extrabold'
                    }`}
                    title="Click to sort by Senior Citizen Rate (60+)"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Senior Rate (60+)</span>
                      {renderSortIcon('seniorCitizenRate', 'amber')}
                    </div>
                  </th>

                  <th className="py-3 px-3">Tenure</th>

                  <th 
                    scope="col"
                    id="th-sort-min-deposit"
                    aria-sort={sortColumn === 'minInvestment' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : 'none'}
                    onClick={() => handleHeaderSort('minInvestment')}
                    className={`py-3 px-3 cursor-pointer select-none transition-colors group/th ${
                      sortColumn === 'minInvestment' ? 'bg-blue-50/80 text-blue-900 font-extrabold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Click to sort by Minimum Deposit"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Min Deposit</span>
                      {renderSortIcon('minInvestment')}
                    </div>
                  </th>

                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredInstruments.map((inst) => {
                  const rateDiff = inst.seniorCitizenRate - inst.generalRate;
                  return (
                    <tr 
                      key={inst.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                      id={`table-row-${inst.id}`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-sm sm:text-base font-bold text-slate-900 block group-hover:text-blue-700 transition-colors">
                              {inst.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {inst.issuer} &bull; <span className="text-slate-600">{inst.subType}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {inst.creditRating}
                          </span>
                          {inst.dicgcCovered && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 w-fit">
                              DICGC ₹5L
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap text-sm">
                        {inst.generalRate.toFixed(2)}%
                      </td>

                      <td className="py-3.5 px-3 font-mono font-extrabold text-amber-900 bg-amber-50/50 whitespace-nowrap text-base">
                        <div className="flex items-center gap-1.5">
                          <span>{inst.seniorCitizenRate.toFixed(2)}%</span>
                          {rateDiff > 0 && (
                            <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-sans">
                              +{rateDiff.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-600 whitespace-nowrap text-xs">
                        {inst.popularTenureLabel}
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-700 whitespace-nowrap text-xs">
                        {formatINR(inst.minInvestment)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInstrumentDetail(inst)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View Full Details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onSelectInstrumentForCalc(inst)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Calculate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Clean Card Grid View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredInstruments.map((instrument) => {
            const currentRate = isSeniorCitizen ? instrument.seniorCitizenRate : instrument.generalRate;
            const rateDifference = instrument.seniorCitizenRate - instrument.generalRate;

            return (
              <div
                key={instrument.id}
                id={`instrument-card-${instrument.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Metadata Row: Category and Rating Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
                      {formatCategoryBadge(instrument.type, instrument.subType)}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{formatCreditRatingBadge(instrument.creditRating)}</span>
                    </span>
                  </div>

                  {/* Instrument Name & Issuer - Full width so text flows naturally */}
                  <div className="mb-2.5">
                    <h3 className={`${isLargeText ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors`}>
                      {instrument.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {instrument.issuer}
                    </p>
                  </div>

                  {/* Highlights Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {instrument.dicgcCovered && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                        DICGC ₹5L Insured
                      </span>
                    )}

                    {instrument.taxBenefitSection && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap">
                        {instrument.taxBenefitSection === '80TTB' ? 'Sec 80TTB Eligible' : instrument.taxBenefitSection}
                      </span>
                    )}

                    {instrument.type === 'rbi_govt' && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap">
                        100% Sovereign Backed
                      </span>
                    )}
                  </div>

                  {/* Large High-Contrast Rate Card */}
                  <div className={`rounded-xl p-3.5 border transition-all ${
                    isSeniorCitizen 
                      ? 'bg-gradient-to-r from-amber-50/70 to-orange-50/40 border-amber-200/90' 
                      : 'bg-slate-50 border-slate-200/90'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-600 block font-bold">
                          {isSeniorCitizen ? 'Senior Citizen Rate (60+)' : 'General Public Rate'}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={`${isLargeText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'} font-extrabold font-mono tracking-tight ${
                            isSeniorCitizen ? 'text-amber-950' : 'text-blue-950'
                          }`}>
                            {currentRate.toFixed(2)}%
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">p.a.</span>
                        </div>
                      </div>

                      {isSeniorCitizen && rateDifference > 0 ? (
                        <span className="text-[11px] font-bold text-amber-950 bg-amber-300/90 px-2 py-1 rounded-lg border border-amber-400 whitespace-nowrap shrink-0">
                          +{rateDifference.toFixed(2)}% Senior Bonus
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap shrink-0">
                          Senior: {instrument.seniorCitizenRate.toFixed(2)}%
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2.5 border-t border-slate-200/70 text-xs">
                      <div className="min-w-0">
                        <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Tenure</span>
                        <span className="font-bold text-slate-800 block truncate" title={instrument.popularTenureLabel}>
                          {instrument.popularTenureLabel}
                        </span>
                      </div>
                      <div className="min-w-0 text-right">
                        <span className="text-slate-500 block text-[10px] font-semibold uppercase tracking-wider">Min Deposit</span>
                        <span className="font-bold text-slate-800 whitespace-nowrap block">
                          {formatINR(instrument.minInvestment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Quick FAQs Accordion */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleCardFaq(instrument.id)}
                    id={`btn-faq-toggle-${instrument.id}`}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer group/faq ${
                      expandedFaqCards[instrument.id]
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50 border border-slate-200/60'
                    }`}
                    aria-expanded={Boolean(expandedFaqCards[instrument.id])}
                    aria-controls={`card-faq-drawer-${instrument.id}`}
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 group-hover/faq:scale-110 transition-transform shrink-0" />
                      <span className="truncate">Quick FAQs: Tax, Withdrawal & Safety</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover/faq:text-blue-700 shrink-0 ml-1">
                      <span>{expandedFaqCards[instrument.id] ? 'Hide FAQs' : 'View (4)'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedFaqCards[instrument.id] ? 'rotate-180 text-blue-600' : ''}`} />
                    </span>
                  </button>

                  {/* Accordion Drawer Content */}
                  {expandedFaqCards[instrument.id] && (
                    <div 
                      id={`card-faq-drawer-${instrument.id}`}
                      className="mt-2.5 space-y-2.5 bg-slate-50/95 rounded-xl p-3 border border-slate-200/90 text-xs animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      {getInstrumentFaqs(instrument).map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-200/70 last:border-0 pb-2 last:pb-0">
                          <div className="flex items-start gap-1.5 font-bold text-slate-900 leading-snug">
                            <span className="text-blue-600 font-extrabold shrink-0">Q:</span>
                            <span>{faq.question}</span>
                          </div>
                          <p className="text-slate-600 pl-4 mt-0.5 leading-relaxed text-[11px] sm:text-xs font-normal">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedInstrumentDetail(instrument)}
                    id={`btn-details-${instrument.id}`}
                    className="py-2.5 px-3 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Full Details</span>
                  </button>
                  <button
                    onClick={() => onSelectInstrumentForCalc(instrument)}
                    id={`btn-calc-${instrument.id}`}
                    className="py-2.5 px-3 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculate ROI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredInstruments.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 my-6 shadow-xs">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No matching debt instruments found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to see all available fixed deposit rates.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSafetyFilter('all'); }}
            className="mt-4 px-4 py-2 text-xs bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detailed Inspection Modal */}
      {selectedInstrumentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            id="instrument-detail-modal"
          >
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {formatCategoryBadge(selectedInstrumentDetail.type, selectedInstrumentDetail.subType)}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                  {selectedInstrumentDetail.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Issued by: {selectedInstrumentDetail.issuer}
                </p>
              </div>
              <button
                onClick={() => setSelectedInstrumentDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-xl font-bold cursor-pointer"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">General Rate</span>
                    <p className="text-lg font-bold text-slate-900 font-mono">
                      {selectedInstrumentDetail.generalRate.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 uppercase font-bold">Senior (60+)</span>
                    <p className="text-lg font-extrabold text-amber-900 font-mono">
                      {selectedInstrumentDetail.seniorCitizenRate.toFixed(2)}%
                    </p>
                  </div>
                  {selectedInstrumentDetail.superSeniorRate && (
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold">Super Senior (80+)</span>
                      <p className="text-lg font-bold text-emerald-700 font-mono">
                        {selectedInstrumentDetail.superSeniorRate.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheme Overview</h4>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {selectedInstrumentDetail.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Terms & Investor Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">Safety & Rating</span>
                    <span className="font-bold text-slate-800">{selectedInstrumentDetail.creditRating}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">DICGC Insurance Status</span>
                    <span className="font-bold text-emerald-700">
                      {selectedInstrumentDetail.dicgcCovered ? 'Covered (₹5 Lakhs per Depositor)' : 'Not applicable (Corporate Risk)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">TDS Threshold Limit</span>
                    <span className="font-bold text-slate-800">
                      {selectedInstrumentDetail.tdsThreshold > 1000000 
                        ? 'Zero TDS (100% Tax-Free)' 
                        : `${formatINR(selectedInstrumentDetail.tdsThreshold)}/year`}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">Premature Exit</span>
                    <span className="font-bold text-slate-800">
                      {selectedInstrumentDetail.prematureWithdrawalAllowed ? 'Allowed (Subject to penalty)' : 'Strict Lock-in'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Important Rules & Highlights</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedInstrumentDetail.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                  {selectedInstrumentDetail.prematureWithdrawalPenalty && (
                    <li className="flex items-start gap-2 text-slate-500">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Penalty Clause:</strong> {selectedInstrumentDetail.prematureWithdrawalPenalty}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Modal FAQs */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Frequently Asked Questions</span>
                </h4>
                <div className="space-y-2">
                  {getInstrumentFaqs(selectedInstrumentDetail).map((faq, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="font-bold text-slate-900 flex items-start gap-1.5 mb-1">
                        <span className="text-blue-600 font-extrabold">Q:</span>
                        <span>{faq.question}</span>
                      </div>
                      <p className="text-slate-600 pl-4 leading-relaxed text-[11px] sm:text-xs">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedInstrumentDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const inst = selectedInstrumentDetail;
                  setSelectedInstrumentDetail(null);
                  onSelectInstrumentForCalc(inst);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulate in Calculator</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
