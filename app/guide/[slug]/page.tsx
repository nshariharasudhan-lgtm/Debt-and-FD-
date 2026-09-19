import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { initialGuideArticles, GuideArticle } from '@/lib/articles-data';
import { GuideArticleContent } from '@/components/GuideArticleContent';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for initial pre-rendered articles
export async function generateStaticParams() {
  return initialGuideArticles.map(article => ({
    slug: article.slug,
  }));
}

// Full SEO metadata generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = initialGuideArticles.find(a => a.slug === slug);

  if (!article) {
    // If not in static list, return dynamic fallback metadata
    const cleanTitle = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      title: `${cleanTitle} | YIELDNEST.ONLINE Guide`,
      description: `Comprehensive financial guide on ${cleanTitle} for Indian depositors and senior citizens.`,
      alternates: {
        canonical: `https://yieldnest.online/guide/${slug}`,
      },
    };
  }

  const pageTitle = `${article.metaTitle || article.title} | YIELDNEST.ONLINE`;
  const pageDescription = article.metaDescription || article.excerpt;
  const canonicalUrl = article.canonicalUrl || `https://yieldnest.online/guide/${article.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      article.primaryKeyword,
      ...(article.secondaryKeywords || []),
      'Fixed Deposit India',
      'Senior Citizen Savings',
      'YIELDNEST.ONLINE'
    ],
    authors: [{ name: article.author?.name || 'Venkatesh Ramanathan' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.metaTitle || article.title,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'YIELDNEST.ONLINE Debt Portal',
      locale: 'en_IN',
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate || article.publishedDate,
      authors: [article.author?.name || 'Venkatesh Ramanathan'],
      tags: [article.primaryKeyword, ...(article.secondaryKeywords || [])],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: pageDescription,
    }
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article = initialGuideArticles.find(a => a.slug === slug);

  // If not found in initial static seed, provide a graceful client placeholder
  // that will be hydrated by GuideArticleContent from localStorage
  if (!article) {
    const formattedTitle = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    article = {
      id: `dynamic-${slug}`,
      slug,
      title: formattedTitle,
      metaTitle: formattedTitle,
      metaDescription: `Guide on ${formattedTitle} for Indian investors.`,
      primaryKeyword: formattedTitle,
      secondaryKeywords: [],
      category: 'Bank FDs & DICGC',
      excerpt: `Detailed investor guide covering ${formattedTitle}.`,
      content: `## Overview of ${formattedTitle}\n\nLoading live article content from YIELDNEST.ONLINE editorial registry...`,
      author: {
        name: 'YIELDNEST.ONLINE Editorial Desk',
        role: 'Research Desk',
        credentials: 'CFP®, CFA'
      },
      publishedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      readTimeMinutes: 5,
      isPublished: true,
      faqs: []
    };
  }

  return (
    <GuideArticleContent 
      initialArticle={article} 
      slug={slug} 
    />
  );
}
