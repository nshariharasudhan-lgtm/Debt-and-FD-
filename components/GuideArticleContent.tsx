'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Tag,
  ThumbsUp
} from 'lucide-react';
import { GuideArticle, initialGuideArticles, generateArticleJsonLd, generateFaqJsonLd, generateBreadcrumbJsonLd } from '@/lib/articles-data';

interface GuideArticleContentProps {
  initialArticle: GuideArticle;
  slug: string;
}

export function GuideArticleContent({ initialArticle, slug }: GuideArticleContentProps) {
  const [article, setArticle] = useState<GuideArticle>(initialArticle);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [liked, setLiked] = useState(false);

  // Check if article was edited or created locally in CMS
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const localData = localStorage.getItem('bharat_debt_articles');
        if (localData) {
          const parsed: GuideArticle[] = JSON.parse(localData);
          const match = parsed.find(a => a.slug === slug);
          if (match) {
            setArticle(match);
          }
        }
      } catch (e) {
        console.warn('Local articles read error', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Extract H2 headings for Table of Contents
  const headings = React.useMemo(() => {
    const lines = (article.content || '').split('\n');
    const h2s: { id: string; text: string }[] = [];
    for (const line of lines) {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        h2s.push({ id, text });
      }
    }
    return h2s;
  }, [article.content]);

  // Format Markdown-like text into structured elements safely
  const renderFormattedContent = (content: string) => {
    const blocks = content.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h2 
            key={idx} 
            id={id} 
            className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-10 mb-4 pt-4 border-t border-slate-100 flex items-center gap-2 group scroll-mt-24"
          >
            <span className="text-blue-700">#</span>
            <span>{text}</span>
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-6 mb-3">
            {text}
          </h3>
        );
      }

      // Blockquote / Statutory Caution
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/gm, '');
        return (
          <div key={idx} className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border-l-4 border-amber-500 text-amber-950 text-sm leading-relaxed shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>{quoteText}</div>
            </div>
          </div>
        );
      }

      // Markdown Table
      if (trimmed.includes('|') && trimmed.includes('---')) {
        const rows = trimmed.split('\n').filter(r => r.trim().startsWith('|'));
        if (rows.length >= 3) {
          const headerCols = rows[0].split('|').map(c => c.trim()).filter(Boolean);
          const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));

          return (
            <div key={idx} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-800 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    {headerCols.map((col, cIdx) => (
                      <th key={cIdx} className="px-4 py-3 border-r border-slate-200 last:border-r-0">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-3 text-slate-700 border-r border-slate-150 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(i => i.trim().startsWith('- ') || i.trim().startsWith('* '));
        return (
          <ul key={idx} className="my-4 space-y-2 list-none pl-0">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^[-*]\s+/, '');
              return (
                <li key={iIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <span>{cleanItem}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter(i => /^\d+\.\s/.test(i.trim()));
        return (
          <ol key={idx} className="my-4 space-y-2 list-none pl-0">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^\d+\.\s+/, '');
              return (
                <li key={iIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {iIdx + 1}
                  </span>
                  <span>{cleanItem}</span>
                </li>
              );
            })}
          </ol>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed my-4">
          {trimmed}
        </p>
      );
    });
  };

  const articleJsonLd = generateArticleJsonLd(article);
  const faqJsonLd = generateFaqJsonLd(article.faqs);
  const breadcrumbsJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://yieldnest.online' },
    { name: 'Investor Guides', url: 'https://yieldnest.online/guide' },
    { name: article.title, url: `https://yieldnest.online/guide/${article.slug}` }
  ]);

  return (
    <article className="min-h-screen bg-slate-50/60 pb-16">
      {/* Structured Schema.org Markup for Article, FAQPage and Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Top Breadcrumb Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Investor Guides</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Share or copy article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Article Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/guide" className="hover:text-blue-700">Guides</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">{article.category}</span>
        </nav>

        {/* Article Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified for FY 2025-26
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans">
              {article.excerpt}
            </p>
          </div>

          {/* Author Card & Credibility */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-base shadow-xs">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{article.author.name}</h3>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                    {article.author.credentials}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{article.author.role}</p>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-0.5 sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published: {new Date(article.publishedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              {article.updatedDate && (
                <p className="text-[11px] text-slate-400">Updated: {new Date(article.updatedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              )}
            </div>
          </div>
        </div>

        {/* Front-Loaded Direct Answer Capsule (Featured Snippet optimization) */}
        <div 
          data-content-capsule="true"
          className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Key Takeaway Summary</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">Statutory Authority</span>
              <p className="text-white font-medium">Income Tax Act, 1961 &amp; RBI Master Directions</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">Primary Target</span>
              <p className="text-white font-medium">{article.primaryKeyword}</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block font-semibold">Investor Segment</span>
              <p className="text-white font-medium">Indian Retail Depositors &amp; Senior Citizens (60+)</p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Table of Contents</span>
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {headings.map(h => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-slate-600 hover:text-blue-700 font-medium flex items-center gap-2 py-0.5 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{h.text}</span>
                  </a>
                </li>
              ))}
              {article.faqs && article.faqs.length > 0 && (
                <li>
                  <a
                    href="#frequently-asked-questions"
                    className="text-slate-600 hover:text-blue-700 font-medium flex items-center gap-2 py-0.5 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Frequently Asked Questions (FAQs)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Main Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm prose-slate max-w-none">
          {renderFormattedContent(article.content)}

          {/* Secondary Keywords / Tags */}
          {article.secondaryKeywords && article.secondaryKeywords.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Related Topics:
              </span>
              {article.secondaryKeywords.map((kw, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interactive FAQ Section with FAQPage Schema */}
        {article.faqs && article.faqs.length > 0 && (
          <div id="frequently-asked-questions" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Clear Answers for Depositors
            </h2>

            <div className="space-y-3 pt-2">
              {article.faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div 
                    key={fIdx} 
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* E-E-A-T Author Bio Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              {article.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{article.author.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 border border-blue-700 text-xs font-extrabold">
                  {article.author.credentials}
                </span>
              </div>
              <p className="text-xs text-blue-400 font-medium">{article.author.role}</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {article.author.bio || 'Experienced analyst specializing in Indian banking regulations, senior citizen cashflow, and fixed income debt instruments.'}
              </p>
            </div>
          </div>
        </div>

        {/* Helpful Feedback Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            Did you find this guide helpful?
          </span>
          <button
            onClick={() => setLiked(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              liked 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{liked ? 'Thank You!' : 'Yes, Very Clear'}</span>
          </button>
        </div>

        {/* CTA Banner to Calculators */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-blue-950 font-serif">
              Calculate Your Exact Net Yield
            </h3>
            <p className="text-xs sm:text-sm text-blue-800">
              Apply the rules from this guide to your real investments with our free, zero-login calculators.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Open Calculator
            </Link>
            <Link
              href="/fd-rates"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 border border-blue-200 font-bold text-xs sm:text-sm transition-colors"
            >
              Compare Bank FDs
            </Link>
          </div>
        </div>
      </main>
    </article>
  );
}
