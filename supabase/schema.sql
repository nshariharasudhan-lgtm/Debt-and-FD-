-- ==============================================================================
-- YIELDNEST.ONLINE - SUPABASE DATABASE SCHEMA FOR BLOG / GUIDE ARTICLES
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- Project: cmgqwpnuddynznmgjqsp.supabase.co
-- ==============================================================================

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    primary_keyword TEXT DEFAULT 'Fixed Deposit',
    secondary_keywords JSONB DEFAULT '[]'::jsonb,
    category TEXT NOT NULL DEFAULT 'Bank FDs & DICGC',
    excerpt TEXT,
    content TEXT NOT NULL,
    author JSONB NOT NULL DEFAULT '{
        "name": "Venkatesh Ramanathan",
        "role": "Chief Fixed Income Strategist",
        "credentials": "CFP®, CFA",
        "bio": "Venkatesh has 18+ years evaluating Indian debt securities, banking regulations, and retirement cashflow structuring for senior citizens."
    }'::jsonb,
    published_date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
    updated_date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
    read_time_minutes INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    faqs JSONB DEFAULT '[]'::jsonb,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON public.articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured);

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 5. Policies:
-- Allow anyone (public anon) to view published articles
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
    ON public.articles
    FOR SELECT
    USING (is_published = true);

-- Allow authenticated users / service_role full read & write access
DROP POLICY IF EXISTS "Service role has full access" ON public.articles;
CREATE POLICY "Service role has full access"
    ON public.articles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Grant permissions to anon and authenticated roles
GRANT SELECT ON public.articles TO anon;
GRANT ALL ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
