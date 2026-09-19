'use client';

import React, { useState } from 'react';
import { DebtInstrument } from '@/lib/debt-data';
import { formatINR } from '@/lib/debt-calculations';
import {
  Building2,
  PlusCircle,
  Check,
  AlertCircle,
  Trash2,
  Sparkles,
  ShieldCheck,
  Award,
  Info,
  ExternalLink,
  Save,
  RefreshCw,
  Eye,
  Percent,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ManualInstrumentFormProps {
  onSaveInstrument: (instrument: DebtInstrument) => void;
  editingInstrument?: DebtInstrument | null;
  onCancelEdit?: () => void;
}

export function ManualInstrumentForm({
  onSaveInstrument,
  editingInstrument,
  onCancelEdit
}: ManualInstrumentFormProps) {
  // Form State initialized directly from editingInstrument if provided
  const [issuer, setIssuer] = useState(editingInstrument?.issuer || '');
  const [name, setName] = useState(editingInstrument?.name || '');
  const [type, setType] = useState<DebtInstrument['type']>(editingInstrument?.type || 'corporate_fd');
  const [subType, setSubType] = useState(editingInstrument?.subType || 'Corporate Fixed Deposit');
  const [generalRate, setGeneralRate] = useState<number | ''>(editingInstrument ? editingInstrument.generalRate : 8.40);
  const [seniorCitizenRate, setSeniorCitizenRate] = useState<number | ''>(editingInstrument ? editingInstrument.seniorCitizenRate : 8.90);
  const [superSeniorRate, setSuperSeniorRate] = useState<number | ''>(editingInstrument?.superSeniorRate ?? '');
  const [popularTenureLabel, setPopularTenureLabel] = useState(editingInstrument?.popularTenureLabel || '36 to 60 Months');
  const [tenureMonthsMin, setTenureMonthsMin] = useState<number | ''>(editingInstrument?.tenureMonthsMin ?? 12);
  const [tenureMonthsMax, setTenureMonthsMax] = useState<number | ''>(editingInstrument?.tenureMonthsMax ?? 60);
  const [payoutFrequency, setPayoutFrequency] = useState<DebtInstrument['payoutFrequency']>(
    editingInstrument?.payoutFrequency || ['monthly', 'quarterly', 'cumulative']
  );
  const [creditRating, setCreditRating] = useState(editingInstrument?.creditRating || 'CRISIL AAA');
  const [ratingAgency, setRatingAgency] = useState<DebtInstrument['ratingAgency']>(editingInstrument?.ratingAgency || 'CRISIL');
  const [safetyLevel, setSafetyLevel] = useState<DebtInstrument['safetyLevel']>(editingInstrument?.safetyLevel || 'High (AAA Corporate)');
  const [dicgcCovered, setDicgcCovered] = useState(editingInstrument?.dicgcCovered ?? false);
  const [minInvestment, setMinInvestment] = useState<number | ''>(editingInstrument?.minInvestment ?? 10000);
  const [maxInvestment, setMaxInvestment] = useState<number | ''>(editingInstrument?.maxInvestment ?? '');
  const [taxBenefitSection, setTaxBenefitSection] = useState<DebtInstrument['taxBenefitSection']>(editingInstrument?.taxBenefitSection || 'Standard');
  const [tdsThreshold, setTdsThreshold] = useState<number | ''>(editingInstrument?.tdsThreshold ?? 5000);
  const [prematureWithdrawalAllowed, setPrematureWithdrawalAllowed] = useState(editingInstrument?.prematureWithdrawalAllowed ?? true);
  const [prematureWithdrawalPenalty, setPrematureWithdrawalPenalty] = useState(
    editingInstrument?.prematureWithdrawalPenalty ?? '1.00% penalty below applicable card rate; minimum 3 months lock-in'
  );
  const [officialApplyUrl, setOfficialApplyUrl] = useState(editingInstrument?.officialApplyUrl || '');
  const [description, setDescription] = useState(editingInstrument?.description || '');
  const [highlights, setHighlights] = useState<string[]>(
    editingInstrument?.keyHighlights || [
      'High interest yield with flexible interest payouts',
      'Crisil AAA / ICRA AA+ certified credit safety',
      'Special additional interest bonus for senior citizens'
    ]
  );
  const [newHighlight, setNewHighlight] = useState('');
  const [featured, setFeatured] = useState(!!editingInstrument?.featured);

  // Status & Feedback
  const [formError, setFormError] = useState('');
  const [previewSenior, setPreviewSenior] = useState(true);
  const [showDetailModalPreview, setShowDetailModalPreview] = useState(false);

  // Preset Template Helper
  const applyPreset = (presetType: 'nbfc' | 'sfb' | 'bank' | 'ncd') => {
    if (presetType === 'nbfc') {
      setType('corporate_fd');
      setSubType('Corporate Fixed Deposit (NBFC)');
      setCreditRating('CRISIL AAA');
      setRatingAgency('CRISIL');
      setSafetyLevel('High (AAA Corporate)');
      setDicgcCovered(false);
      setTaxBenefitSection('Standard');
      setTdsThreshold(5000);
      setMinInvestment(10000);
      setPopularTenureLabel('36 to 60 Months');
      setTenureMonthsMin(12);
      setTenureMonthsMax(60);
      setPrematureWithdrawalAllowed(true);
      setPrematureWithdrawalPenalty('1.00% penalty below card rate; 3 months statutory lock-in');
      setPayoutFrequency(['monthly', 'quarterly', 'cumulative']);
      if (!description) {
        setDescription('High-yield fixed deposit from a leading Indian NBFC with verified CRISIL AAA safety ratings and periodic interest payout options.');
      }
    } else if (presetType === 'sfb') {
      setType('bank_fd');
      setSubType('Small Finance Bank FD');
      setCreditRating('DICGC Insured');
      setRatingAgency('DICGC');
      setSafetyLevel('Very High (DICGC Insured)');
      setDicgcCovered(true);
      setTaxBenefitSection('80TTB');
      setTdsThreshold(50000);
      setMinInvestment(5000);
      setPopularTenureLabel('15 to 36 Months');
      setTenureMonthsMin(7);
      setTenureMonthsMax(60);
      setPrematureWithdrawalAllowed(true);
      setPrematureWithdrawalPenalty('0.50% penalty on premature closure');
      setPayoutFrequency(['quarterly', 'cumulative']);
      if (!description) {
        setDescription('Scheduled Small Finance Bank term deposit offering market-topping interest yields backed by statutory RBI DICGC ₹5 Lakh insurance cover.');
      }
    } else if (presetType === 'bank') {
      setType('bank_fd');
      setSubType('Commercial Bank Term Deposit');
      setCreditRating('DICGC Insured');
      setRatingAgency('DICGC');
      setSafetyLevel('Very High (DICGC Insured)');
      setDicgcCovered(true);
      setTaxBenefitSection('80TTB');
      setTdsThreshold(50000);
      setMinInvestment(10000);
      setPopularTenureLabel('1 Year to 3 Years');
      setTenureMonthsMin(12);
      setTenureMonthsMax(120);
      setPrematureWithdrawalAllowed(true);
      setPrematureWithdrawalPenalty('1.00% penalty for premature withdrawal');
      setPayoutFrequency(['quarterly', 'cumulative']);
      if (!description) {
        setDescription('Institutional fixed deposit from a scheduled commercial bank, eligible for Section 80TTB deductions and DICGC deposit insurance.');
      }
    } else if (presetType === 'ncd') {
      setType('ncd_bond');
      setSubType('Secured Non-Convertible Debenture (NCD)');
      setCreditRating('CARE AAA / Stable');
      setRatingAgency('CARE');
      setSafetyLevel('High (AAA Corporate)');
      setDicgcCovered(false);
      setTaxBenefitSection('Standard');
      setTdsThreshold(10000);
      setMinInvestment(10000);
      setPopularTenureLabel('3 to 5 Years');
      setTenureMonthsMin(36);
      setTenureMonthsMax(60);
      setPrematureWithdrawalAllowed(false);
      setPrematureWithdrawalPenalty('Tradable on BSE/NSE secondary markets; no premature bank exit');
      setPayoutFrequency(['annual', 'cumulative']);
      if (!description) {
        setDescription('Exchange-listed secured debenture backed by company tangible assets offering fixed coupon yields for retail investors.');
      }
    }
  };

  const handleTogglePayout = (freq: 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'cumulative') => {
    if (payoutFrequency.includes(freq)) {
      if (payoutFrequency.length === 1) return; // keep at least 1
      setPayoutFrequency(payoutFrequency.filter(f => f !== freq));
    } else {
      setPayoutFrequency([...payoutFrequency, freq]);
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    if (highlights.length >= 6) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!issuer.trim()) {
      setFormError('Please enter the Company / Issuer Name.');
      return;
    }
    if (!name.trim()) {
      setFormError('Please enter the Product / Scheme Name.');
      return;
    }
    if (generalRate === '' || isNaN(Number(generalRate)) || Number(generalRate) <= 0) {
      setFormError('Please enter a valid General Interest Rate (% p.a.).');
      return;
    }
    if (seniorCitizenRate === '' || isNaN(Number(seniorCitizenRate)) || Number(seniorCitizenRate) <= 0) {
      setFormError('Please enter a valid Senior Citizen Rate (% p.a.).');
      return;
    }
    if (minInvestment === '' || isNaN(Number(minInvestment)) || Number(minInvestment) <= 0) {
      setFormError('Please enter a valid Minimum Investment amount in ₹.');
      return;
    }

    const genRateNum = Number(generalRate);
    const senRateNum = Number(seniorCitizenRate);
    const superSenRateNum = superSeniorRate !== '' ? Number(superSeniorRate) : undefined;
    const minInvNum = Number(minInvestment);
    const maxInvNum = maxInvestment !== '' ? Number(maxInvestment) : undefined;
    const minTenure = tenureMonthsMin !== '' ? Number(tenureMonthsMin) : 12;
    const maxTenure = tenureMonthsMax !== '' ? Number(tenureMonthsMax) : 60;

    // Generate safe unique ID
    const sanitizedIssuer = issuer.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16);
    const generatedId = editingInstrument?.id || `manual-${sanitizedIssuer}-${Date.now().toString(36)}`;

    const newInstrument: DebtInstrument = {
      id: generatedId,
      name: name.trim(),
      issuer: issuer.trim(),
      type,
      subType: subType.trim() || (type === 'corporate_fd' ? 'Corporate Fixed Deposit' : 'Bank Term Deposit'),
      generalRate: Number(genRateNum.toFixed(2)),
      seniorCitizenRate: Number(senRateNum.toFixed(2)),
      superSeniorRate: superSenRateNum ? Number(superSenRateNum.toFixed(2)) : undefined,
      tenureMonthsMin: minTenure,
      tenureMonthsMax: maxTenure,
      popularTenureLabel: popularTenureLabel.trim() || `${minTenure} - ${maxTenure} Months`,
      payoutFrequency,
      creditRating: creditRating.trim() || (dicgcCovered ? 'DICGC Insured' : 'CRISIL AAA'),
      ratingAgency,
      safetyLevel,
      minInvestment: minInvNum,
      maxInvestment: maxInvNum,
      dicgcCovered,
      taxBenefitSection,
      tdsThreshold: tdsThreshold !== '' ? Number(tdsThreshold) : (dicgcCovered ? 50000 : 5000),
      description: description.trim() || `Official fixed income deposit schedule for ${issuer.trim()}.`,
      keyHighlights: highlights.length > 0 ? highlights : [
        `Up to ${senRateNum}% p.a. for Senior Citizens`,
        `Safety Profile: ${creditRating}`
      ],
      prematureWithdrawalAllowed,
      prematureWithdrawalPenalty: prematureWithdrawalPenalty.trim(),
      officialApplyUrl: officialApplyUrl.trim() || undefined,
      lastUpdated: 'Manual Entry Verified',
      featured
    };

    onSaveInstrument(newInstrument);
  };

  const rateDiff = (Number(seniorCitizenRate) || 0) - (Number(generalRate) || 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header & Template Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                {editingInstrument ? `Edit ${editingInstrument.issuer}` : 'Manual Company & Product Listing'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              If an institution’s website blocks automated scraping or has custom deposit rates, you can manually list it here. Every field below maps directly to the live site directory cards, calculator tools, and details modal.
            </p>
          </div>

          {editingInstrument && onCancelEdit && (
            <button
              onClick={onCancelEdit}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('nbfc')}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs rounded-lg font-medium transition-colors"
          >
            🏢 Corporate NBFC FD
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sfb')}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs rounded-lg font-medium transition-colors"
          >
            🏦 Small Finance Bank FD
          </button>
          <button
            type="button"
            onClick={() => applyPreset('bank')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs rounded-lg font-medium transition-colors"
          >
            🏛️ Commercial Bank FD
          </button>
          <button
            type="button"
            onClick={() => applyPreset('ncd')}
            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs rounded-lg font-medium transition-colors"
          >
            📜 Secured Bond / NCD
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Real-time Site Card Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Section 1: Company & Product Names */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>1. Company & Product Classification</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-issuer-input">
                  Company / Issuer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="manual-issuer-input"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Piramal Capital & Housing Finance Ltd"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium shadow-2xs"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Official corporate or banking entity</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-name-input">
                  Product / Scheme Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="manual-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Piramal Finance Corporate Fixed Deposit"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium shadow-2xs"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Heading displayed on the directory card</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-type-select">
                  Category Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="manual-type-select"
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as DebtInstrument['type'];
                    setType(newType);
                    if (newType === 'corporate_fd' && !subType) setSubType('Corporate Fixed Deposit');
                    if (newType === 'bank_fd' && !subType) setSubType('Bank Fixed Deposit');
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="corporate_fd">Corporate NBFC Fixed Deposit (corporate_fd)</option>
                  <option value="bank_fd">Bank Fixed Deposit (bank_fd)</option>
                  <option value="rbi_govt">RBI & Sovereign Bonds (rbi_govt)</option>
                  <option value="ncd_bond">Corporate Bonds & NCDs (ncd_bond)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-subtype-input">
                  Sub-Type Badge Label
                </label>
                <input
                  type="text"
                  id="manual-subtype-input"
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  placeholder="e.g. Corporate Fixed Deposit (NBFC)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Blue pill tag above product title</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-url-input">
                Official Application / Tariff Page URL
              </label>
              <input
                type="url"
                id="manual-url-input"
                value={officialApplyUrl}
                onChange={(e) => setOfficialApplyUrl(e.target.value)}
                placeholder="https://piramalfinance.com/fixed-deposit"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono text-[11px]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Users clicking &ldquo;Apply on Official Portal&rdquo; will be directed here</span>
            </div>
          </div>

          {/* Section 2: Interest Rates & Tenure */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>2. Interest Rates & Tenure Ladder</span>
              </h3>
              {rateDiff > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                  +{rateDiff.toFixed(2)}% Senior Bonus
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-gen-rate-input">
                  General Rate (% p.a.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    id="manual-gen-rate-input"
                    value={generalRate}
                    onChange={(e) => setGeneralRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="8.35"
                    className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono font-bold"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Regular depositors (&lt;60)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-sen-rate-input">
                  Senior Citizen Rate (% p.a.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    id="manual-sen-rate-input"
                    value={seniorCitizenRate}
                    onChange={(e) => setSeniorCitizenRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="8.85"
                    className="w-full pl-3 pr-8 py-2 text-xs bg-amber-50/60 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-amber-900 font-mono font-bold"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Age 60 and above</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-super-sen-rate-input">
                  Super Senior Rate (80+)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    id="manual-super-sen-rate-input"
                    value={superSeniorRate}
                    onChange={(e) => setSuperSeniorRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Optional (e.g. 9.00)"
                    className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Age 80+ special bonus</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-tenure-label-input">
                  Popular Tenure Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="manual-tenure-label-input"
                  value={popularTenureLabel}
                  onChange={(e) => setPopularTenureLabel(e.target.value)}
                  placeholder="e.g. 36 to 60 Months"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-min-tenure-input">
                  Min Tenure (Months)
                </label>
                <input
                  type="number"
                  id="manual-min-tenure-input"
                  value={tenureMonthsMin}
                  onChange={(e) => setTenureMonthsMin(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  placeholder="12"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-max-tenure-input">
                  Max Tenure (Months)
                </label>
                <input
                  type="number"
                  id="manual-max-tenure-input"
                  value={tenureMonthsMax}
                  onChange={(e) => setTenureMonthsMax(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  placeholder="60"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Payout Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payout Frequency Options
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'quarterly', label: 'Quarterly' },
                  { id: 'half_yearly', label: 'Half-Yearly' },
                  { id: 'annual', label: 'Annual' },
                  { id: 'cumulative', label: 'Cumulative / At Maturity' }
                ].map(p => {
                  const isChecked = payoutFrequency.includes(p.id as any);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTogglePayout(p.id as any)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-all font-medium flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Safety, Ratings & DICGC Coverage */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>3. Credit Rating, Safety & DICGC Insurance</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-rating-input">
                  Credit Rating Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="manual-rating-input"
                  value={creditRating}
                  onChange={(e) => setCreditRating(e.target.value)}
                  placeholder="e.g. CRISIL AAA or ICRA AA+"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-agency-select">
                  Rating Agency
                </label>
                <select
                  id="manual-agency-select"
                  value={ratingAgency}
                  onChange={(e) => setRatingAgency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="CRISIL">CRISIL</option>
                  <option value="ICRA">ICRA</option>
                  <option value="CARE">CARE</option>
                  <option value="DICGC">DICGC (RBI Subsidiary)</option>
                  <option value="RBI / Govt">RBI / Sovereign Govt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-safety-select">
                  Safety Tier Profile
                </label>
                <select
                  id="manual-safety-select"
                  value={safetyLevel}
                  onChange={(e) => setSafetyLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="High (AAA Corporate)">High (AAA Corporate)</option>
                  <option value="Moderate (AA+ Corporate)">Moderate (AA+ Corporate)</option>
                  <option value="Very High (DICGC Insured)">Very High (DICGC Insured)</option>
                  <option value="Highest (Sovereign)">Highest (Sovereign)</option>
                </select>
              </div>
            </div>

            {/* DICGC Toggle Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  RBI DICGC Insurance Coverage
                </span>
                <span className="text-[11px] text-slate-500">
                  Are deposits protected up to ₹5,00,000 under RBI Deposit Insurance Act? (Enable only for Banks)
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setDicgcCovered(false)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    !dicgcCovered ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  No (NBFC / Bond)
                </button>
                <button
                  type="button"
                  onClick={() => setDicgcCovered(true)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    dicgcCovered ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  Yes (₹5 Lakhs Insured)
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Investment Limits, Taxation & Liquidity */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>4. Investment Limits, Taxation & Liquidity</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-min-inv-input">
                  Minimum Investment (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="manual-min-inv-input"
                  value={minInvestment}
                  onChange={(e) => setMinInvestment(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="10000"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-max-inv-input">
                  Maximum Investment (₹)
                </label>
                <input
                  type="number"
                  id="manual-max-inv-input"
                  value={maxInvestment}
                  onChange={(e) => setMaxInvestment(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="Leave empty for No Limit"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-tax-select">
                  Tax Benefit Section
                </label>
                <select
                  id="manual-tax-select"
                  value={taxBenefitSection}
                  onChange={(e) => setTaxBenefitSection(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Standard">Standard (Normal Income Tax Slab)</option>
                  <option value="80TTB">80TTB (Up to ₹50,000 Tax-Free Interest for 60+ Seniors)</option>
                  <option value="80C">80C (Tax Saver 5-Year Lock-in up to ₹1.5L)</option>
                  <option value="Tax Free">Tax Free (Section 10(15) Govt/Bonds)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-tds-input">
                  Annual TDS Threshold Limit (₹)
                </label>
                <input
                  type="number"
                  id="manual-tds-input"
                  value={tdsThreshold}
                  onChange={(e) => setTdsThreshold(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="50000 for Banks, 5000 for NBFCs"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Premature Exit Rules */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Premature Withdrawal Policy</span>
                  <span className="text-[11px] text-slate-500">Can investors close deposit before maturity?</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={prematureWithdrawalAllowed}
                    onChange={(e) => setPrematureWithdrawalAllowed(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Allowed (Subject to penalty)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-penalty-input">
                  Penalty / Lock-in Clause
                </label>
                <input
                  type="text"
                  id="manual-penalty-input"
                  value={prematureWithdrawalPenalty}
                  onChange={(e) => setPrematureWithdrawalPenalty(e.target.value)}
                  placeholder="e.g. 1% deduction below card rate; 3 months statutory lock-in"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Editorial Overview & Key Highlights */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-700" />
                <span>5. Scheme Overview & Highlights</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="manual-description-textarea">
                Product Overview / Scheme Summary
              </label>
              <textarea
                id="manual-description-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key benefits, safety credentials, investor track record, and payout options..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 leading-relaxed font-normal"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Appears in the &ldquo;Full Details&rdquo; modal dialog for investors</span>
            </div>

            {/* Highlights Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Key Highlights (Bullet Points on Card & Modal)
              </label>
              <div className="space-y-2 mb-2.5">
                {highlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-1" />
                    <span className="flex-1 text-slate-700 font-medium">{hl}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {highlights.length < 5 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Add a highlight bullet point..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Featured Badge Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Recommended / Featured Status</span>
                <span className="text-[11px] text-slate-500">
                  Highlight this product with a top &ldquo;Recommended Pick&rdquo; ribbon on the public directory
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className={featured ? 'text-blue-700 font-bold' : ''}>Featured Pick</span>
              </label>
            </div>
          </div>

          {/* Submit Actions Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-500">
              Saving updates both the client directory cache and notifies open browser tabs immediately.
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {editingInstrument && onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                id="btn-save-manual-instrument"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{editingInstrument ? 'Update Product in Catalog' : 'Publish & Add to Directory'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Site Card Preview Column */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-blue-700" />
                <span>Live Site Card Preview</span>
              </div>

              {/* Toggle General vs Senior Citizen View */}
              <div className="bg-slate-100 p-1 rounded-lg flex items-center text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewSenior(false)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    !previewSenior ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  General (&lt;60)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSenior(true)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    previewSenior ? 'bg-amber-400 text-slate-950 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Senior (60+)
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              This is the exact visual presentation visitors will see in the Pan-India Fixed Income Catalog:
            </p>

            {/* Exact Instrument Card Simulation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between">
              {featured && (
                <div className="absolute -top-2.5 right-4 bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Recommended Pick
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold tracking-wide uppercase text-blue-700">
                  {subType || 'Deposit Scheme'}
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug mt-0.5">
                  {name || 'Product Scheme Name'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {issuer || 'Company / Issuer Name'}
                </p>

                {/* Rating & Safety Badges */}
                <div className="flex flex-wrap items-center gap-1.5 my-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {creditRating || 'CRISIL AAA'}
                  </span>
                  {dicgcCovered && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      DICGC ₹5L Insured
                    </span>
                  )}
                  {taxBenefitSection && taxBenefitSection !== 'Standard' && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                      {taxBenefitSection === '80TTB' ? 'Sec 80TTB Eligible' : taxBenefitSection}
                    </span>
                  )}
                </div>

                {/* Key Metrics Box */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 my-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">
                        {previewSenior ? 'Senior Citizen Rate' : 'Regular Interest Rate'}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold text-blue-900 font-mono tracking-tight">
                          {(previewSenior ? (seniorCitizenRate || 0) : (generalRate || 0)).toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">p.a.</span>
                      </div>
                    </div>

                    {previewSenior && rateDiff > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{rateDiff.toFixed(2)}% for 60+
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">Tenure</span>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {popularTenureLabel || '12 to 60 Months'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">Min Deposit</span>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {formatINR(Number(minInvestment) || 10000)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                <ul className="text-xs text-slate-600 space-y-1 mb-4">
                  {highlights.slice(0, 2).map((hl, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-blue-600 font-bold shrink-0">&bull;</span>
                      <span className="line-clamp-2">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDetailModalPreview(true)}
                  className="py-2 px-2 text-[11px] font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>Inspect Modal</span>
                </button>
                <div className="py-2 px-2 text-[11px] font-bold rounded-xl text-white bg-blue-600 text-center shadow-2xs">
                  Calculate Yield
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Detail Modal */}
      {showDetailModalPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {subType || 'Fixed Income'}
                </span>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  {name || 'Product Scheme Name'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Issued by: {issuer || 'Company Name'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModalPreview(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200/80">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">General Rate</span>
                    <p className="text-base font-bold text-slate-900 font-mono">
                      {(Number(generalRate) || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-700 uppercase font-bold">Senior (60+)</span>
                    <p className="text-base font-extrabold text-amber-700 font-mono">
                      {(Number(seniorCitizenRate) || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-700 uppercase font-bold">Super Senior (80+)</span>
                    <p className="text-base font-bold text-emerald-700 font-mono">
                      {superSeniorRate ? `${Number(superSeniorRate).toFixed(2)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">Scheme Overview</h5>
                <p className="text-slate-600 leading-relaxed">
                  {description || 'Official scheme details and interest schedule.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Safety & Rating</span>
                  <span className="font-bold text-slate-800">{creditRating}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">DICGC Insurance</span>
                  <span className="font-bold text-emerald-700">
                    {dicgcCovered ? 'Covered (₹5L)' : 'Corporate Risk'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">TDS Threshold</span>
                  <span className="font-bold text-slate-800">{formatINR(Number(tdsThreshold) || 5000)}/yr</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Premature Exit</span>
                  <span className="font-bold text-slate-800">
                    {prematureWithdrawalAllowed ? 'Allowed' : 'Strict Lock-in'}
                  </span>
                </div>
              </div>

              {officialApplyUrl && (
                <div className="pt-2">
                  <a
                    href={officialApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Visit Official Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
