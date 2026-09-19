import { NextRequest, NextResponse } from 'next/server';
import { initialGuideArticles, GuideArticle, calculateSeoScore } from '@/lib/articles-data';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// In-memory store fallback
let articlesCache: GuideArticle[] = [...initialGuideArticles];

function mapRowToArticle(row: any): GuideArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title || row.metaTitle || row.title,
    metaDescription: row.meta_description || row.metaDescription || row.excerpt || '',
    canonicalUrl: row.canonical_url || row.canonicalUrl || `https://yieldnest.online/guide/${row.slug}`,
    primaryKeyword: row.primary_keyword || row.primaryKeyword || 'Fixed Deposit',
    secondaryKeywords: Array.isArray(row.secondary_keywords)
      ? row.secondary_keywords
      : Array.isArray(row.secondaryKeywords)
      ? row.secondaryKeywords
      : [],
    category: row.category || 'Bank FDs & DICGC',
    excerpt: row.excerpt || '',
    content: row.content || '',
    author: typeof row.author === 'object' && row.author !== null
      ? row.author
      : {
          name: 'Venkatesh Ramanathan',
          role: 'Chief Fixed Income Strategist',
          credentials: 'CFP®, CFA'
        },
    publishedDate: row.published_date || row.publishedDate || new Date().toISOString().split('T')[0],
    updatedDate: row.updated_date || row.updatedDate || new Date().toISOString().split('T')[0],
    readTimeMinutes: Number(row.read_time_minutes || row.readTimeMinutes || 5),
    featured: Boolean(row.featured),
    isPublished: row.is_published !== undefined ? Boolean(row.is_published) : row.isPublished !== undefined ? Boolean(row.isPublished) : true,
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    viewsCount: Number(row.views_count || row.viewsCount || 0)
  };
}

function mapArticleToRow(article: GuideArticle) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    meta_title: article.metaTitle,
    meta_description: article.metaDescription,
    canonical_url: article.canonicalUrl,
    primary_keyword: article.primaryKeyword,
    secondary_keywords: article.secondaryKeywords,
    category: article.category,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    published_date: article.publishedDate,
    updated_date: article.updatedDate,
    read_time_minutes: article.readTimeMinutes,
    featured: article.featured,
    is_published: article.isPublished,
    faqs: article.faqs,
    views_count: article.viewsCount
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const includeDrafts = searchParams.get('includeDrafts') === 'true';

  const supabase = getSupabaseAdminClient() || getSupabaseClient();

  // Try Supabase first if available
  if (supabase) {
    try {
      if (slug) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({ article: mapRowToArticle(data), source: 'supabase' });
        }
      } else {
        let query = supabase.from('articles').select('*');
        if (!includeDrafts) {
          query = query.eq('is_published', true);
        }
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        query = query.order('published_date', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const articles = data.map(mapRowToArticle);
          return NextResponse.json({
            articles,
            total: articles.length,
            source: 'supabase'
          });
        }
      }
    } catch (err) {
      console.warn('Supabase query fallback to memory cache:', err);
    }
  }

  // Fallback to local memory cache
  if (slug) {
    const article = articlesCache.find(a => a.slug === slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ article, source: 'cache' });
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
    total: filtered.length,
    source: 'cache'
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

    // Update in-memory store
    const existingIndex = articlesCache.findIndex(a => a.id === updatedArticle.id || a.slug === cleanSlug);
    if (existingIndex >= 0) {
      articlesCache[existingIndex] = updatedArticle;
    } else {
      articlesCache.unshift(updatedArticle);
    }

    // Persist to Supabase if connected
    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    let savedToDatabase = false;
    let dbError: string | null = null;

    if (supabase) {
      try {
        const row = mapArticleToRow(updatedArticle);
        const { error } = await supabase
          .from('articles')
          .upsert(row, { onConflict: 'slug' });

        if (!error) {
          savedToDatabase = true;
        } else {
          dbError = error.message;
          console.warn('Supabase upsert warning:', error.message);
        }
      } catch (err: any) {
        dbError = err.message;
        console.warn('Failed to save to Supabase:', err);
      }
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
      seoAudit,
      savedToDatabase,
      dbWarning: dbError ? `Saved to memory cache. Supabase note: ${dbError}` : undefined
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

    // Remove from in-memory cache
    articlesCache = articlesCache.filter(a => a.id !== id && a.slug !== slug);

    // Delete from Supabase if connected
    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    if (supabase) {
      try {
        if (id) {
          await supabase.from('articles').delete().eq('id', id);
        } else if (slug) {
          await supabase.from('articles').delete().eq('slug', slug);
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Article removed',
      remaining: articlesCache.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
