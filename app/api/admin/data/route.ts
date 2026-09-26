import { NextRequest, NextResponse } from 'next/server';
import { initialBenchmarks, initialDebtInstruments, DebtInstrument, MarketBenchmark } from '@/lib/debt-data';
import { initialGuideArticles, GuideArticle } from '@/lib/articles-data';
import { ScrapeTarget } from '@/lib/scraping-agent';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// In-memory persistent cache for server process lifetime
let persistedInstruments: DebtInstrument[] = [...initialDebtInstruments];
let persistedBenchmarks: MarketBenchmark = { ...initialBenchmarks };
let persistedTargets: ScrapeTarget[] = []; // Starts clean with ZERO hardcoded URLs
let persistedArticles: GuideArticle[] = [...initialGuideArticles];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    if (type === 'instruments') {
      return NextResponse.json({
        success: true,
        instruments: persistedInstruments,
        total: persistedInstruments.length
      });
    }

    if (type === 'benchmarks') {
      return NextResponse.json({
        success: true,
        benchmarks: persistedBenchmarks
      });
    }

    if (type === 'targets') {
      return NextResponse.json({
        success: true,
        targets: persistedTargets,
        total: persistedTargets.length
      });
    }

    if (type === 'articles') {
      return NextResponse.json({
        success: true,
        articles: persistedArticles,
        total: persistedArticles.length
      });
    }

    // Default: return all portal data
    return NextResponse.json({
      success: true,
      instruments: persistedInstruments,
      benchmarks: persistedBenchmarks,
      targets: persistedTargets,
      articles: persistedArticles
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, instruments, benchmarks, targets, articles, article } = body;

    if (action === 'save_instruments' && Array.isArray(instruments)) {
      persistedInstruments = instruments;
      return NextResponse.json({
        success: true,
        message: `${instruments.length} instruments updated successfully`,
        count: instruments.length
      });
    }

    if (action === 'save_benchmarks' && benchmarks) {
      persistedBenchmarks = benchmarks;
      return NextResponse.json({
        success: true,
        message: 'Market benchmarks updated successfully'
      });
    }

    if (action === 'save_targets' && Array.isArray(targets)) {
      persistedTargets = targets;
      return NextResponse.json({
        success: true,
        message: `${targets.length} custom scrape targets saved successfully`,
        count: targets.length
      });
    }

    if (action === 'save_articles' && Array.isArray(articles)) {
      persistedArticles = articles;
      return NextResponse.json({
        success: true,
        message: `${articles.length} articles saved successfully`,
        count: articles.length
      });
    }

    if (action === 'save_single_article' && article) {
      const idx = persistedArticles.findIndex(a => a.id === article.id || a.slug === article.slug);
      if (idx >= 0) {
        persistedArticles[idx] = article;
      } else {
        persistedArticles.unshift(article);
      }
      return NextResponse.json({
        success: true,
        message: 'Article saved successfully',
        article
      });
    }

    if (action === 'delete_article' && body.id) {
      persistedArticles = persistedArticles.filter(a => a.id !== body.id && a.slug !== body.id);
      return NextResponse.json({
        success: true,
        message: 'Article deleted successfully'
      });
    }

    if (action === 'full_backup_restore') {
      if (Array.isArray(instruments)) persistedInstruments = instruments;
      if (benchmarks) persistedBenchmarks = benchmarks;
      if (Array.isArray(targets)) persistedTargets = targets;
      if (Array.isArray(articles)) persistedArticles = articles;
      return NextResponse.json({
        success: true,
        message: 'Portal backup restored successfully'
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
