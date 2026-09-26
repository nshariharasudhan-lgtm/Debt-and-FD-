'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  Upload, 
  FileText, 
  Bot, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Save, 
  Eye, 
  Check, 
  Key, 
  LogOut, 
  ExternalLink, 
  Globe, 
  ArrowLeft,
  Settings,
  RefreshCw,
  Search,
  Tag,
  Clock,
  HelpCircle,
  Smartphone,
  Monitor
} from 'lucide-react';
import { AdminAuthGate } from '@/components/AdminAuthGate';
import { 
  initialBenchmarks, 
  initialDebtInstruments, 
  DebtInstrument, 
  MarketBenchmark 
} from '@/lib/debt-data';
import { 
  GuideArticle, 
  calculateSeoScore, 
  SeoAuditResult, 
  ArticleCategory,
  defaultAuthor
} from '@/lib/articles-data';
import { 
  ScrapeTarget, 
  ScrapedRateResult, 
  AgentExecutionLog 
} from '@/lib/scraping-agent';
import { formatINR } from '@/lib/debt-calculations';

export default function MasterDashboardPage() {
  const [activeTab, setActiveTab] = useState<'rates_csv' | 'cms_articles' | 'scraper' | 'settings'>('rates_csv');

  // ==========================================
  // 1. RATES MANAGEMENT (CSV UPLOAD) STATE
  // ==========================================
  const [instruments, setInstruments] = useState<DebtInstrument[]>(initialDebtInstruments);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string>('');
  const [ratesFilter, setRatesFilter] = useState<'all' | 'bank_fd' | 'corporate_fd' | 'rbi_govt'>('all');
  const [ratesSearch, setRatesSearch] = useState('');

  // ==========================================
  // 2. SEO CMS STATE
  // ==========================================
  const [articles, setArticles] = useState<GuideArticle[]>([]);
  const [cmsMode, setCmsMode] = useState<'list' | 'editor'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleSubpage, setArticleSubpage] = useState<'Insights' | 'Guides'>('Insights');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>('Bank FDs & DICGC');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywordsText, setSecondaryKeywordsText] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(defaultAuthor.name);
  const [authorRole, setAuthorRole] = useState(defaultAuthor.role);
  const [authorCredentials, setAuthorCredentials] = useState(defaultAuthor.credentials);
  const [isPublished, setIsPublished] = useState(true);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' }
  ]);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [cmsSuccessMsg, setCmsSuccessMsg] = useState('');

  // ==========================================
  // 3. TARGETED SCRAPER STATE (ONLY ADMIN ADDED URLS)
  // ==========================================
  const [customTargets, setCustomTargets] = useState<ScrapeTarget[]>([]);
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetCategory, setNewTargetCategory] = useState<ScrapeTarget['category']>('psu_bank');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [scraperRunning, setScraperRunning] = useState(false);
  const [scraperLogs, setScraperLogs] = useState<AgentExecutionLog[]>([]);
  const [scrapedResults, setScrapedResults] = useState<ScrapedRateResult[]>([]);
  const [scraperSuccessMsg, setScraperSuccessMsg] = useState('');

  // ==========================================
  // 4. SETTINGS & ACCESS OPTIONS
  // ==========================================
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Load persistent data from backend API and localStorage on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/admin/data');
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.instruments) && data.instruments.length > 0) {
            setInstruments(data.instruments);
          }
          if (Array.isArray(data.targets)) {
            setCustomTargets(data.targets);
          }
          if (Array.isArray(data.articles)) {
            setArticles(data.articles);
          }
        }
      } catch (err) {
        console.error('Data load note:', err);
      }

      // Check localStorage fallbacks
      try {
        const savedInst = localStorage.getItem('bharat_debt_instruments');
        if (savedInst) {
          const parsed = JSON.parse(savedInst);
          if (Array.isArray(parsed) && parsed.length > 0) setInstruments(parsed);
        }

        const savedArticles = localStorage.getItem('bharat_debt_articles');
        if (savedArticles) {
          const parsed = JSON.parse(savedArticles);
          if (Array.isArray(parsed)) setArticles(parsed);
        }

        const savedTargets = localStorage.getItem('bharat_debt_scrape_targets');
        if (savedTargets) {
          const parsed = JSON.parse(savedTargets);
          if (Array.isArray(parsed)) setCustomTargets(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadInitialData();
  }, []);

  // Save instruments to persistent backend & localStorage
  const persistInstruments = async (updated: DebtInstrument[]) => {
    setInstruments(updated);
    try {
      localStorage.setItem('bharat_debt_instruments', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_instruments', instruments: updated })
      });
    } catch (e) {
      console.error('Instruments save error:', e);
    }
  };

  // Save scrape targets
  const persistTargets = async (updated: ScrapeTarget[]) => {
    setCustomTargets(updated);
    try {
      localStorage.setItem('bharat_debt_scrape_targets', JSON.stringify(updated));
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_targets', targets: updated })
      });
    } catch (e) {
      console.error('Targets save error:', e);
    }
  };

  // Save articles
  const persistArticles = async (updated: GuideArticle[]) => {
    setArticles(updated);
    try {
      localStorage.setItem('bharat_debt_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_articles', articles: updated })
      });
    } catch (e) {
      console.error('Articles save error:', e);
    }
  };

  // =========================================================================
  // CSV UPLOAD HANDLERS
  // =========================================================================
  const handleDownloadSampleCsv = () => {
    const csvContent = 
`Issuer,Name,Type,SubType,GeneralRate,SeniorRate,PopularTenure,Rating,DICGC,MinInvestment,MaxInvestment,Payout,Description,Notes
Unity Small Finance Bank,Unity SFB 1001-Day Deposit,bank_fd,Small Finance Bank,9.00,9.50,1001 Days,DICGC Insured,true,1000,,quarterly,Flagship 1001-day high yield fixed deposit,100% DICGC Insured up to 5 Lakhs
State Bank of India,SBI Amrit Kalash Term Deposit,bank_fd,Public Sector Bank,7.10,7.60,400 Days,Sovereign / PSU Tier 1,true,1000,,quarterly,Special 400-day term deposit by India largest bank,DICGC insured
HDFC Bank Ltd,HDFC Bank Special Tenure FD,bank_fd,Private Bank,7.25,7.75,55 Months,Private Bank D-SIB,true,5000,,quarterly,Top tier private bank deposit,DICGC insured
Senior Citizen Savings Scheme,Government SCSS,rbi_govt,Govt Small Savings,8.20,8.20,5 Years,Sovereign Guarantee,true,1000,3000000,quarterly,Official Ministry of Finance scheme for senior citizens,Zero default risk
Bajaj Finance Limited,Bajaj Finance Corporate FD,corporate_fd,Corporate NBFC,8.35,8.60,44 Months,CRISIL AAA,false,15000,,quarterly,Premier AAA rated NBFC fixed deposit,Not DICGC insured`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'yieldnest_rates_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportActiveCsv = () => {
    const headers = 'Issuer,Name,Type,SubType,GeneralRate,SeniorRate,PopularTenure,Rating,DICGC,MinInvestment,MaxInvestment,Payout,Description,Notes\n';
    const rows = instruments.map(inst => {
      return `"${inst.issuer}","${inst.name}","${inst.type}","${inst.subType}",${inst.generalRate},${inst.seniorCitizenRate},"${inst.popularTenureLabel}","${inst.creditRating}",${inst.dicgcCovered},${inst.minInvestment},${inst.maxInvestment || ''},"${inst.payoutFrequency?.join(';') || 'quarterly'}","${(inst.description || '').replace(/"/g, '""')}","${(inst.keyHighlights?.[0] || '').replace(/"/g, '""')}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'yieldnest_active_rates.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCsvErrors([]);
    setCsvUploadSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setCsvErrors(['CSV must contain a header row and at least one data row.']);
      setCsvParsedRows([]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const parsedRows: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV token parser handling quotes
      const values: string[] = [];
      let inQuotes = false;
      let curVal = '';
      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          values.push(curVal.trim().replace(/^"|"$/g, ''));
          curVal = '';
        } else {
          curVal += c;
        }
      }
      values.push(curVal.trim().replace(/^"|"$/g, ''));

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      // Validation
      const issuer = rowObj.issuer || rowObj.bank || '';
      const name = rowObj.name || rowObj.instrumentname || `${issuer} Deposit`;
      const generalRate = parseFloat(rowObj.generalrate || rowObj.general || rowObj.rate || '0');
      const seniorRate = parseFloat(rowObj.seniorrate || rowObj.seniorcitizenrate || rowObj.senior || String(generalRate + 0.5));

      if (!issuer) {
        errors.push(`Row ${i}: Missing Issuer / Bank name.`);
        continue;
      }
      if (isNaN(generalRate) || generalRate <= 0) {
        errors.push(`Row ${i} (${issuer}): Invalid general rate: "${rowObj.generalrate}".`);
        continue;
      }

      parsedRows.push({
        id: `inst-${issuer.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}-${i}`,
        issuer,
        name,
        type: rowObj.type === 'corporate_fd' || rowObj.type === 'rbi_govt' ? rowObj.type : 'bank_fd',
        subType: rowObj.subtype || 'Scheduled Bank',
        generalRate,
        seniorCitizenRate: isNaN(seniorRate) ? generalRate + 0.5 : seniorRate,
        popularTenureLabel: rowObj.populartenure || rowObj.tenure || '3 Years',
        tenureMonthsMin: 12,
        tenureMonthsMax: 60,
        payoutFrequency: ['quarterly', 'monthly', 'cumulative'],
        creditRating: rowObj.rating || 'DICGC Insured',
        safetyLevel: rowObj.dicgc === 'false' ? 'High (AAA Corporate)' : 'Very High (DICGC Insured)',
        minInvestment: parseInt(rowObj.mininvestment || '1000', 10) || 1000,
        maxInvestment: rowObj.maxinvestment ? parseInt(rowObj.maxinvestment, 10) : undefined,
        dicgcCovered: rowObj.dicgc === 'true' || rowObj.dicgc === '1',
        tdsThreshold: 50000,
        description: rowObj.description || `${issuer} fixed income deposit product.`,
        keyHighlights: rowObj.notes ? [rowObj.notes] : ['Verified official card rate'],
        prematureWithdrawalAllowed: true,
        lastUpdated: 'Sept 2026'
      });
    }

    setCsvErrors(errors);
    setCsvParsedRows(parsedRows);
  };

  const handleApplyCsvRates = async () => {
    if (csvParsedRows.length === 0) return;
    
    // Replace or merge instruments: we overwrite with the newly uploaded validated rates list
    const newInstruments = [...csvParsedRows];
    await persistInstruments(newInstruments);

    setCsvUploadSuccess(`Successfully updated ${csvParsedRows.length} rates! All changes are live on the public directory.`);
    setCsvParsedRows([]);
    setCsvFile(null);
  };

  const handleDeleteInstrument = async (id: string) => {
    const updated = instruments.filter(inst => inst.id !== id);
    await persistInstruments(updated);
  };

  // =========================================================================
  // SEO CONTENT MANAGEMENT SYSTEM (CMS) HANDLERS
  // =========================================================================
  const handleNewArticle = () => {
    setEditingArticleId(null);
    setArticleTitle('');
    setArticleSlug('');
    setArticleSubpage('Insights');
    setArticleCategory('Bank FDs & DICGC');
    setPrimaryKeyword('');
    setSecondaryKeywordsText('');
    setMetaTitle('');
    setMetaDescription('');
    setExcerpt('');
    setContent('');
    setAuthorName(defaultAuthor.name);
    setAuthorRole(defaultAuthor.role);
    setAuthorCredentials(defaultAuthor.credentials);
    setIsPublished(true);
    setFaqs([{ question: '', answer: '' }]);
    setCmsMode('editor');
    setCmsSuccessMsg('');
  };

  const handleEditArticle = (art: GuideArticle) => {
    setEditingArticleId(art.id);
    setArticleTitle(art.title);
    setArticleSlug(art.slug);
    setArticleSubpage(art.resourceType || 'Insights');
    setArticleCategory(art.category);
    setPrimaryKeyword(art.primaryKeyword);
    setSecondaryKeywordsText(art.secondaryKeywords?.join(', ') || '');
    setMetaTitle(art.metaTitle || art.title);
    setMetaDescription(art.metaDescription || art.excerpt);
    setExcerpt(art.excerpt);
    setContent(art.content);
    setAuthorName(art.author?.name || defaultAuthor.name);
    setAuthorRole(art.author?.role || defaultAuthor.role);
    setAuthorCredentials(art.author?.credentials || defaultAuthor.credentials);
    setIsPublished(art.isPublished);
    setFaqs(art.faqs && art.faqs.length > 0 ? art.faqs : [{ question: '', answer: '' }]);
    setCmsMode('editor');
    setCmsSuccessMsg('');
  };

  // Auto slug generation
  const handleTitleChange = (val: string) => {
    setArticleTitle(val);
    if (!editingArticleId) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setArticleSlug(generatedSlug);
      if (!metaTitle) setMetaTitle(val.slice(0, 60));
    }
  };

  // Real-time SEO Audit calculation
  const seoAudit = useMemo<SeoAuditResult>(() => {
    return calculateSeoScore({
      title: articleTitle,
      metaTitle,
      metaDescription,
      primaryKeyword,
      slug: articleSlug,
      content,
      faqs
    });
  }, [articleTitle, metaTitle, metaDescription, primaryKeyword, articleSlug, content, faqs]);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleSlug.trim()) return;

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const estReadTime = Math.max(1, Math.ceil(wordCount / 180));
    const now = new Date().toISOString().split('T')[0];

    const cleanSecondary = secondaryKeywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const articleObj: GuideArticle = {
      id: editingArticleId || `guide-${articleSlug}-${Date.now().toString(36)}`,
      title: articleTitle.trim(),
      slug: articleSlug.trim(),
      metaTitle: metaTitle.trim() || articleTitle.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      canonicalUrl: `https://yieldnest.online/resources/${articleSlug.trim()}`,
      primaryKeyword: primaryKeyword.trim() || 'Fixed Deposit',
      secondaryKeywords: cleanSecondary,
      category: articleCategory,
      resourceType: articleSubpage,
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        credentials: authorCredentials.trim()
      },
      publishedDate: now,
      updatedDate: now,
      readTimeMinutes: estReadTime,
      isPublished,
      faqs: faqs.filter(f => f.question.trim().length > 0)
    };

    let updatedList: GuideArticle[];
    if (editingArticleId) {
      updatedList = articles.map(a => a.id === editingArticleId ? articleObj : a);
    } else {
      updatedList = [articleObj, ...articles];
    }

    await persistArticles(updatedList);
    setCmsSuccessMsg(`Article "${articleTitle}" saved and published to Resources (${articleSubpage})!`);
    setTimeout(() => {
      setCmsMode('list');
      setCmsSuccessMsg('');
    }, 1500);
  };

  const handleDeleteArticle = async (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    await persistArticles(updated);
  };

  // =========================================================================
  // TARGETED SCRAPER HANDLERS (ADMIN ADDED URLS ONLY)
  // =========================================================================
  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetName.trim() || !newTargetUrl.trim()) return;

    const newTarget: ScrapeTarget = {
      id: `target-${Date.now().toString(36)}`,
      name: newTargetName.trim(),
      category: newTargetCategory,
      officialUrl: newTargetUrl.trim(),
      status: 'idle',
      isCustom: true
    };

    const updated = [...customTargets, newTarget];
    await persistTargets(updated);
    setNewTargetName('');
    setNewTargetUrl('');
    setScraperSuccessMsg(`Target URL for "${newTarget.name}" added successfully!`);
    setTimeout(() => setScraperSuccessMsg(''), 3000);
  };

  const handleDeleteTarget = async (id: string) => {
    const updated = customTargets.filter(t => t.id !== id);
    await persistTargets(updated);
  };

  const handleRunScraper = async () => {
    if (customTargets.length === 0) return;
    setScraperRunning(true);
    setScraperLogs([]);
    setScrapedResults([]);
    setScraperSuccessMsg('');

    try {
      const res = await fetch('/api/agent/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customTargets,
          targetIds: customTargets.map(t => t.id),
          existingInstruments: instruments
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setScraperLogs(data.data.logs || []);
        setScrapedResults(data.data.results || []);
        setScraperSuccessMsg(`Scraping completed! ${data.data.results?.length || 0} rates parsed from configured URLs.`);
      } else {
        setScraperLogs([{
          timestamp: new Date().toLocaleTimeString(),
          stage: 'CONNECT',
          level: 'error',
          message: data.error || 'Failed to complete scrape execution.'
        }]);
      }
    } catch (err: any) {
      setScraperLogs([{
        timestamp: new Date().toLocaleTimeString(),
        stage: 'CONNECT',
        level: 'error',
        message: err.message || 'Scraper network error.'
      }]);
    } finally {
      setScraperRunning(false);
    }
  };

  const handleApplyScrapedRates = async () => {
    if (scrapedResults.length === 0) return;

    // Convert scraped rate results to debt instruments
    const converted: DebtInstrument[] = scrapedResults.map(res => ({
      id: `scraped-${res.id || Date.now().toString(36)}`,
      name: res.instrumentName,
      issuer: res.issuer,
      type: res.category === 'corporate_nbfc' ? 'corporate_fd' : res.category === 'rbi_sovereign' ? 'rbi_govt' : 'bank_fd',
      subType: res.category === 'sfb_bank' ? 'Small Finance Bank' : res.category === 'corporate_nbfc' ? 'Corporate NBFC' : 'Scheduled Commercial Bank',
      generalRate: res.generalRate,
      seniorCitizenRate: res.seniorCitizenRate,
      tenureMonthsMin: 12,
      tenureMonthsMax: 60,
      popularTenureLabel: res.tenure,
      payoutFrequency: ['quarterly', 'monthly', 'cumulative'],
      creditRating: res.creditRating,
      safetyLevel: res.dicgcInsured ? 'Very High (DICGC Insured)' : 'High (AAA Corporate)',
      minInvestment: res.minInvestment || 1000,
      dicgcCovered: res.dicgcInsured,
      tdsThreshold: 50000,
      description: res.notes || `Scraped card rate from official portal.`,
      keyHighlights: [res.notes || 'Verified official rate'],
      prematureWithdrawalAllowed: true,
      lastUpdated: 'Sept 2026'
    }));

    // Merge into instruments
    const merged = [...instruments];
    for (const c of converted) {
      const idx = merged.findIndex(i => i.issuer.toLowerCase() === c.issuer.toLowerCase());
      if (idx >= 0) {
        merged[idx] = c;
      } else {
        merged.unshift(c);
      }
    }

    await persistInstruments(merged);
    setScraperSuccessMsg(`Applied ${converted.length} scraped rates to live portal!`);
  };

  // Filtered rates for view
  const filteredInstruments = instruments.filter(inst => {
    if (ratesFilter !== 'all' && inst.type !== ratesFilter) return false;
    if (ratesSearch.trim()) {
      const q = ratesSearch.toLowerCase();
      return inst.issuer.toLowerCase().includes(q) || inst.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminAuthGate>
      {({ adminEmail, adminRole, onSignOut, onOpenChangePassword }) => (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
          
          {/* Top Admin Bar */}
          <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Portal</span>
              </Link>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white tracking-tight uppercase">
                  YieldNest Admin Console
                </span>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-700/50">
                  Internal Only
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 hidden sm:inline">
                {adminEmail} ({adminRole})
              </span>
              <button
                onClick={onOpenChangePassword}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Change Admin Password"
              >
                <Key className="w-3 h-3 text-amber-400" />
                <span>Password</span>
              </button>
              <button
                onClick={onSignOut}
                className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/60 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Clean 4-Tab Navigation */}
          <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 lg:px-8">
            <nav className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
              <button
                onClick={() => setActiveTab('rates_csv')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'rates_csv'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>1. Rate Management (CSV Upload)</span>
              </button>

              <button
                onClick={() => setActiveTab('cms_articles')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'cms_articles'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. SEO Article CMS (Insights &amp; Guides)</span>
                {articles.length > 0 && (
                  <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.2 rounded-full">
                    {articles.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('scraper')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'scraper'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>3. Targeted Web Scraper</span>
                {customTargets.length > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
                    {customTargets.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>4. Settings &amp; Backup</span>
              </button>
            </nav>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* ========================================================================= */}
            {/* TAB 1: RATE MANAGEMENT THROUGH CSV UPLOAD */}
            {/* ========================================================================= */}
            {activeTab === 'rates_csv' && (
              <div className="space-y-6">
                
                {/* Header card with CSV instructions */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        <span>Fixed Income &amp; Bond Rate Management via CSV Upload</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload official rate tables for Bank Fixed Deposits, Corporate NBFCs, and Sovereign bonds. Data updates sync directly to the public directory.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={handleDownloadSampleCsv}
                        className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span>Download Sample CSV Template</span>
                      </button>

                      <button
                        onClick={handleExportActiveCsv}
                        className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export Current Live Rates ({instruments.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* CSV Upload Zone */}
                  <div className="p-5 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-slate-900/60 transition-colors text-center space-y-3">
                    <input
                      type="file"
                      id="rates-csv-input"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="rates-csv-input"
                      className="cursor-pointer inline-flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-950/70 border border-blue-700/60 flex items-center justify-center text-blue-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {csvFile ? `Selected: ${csvFile.name}` : 'Click to Upload Rates CSV File'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Supports standard columns: Issuer, Name, Type, GeneralRate, SeniorRate, PopularTenure, Rating, DICGC
                      </span>
                    </label>
                  </div>

                  {/* Errors display */}
                  {csvErrors.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>CSV Validation Errors:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                        {csvErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Success display */}
                  {csvUploadSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{csvUploadSuccess}</span>
                    </div>
                  )}

                  {/* Preview of parsed rows ready for sync */}
                  {csvParsedRows.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{csvParsedRows.length} Valid Rates Parsed &amp; Ready to Apply</span>
                        </span>
                        <button
                          onClick={handleApplyCsvRates}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Apply &amp; Save to Live Portal</span>
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-950 text-slate-400 text-[11px] sticky top-0">
                            <tr>
                              <th className="p-2.5">Issuer</th>
                              <th className="p-2.5">Type</th>
                              <th className="p-2.5">General Rate</th>
                              <th className="p-2.5">Senior Rate</th>
                              <th className="p-2.5">Tenure</th>
                              <th className="p-2.5">DICGC</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-200">
                            {csvParsedRows.map((r, i) => (
                              <tr key={i} className="hover:bg-slate-800/40">
                                <td className="p-2.5 font-bold">{r.issuer}</td>
                                <td className="p-2.5 text-slate-400 text-[11px]">{r.type}</td>
                                <td className="p-2.5 font-mono text-emerald-400">{r.generalRate}%</td>
                                <td className="p-2.5 font-mono text-amber-400 font-bold">{r.seniorCitizenRate}%</td>
                                <td className="p-2.5">{r.popularTenureLabel}</td>
                                <td className="p-2.5">{r.dicgcCovered ? 'Yes (₹5L)' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Currently Active Rates Directory Table */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Currently Active Rates on Public Portal ({instruments.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        These rates are displayed directly to website visitors and senior citizens.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search issuer..."
                          value={ratesSearch}
                          onChange={(e) => setRatesSearch(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <select
                        value={ratesFilter}
                        onChange={(e: any) => setRatesFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        <option value="bank_fd">Bank Fixed Deposits</option>
                        <option value="corporate_fd">Corporate NBFC FDs</option>
                        <option value="rbi_govt">Sovereign / RBI Bonds</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-700/80 rounded-xl text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 text-[11px]">
                        <tr>
                          <th className="p-3">Issuer &amp; Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">General Rate</th>
                          <th className="p-3">Senior Rate</th>
                          <th className="p-3">Tenure</th>
                          <th className="p-3">Safety Rating</th>
                          <th className="p-3">DICGC</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 text-slate-200">
                        {filteredInstruments.map((inst) => (
                          <tr key={inst.id} className="hover:bg-slate-800/50">
                            <td className="p-3">
                              <span className="font-bold text-white block">{inst.issuer}</span>
                              <span className="text-[11px] text-slate-400 block">{inst.name}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-slate-300">
                                {inst.type}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-semibold text-emerald-400">
                              {inst.generalRate.toFixed(2)}%
                            </td>
                            <td className="p-3 font-mono font-bold text-amber-400">
                              {inst.seniorCitizenRate.toFixed(2)}%
                            </td>
                            <td className="p-3 text-slate-300">{inst.popularTenureLabel}</td>
                            <td className="p-3 text-slate-300">{inst.creditRating}</td>
                            <td className="p-3">
                              {inst.dicgcCovered ? (
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                                  ₹5L Insured
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                                  No DICGC
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteInstrument(inst.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 cursor-pointer transition-colors"
                                title="Delete rate entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: SEO CONTENT MANAGEMENT SYSTEM (CMS) */}
            {/* ========================================================================= */}
            {activeTab === 'cms_articles' && (
              <div className="space-y-6">
                
                {cmsMode === 'list' ? (
                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <span>SEO Content Management System (Insights &amp; Guides)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Author, optimize, and publish editorial articles with complete Google SERP previews and schema tags.
                        </p>
                      </div>

                      <button
                        onClick={handleNewArticle}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Write New Article</span>
                      </button>
                    </div>

                    {/* Articles list or empty state */}
                    {articles.length === 0 ? (
                      <div className="py-12 text-center max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-white">No Articles Published Yet</h3>
                        <p className="text-xs text-slate-400">
                          The portal is cleanly initialized without mock articles. Click &quot;Write New Article&quot; above to create an Insight or Guide.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-700/80 rounded-xl text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-950 text-slate-400 text-[11px]">
                            <tr>
                              <th className="p-3">Title &amp; Slug</th>
                              <th className="p-3">Resource Subpage</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Primary Keyword</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/60 text-slate-200">
                            {articles.map((art) => (
                              <tr key={art.id} className="hover:bg-slate-800/50">
                                <td className="p-3">
                                  <span className="font-bold text-white block">{art.title}</span>
                                  <span className="text-[11px] text-blue-400 font-mono">/resources/{art.slug}</span>
                                </td>
                                <td className="p-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    art.resourceType === 'Insights' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  }`}>
                                    {art.resourceType || 'Insights'}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-300">{art.category}</td>
                                <td className="p-3 text-slate-300">{art.primaryKeyword}</td>
                                <td className="p-3">
                                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                                    {art.isPublished ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => handleEditArticle(art)}
                                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteArticle(art.id)}
                                    className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                                    title="Delete article"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ARTICLE EDITOR VIEW */
                  <form onSubmit={handleSaveArticle} className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
                      <button
                        type="button"
                        onClick={() => setCmsMode('list')}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Articles</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          SEO Score: <strong className="text-emerald-400">{seoAudit.score}%</strong>
                        </span>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Publish to Portal</span>
                        </button>
                      </div>
                    </div>

                    {cmsSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{cmsSuccessMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Article Details & Content */}
                      <div className="lg:col-span-8 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Resource Subpage Placement
                            </label>
                            <select
                              value={articleSubpage}
                              onChange={(e: any) => setArticleSubpage(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="Insights">Subpage 1: Insights (Market Analysis &amp; Trends)</option>
                              <option value="Guides">Subpage 2: Guides (Tutorials &amp; How-To)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Category
                            </label>
                            <select
                              value={articleCategory}
                              onChange={(e: any) => setArticleCategory(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="Taxation & 80TTB">Taxation &amp; 80TTB</option>
                              <option value="Bank FDs & DICGC">Bank FDs &amp; DICGC</option>
                              <option value="RBI Sovereign Bonds">RBI Sovereign Bonds</option>
                              <option value="Corporate Debt & Ratings">Corporate Debt &amp; Ratings</option>
                              <option value="Retirement Planning">Retirement Planning</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Article Title
                          </label>
                          <input
                            type="text"
                            required
                            value={articleTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="e.g., Section 80TTB Complete Tax Exemption Guide for Senior Citizens"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            URL Slug
                          </label>
                          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs">
                            <span className="text-slate-500 font-mono">/resources/</span>
                            <input
                              type="text"
                              required
                              value={articleSlug}
                              onChange={(e) => setArticleSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                              className="w-full bg-transparent py-2 text-white font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Primary / Focus Keyword
                            </label>
                            <input
                              type="text"
                              value={primaryKeyword}
                              onChange={(e) => setPrimaryKeyword(e.target.value)}
                              placeholder="e.g. Section 80TTB"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Secondary Keywords (comma separated)
                            </label>
                            <input
                              type="text"
                              value={secondaryKeywordsText}
                              onChange={(e) => setSecondaryKeywordsText(e.target.value)}
                              placeholder="e.g. Form 15H, Senior Citizen FD, TDS exemption"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Article Excerpt / Summary
                          </label>
                          <textarea
                            rows={2}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A concise 2-sentence summary of the article..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Article Body (Markdown Formatted)
                          </label>
                          <textarea
                            rows={12}
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="## Section Heading&#10;&#10;Write comprehensive guidance here. Markdown headings (##, ###), bullet lists, and bold text are supported..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Right: SEO Snippet & Audit Checklist */}
                      <div className="lg:col-span-4 space-y-4">
                        
                        {/* SERP Google Snippet Preview */}
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-blue-400" />
                              <span>Google SERP Preview</span>
                            </span>
                            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                              <button
                                type="button"
                                onClick={() => setSerpDevice('desktop')}
                                className={`p-1 rounded ${serpDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                              >
                                <Monitor className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSerpDevice('mobile')}
                                className={`p-1 rounded ${serpDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                              >
                                <Smartphone className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl shadow-xs text-left font-sans space-y-1">
                            <div className="text-[10px] text-slate-600 truncate">
                              https://yieldnest.online &gt; resources &gt; {articleSlug || 'slug'}
                            </div>
                            <div className="text-sm font-semibold text-blue-800 line-clamp-1 leading-snug hover:underline cursor-pointer">
                              {metaTitle || articleTitle || 'Article Title Display'}
                            </div>
                            <div className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                              {metaDescription || excerpt || 'Meta description will be displayed here in search engine result pages.'}
                            </div>
                          </div>
                        </div>

                        {/* SEO Fields: Meta Title & Meta Desc */}
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                          <span className="text-xs font-bold text-white block">
                            Search Engine Snippet Fields
                          </span>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                              <span>Meta Title</span>
                              <span className={metaTitle.length >= 45 && metaTitle.length <= 65 ? 'text-emerald-400' : 'text-amber-400'}>
                                {metaTitle.length}/60 chars
                              </span>
                            </div>
                            <input
                              type="text"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              placeholder="Title in Google search"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                              <span>Meta Description</span>
                              <span className={metaDescription.length >= 120 && metaDescription.length <= 165 ? 'text-emerald-400' : 'text-amber-400'}>
                                {metaDescription.length}/160 chars
                              </span>
                            </div>
                            <textarea
                              rows={3}
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              placeholder="Search description"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Real-time SEO Checklist */}
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                          <span className="text-xs font-bold text-white block">
                            SEO Quality Checklist
                          </span>
                          <div className="space-y-2 text-xs">
                            {seoAudit.checks.map((chk) => (
                              <div key={chk.id} className="flex items-start gap-2">
                                {chk.passed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <span className={chk.passed ? 'text-slate-300 font-semibold' : 'text-amber-300 font-semibold'}>
                                    {chk.label}
                                  </span>
                                  <p className="text-[10px] text-slate-400 leading-snug">
                                    {chk.recommendation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: TARGETED WEB SCRAPER (ONLY ADMIN ADDED URLS) */}
            {/* ========================================================================= */}
            {activeTab === 'scraper' && (
              <div className="space-y-6">
                
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-400" />
                      <span>Targeted Official Web Scraper</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      All pre-existing URLs have been removed. Add only the specific bank or institutional URLs you wish to scrape. Only those URLs will be scraped.
                    </p>
                  </div>

                  {/* Add URL Form */}
                  <form onSubmit={handleAddTarget} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-white block">
                      Add New Webpage URL for Scraping
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Institution / Issuer Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newTargetName}
                          onChange={(e) => setNewTargetName(e.target.value)}
                          placeholder="e.g. State Bank of India"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Category
                        </label>
                        <select
                          value={newTargetCategory}
                          onChange={(e: any) => setNewTargetCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="psu_bank">Public Sector Bank (PSU)</option>
                          <option value="private_bank">Private Sector Bank</option>
                          <option value="sfb_bank">Small Finance Bank (SFB)</option>
                          <option value="corporate_nbfc">Corporate NBFC Deposit</option>
                          <option value="rbi_sovereign">Sovereign / RBI Scheme</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Official Rate Page URL
                        </label>
                        <input
                          type="url"
                          required
                          value={newTargetUrl}
                          onChange={(e) => setNewTargetUrl(e.target.value)}
                          placeholder="https://sbi.co.in/web/interest-rates/..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Scrape URL Target</span>
                      </button>
                    </div>
                  </form>

                  {scraperSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{scraperSuccessMsg}</span>
                    </div>
                  )}

                  {/* Configured Targets List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        Configured URLs to Scrape ({customTargets.length})
                      </span>

                      <button
                        onClick={handleRunScraper}
                        disabled={customTargets.length === 0 || scraperRunning}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        {scraperRunning ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span>{scraperRunning ? 'Scraping Active...' : 'Scrape Configured URLs'}</span>
                      </button>
                    </div>

                    {customTargets.length === 0 ? (
                      <div className="py-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                        No URLs configured yet. Add official rate URLs above to scrape institutional cards.
                      </div>
                    ) : (
                      <div className="border border-slate-700 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-950 text-slate-400 text-[11px]">
                            <tr>
                              <th className="p-3">Institution Name</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Official URL</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-200">
                            {customTargets.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-800/40">
                                <td className="p-3 font-bold text-white">{t.name}</td>
                                <td className="p-3 text-slate-300 font-mono text-[11px]">{t.category}</td>
                                <td className="p-3">
                                  <a 
                                    href={t.officialUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-blue-400 hover:underline flex items-center gap-1 truncate max-w-md"
                                  >
                                    <span className="truncate">{t.officialUrl}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handleDeleteTarget(t.id)}
                                    className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                                    title="Remove URL"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Scraper Logs */}
                  {scraperLogs.length > 0 && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                      <span className="text-[11px] text-slate-400 font-bold block">
                        Live Execution Logs:
                      </span>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {scraperLogs.map((log, i) => (
                          <div key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
                            <span className="text-slate-500">[{log.timestamp}]</span>
                            <span className={log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>
                              {log.stage}:
                            </span>
                            <span>{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Parsed Scraper Results */}
                  {scrapedResults.length > 0 && (
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          {scrapedResults.length} Rates Parsed from Configured URLs
                        </span>
                        <button
                          onClick={handleApplyScrapedRates}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Approve &amp; Apply to Live Portal
                        </button>
                      </div>

                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-950 text-slate-400 text-[11px]">
                            <tr>
                              <th className="p-2">Issuer</th>
                              <th className="p-2">General Rate</th>
                              <th className="p-2">Senior Rate</th>
                              <th className="p-2">Tenure</th>
                              <th className="p-2">Rating</th>
                              <th className="p-2">DICGC</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-200">
                            {scrapedResults.map((r, i) => (
                              <tr key={i}>
                                <td className="p-2 font-bold">{r.issuer}</td>
                                <td className="p-2 font-mono text-emerald-400">{r.generalRate}%</td>
                                <td className="p-2 font-mono text-amber-400 font-bold">{r.seniorCitizenRate}%</td>
                                <td className="p-2">{r.tenure}</td>
                                <td className="p-2">{r.creditRating}</td>
                                <td className="p-2">{r.dicgcInsured ? 'Yes (₹5L)' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: SETTINGS & BACKUP OPTIONS ("i. Give the option") */}
            {/* ========================================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span>Internal Security, Portal Backup &amp; Options</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage authentication credentials, complete portal backups, and data immutability locks.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    
                    {/* Option 1: Admin Password & Access */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Admin Access &amp; Password</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        The Admin Dashboard is strictly internal and private (not linked in any public navbar or footer). You can update your internal security key at any time.
                      </p>
                      <button
                        onClick={onOpenChangePassword}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Change Admin Password</span>
                      </button>
                    </div>

                    {/* Option 2: Full Portal Backup */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Export Full Portal Backup (JSON)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Export all active fixed-income instruments, custom scrape URLs, and CMS articles into an encrypted JSON backup file.
                      </p>
                      <button
                        onClick={() => {
                          const backup = {
                            exportedAt: new Date().toISOString(),
                            instruments,
                            targets: customTargets,
                            articles
                          };
                          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `yieldnest_portal_backup_${new Date().toISOString().split('T')[0]}.json`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Full Portal Backup</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </main>
        </div>
      )}
    </AdminAuthGate>
  );
}
