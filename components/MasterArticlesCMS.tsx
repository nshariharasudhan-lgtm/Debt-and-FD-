'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  Globe, 
  Clock, 
  Tag, 
  User, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  LayoutList,
  Edit3,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import { 
  GuideArticle, 
  ArticleCategory, 
  initialGuideArticles, 
  calculateSeoScore, 
  SeoAuditResult,
  generateArticleJsonLd,
  generateFaqJsonLd
} from '@/lib/articles-data';

const CATEGORIES: ArticleCategory[] = [
  'Taxation & 80TTB',
  'Bank FDs & DICGC',
  'RBI Sovereign Bonds',
  'Corporate Debt & Ratings',
  'Retirement Planning'
];

interface MasterArticlesCMSProps {
  onArticleCountChange?: (count: number) => void;
}

export function MasterArticlesCMS({ onArticleCountChange }: MasterArticlesCMSProps) {
  const [articles, setArticles] = useState<GuideArticle[]>(initialGuideArticles);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Bank FDs & DICGC');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywordsText, setSecondaryKeywordsText] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Venkatesh Ramanathan');
  const [authorRole, setAuthorRole] = useState('Chief Fixed Income Strategist');
  const [authorCredentials, setAuthorCredentials] = useState('CFP®, CFA');
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' }
  ]);

  // Load articles from localStorage and API
  useEffect(() => {
    const load = async () => {
      try {
        let combined = [...initialGuideArticles];
        const saved = localStorage.getItem('bharat_debt_articles');
        if (saved) {
          try {
            const parsed: GuideArticle[] = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const localMap = new Map(parsed.map(a => [a.slug, a]));
              const initialRemaining = initialGuideArticles.filter(a => !localMap.has(a.slug));
              combined = [...parsed, ...initialRemaining];
            }
          } catch (e) {
            console.error('Error parsing local articles', e);
          }
        }

        // Also fetch from API
        try {
          const res = await fetch('/api/articles?includeDrafts=true');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.articles) && data.articles.length > 0) {
              const apiMap = new Map(data.articles.map((a: GuideArticle) => [a.slug, a]));
              for (const [slugKey, item] of apiMap.entries()) {
                const idx = combined.findIndex(a => a.slug === slugKey);
                if (idx >= 0) {
                  combined[idx] = item as GuideArticle;
                } else {
                  combined.unshift(item as GuideArticle);
                }
              }
            }
          }
        } catch (apiErr) {
          console.warn('Articles API fetch notice', apiErr);
        }

        setArticles(combined);
        if (onArticleCountChange) {
          onArticleCountChange(combined.length);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [onArticleCountChange]);

  // Save articles state to localStorage and update count
  const persistArticles = (newArticles: GuideArticle[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem('bharat_debt_articles', JSON.stringify(newArticles));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
    if (onArticleCountChange) {
      onArticleCountChange(newArticles.length);
    }
  };

  // Auto-slugify title if slug is empty or user is typing initial title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticleId || !slug) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
    if (!metaTitle) {
      setMetaTitle(val.slice(0, 60));
    }
  };

  // Real-time SEO Score calculation
  const seoAudit: SeoAuditResult = useMemo(() => {
    const validFaqs = faqs.filter(f => f.question.trim().length > 0 && f.answer.trim().length > 0);
    return calculateSeoScore({
      title,
      metaTitle,
      metaDescription,
      primaryKeyword,
      slug,
      content,
      faqs: validFaqs
    });
  }, [title, metaTitle, metaDescription, primaryKeyword, slug, content, faqs]);

  // Start creating new article
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setTitle('');
    setSlug('');
    setCategory('Bank FDs & DICGC');
    setPrimaryKeyword('');
    setSecondaryKeywordsText('');
    setMetaTitle('');
    setMetaDescription('');
    setExcerpt('');
    setContent(`## Executive Overview\n\nFixed income investors in India navigating today's interest rate environment must carefully evaluate bank safety, post-tax yield, and statutory deductions under the Income Tax Act.\n\n## Key Regulatory Rules\n\n1. **Statutory Coverage**: Up to ₹5 Lakh per depositor per bank is insured by the DICGC.\n2. **Tax Advantage**: Senior citizens can claim up to ₹50,000 under Section 80TTB.\n\n## Yield Comparison Matrix\n\n| Institution Category | Indicative Card Rate | Senior Citizen Rate | Safety Backing |\n| --- | --- | --- | --- |\n| Public Sector Banks (PSU) | 7.00% - 7.30% | 7.50% - 7.80% | Sovereign / DICGC |\n| Scheduled Private Banks | 7.25% - 7.50% | 7.75% - 8.00% | DICGC Insured |\n| Small Finance Banks (SFBs) | 8.25% - 9.00% | 8.75% - 9.50% | DICGC Insured |\n\n> **Statutory Caution:** Always ensure bank deposit accounts are registered with valid PAN cards to avoid standard 20% penal TDS rates under Section 206AA.`);
    setAuthorName('Venkatesh Ramanathan');
    setAuthorRole('Chief Fixed Income Strategist');
    setAuthorCredentials('CFP®, CFA');
    setIsPublished(true);
    setFeatured(false);
    setFaqs([
      {
        question: 'Who is eligible to claim tax benefits on this scheme?',
        answer: 'Resident Indian individuals and Senior Citizens (aged 60 and above) can avail of the specified provisions under the Indian Income Tax Act.'
      },
      {
        question: 'Is capital protected under statutory deposit insurance?',
        answer: 'Yes, principal plus accrued interest up to ₹5,00,000 is covered by RBI subsidiary DICGC across all scheduled commercial banks.'
      }
    ]);
    setViewMode('editor');
  };

  // Edit existing article
  const handleEditArticle = (article: GuideArticle) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setCategory(article.category);
    setPrimaryKeyword(article.primaryKeyword);
    setSecondaryKeywordsText((article.secondaryKeywords || []).join(', '));
    setMetaTitle(article.metaTitle || article.title);
    setMetaDescription(article.metaDescription || article.excerpt);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setAuthorName(article.author?.name || 'Venkatesh Ramanathan');
    setAuthorRole(article.author?.role || 'Chief Fixed Income Strategist');
    setAuthorCredentials(article.author?.credentials || 'CFP®, CFA');
    setIsPublished(article.isPublished ?? true);
    setFeatured(article.featured ?? false);
    setFaqs(
      article.faqs && article.faqs.length > 0 
        ? article.faqs 
        : [{ question: '', answer: '' }]
    );
    setViewMode('editor');
  };

  // Delete article
  const handleDeleteArticle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return;

    const remaining = articles.filter(a => a.id !== id);
    persistArticles(remaining);

    // Call DELETE API
    try {
      await fetch(`/api/articles?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete error', err);
    }
  };

  // Save Article (Publish or Draft)
  const handleSaveArticle = async (publishState: boolean) => {
    if (!title.trim()) {
      alert('Please enter an Article Title');
      return;
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    const secondaryKeywords = secondaryKeywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    // Compute approximate read time (approx 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(2, Math.ceil(wordCount / 200));

    const articleToSave: GuideArticle = {
      id: editingArticleId || `article-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      slug: cleanSlug,
      title: title.trim(),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      primaryKeyword: primaryKeyword.trim() || title.trim(),
      secondaryKeywords,
      category,
      excerpt: excerpt.trim() || content.slice(0, 160).replace(/[#*`>|]/g, '').trim(),
      content: content.trim(),
      canonicalUrl: `https://yieldnest.online/guide/${cleanSlug}`,
      author: {
        name: authorName.trim() || 'YIELDNEST.ONLINE Editorial Desk',
        role: authorRole.trim() || 'Research Analyst',
        credentials: authorCredentials.trim() || 'CFP®, CFA'
      },
      publishedDate: editingArticleId 
        ? (articles.find(a => a.id === editingArticleId)?.publishedDate || new Date().toISOString().split('T')[0])
        : new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      readTimeMinutes,
      isPublished: publishState,
      featured,
      faqs: validFaqs
    };

    // Update state & localStorage
    let updated: GuideArticle[];
    if (editingArticleId) {
      updated = articles.map(a => a.id === editingArticleId ? articleToSave : a);
    } else {
      updated = [articleToSave, ...articles];
    }
    persistArticles(updated);

    // Sync with API
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleToSave)
      });
    } catch (err) {
      console.warn('API save sync error', err);
    }

    setSaveSuccessMsg(`Article "${articleToSave.title}" saved successfully!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
    setViewMode('list');
  };

  // Quick Markdown formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + `\n\n${prefix}${suffix}`);
  };

  // Filtered list
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesCategory = selectedCategoryFilter === 'All' || a.category === selectedCategoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        a.primaryKeyword.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <Link
            href="/guide"
            target="_blank"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline"
          >
            <span>View Live Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* VIEW 1: ARTICLE LIST & CMS OVERVIEW */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <FileText className="w-5 h-5 text-amber-700" />
                </span>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">
                    Guide &amp; Blog Article Publisher (SEO CMS)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create, edit, and publish high-ranking financial guides with real-time SEO scoring, FAQ Schema.org markup, and Google SERP previews.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/guide"
                target="_blank"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Open Public Guide</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              <button
                onClick={handleOpenNewArticle}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Article</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keyword, or slug..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] pr-1">Category:</span>
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-700 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Article Title &amp; Slug</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Target Keyword</th>
                    <th className="px-4 py-3.5">SEO Health</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Published Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-slate-700">No articles found</p>
                        <p className="text-xs text-slate-400">Click &quot;Create New Article&quot; above to publish your first guide.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map(article => {
                      const score = calculateSeoScore({
                        title: article.title,
                        metaTitle: article.metaTitle || article.title,
                        metaDescription: article.metaDescription || article.excerpt,
                        primaryKeyword: article.primaryKeyword,
                        slug: article.slug,
                        content: article.content,
                        faqs: article.faqs || []
                      }).score;

                      const scoreBadge = 
                        score >= 85 ? { text: `${score}%`, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' } :
                        score >= 70 ? { text: `${score}%`, bg: 'bg-amber-50 text-amber-800 border-amber-200' } :
                        { text: `${score}%`, bg: 'bg-red-50 text-red-800 border-red-200' };

                      return (
                        <tr 
                          key={article.id} 
                          onClick={() => handleEditArticle(article)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="space-y-0.5 max-w-sm">
                              <h4 className="font-bold text-slate-900 hover:text-blue-700 transition-colors line-clamp-1">
                                {article.title}
                              </h4>
                              <p className="text-[11px] font-mono text-slate-400">
                                /guide/{article.slug}
                              </p>
                              {article.featured && (
                                <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                                  Featured Flagship
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                              {article.category}
                            </span>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {article.primaryKeyword}
                            </span>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreBadge.bg} inline-flex items-center gap-1`}>
                              <Sparkles className="w-3 h-3" />
                              <span>SEO: {scoreBadge.text}</span>
                            </span>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              article.isPublished 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {article.isPublished ? 'Live' : 'Draft'}
                            </span>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                            {new Date(article.publishedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/guide/${article.slug}`}
                                target="_blank"
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Preview Live Article"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit Article"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteArticle(article.id, e)}
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SEO ARTICLE EDITOR & REAL-TIME AUDIT SUITE */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          {/* Editor Header Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Back to Article List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                  {editingArticleId ? 'Edit Article & SEO Matrix' : 'Write New Article with Full SEO Compliance'}
                </h2>
                <p className="text-xs text-slate-500">
                  Live SEO score recalculates dynamically as you type. Structured FAQ Schema is auto-generated.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {slug && (
                <Link
                  href={`/guide/${slug}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              )}

              <button
                onClick={() => handleSaveArticle(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Save as Draft
              </button>

              <button
                onClick={() => handleSaveArticle(true)}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish Article</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Editor Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT COLUMN: Main Form & Markdown Editor (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Core Metadata Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>1. Title, URL &amp; Primary Keyword</span>
                </h3>

                {/* Article Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800">Article Title (H1)</label>
                    <span className={`text-[11px] font-mono ${title.length >= 40 && title.length <= 65 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {title.length} / 60 chars (Recommended: 40-65)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g. Complete Guide to Section 80TTB Tax Exemption for Senior Citizens (FY 2025-26)"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>URL Slug</span>
                      <span className="text-slate-400 font-normal">(/guide/...)</span>
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                      placeholder="e.g. section-80ttb-senior-citizen-tax-guide"
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Topic Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as ArticleCategory)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 font-medium"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Keyword & Secondary Keywords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Focus Primary Keyword</span>
                      <span className="text-blue-600 font-semibold">*Important for SEO</span>
                    </label>
                    <input
                      type="text"
                      value={primaryKeyword}
                      onChange={e => setPrimaryKeyword(e.target.value)}
                      placeholder="e.g. Section 80TTB deduction"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Secondary Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={secondaryKeywordsText}
                      onChange={e => setSecondaryKeywordsText(e.target.value)}
                      placeholder="e.g. senior citizen FD tax, 80TTB limit, Form 15H"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Meta Tags & SERP Copy */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>2. Meta Tags (Search Engine Optimization)</span>
                </h3>

                {/* Meta Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800">SEO Meta Title (Title Tag)</label>
                    <span className={`text-[11px] font-mono ${metaTitle.length >= 45 && metaTitle.length <= 60 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {metaTitle.length} / 60 chars (Recommended: 45-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                    placeholder="e.g. Section 80TTB Tax Exemption Guide (FY 2025-26) | YIELDNEST.ONLINE"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 font-medium"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800">SEO Meta Description</label>
                    <span className={`text-[11px] font-mono ${metaDescription.length >= 130 && metaDescription.length <= 160 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {metaDescription.length} / 160 chars (Recommended: 130-160)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    placeholder="e.g. Complete guide to claiming up to ₹50,000 tax-free interest under Section 80TTB for senior citizens. Understand eligibility, Form 15H rules, and bank FD benefits."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Article Lead Excerpt (Shown on Blog Index)</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence overview for the article card on /guide..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Main Markdown Content Editor */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-purple-600" />
                    <span>3. In-Depth Article Content (Markdown)</span>
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span>~{Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200))} min read</span>
                  </div>
                </div>

                {/* Quick Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">Insert:</span>
                  <button
                    type="button"
                    onClick={() => insertFormatting('## Section Subheading\n\n')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded font-semibold border border-slate-200 text-[11px]"
                  >
                    + H2 Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### Subsection Title\n\n')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded font-semibold border border-slate-200 text-[11px]"
                  >
                    + H3 Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> **Statutory Caution:** Always verify the latest RBI / CBDT circular notifications.\n\n')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-semibold border border-amber-200 text-[11px]"
                  >
                    + Warning Callout
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('| Parameter | Standard Citizen | Senior Citizen (60+) |\n| --- | --- | --- |\n| Exemption Section | 80TTA (Savings only) | 80TTB (Savings & FDs) |\n| Max Deduction Limit | ₹10,000 | ₹50,000 |\n| TDS Exemption Threshold | ₹40,000 | ₹50,000 |\n\n')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded font-semibold border border-blue-200 text-[11px]"
                  >
                    + Comparison Table
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- Point 1: Essential compliance requirement\n- Point 2: Documentation verification\n\n')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded font-semibold border border-slate-200 text-[11px]"
                  >
                    + Bullet List
                  </button>
                </div>

                <textarea
                  rows={16}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write comprehensive article content in markdown format. Use ## for main sections to build the Table of Contents..."
                  className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 leading-relaxed"
                />
              </div>

              {/* FAQ Builder (Generates Schema.org FAQPage) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>4. Frequently Asked Questions (FAQ Schema Builder)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      These questions automatically render as Google Search Rich Accordion snippets.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFaqs(prev => [...prev, { question: '', answer: '' }])}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-600">Question #{idx + 1}</span>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setFaqs(prev => prev.filter((_, i) => i !== idx))}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={faq.question}
                        onChange={e => {
                          const val = e.target.value;
                          setFaqs(prev => prev.map((item, i) => i === idx ? { ...item, question: val } : item));
                        }}
                        placeholder="e.g. Can an NRI senior citizen claim Section 80TTB benefits?"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                      />

                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={e => {
                          const val = e.target.value;
                          setFaqs(prev => prev.map((item, i) => i === idx ? { ...item, answer: val } : item));
                        }}
                        placeholder="e.g. No. Section 80TTB is strictly restricted to resident senior citizen individuals..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-800 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Real-Time SEO Inspector & Google SERP Preview (1 col) */}
            <div className="space-y-6 sticky top-20">
              {/* Overall SEO Score Gauge */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Real-time SEO Audit
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    seoAudit.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                    seoAudit.score >= 70 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {seoAudit.score >= 85 ? 'Excellent SEO' : seoAudit.score >= 70 ? 'Good / Passing' : 'Needs Optimization'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-2xl font-extrabold shadow-xs ${
                    seoAudit.score >= 85 ? 'bg-emerald-600 text-white' :
                    seoAudit.score >= 70 ? 'bg-amber-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {seoAudit.score}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Calculated Rating</span>
                    <h4 className="text-sm font-bold text-slate-800">{seoAudit.score}/100 Score</h4>
                    <p className="text-[11px] text-slate-500">
                      {seoAudit.checks.filter(c => c.passed).length} of {seoAudit.checks.length} checks passed
                    </p>
                  </div>
                </div>

                {/* 8-Point Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  {seoAudit.checks.map((check, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`font-semibold ${check.passed ? 'text-slate-800' : 'text-slate-600'}`}>
                          {check.label}
                        </span>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {check.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google SERP Live Simulator */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google SERP Preview</span>
                  </h3>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setSerpDevice('desktop')}
                      className={`p-1 rounded ${serpDevice === 'desktop' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-400'}`}
                      title="Desktop Search"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpDevice('mobile')}
                      className={`p-1 rounded ${serpDevice === 'mobile' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-400'}`}
                      title="Mobile Search"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Google Result Card */}
                <div className={`p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 ${serpDevice === 'mobile' ? 'max-w-[280px] mx-auto text-xs' : ''}`}>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-700 text-white text-[8px] flex items-center justify-center font-bold">
                      Y
                    </div>
                    <span className="font-medium text-slate-800">yieldnest.online</span>
                    <span className="text-slate-400">&gt; guide &gt; {slug || 'guide-slug'}</span>
                  </div>

                  <h4 className="text-sm font-medium text-blue-800 hover:underline line-clamp-2 leading-snug cursor-pointer">
                    {metaTitle || title || 'Your Article Title Appears Here'}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {metaDescription || excerpt || 'Your informative meta description showing how you solve the user search query will display here.'}
                  </p>

                  {/* Simulated FAQ Rich Snippet */}
                  {faqs.filter(f => f.question.trim()).length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">People Also Ask (Rich Snippet):</span>
                      <div className="text-blue-700 font-medium flex items-center gap-1">
                        <span>▾ {faqs[0].question || 'Sample FAQ Question'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Author & Publishing Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Author &amp; Publication Status</span>
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Author Name</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-medium text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Credentials</label>
                      <input
                        type="text"
                        value={authorCredentials}
                        onChange={e => setAuthorCredentials(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Designation</label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={e => setAuthorRole(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={e => setIsPublished(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Publish live to public /guide portal</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={e => setFeatured(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Mark as Featured Flagship Guide</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
