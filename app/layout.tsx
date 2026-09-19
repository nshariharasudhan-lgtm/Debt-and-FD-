import type { Metadata } from 'next';
import './globals.css';
import { SITE_STRUCTURED_DATA } from '@/lib/schema';

export const metadata: Metadata = {
  metadataBase: new URL('https://yieldnest.online'),
  title: 'Indian Debt & Fixed Income Portal | Bank FDs, Corporate Bonds, RBI Bonds & Yield Analytics',
  description: 'Comprehensive intelligence and yield analytics on Indian Fixed Deposits, Corporate Bonds, RBI Savings Bonds, SCSS, and G-Secs with tailored calculators for senior citizens and investors.',
  alternates: {
    canonical: 'https://yieldnest.online',
  },
  keywords: [
    'Indian Debt Instruments',
    'Bank Fixed Deposit Rates India',
    'Corporate Bonds India',
    'RBI Floating Rate Savings Bonds',
    'Senior Citizen Savings Scheme SCSS',
    'FD Interest Rate Calculator',
    'Post Tax Yield Calculator India',
    'Section 80TTB Tax Benefit',
    'NCD Investment India',
    'Government Securities G-Sec',
    'DICGC Insurance Limit'
  ],
  authors: [{ name: 'Venkatesh Ramanathan, CFP®, CFA', url: 'https://yieldnest.online/#author-methodology' }],
  creator: 'YIELDNEST.ONLINE Research Desk',
  publisher: 'YIELDNEST.ONLINE',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-search-console-verification-token',
    other: {
      'msvalidate.01': ['bing-webmaster-verification-token'],
    },
  },
  openGraph: {
    title: 'YIELDNEST.ONLINE | Indian Debt & Fixed Income Portal',
    description: 'Compare Bank FDs, Corporate Bonds, RBI Bonds and calculate real post-tax returns for Senior Citizens and Indian debt investors.',
    url: 'https://yieldnest.online',
    siteName: 'YIELDNEST.ONLINE',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YIELDNEST.ONLINE | Fixed Income & Yield Analytics',
    description: 'Compare Bank FDs, Corporate Bonds, RBI Bonds and calculate real post-tax returns for Senior Citizens and Indian debt investors.',
  },
  other: {
    'agentic-tools': '/api/mcp/tools',
    'llms-txt': '/llms.txt',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8TSJVS8X60" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-8TSJVS8X60');
            `,
          }}
        />

        <link rel="alternate" type="application/json+tools" href="/api/mcp/tools" title="WebMCP Tool Registry" />
        <link rel="agent-manifest" href="/.well-known/agent.json" />
        <link rel="help" href="/llms.txt" title="LLMs Context Directory" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_STRUCTURED_DATA),
          }}
        />
      </head>
      <body className="w-full max-w-full overflow-x-hidden" suppressHydrationWarning>{children}</body>
    </html>
  );
}

