'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Award,
  Filter,
  FileText,
  Landmark,
  Calculator,
  Percent
} from 'lucide-react';
import { initialGuideArticles, GuideArticle, ArticleCategory, generateBreadcrumbJsonLd } from '@/lib/articles-data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const CATEGORIES: ('All' | ArticleCategory)[] = [
  'All',
  'Taxation & 80TTB',
  'Bank FDs & DICGC',
  'RBI Sovereign Bonds',
  'Corporate Debt & Ratings',
  'Retirement Planning'
];

export default function GuideBlogPage() {
  const [articles, setArticles] = useState<GuideArticle[]>(initialGuideArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ArticleCategory>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Load articles from localStorage & API to reflect live CMS additions
  useEffect(() => {
    const loadArticles = async () => {
      try {
        // 1. Check local storage for articles created/edited in CMS
        const localSaved = localStorage.getItem('bharat_debt_articles');
        let combined = [...initialGuideArticles];

        if (localSaved) {
          try {
            const parsed: GuideArticle[] = JSON.parse(localSaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Merge local saved with initial articles (local overrides initial)
              const localMap = new Map(parsed.map(a => [a.slug, a]));
              const initialRemaining = initialGuideArticles.filter(a => !localMap.has(a.slug));
              combined = [...parsed, ...initialRemaining];
            }
          } catch (e) {
            console.warn('Could not parse local articles cache', e);
          }
        }

        // 2. Fetch from API
        const res = await fetch('/api/articles?includeDrafts=false');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.articles) && data.articles.length > 0) {
            const apiMap = new Map(data.articles.map((a: GuideArticle) => [a.slug, a]));
            // Merge combined with api
            for (const [slug, item] of apiMap.entries()) {
              const existingIdx = combined.findIndex(a => a.slug === slug);
              if (existingIdx >= 0) {
                combined[existingIdx] = item as GuideArticle;
              } else {
                combined.unshift(item as GuideArticle);
              }
            }
          }
        }

        setArticles(combined);
      } catch (err) {
        console.error('Failed to load articles', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (!article.isPublished) return false;
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.primaryKeyword.toLowerCase().includes(q) ||
        article.secondaryKeywords.some(kw => kw.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return filteredArticles.find(a => a.featured) || filteredArticles[0];
  }, [filteredArticles]);

  const otherArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return filteredArticles.filter(a => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://bharatfixed.in' },
    { name: 'Investor Guides & Blog', url: 'https://bharatfixed.in/guide' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Schema.org Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar activeSection="guides" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Investor Guides &amp; Blog</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>BharatFixed Editorial &amp; Knowledge Hub</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif text-white">
              Indian Fixed Income, Tax &amp; Deposit Guides
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In-depth, compliance-backed research on Section 80TTB tax exemptions, DICGC ₹5 Lakh statutory deposit safety, Form 15H TDS avoidance, and RBI sovereign floating rate bonds. Written by CFP® and CFA charterholders.
            </p>

            {/* Quick Stat Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Section 80TTB Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>DICGC Safety Rules</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>SEBI &amp; RBI Circular Sourced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles by keyword, 80TTB, DICGC, TDS..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Articles Counter */}
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Showing <strong>{filteredArticles.length}</strong> published {filteredArticles.length === 1 ? 'guide' : 'guides'}</span>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Guide Spotlight */}
        {featuredArticle && !searchQuery && selectedCategory === 'All' && (
          <div className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden hover:border-blue-400 transition-all group">
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Featured Flagship Guide</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(featuredArticle.publishedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTimeMinutes} min read
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                  {featuredArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-slate-900 group-hover:text-blue-700 transition-colors">
                  <Link href={`/guide/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Author & CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm border border-blue-200">
                    {featuredArticle.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{featuredArticle.author.name}</h4>
                    <p className="text-[11px] text-slate-500">{featuredArticle.author.credentials} • {featuredArticle.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/guide/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Guides Grid */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>{selectedCategory === 'All' ? 'All In-Depth Articles & Analyses' : `${selectedCategory} Guides`}</span>
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No articles found matching &quot;{searchQuery}&quot;</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for other terms like &quot;80TTB&quot;, &quot;DICGC&quot;, &quot;SCSS&quot;, or &quot;Floating Bonds&quot;, or clear your filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || selectedCategory !== 'All' ? filteredArticles : otherArticles).map(article => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTimeMinutes} min read
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors font-serif leading-snug">
                      <Link href={`/guide/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Target Keywords / Tags */}
                    {article.secondaryKeywords && article.secondaryKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {article.secondaryKeywords.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {article.author.name[0]}
                      </div>
                      <span className="text-slate-700 font-semibold text-[11px]">{article.author.name}</span>
                    </div>

                    <Link
                      href={`/guide/${article.slug}`}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Quick Fixed Income Tool Banners */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                <span>Interactive Yield Tools</span>
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Put Theory into Practice with Live Financial Simulators
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Test Section 80TTB tax savings on your real fixed deposit portfolio, simulate monthly retirement cashflows, or compare scheduled bank rates side-by-side.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/fd-rates"
                className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Landmark className="w-3.5 h-3.5 text-blue-700" />
                <span>Live Bank FD Matrix</span>
              </Link>

              <Link
                href="/senior-citizen-savings-scheme"
                className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>8.20% SCSS Calculator</span>
              </Link>

              <Link
                href="/rbi-floating-rate-bonds"
                className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Percent className="w-3.5 h-3.5 text-emerald-700" />
                <span>8.05% RBI Bonds Hub</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
