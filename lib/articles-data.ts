export interface ArticleAuthor {
  name: string;
  role: string;
  credentials: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export type ArticleCategory = 
  | 'Taxation & 80TTB' 
  | 'Bank FDs & DICGC' 
  | 'RBI Sovereign Bonds' 
  | 'Corporate Debt & Ratings' 
  | 'Retirement Planning';

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string; // Optimal: 50-60 characters
  metaDescription: string; // Optimal: 140-160 characters
  canonicalUrl?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: ArticleCategory;
  resourceType?: 'Insights' | 'Guides'; // Explicit subpage placement
  excerpt: string;
  content: string; // Markdown formatted article body
  author: ArticleAuthor;
  publishedDate: string; // e.g. '2025-02-15'
  updatedDate: string;
  readTimeMinutes: number;
  featured?: boolean;
  isPublished: boolean;
  faqs: ArticleFaq[];
  viewsCount?: number;
}

export interface SeoAuditResult {
  score: number; // 0 - 100
  checks: {
    id: string;
    label: string;
    passed: boolean;
    recommendation: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
}

export const defaultAuthor: ArticleAuthor = {
  name: 'Venkatesh Ramanathan',
  role: 'Chief Fixed Income Strategist',
  credentials: 'CFP®, CFA',
  bio: 'Venkatesh has 18+ years evaluating Indian debt securities, banking regulations, and retirement cashflow structuring for senior citizens.'
};

/**
 * Initial Guide Articles list - kept empty as per requirement:
 * "Do not put your own data, keep the pages without any data, where it can be updated later through Admin Dashboard."
 */
export const initialGuideArticles: GuideArticle[] = [];

export function calculateSeoScore(article: Partial<GuideArticle>): SeoAuditResult {
  const checks: SeoAuditResult['checks'] = [];
  let passedCount = 0;
  const totalWeight = 8;

  // 1. Meta Title Length
  const titleLen = article.metaTitle?.length || article.title?.length || 0;
  const titlePassed = titleLen >= 45 && titleLen <= 65;
  if (titlePassed) passedCount++;
  checks.push({
    id: 'meta-title-length',
    label: `Meta Title Length (${titleLen} chars)`,
    passed: titlePassed,
    recommendation: titlePassed 
      ? 'Optimal length for Google SERP snippet display.' 
      : titleLen < 45 ? 'Title is too short. Target 50-60 characters for maximum click-through.' : 'Title exceeds 65 characters and may be truncated on Google.',
    severity: titlePassed ? 'info' : 'critical'
  });

  // 2. Meta Description Length
  const descLen = article.metaDescription?.length || 0;
  const descPassed = descLen >= 120 && descLen <= 165;
  if (descPassed) passedCount++;
  checks.push({
    id: 'meta-desc-length',
    label: `Meta Description Length (${descLen} chars)`,
    passed: descPassed,
    recommendation: descPassed 
      ? 'Optimal length for search snippets.' 
      : descLen < 120 ? 'Description is too brief. Provide a compelling 140-160 character summary.' : 'Description exceeds 165 characters and will be clipped by search engines.',
    severity: descPassed ? 'info' : 'critical'
  });

  // 3. Primary Keyword in Title
  const hasKeywordInTitle = Boolean(
    article.primaryKeyword && 
    (article.title?.toLowerCase().includes(article.primaryKeyword.toLowerCase()) || 
     article.metaTitle?.toLowerCase().includes(article.primaryKeyword.toLowerCase()))
  );
  if (hasKeywordInTitle) passedCount++;
  checks.push({
    id: 'keyword-in-title',
    label: 'Primary Keyword in Title',
    passed: hasKeywordInTitle,
    recommendation: hasKeywordInTitle 
      ? 'Focus keyword is prominently positioned in the title.' 
      : `Ensure the focus keyword "${article.primaryKeyword || 'your keyword'}" appears in the main title.`,
    severity: hasKeywordInTitle ? 'info' : 'critical'
  });

  // 4. Primary Keyword in Meta Description
  const hasKeywordInDesc = Boolean(
    article.primaryKeyword && 
    article.metaDescription?.toLowerCase().includes(article.primaryKeyword.toLowerCase())
  );
  if (hasKeywordInDesc) passedCount++;
  checks.push({
    id: 'keyword-in-desc',
    label: 'Primary Keyword in Meta Description',
    passed: hasKeywordInDesc,
    recommendation: hasKeywordInDesc 
      ? 'Focus keyword is included in meta description.' 
      : 'Include your focus keyword naturally within the first sentence of the meta description.',
    severity: hasKeywordInDesc ? 'info' : 'warning'
  });

  // 5. Clean Slug Formatting
  const slug = article.slug || '';
  const isSlugClean = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  if (isSlugClean && slug.length > 5) passedCount++;
  checks.push({
    id: 'slug-formatting',
    label: 'SEO-Friendly URL Slug',
    passed: isSlugClean && slug.length > 5,
    recommendation: isSlugClean && slug.length > 5
      ? 'URL slug is lowercase and uses hyphen delimiters.' 
      : 'Use only lowercase alphanumeric characters and single hyphens without special symbols.',
    severity: isSlugClean ? 'info' : 'critical'
  });

  // 6. Content Word Count
  const words = (article.content || '').trim().split(/\s+/).filter(Boolean).length;
  const wordCountPassed = words >= 300;
  if (wordCountPassed) passedCount++;
  checks.push({
    id: 'content-depth',
    label: `Article Content Depth (${words} words)`,
    passed: wordCountPassed,
    recommendation: wordCountPassed 
      ? 'Good content length for comprehensive topical authority.' 
      : 'Comprehensive financial guides should ideally be at least 300 words to answer user queries effectively.',
    severity: wordCountPassed ? 'info' : 'warning'
  });

  // 7. Structured Headings (H2 / H3 tags)
  const hasHeadings = (article.content || '').includes('## ');
  if (hasHeadings) passedCount++;
  checks.push({
    id: 'structured-headings',
    label: 'Structured Subheadings (Markdown H2/H3)',
    passed: hasHeadings,
    recommendation: hasHeadings 
      ? 'Article contains proper hierarchical H2/H3 headings for crawlability.' 
      : 'Add markdown subheadings (e.g., ## Section Title) to break up content for senior readability and search crawlers.',
    severity: hasHeadings ? 'info' : 'warning'
  });

  // 8. FAQ Schema Data Present
  const hasFaqs = Boolean(article.faqs && article.faqs.length >= 1 && article.faqs[0].question.trim().length > 0);
  if (hasFaqs) passedCount++;
  checks.push({
    id: 'faq-schema-readiness',
    label: `FAQ Rich Snippet Schema (${article.faqs?.filter(f => f.question.trim().length > 0).length || 0} Q&As)`,
    passed: hasFaqs,
    recommendation: hasFaqs 
      ? 'FAQ items configured for Google Rich Results snippet generation.' 
      : 'Adding 2-3 common depositor FAQs helps qualify for Google Rich Snippets in SERP.',
    severity: hasFaqs ? 'info' : 'info'
  });

  const score = Math.round((passedCount / totalWeight) * 100);

  return {
    score,
    checks
  };
}

export function generateArticleJsonLd(article: GuideArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl || `https://yieldnest.online/resources/${article.slug}`
    },
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: 'https://yieldnest.online/og-image.png',
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Venkatesh Ramanathan',
      jobTitle: article.author?.role || 'Chief Fixed Income Strategist',
      description: article.author?.credentials || 'CFP®, CFA'
    },
    publisher: {
      '@type': 'Organization',
      name: 'YIELDNEST.ONLINE Debt Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yieldnest.online/icon.png'
      }
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    keywords: [article.primaryKeyword, ...(article.secondaryKeywords || [])].join(', ')
  };
}

export function generateFaqJsonLd(faqs: ArticleFaq[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
