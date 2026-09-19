import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixed Income Knowledge Base & Senior Citizen Tax Guides | YIELDNEST.ONLINE',
  description: 'Statutory guides on Section 80TTB, DICGC ₹5 Lakh deposit insurance, Form 15H submission, RBI Floating Rate Savings Bonds, and Corporate FD safety ratings.',
  alternates: {
    canonical: 'https://yieldnest.online/guide',
  },
  openGraph: {
    title: 'Fixed Income Knowledge Base & Senior Citizen Tax Guides | YIELDNEST.ONLINE',
    description: 'Statutory guides on Section 80TTB, DICGC ₹5 Lakh deposit insurance, Form 15H submission, RBI Floating Rate Savings Bonds, and Corporate FD safety ratings.',
    url: 'https://yieldnest.online/guide',
    type: 'website',
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
