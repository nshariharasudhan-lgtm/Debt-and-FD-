'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  SlidersHorizontal, 
  TrendingUp, 
  Mail, 
  Database, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Edit3, 
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  Users,
  Bot,
  RefreshCw,
  Terminal,
  ArrowUpRight,
  Key,
  LogOut,
  User,
  Globe,
  PlusCircle,
  Edit,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AdminAuthGate } from '@/components/AdminAuthGate';
import { ManualInstrumentForm } from '@/components/ManualInstrumentForm';
import { MasterArticlesCMS } from '@/components/MasterArticlesCMS';
import { 
  initialBenchmarks, 
  initialDebtInstruments, 
  sampleSubscribers, 
  marketPulseUpdates,
  DebtInstrument, 
  MarketBenchmark, 
  NewsletterSubscriber,
  MarketPulseUpdate 
} from '@/lib/debt-data';
import { formatINR } from '@/lib/debt-calculations';
import { 
  defaultScrapeTargets, 
  ScrapedRateResult, 
  AgentExecutionLog,
  ScrapeUrlResult,
  ScrapeTarget
} from '@/lib/scraping-agent';

export default function MasterDashboardPage() {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'instruments' | 'manual_entry' | 'subscribers' | 'prompt' | 'bulletin' | 'scraper' | 'articles'>('benchmarks');
  const [fullFormEditInstrument, setFullFormEditInstrument] = useState<DebtInstrument | null>(null);
  const [scraperRunning, setScraperRunning] = useState(false);
  const [scraperLogs, setScraperLogs] = useState<AgentExecutionLog[]>([]);
  const [scrapedResults, setScrapedResults] = useState<ScrapedRateResult[]>([]);
  const [customScrapeTargets, setCustomScrapeTargets] = useState<ScrapeTarget[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>(defaultScrapeTargets.map(t => t.id));
  const [scraperCategoryFilter, setScraperCategoryFilter] = useState<'all' | 'psu_bank' | 'private_bank' | 'sfb_bank' | 'corporate_nbfc' | 'rbi_sovereign'>('all');
  const [applyScrapedSuccess, setApplyScrapedSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'fallback' | 'checking'>('checking');
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark>(initialBenchmarks);
  const [instruments, setInstruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(sampleSubscribers);
  const [articlesCount, setArticlesCount] = useState<number>(3);

  // New Target Form State
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetCategory, setNewTargetCategory] = useState<ScrapeTarget['category']>('corporate_nbfc');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [newTargetAdding, setNewTargetAdding] = useState(false);
  const [newTargetMsg, setNewTargetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [bulletins, setBulletins] = useState<MarketPulseUpdate[]>(marketPulseUpdates);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [verifyingTable, setVerifyingTable] = useState(false);
  const [tableStatus, setTableStatus] = useState<{ checked: boolean; exists: boolean; message: string }>({
    checked: false,
    exists: false,
    message: ''
  });
  const [resettingAdmin, setResettingAdmin] = useState(false);
  const [resetAdminMsg, setResetAdminMsg] = useState('');
  const [subSearch, setSubSearch] = useState('');
  const [editingInstrumentId, setEditingInstrumentId] = useState<string | null>(null);

  // Custom URL scraper states
  const [customUrl, setCustomUrl] = useState('');
  const [customUrlScraping, setCustomUrlScraping] = useState(false);
  const [autoAddIfNew, setAutoAddIfNew] = useState(true);
  const [customUrlResult, setCustomUrlResult] = useState<ScrapeUrlResult | null>(null);
  const [newCorporateNotice, setNewCorporateNotice] = useState<{
    name: string;
    generalRate: number;
    seniorRate: number;
    rating: string;
    isNew: boolean;
  } | null>(null);

  // Safely hydrate saved benchmarks and instruments from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedBench = localStorage.getItem('bharat_debt_benchmarks');
        if (savedBench) setBenchmarks(JSON.parse(savedBench));

        const savedInst = localStorage.getItem('bharat_debt_instruments');
        if (savedInst) setInstruments(JSON.parse(savedInst));

        const savedSubs = localStorage.getItem('bharat_debt_newsletter_subscribers');
        if (savedSubs) setSubscribers(JSON.parse(savedSubs));
      } catch (e) {
        console.error(e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync newsletter subscribers from API & Supabase
  useEffect(() => {
    async function loadSubscribers() {
      try {
        const [newsRes, authRes] = await Promise.all([
          fetch('/api/newsletter'),
          fetch('/api/admin/auth')
        ]);
        const json = await newsRes.json();
        const authJson = await authRes.json();
        
        if (json.success && Array.isArray(json.subscribers)) {
          setSubscribers(json.subscribers);
        }
        if (authJson.connected || json.source === 'supabase') {
          setSupabaseStatus('connected');
        } else {
          setSupabaseStatus('fallback');
        }
      } catch (err) {
        console.warn('Subscribers load notice:', err);
        setSupabaseStatus('fallback');
      }
    }
    loadSubscribers();
  }, []);

  const handleSaveBenchmarks = () => {
    localStorage.setItem('bharat_debt_benchmarks', JSON.stringify(benchmarks));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveInstruments = () => {
    localStorage.setItem('bharat_debt_instruments', JSON.stringify(instruments));
    window.dispatchEvent(new Event('storage'));
    setEditingInstrumentId(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleFeatured = (id: string) => {
    setInstruments(prev => {
      const updated = prev.map(inst => inst.id === id ? { ...inst, featured: !inst.featured } : inst);
      localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      return updated;
    });
  };

  const handleSaveManualInstrument = (newInst: DebtInstrument) => {
    setInstruments(prev => {
      const exists = prev.some(i => i.id === newInst.id);
      let updated: DebtInstrument[];
      if (exists) {
        updated = prev.map(i => i.id === newInst.id ? newInst : i);
      } else {
        updated = [newInst, ...prev];
      }
      localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      return updated;
    });
    setFullFormEditInstrument(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setActiveTab('instruments');
  };

  const handleDeleteInstrument = (id: string, name: string) => {
    if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to remove "${name}" from the active debt directory?`)) {
      setInstruments(prev => {
        const updated = prev.filter(i => i.id !== id);
        localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        return updated;
      });
    }
  };

  const handleOpenEditInForm = (inst: DebtInstrument) => {
    setFullFormEditInstrument(inst);
    setActiveTab('manual_entry');
  };

  const handleOpenNewEntry = () => {
    setFullFormEditInstrument(null);
    setActiveTab('manual_entry');
  };

  // Hydrate custom scrape targets
  useEffect(() => {
    async function loadCustomTargets() {
      try {
        let loaded: ScrapeTarget[] = [];
        const local = localStorage.getItem('bharat_debt_custom_scrape_targets');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) loaded = parsed;
          } catch (e) {
            console.error('Error parsing local scrape targets', e);
          }
        }

        try {
          const res = await fetch('/api/agent/targets');
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.targets)) {
              loaded = json.targets;
            }
          }
        } catch (apiErr) {
          console.warn('Scrape targets API fetch notice', apiErr);
        }

        if (loaded.length > 0) {
          setCustomScrapeTargets(loaded);
          // Automatically check them in selector
          setSelectedTargetIds(prev => {
            const combined = new Set([...prev, ...loaded.map(t => t.id)]);
            return Array.from(combined);
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadCustomTargets();
  }, []);

  const handleAddNewTargetToBot = async () => {
    if (!newTargetName.trim() || !newTargetUrl.trim()) {
      setNewTargetMsg({ type: 'error', text: 'Please provide both an institution name and valid URL.' });
      return;
    }

    let urlToUse = newTargetUrl.trim();
    if (!urlToUse.startsWith('http://') && !urlToUse.startsWith('https://')) {
      urlToUse = 'https://' + urlToUse;
    }

    setNewTargetAdding(true);
    setNewTargetMsg(null);

    const newTarget: ScrapeTarget = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newTargetName.trim(),
      category: newTargetCategory,
      officialUrl: urlToUse,
      status: 'idle',
      isCustom: true
    };

    const updated = [newTarget, ...customScrapeTargets];
    setCustomScrapeTargets(updated);
    setSelectedTargetIds(prev => [...prev, newTarget.id]);

    try {
      localStorage.setItem('bharat_debt_custom_scrape_targets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Also persist to API
    try {
      await fetch('/api/agent/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
      });
    } catch (apiErr) {
      console.warn('API targets save notice', apiErr);
    }

    setNewTargetName('');
    setNewTargetUrl('');
    setNewTargetAdding(false);
    setNewTargetMsg({ type: 'success', text: `Target "${newTarget.name}" added to Scrape Bot successfully!` });
    setTimeout(() => setNewTargetMsg(null), 4000);
  };

  const handleDeleteCustomTarget = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this custom URL from the scraping bot?')) return;

    const remaining = customScrapeTargets.filter(t => t.id !== id);
    setCustomScrapeTargets(remaining);
    setSelectedTargetIds(prev => prev.filter(tid => tid !== id));

    try {
      localStorage.setItem('bharat_debt_custom_scrape_targets', JSON.stringify(remaining));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch(`/api/agent/targets?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete target error', err);
    }
  };

  const handleRunScraperAgent = async () => {
    if (selectedTargetIds.length === 0) return;
    setScraperRunning(true);
    setApplyScrapedSuccess(false);
    setScraperLogs([]);
    setScrapedResults([]);

    try {
      const response = await fetch('/api/agent/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetIds: selectedTargetIds,
          customTargets: customScrapeTargets,
          existingInstruments: instruments
        })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setScraperLogs(data.data.logs || []);
        setScrapedResults(data.data.results || []);
      } else {
        setScraperLogs([
          { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: data.error || 'Scraper run failed' }
        ]);
      }
    } catch (e: any) {
      setScraperLogs([
        { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: e.message || 'Network request failed' }
      ]);
    } finally {
      setScraperRunning(false);
    }
  };

  const handleApplyScrapedToCatalog = () => {
    if (scrapedResults.length === 0) return;

    setInstruments(prev => {
      let updated = [...prev];
      // Update existing instruments
      updated = updated.map(inst => {
        const match = scrapedResults.find(r => 
          r.issuer.toLowerCase().includes(inst.issuer.toLowerCase()) ||
          inst.issuer.toLowerCase().includes(r.issuer.toLowerCase())
        );
        if (match) {
          return {
            ...inst,
            generalRate: match.generalRate,
            seniorCitizenRate: match.seniorCitizenRate,
            popularTenureLabel: match.tenure
          };
        }
        return inst;
      });

      // Also append any new entities that are not currently in the catalog
      for (const r of scrapedResults) {
        const exists = updated.some(inst => 
          inst.issuer.toLowerCase().includes(r.issuer.toLowerCase()) ||
          r.issuer.toLowerCase().includes(inst.issuer.toLowerCase())
        );
        if (!exists) {
          updated.unshift({
            id: r.targetId || `corp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: r.instrumentName,
            issuer: r.issuer,
            type: r.category === 'corporate_nbfc' ? 'corporate_fd' : 'bank_fd',
            subType: r.category === 'corporate_nbfc' ? 'Corporate Fixed Deposit' : 'Bank Term Deposit',
            generalRate: r.generalRate,
            seniorCitizenRate: r.seniorCitizenRate,
            superSeniorRate: r.superSeniorRate,
            tenureMonthsMin: 12,
            tenureMonthsMax: 60,
            popularTenureLabel: r.tenure,
            payoutFrequency: ['quarterly', 'cumulative'],
            creditRating: r.creditRating,
            safetyLevel: r.dicgcInsured ? 'Very High (DICGC Insured)' : 'High (AAA Corporate)',
            minInvestment: r.minInvestment || 10000,
            dicgcCovered: r.dicgcInsured,
            taxBenefitSection: r.dicgcInsured ? '80TTB' : 'Standard',
            tdsThreshold: r.dicgcInsured ? 50000 : 5000,
            description: `Official fixed deposit schedule for ${r.issuer}.`,
            keyHighlights: [
              `Up to ${r.seniorCitizenRate}% p.a. for Senior Citizens`,
              `Credit Safety: ${r.creditRating}`
            ],
            prematureWithdrawalAllowed: true,
            officialApplyUrl: r.sourceUrl,
            lastUpdated: 'Live Scraped Rates',
            featured: r.generalRate >= 8.20
          });
        }
      }

      localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      return updated;
    });

    setApplyScrapedSuccess(true);
    setTimeout(() => setApplyScrapedSuccess(false), 2500);
  };

  const handleScrapeCustomUrl = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || customUrl).trim();
    if (!targetUrl) return;
    setCustomUrlScraping(true);
    setNewCorporateNotice(null);
    setCustomUrlResult(null);

    try {
      const response = await fetch('/api/agent/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          existingInstruments: instruments
        })
      });
      const data = await response.json();
      if (data.success && data.data) {
        const urlData: ScrapeUrlResult = data.data;
        setCustomUrlResult(urlData);
        setScraperLogs(prev => [...(urlData.logs || []), ...prev]);

        if (urlData.isNewCorporate && autoAddIfNew) {
          const newInst = urlData.scrapedInstrument;
          setInstruments(prev => {
            const filtered = prev.filter(p => p.id !== newInst.id);
            const updated = [newInst, ...filtered];
            localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
            return updated;
          });
          setNewCorporateNotice({
            name: newInst.issuer,
            generalRate: newInst.generalRate,
            seniorRate: newInst.seniorCitizenRate,
            rating: newInst.creditRating,
            isNew: true
          });
        } else if (!urlData.isNewCorporate && autoAddIfNew) {
          const updatedInst = urlData.scrapedInstrument;
          setInstruments(prev => {
            const updated = prev.map(p => {
              if (p.id === updatedInst.id || p.issuer.toLowerCase().includes(updatedInst.issuer.toLowerCase()) || updatedInst.issuer.toLowerCase().includes(p.issuer.toLowerCase())) {
                return {
                  ...p,
                  generalRate: updatedInst.generalRate,
                  seniorCitizenRate: updatedInst.seniorCitizenRate,
                  superSeniorRate: updatedInst.superSeniorRate,
                  popularTenureLabel: updatedInst.popularTenureLabel,
                  creditRating: updatedInst.creditRating,
                  lastUpdated: 'Live Scraped Rates'
                };
              }
              return p;
            });
            localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
            return updated;
          });
          setNewCorporateNotice({
            name: updatedInst.issuer,
            generalRate: updatedInst.generalRate,
            seniorRate: updatedInst.seniorCitizenRate,
            rating: updatedInst.creditRating,
            isNew: false
          });
        }
      } else {
        setScraperLogs(prev => [
          { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: data.error || 'Custom URL scraping failed' },
          ...prev
        ]);
      }
    } catch (e: any) {
      setScraperLogs(prev => [
        { timestamp: new Date().toLocaleTimeString('en-IN'), stage: 'SYNC', level: 'error', message: e.message || 'Network request failed' },
        ...prev
      ]);
    } finally {
      setCustomUrlScraping(false);
    }
  };

  const handleExportSubscribersCSV = () => {
    const headers = 'ID,Email,Investor Type,Primary Interest,Subscribed At,Status\n';
    const rows = subscribers.map(s => 
      `"${s.id}","${s.email}","${s.investorType}","${s.primaryInterest}","${s.subscribedAt}","${s.status}"`
    ).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `debt-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const supabaseTableSql = `-- =========================================================================
-- BHARATFIXED SUPABASE DATABASE SCHEMA: NEWSLETTER SUBSCRIBERS TABLE
-- Run this in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- =========================================================================

-- 1. Create the newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    investor_type TEXT DEFAULT 'Senior Citizen (60+)',
    primary_interest TEXT DEFAULT 'Senior Citizen FDs & SCSS Quarterly Payouts',
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on email for high-speed queries & duplicate prevention
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
ON public.newsletter_subscribers(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow public newsletter signups (INSERT)
CREATE POLICY "Allow public newsletter signups" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Allow full access for service role and authenticated admin
CREATE POLICY "Allow full access for service role and admins" 
ON public.newsletter_subscribers 
FOR ALL 
USING (true) 
WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseTableSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleVerifyTable = async () => {
    setVerifyingTable(true);
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (data.tableExists) {
        setTableStatus({
          checked: true,
          exists: true,
          message: `Table 'public.newsletter_subscribers' is verified and ACTIVE in Supabase! (${data.count ?? 0} records stored)`
        });
        setSupabaseStatus('connected');
        if (Array.isArray(data.subscribers)) setSubscribers(data.subscribers);
      } else {
        setTableStatus({
          checked: true,
          exists: false,
          message: `Table 'public.newsletter_subscribers' not yet found in Supabase schema cache. Run the SQL script in your Supabase SQL Editor and re-check.`
        });
      }
    } catch (err: any) {
      setTableStatus({
        checked: true,
        exists: false,
        message: err.message || 'Error checking table'
      });
    } finally {
      setVerifyingTable(false);
    }
  };

  const handleResetAdmin = async () => {
    setResettingAdmin(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_admin' })
      });
      const data = await res.json();
      if (data.success) {
        setResetAdminMsg(`Admin account reset successfully! User ID: harihns.0306@gmail.com, Password: BharatAdmin@2025`);
      } else {
        setResetAdminMsg(data.error || 'Failed to reset admin credentials.');
      }
    } catch (err: any) {
      setResetAdminMsg(err.message || 'Network error');
    } finally {
      setResettingAdmin(false);
      setTimeout(() => setResetAdminMsg(''), 6000);
    }
  };

  const masterPromptText = `Build a comprehensive, production-ready Debt Instruments Information & Yield Analytics portal for the Indian financial market, functioning similarly to Value Research or Morningstar but exclusively focused on Fixed Deposits (Bank & Corporate NBFC), RBI Bonds, Sovereign Debt, and Senior Citizen fixed income products.

Key Requirements:
1. Indian Fixed Income Directory:
   - Public Sector Bank FDs (SBI, Bank of Baroda, PNB)
   - Private Sector Bank FDs (HDFC, ICICI)
   - High-Yield Scheduled Small Finance Banks (AU Small Finance Bank, Unity SFB with yields up to 9.40%)
   - Corporate FDs (Bajaj Finance AAA, Shriram Finance, Mahindra Finance)
   - Government & RBI Instruments: Senior Citizen Savings Scheme (SCSS 8.20%), RBI Floating Rate Savings Bonds (FRSB 8.05%), 10-Year Benchmark G-Sec, Post Office Monthly Income Scheme (POMIS)
   - Corporate Bonds & NCDs: NHAI Tax-Free Bonds (Section 10(15)), REC 54EC Real Estate Capital Gains Exemption Bonds, Tata Capital NCDs

2. Senior Citizen & Investor Analytical Engine:
   - Dedicated Senior Citizen Yield & Cashflow Visualizer with +0.50% to +0.75% rate premium.
   - Section 80TTB Tax-Free Interest Calculator: Automatically simulates the ₹50,000 annual interest deduction for senior citizens versus 80TTA.
   - Form 15H / 15G Zero-TDS deduction toggle.
   - Compounding mode selection: Quarterly statutory banking compounding (cumulative) vs Monthly pension cashflow vs Quarterly SCSS payout.
   - Post-tax real return calculation taking into account Indian tax slabs (0%, 10%, 20%, 30%) and CPI inflation rates.
   - Visual breakdown of Principal vs Gross Interest vs Section 80TTB Tax Shield vs Net Post-Tax Yield.

3. Retirement Monthly Cashflow & Pension Planner:
   - Enter retirement corpus (e.g. ₹30,00,000 to ₹1 Crore).
   - Optimize allocations across SCSS (quarterly 8.2%), RBI Floating Bonds, Top PSU FDs, and SFBs.
   - Generates a 12-month Jan-Dec predictable cashflow calendar showing exact monthly pension payouts.
   - Verifies 100% DICGC statutory insurance safety (₹5,00,000 per bank) and sovereign backing.

4. Side-by-Side Instrument Comparator:
   - Compare any 3 fixed income products across safety ratings, DICGC coverage, Section 80TTB eligibility, TDS thresholds, liquidity, and 5-year net returns.

5. Master Dashboard (Accessible via URL):
   - Dedicated hidden URL access (/master-dashboard) without public admin login buttons in the front header.
   - No user authentication required at this stage.
   - Live benchmark editor (RBI Repo Rate 6.50%, 10Y G-Sec 6.92%, SCSS 8.20%, CPI Inflation).
   - Instrument inventory editor to update rates and featured recommendations.
   - Newsletter subscribers manager with live list and CSV export.

6. Weekly Newsletter ("The Indian Debt Pulse"):
   - Investor sign-up capturing email, investor category (Senior Citizen 60+, Retiree, Retail), and primary interest.
   - Syncs directly to the Master Dashboard for lead collection and weekly market trend notifications.

7. SEO-Optimized Financial Architecture:
   - Deep editorial guides on Section 80TTB, RBI DICGC ₹5 Lakh coverage, Form 15H filing, and Corporate vs Bank FD credit risk.
   - Crafted with sophisticated, high-contrast financial aesthetics without generic AI clichés.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const filteredSubs = subscribers.filter(s => 
    s.email.toLowerCase().includes(subSearch.toLowerCase()) ||
    s.investorType.toLowerCase().includes(subSearch.toLowerCase())
  );

  return (
    <AdminAuthGate>
      {({ adminEmail, adminRole, isSupabaseConnected, onSignOut, onOpenChangePassword }) => (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans w-full max-w-full overflow-x-hidden">
          {/* Top Bar */}
          <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 shadow-2xs">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link 
                  href="/" 
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  title="Return to Public Site"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold font-serif text-slate-900 tracking-tight">
                      BharatFixed <span className="text-blue-700">Master Dashboard</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Role: {adminRole}
                    </span>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Database className="w-3 h-3 text-blue-600" />
                      Supabase Cloud: {isSupabaseConnected ? 'Connected' : 'Local'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Administrative controls, live rate adjustments, newsletter subscriber leads & AI scraping agent
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-mono">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold">{adminEmail}</span>
                  <span className="text-[9px] bg-blue-700 text-white px-1.5 py-0.5 rounded-md font-sans font-bold uppercase tracking-wider">Admin</span>
                </div>

                <button
                  onClick={onOpenChangePassword}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Change Admin Password"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Change Password</span>
                </button>

                <Link
                  href="/"
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                >
                  View Public Site
                </Link>

                <button
                  onClick={onSignOut}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors border border-red-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Sign out of Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 py-8 w-full max-w-full overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto touch-pan-x overscroll-x-contain scrollbar-none border-b border-slate-200 pb-3 mb-6 text-xs sm:text-sm w-full max-w-full">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'benchmarks' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Market Benchmarks</span>
          </button>

          <button
            onClick={() => setActiveTab('instruments')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'instruments' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Instruments & Rates ({instruments.length})</span>
          </button>

          <button
            onClick={handleOpenNewEntry}
            id="master-tab-manual-entry"
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'manual_entry' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>{fullFormEditInstrument ? `Edit ${fullFormEditInstrument.issuer}` : '+ Manual Product Entry'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            id="master-tab-scraper"
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'scraper' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Bank & Corporate Scraper</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'subscribers' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            id="master-tab-articles"
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'articles' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Guides &amp; SEO Blog ({articlesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'prompt' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Studio AI Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('bulletin')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'bulletin' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Market Trends Dispatch</span>
          </button>
        </div>

        {/* Save Toast */}
        {savedSuccess && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Updates saved successfully! The front website will reflect your updated figures immediately.</span>
          </div>
        )}

        {/* Tab 1: Market Benchmarks */}
        {activeTab === 'benchmarks' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">Configure Indian Fixed Income Benchmarks</h2>
              <p className="text-xs text-slate-500 mt-1">
                These rates drive the top ticker and macroeconomic comparison models across the portal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">RBI Repo Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={benchmarks.rbiRepoRate}
                  onChange={(e) => setBenchmarks({ ...benchmarks, rbiRepoRate: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Monetary Policy baseline</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">10Y Benchmark G-Sec (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={benchmarks.benchmarkGsec10Y}
                  onChange={(e) => setBenchmarks({ ...benchmarks, benchmarkGsec10Y: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Sovereign 10-year market yield</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Senior Citizen SCSS Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={benchmarks.scssRate}
                  onChange={(e) => setBenchmarks({ ...benchmarks, scssRate: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Ministry of Finance notification</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">RBI Floating Rate Bonds (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={benchmarks.rbiFrsbRate}
                  onChange={(e) => setBenchmarks({ ...benchmarks, rbiFrsbRate: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">NSC rate + 35 bps spread</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Top SFB Senior FD Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={benchmarks.highestSfbFdRate}
                  onChange={(e) => setBenchmarks({ ...benchmarks, highestSfbFdRate: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Highest scheduled SFB card rate</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Retail CPI Inflation (%)</label>
                <input
                  type="number"
                  step="0.10"
                  value={benchmarks.retailCpiInflation}
                  onChange={(e) => setBenchmarks({ ...benchmarks, retailCpiInflation: Number(e.target.value) })}
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-blue-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Erosion benchmark for real yields</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSaveBenchmarks}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Benchmark Rates</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Instruments Inventory */}
        {activeTab === 'instruments' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Debt Instruments Inventory</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust active interest rates, senior citizen premiums, and toggle recommended featured status.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenNewEntry}
                  id="btn-master-add-manual-product"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Manual Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('scraper')}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-blue-200 shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scrape & Add from URL</span>
                </button>
                <button
                  onClick={handleSaveInstruments}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            <div className="sm:hidden px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex justify-between mb-2">
              <span>Swipe table horizontally to edit all fields</span>
              <span>&rarr;</span>
            </div>
            <div className="overflow-x-auto touch-pan-x overscroll-x-contain w-full max-w-full border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="py-3 px-3">Instrument</th>
                    <th className="py-3 px-3">Type / Issuer</th>
                    <th className="py-3 px-3">General Rate</th>
                    <th className="py-3 px-3">Senior Rate (60+)</th>
                    <th className="py-3 px-3">Rating / Safety</th>
                    <th className="py-3 px-3">DICGC</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {instruments.map(inst => {
                    const isEditing = editingInstrumentId === inst.id;

                    return (
                      <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{inst.name}</span>
                          <span className="text-[10px] text-slate-500">{inst.popularTenureLabel}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-medium block">{inst.issuer}</span>
                          <span className="text-[10px] text-blue-700">{inst.subType}</span>
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.05"
                              value={inst.generalRate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setInstruments(prev => prev.map(i => i.id === inst.id ? { ...i, generalRate: val } : i));
                              }}
                              className="w-16 py-1 px-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono font-bold"
                            />
                          ) : (
                            <span className="font-mono font-bold text-slate-800">{inst.generalRate.toFixed(2)}%</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.05"
                              value={inst.seniorCitizenRate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setInstruments(prev => prev.map(i => i.id === inst.id ? { ...i, seniorCitizenRate: val } : i));
                              }}
                              className="w-16 py-1 px-1.5 bg-white border border-blue-400 rounded text-blue-900 font-mono font-bold"
                            />
                          ) : (
                            <span className="font-mono font-bold text-blue-900">{inst.seniorCitizenRate.toFixed(2)}%</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {inst.creditRating}
                        </td>
                        <td className="py-3 px-3">
                          {inst.dicgcCovered ? (
                            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">Yes (₹5L)</span>
                          ) : (
                            <span className="text-slate-400">Corporate</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleFeatured(inst.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inst.featured ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {inst.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingInstrumentId(isEditing ? null : inst.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isEditing ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                              title={isEditing ? 'Close quick edit' : 'Quick rate edit'}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditInForm(inst)}
                              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                              title="Edit all fields in Full Manual Form"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInstrument(inst.id, inst.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete from active directory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Tab: Manual Company & Product Entry Form */}
        {activeTab === 'manual_entry' && (
          <ManualInstrumentForm
            key={fullFormEditInstrument?.id || 'new-entry'}
            onSaveInstrument={handleSaveManualInstrument}
            editingInstrument={fullFormEditInstrument}
            onCancelEdit={() => {
              setFullFormEditInstrument(null);
              setActiveTab('instruments');
            }}
          />
        )}

        {/* Tab 3: Newsletter Subscribers */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-serif">Weekly Newsletter Subscribers ({subscribers.length})</h2>
                  {supabaseStatus === 'connected' ? (
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Supabase Cloud DB Connected
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold" title="To persist directly to Supabase cloud, provide credentials in .env">
                      Active (Supabase Keys in .env)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Investors registered for &ldquo;The Indian Debt Pulse&rdquo; weekly updates. Email captures are stored server-side with Supabase database support.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/newsletter');
                      const json = await res.json();
                      if (json.success && Array.isArray(json.subscribers)) {
                        setSubscribers(json.subscribers);
                        setSupabaseStatus(json.source === 'supabase' ? 'connected' : 'fallback');
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Refresh from Database"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync DB</span>
                </button>
                <button
                  onClick={handleExportSubscribersCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by email or investor category..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-blue-600"
              />
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="py-2.5 px-3">Subscriber Email</th>
                    <th className="py-2.5 px-3">Investor Category</th>
                    <th className="py-2.5 px-3">Primary Focus</th>
                    <th className="py-2.5 px-3">Subscribed Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredSubs.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{sub.email}</td>
                      <td className="py-3 px-3 text-blue-700 font-sans font-medium">{sub.investorType}</td>
                      <td className="py-3 px-3 text-slate-600 font-sans">{sub.primaryInterest}</td>
                      <td className="py-3 px-3 text-slate-500">{sub.subscribedAt}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-sans font-bold">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Supabase Schema Setup & Verification Box */}
            <div className="pt-4 border-t border-slate-200/90 space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-white font-serif">
                        Supabase Database Setup: <code className="text-emerald-400 font-mono text-xs">newsletter_subscribers</code>
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Execute this SQL script in your Supabase Dashboard to create the table and enable automatic public newsletter capture with Row Level Security (RLS).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySql}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied SQL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy SQL Query</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleVerifyTable}
                      disabled={verifyingTable}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {verifyingTable ? (
                        <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>Verify Table in Supabase</span>
                    </button>
                  </div>
                </div>

                {/* Table verification feedback */}
                {tableStatus.checked && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                    tableStatus.exists 
                      ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200' 
                      : 'bg-amber-950/70 border border-amber-800 text-amber-200'
                  }`}>
                    {tableStatus.exists ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                    )}
                    <span>{tableStatus.message}</span>
                  </div>
                )}

                {/* SQL Code Preview Block */}
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/90 font-mono text-[11px] leading-relaxed">
                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>SQL Query (Supabase Dashboard &rarr; SQL Editor)</span>
                    <span className="text-emerald-400 font-semibold">PostgreSQL DDL</span>
                  </div>
                  <pre className="p-4 text-slate-300 overflow-x-auto max-h-52 select-all whitespace-pre">
                    {supabaseTableSql}
                  </pre>
                </div>

                {/* Step by step guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="font-bold text-white text-[11px]">Step 1: Open SQL Editor</span>
                    <p className="text-[11px] text-slate-400">Go to your Supabase project dashboard and click on <strong className="text-slate-200">SQL Editor</strong> on the left bar.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="font-bold text-white text-[11px]">Step 2: Paste & Click Run</span>
                    <p className="text-[11px] text-slate-400">Click &ldquo;Copy SQL Query&rdquo; above, paste into a new query, and click the green <strong className="text-emerald-400">Run</strong> button.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="font-bold text-white text-[11px]">Step 3: Click Verify</span>
                    <p className="text-[11px] text-slate-400">Click &ldquo;Verify Table in Supabase&rdquo; above. The dashboard will immediately connect and show live status.</p>
                  </div>
                </div>
              </div>

              {/* Admin Reset Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-bold text-slate-900">Admin Credentials & Role Reset</h4>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Role: Admin Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    User ID: <code className="text-blue-700 font-semibold font-mono">harihns.0306@gmail.com</code> &bull; Initial Password: <code className="text-slate-700 font-mono">BharatAdmin@2025</code>
                  </p>
                  {resetAdminMsg && (
                    <p className="text-xs text-emerald-700 font-semibold mt-1 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                      {resetAdminMsg}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleResetAdmin}
                  disabled={resettingAdmin}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {resettingAdmin ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>Reset Admin Password to Default</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Studio AI Prompt Generator */}
        {activeTab === 'prompt' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompt for Google AI Studio</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Comprehensive Production Prompt</h2>
                <p className="text-xs text-slate-500 mt-1">
                  As requested, here is the exact, comprehensive prompt you can copy and give to Google AI Studio to recreate or expand this application.
                </p>
              </div>

              <button
                onClick={handleCopyPrompt}
                id="copy-studio-prompt-btn"
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto shadow-2xs"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Master Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto selection:bg-blue-500 selection:text-white">
              {masterPromptText}
            </div>
          </div>
        )}

        {/* Tab 5: Market Trends & Bulletin */}
        {activeTab === 'bulletin' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">Weekly Market Trends & Changes Bulletin</h2>
              <p className="text-xs text-slate-500 mt-1">
                Editorial updates and monetary changes that get dispatched to newsletter subscribers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bulletins.map(b => (
                <div key={b.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{b.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.summary}</p>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-800">
                    <strong>Investor Takeaway:</strong> {b.impactForInvestors}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Autonomous Bank & Corporate Scraping Agent */}
        {activeTab === 'scraper' && (
          <div className="space-y-6">
            {/* Direct Bank or Corporate URL Scraper & Auto-Add Card */}
            <div className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-2xl border-2 border-blue-300/80 p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 font-serif">
                      Scrape Any Bank or Corporate FD by URL
                    </h2>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                      Auto-Add Enabled
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    Paste the published Fixed Deposit tariff page URL of any Indian bank or corporate NBFC (e.g. Piramal, Muthoot, Godrej, Federal Bank, Suryoday). The crawler extracts rates, safety ratings, and <strong className="text-blue-900">automatically registers new corporates into your public directory</strong>.
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      id="master-custom-scrape-url-input"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleScrapeCustomUrl();
                        }
                      }}
                      placeholder="e.g. https://piramalfinance.com/fixed-deposit or https://www.muthootfinance.com/fixed-deposit"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800 placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>

                  <button
                    onClick={() => handleScrapeCustomUrl()}
                    disabled={customUrlScraping || !customUrl.trim()}
                    id="master-btn-scrape-custom-url"
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs active:scale-95 shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${customUrlScraping ? 'animate-spin' : ''}`} />
                    <span>{customUrlScraping ? 'Crawling & Ingesting...' : 'Scrape & Auto-Add'}</span>
                  </button>
                </div>

                {/* Auto-Add Option Toggle & Quick Examples */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={autoAddIfNew}
                      onChange={(e) => setAutoAddIfNew(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Automatically append newly detected corporate to directory catalog</span>
                  </label>

                  {/* Preset quick test chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-semibold">Quick Presets:</span>
                    {[
                      { name: 'Piramal Finance', url: 'https://piramalfinance.com/fixed-deposit' },
                      { name: 'Muthoot Finance', url: 'https://www.muthootfinance.com/fixed-deposit' },
                      { name: 'Godrej Capital', url: 'https://godrejcapital.com/fixed-deposit' },
                      { name: 'Federal Bank', url: 'https://www.federalbank.co.in/deposit-rate' },
                      { name: 'Suryoday SFB', url: 'https://www.suryodaybank.com/rate' }
                    ].map(p => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setCustomUrl(p.url);
                          handleScrapeCustomUrl(p.url);
                        }}
                        disabled={customUrlScraping}
                        className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg transition-colors font-medium shadow-2xs"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Banner when Scraped */}
              {newCorporateNotice && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300 ${
                  newCorporateNotice.isNew 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        newCorporateNotice.isNew ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {newCorporateNotice.isNew ? '✨ New Corporate Ingested & Added' : '🔄 Existing Card Rate Updated'}
                      </span>
                      <strong className="text-sm font-bold">{newCorporateNotice.name}</strong>
                    </div>
                    <p className="text-xs opacity-90">
                      {newCorporateNotice.isNew
                        ? `This corporate was not previously listed. It has been automatically added to your public debt inventory with verified parameters.`
                        : `Existing card rates have been refreshed with the latest parsed interest schedule.`
                      }
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                      <span className="bg-white/90 px-2.5 py-0.5 rounded border border-current/20 font-bold">
                        General: {newCorporateNotice.generalRate}%
                      </span>
                      <span className="bg-white/90 px-2.5 py-0.5 rounded border border-current/20 font-bold">
                        Senior: {newCorporateNotice.seniorRate}%
                      </span>
                      <span className="bg-white/90 px-2.5 py-0.5 rounded border border-current/20">
                        Rating: {newCorporateNotice.rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('instruments')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
                  >
                    <span>View in Catalog ({instruments.length})</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Top Scraper Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-serif">Autonomous Debt Scraping & Sync Agent</h2>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Gemini 2.5 Powered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Crawls and parses official tariff schedules from Indian PSU banks, private banks, small finance banks (AU, Unity), NBFCs (Bajaj, Shriram), and RBI gazettes to detect senior citizen rate revisions and DICGC protection updates.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRunScraperAgent}
                    disabled={scraperRunning || selectedTargetIds.length === 0}
                    id="master-btn-trigger-scraper"
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-2xs active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${scraperRunning ? 'animate-spin' : ''}`} />
                    <span>{scraperRunning ? 'Scraping Active...' : 'Run Autonomous Scraper'}</span>
                  </button>

                  {scrapedResults.length > 0 && (
                    <button
                      onClick={handleApplyScrapedToCatalog}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {applyScrapedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Catalog Updated!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          <span>Apply to Public Catalog</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Target Selector Grid */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                {/* Form to Add New URL to Scrape Bot */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-blue-700" />
                      <h3 className="text-sm font-bold text-slate-900 font-serif">
                        Add New Institutional / Corporate URL to Scrape Bot
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Adds an additional URL target to the bot alongside existing institutions
                    </span>
                  </div>

                  {newTargetMsg && (
                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      newTargetMsg.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                        : 'bg-red-50 text-red-900 border border-red-200'
                    }`}>
                      {newTargetMsg.type === 'success' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                      <span>{newTargetMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Institution / Issuer Name</label>
                      <input
                        type="text"
                        value={newTargetName}
                        onChange={(e) => setNewTargetName(e.target.value)}
                        placeholder="e.g. Shriram Finance"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Category</label>
                      <select
                        value={newTargetCategory}
                        onChange={(e) => setNewTargetCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      >
                        <option value="corporate_nbfc">NBFC / Corporate FD</option>
                        <option value="private_bank">Private Sector Bank</option>
                        <option value="sfb_bank">Small Finance Bank (SFB)</option>
                        <option value="psu_bank">Public Sector Bank (PSU)</option>
                        <option value="rbi_sovereign">Sovereign / Post Office</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Official Rate Schedule URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newTargetUrl}
                          onChange={(e) => setNewTargetUrl(e.target.value)}
                          placeholder="https://www.shriramfinance.in/fixed-deposit"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewTargetToBot}
                          disabled={newTargetAdding || !newTargetName.trim() || !newTargetUrl.trim()}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {(() => {
                  const allTargets = [...defaultScrapeTargets, ...customScrapeTargets];
                  const filteredTargets = allTargets.filter(target => 
                    scraperCategoryFilter === 'all' || target.category === scraperCategoryFilter
                  );

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2">
                        <div>
                          <span className="text-slate-800 font-bold text-sm">
                            Configured Scraping Endpoints ({selectedTargetIds.length}/{allTargets.length} selected)
                          </span>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Includes {defaultScrapeTargets.length} built-in institutional endpoints and {customScrapeTargets.length} custom user-added URLs.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedTargetIds(allTargets.map(t => t.id))}
                            className="text-blue-700 hover:underline text-xs font-semibold px-2 py-1 bg-blue-50 rounded-lg cursor-pointer"
                          >
                            Select All ({allTargets.length})
                          </button>
                          <button 
                            onClick={() => setSelectedTargetIds([])}
                            className="text-slate-500 hover:underline text-xs px-2 py-1 bg-slate-100 rounded-lg cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {/* Category Filter Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {[
                          { id: 'all', label: 'All Institutions', count: allTargets.length },
                          { id: 'psu_bank', label: 'PSU Banks', count: allTargets.filter(t => t.category === 'psu_bank').length },
                          { id: 'private_bank', label: 'Private Banks', count: allTargets.filter(t => t.category === 'private_bank').length },
                          { id: 'sfb_bank', label: 'Small Finance Banks', count: allTargets.filter(t => t.category === 'sfb_bank').length },
                          { id: 'corporate_nbfc', label: 'NBFCs & Corporates', count: allTargets.filter(t => t.category === 'corporate_nbfc').length },
                          { id: 'rbi_sovereign', label: 'Sovereign / Post Office', count: allTargets.filter(t => t.category === 'rbi_sovereign').length },
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setScraperCategoryFilter(cat.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                              scraperCategoryFilter === cat.id
                                ? 'bg-blue-700 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              scraperCategoryFilter === cat.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {cat.count}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Filtered Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {filteredTargets.map(target => {
                          const isChecked = selectedTargetIds.includes(target.id);
                          const catBadge = 
                            target.category === 'psu_bank' ? { text: 'PSU Bank', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' } :
                            target.category === 'private_bank' ? { text: 'Private Bank', bg: 'bg-sky-50 text-sky-700 border-sky-200' } :
                            target.category === 'sfb_bank' ? { text: 'SFB (9.0%+)', bg: 'bg-amber-50 text-amber-800 border-amber-200' } :
                            target.category === 'corporate_nbfc' ? { text: 'NBFC / Corp', bg: 'bg-purple-50 text-purple-700 border-purple-200' } :
                            { text: 'Sovereign', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };

                          return (
                            <div
                              key={target.id}
                              onClick={() => {
                                setSelectedTargetIds(prev => 
                                  prev.includes(target.id) ? prev.filter(x => x !== target.id) : [...prev, target.id]
                                );
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative ${
                                isChecked 
                                  ? 'bg-blue-50/70 border-blue-300 text-slate-900 shadow-2xs' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${catBadge.bg}`}>
                                      {catBadge.text}
                                    </span>
                                    {target.isCustom && (
                                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                        Custom URL
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {target.isCustom && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteCustomTarget(target.id, e)}
                                        className="p-0.5 text-slate-400 hover:text-red-700 rounded transition-colors"
                                        title="Delete custom target"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                                      isChecked ? 'bg-blue-700 border-blue-700 text-white' : 'border-slate-300 bg-white'
                                    }`}>
                                      {isChecked && <Check className="w-3 h-3 stroke-3" />}
                                    </div>
                                  </div>
                                </div>
                                <span className="font-bold text-xs block text-slate-900 leading-snug">{target.name}</span>
                              </div>

                              <a 
                                href={target.officialUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 truncate pt-1 border-t border-slate-100"
                              >
                                <span className="truncate">{target.officialUrl.replace('https://', '').replace('http://', '')}</span>
                                <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Execution Logs Terminal */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Live Scraping Agent Execution Output</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {scraperLogs.length} events logged
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-[300px] overflow-y-auto border border-slate-800">
                {scraperLogs.length === 0 ? (
                  <div className="text-slate-500 italic py-3">
                    Terminal idle. Click &ldquo;Run Autonomous Scraper&rdquo; to execute the agent.
                  </div>
                ) : (
                  scraperLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                        log.stage === 'CONNECT' ? 'bg-blue-950 text-blue-300' :
                        log.stage === 'SCRAPE' ? 'bg-amber-950 text-amber-300' :
                        log.stage === 'GEMINI_PARSE' ? 'bg-purple-950 text-purple-300' :
                        log.stage === 'VALIDATE' ? 'bg-emerald-950 text-emerald-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.stage}
                      </span>
                      <span className={`${
                        log.level === 'error' ? 'text-rose-400' :
                        log.level === 'warn' ? 'text-amber-400' :
                        log.level === 'success' ? 'text-emerald-300' : 'text-slate-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
                {scraperRunning && (
                  <div className="text-blue-400 animate-pulse pt-1">
                    &gt; Agent executing HTTP fetch and Gemini structured schema parsing...
                  </div>
                )}
              </div>
            </div>

            {/* Scraped Results Table */}
            {scrapedResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">Discovered Institutional Rates ({scrapedResults.length})</h3>
                    <p className="text-xs text-slate-500">Validated against banking disclosures and ready to synchronize with the public catalog</p>
                  </div>
                  <button
                    onClick={handleApplyScrapedToCatalog}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply All Rates to Live Catalog</span>
                  </button>
                </div>

                <div className="sm:hidden px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex justify-between mb-2">
                  <span>Swipe table horizontally to inspect all columns</span>
                  <span>&rarr;</span>
                </div>
                <div className="overflow-x-auto touch-pan-x overscroll-x-contain w-full max-w-full border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Institution & Scheme</th>
                        <th className="py-2.5 px-3">Tenure & Term</th>
                        <th className="py-2.5 px-3">General ROI</th>
                        <th className="py-2.5 px-3">Senior (60+)</th>
                        <th className="py-2.5 px-3">Super Senior (80+)</th>
                        <th className="py-2.5 px-3">Compounding</th>
                        <th className="py-2.5 px-3">Min Investment</th>
                        <th className="py-2.5 px-3">Safety Rating</th>
                        <th className="py-2.5 px-3">Official Tariff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {scrapedResults.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 font-sans block">{r.instrumentName}</span>
                            <span className="text-[10px] text-blue-700 font-sans font-medium">{r.issuer}</span>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <span className="font-semibold text-slate-900">{r.tenure}</span>
                            <span className="block text-[10px] text-slate-500">Effective: {r.effectiveDate}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">{r.generalRate.toFixed(2)}%</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-blue-900">{r.seniorCitizenRate.toFixed(2)}%</span>
                              {r.rateChange && r.rateChange > 0 && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 rounded font-sans font-bold">
                                  +{r.rateChange}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-amber-900">
                              {r.superSeniorRate ? `${r.superSeniorRate.toFixed(2)}%` : `${(r.seniorCitizenRate + 0.15).toFixed(2)}%`}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-sans">
                            <span className="text-[11px] font-medium">{r.compoundingFrequency || 'Quarterly'}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-800 font-sans font-medium">
                            {formatINR(r.minInvestment || 1000)}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {r.dicgcInsured ? (
                              <span className="text-emerald-800 font-bold text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-block">
                                DICGC ₹5L Sovereign Guarantee
                              </span>
                            ) : (
                              <span className="text-purple-800 font-bold text-[10px] bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded inline-block">
                                {r.creditRating || 'AAA Rated'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <a 
                              href={r.sourceUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <span>Official Tariff</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Guides & SEO Articles CMS */}
        {activeTab === 'articles' && (
          <MasterArticlesCMS onArticleCountChange={setArticlesCount} />
        )}
      </main>
        </div>
      )}
    </AdminAuthGate>
  );
}
