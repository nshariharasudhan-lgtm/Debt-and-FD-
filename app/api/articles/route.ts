import { NextRequest, NextResponse } from 'next/server';
import { initialGuideArticles, GuideArticle, calculateSeoScore } from '@/lib/articles-data';

// In-memory store for server-rendered requests
let articlesCache: GuideArticle[] = [...initialGuideArticles];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const includeDrafts = searchParams.get('includeDrafts') === 'true';

  if (slug) {
    const article = articlesCache.find(a => a.slug === slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ article });
  }

  let filtered = [...articlesCache];

  if (!includeDrafts) {
    filtered = filtered.filter(a => a.isPublished);
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(a => a.category === category);
  }

  return NextResponse.json({
    articles: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { article } = body;

    if (!article || !article.title || !article.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = article.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Calculate SEO audit
    const seoAudit = calculateSeoScore(article);

    const now = new Date().toISOString().split('T')[0];
    const wordCount = (article.content || '').split(/\s+/).filter(Boolean).length;
    const estReadTime = Math.max(1, Math.ceil(wordCount / 180));

    const existingIndex = articlesCache.findIndex(a => a.id === article.id || a.slug === cleanSlug);

    const updatedArticle: GuideArticle = {
      id: article.id || `guide-${cleanSlug}-${Date.now().toString(36)}`,
      slug: cleanSlug,
      title: article.title.trim(),
      metaTitle: article.metaTitle?.trim() || article.title.trim(),
      metaDescription: article.metaDescription?.trim() || article.excerpt?.trim() || '',
      canonicalUrl: article.canonicalUrl || `https://yieldnest.online/guide/${cleanSlug}`,
      primaryKeyword: article.primaryKeyword?.trim() || 'Fixed Deposit',
      secondaryKeywords: Array.isArray(article.secondaryKeywords) ? article.secondaryKeywords : [],
      category: article.category || 'Bank FDs & DICGC',
      excerpt: article.excerpt?.trim() || '',
      content: article.content || '',
      author: article.author || {
        name: 'Venkatesh Ramanathan',
        role: 'Chief Fixed Income Strategist',
        credentials: 'CFP®, CFA'
      },
      publishedDate: article.publishedDate || now,
      updatedDate: now,
      readTimeMinutes: article.readTimeMinutes || estReadTime,
      featured: Boolean(article.featured),
      isPublished: article.isPublished !== false,
      faqs: Array.isArray(article.faqs) ? article.faqs : [],
      viewsCount: (article.viewsCount || 0) + 1
    };

    if (existingIndex >= 0) {
      articlesCache[existingIndex] = updatedArticle;
    } else {
      articlesCache.unshift(updatedArticle);
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
      seoAudit
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'id or slug is required' }, { status: 400 });
    }

    articlesCache = articlesCache.filter(a => a.id !== id && a.slug !== slug);

    return NextResponse.json({
      success: true,
      message: 'Article removed',
      remaining: articlesCache.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
