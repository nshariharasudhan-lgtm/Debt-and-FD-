'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GuideArticle } from '@/lib/articles-data';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function ResourceArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<GuideArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      try {
        // 1. Check local storage
        const localSaved = localStorage.getItem('bharat_debt_articles');
        if (localSaved) {
          const parsed: GuideArticle[] = JSON.parse(localSaved);
          const found = parsed.find(a => a.slug === slug);
          if (found) {
            setArticle(found);
            setLoading(false);
            return;
          }
        }

        // 2. Fetch from backend API
        const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.article) {
            setArticle(data.article);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Clean Markdown & Content block parser
  const renderContentBlocks = (rawContent: string) => {
    if (!rawContent) return null;
    const blocks = rawContent.split(/\n\n+/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace(/^##\s+/, '');
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-200">
            {text}
          </h2>
        );
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^###\s+/, '');
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2">
            {text}
          </h3>
        );
      }

      // Blockquote / Caution callout
      if (trimmed.startsWith('> ')) {
        const text = trimmed.replace(/^>\s+/, '');
        return (
          <blockquote key={idx} className="p-4 my-4 rounded-xl bg-blue-50/70 border-l-4 border-blue-600 text-xs sm:text-sm text-blue-900 leading-relaxed">
            {text}
          </blockquote>
        );
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(i => i.trim().startsWith('- ') || i.trim().startsWith('* '));
        return (
          <ul key={idx} className="my-4 space-y-2 list-none pl-0">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item.replace(/^[-*]\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-3">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
          <p className="text-sm text-slate-600">
            The requested article could not be located. It may have been unpublished or updated in the Admin Dashboard.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Resources</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Resources ({article.resourceType || 'Overview'})</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Article Header Card */}
        <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {article.resourceType || 'Resource'} • {article.category}
              </span>
              {article.primaryKeyword && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{article.primaryKeyword}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-serif border-l-4 border-blue-500 pl-4 py-1 italic bg-slate-50/50 rounded-r-lg">
                {article.excerpt}
              </p>
            )}

            {/* Author and Metadata bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  {article.author?.name ? article.author.name.charAt(0) : 'Y'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {article.author?.name || 'YIELDNEST.ONLINE Desk'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {article.author?.role || 'Fixed Income Research'} {article.author?.credentials && `(${article.author.credentials})`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.publishedDate}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readTimeMinutes} min read</span>
                </span>
              </div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="pt-6 border-t border-slate-100 text-slate-700 leading-relaxed">
            {renderContentBlocks(article.content)}
          </div>

          {/* FAQ Section if defined */}
          {article.faqs && article.faqs.length > 0 && article.faqs.some(f => f.question?.trim()) && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2>Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {article.faqs.filter(f => f.question?.trim()).map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
