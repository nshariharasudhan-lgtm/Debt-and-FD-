'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles, Send, Bell } from 'lucide-react';
import { NewsletterSubscriber, sampleSubscribers } from '@/lib/debt-data';

interface NewsletterSignupProps {
  isModal?: boolean;
  onClose?: () => void;
}

export function NewsletterSignup({ isModal = false, onClose }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [investorType, setInvestorType] = useState<NewsletterSubscriber['investorType']>('Senior Citizen (60+)');
  const [interest, setInterest] = useState('Senior Citizen FDs & SCSS Quarterly Payouts');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);

    try {
      // Call server-side API to persist in Supabase / backend store
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          investorType,
          primaryInterest: interest
        })
      });

      const resData = await response.json();
      if (resData?.storedInDatabase) {
        setDbStatus('Saved to Supabase');
      }

      // Also sync to localStorage for instantaneous offline/client responsiveness
      const newSub: NewsletterSubscriber = {
        id: `sub-${Date.now()}`,
        email,
        investorType,
        primaryInterest: interest,
        subscribedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'Active'
      };

      try {
        const existingRaw = localStorage.getItem('bharat_debt_newsletter_subscribers');
        const list: NewsletterSubscriber[] = existingRaw ? JSON.parse(existingRaw) : sampleSubscribers;
        list.unshift(newSub);
        localStorage.setItem('bharat_debt_newsletter_subscribers', JSON.stringify(list));
      } catch (err) {
        console.error('Storage error', err);
      }
    } catch (apiErr) {
      console.warn('API sync notice:', apiErr);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const content = (
    <div className={`p-6 sm:p-8 ${isModal ? 'bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl relative' : 'bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-xs my-8'}`}>
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
          aria-label="Close"
        >
          &times;
        </button>
      )}

      {submitted ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900">
            You&apos;re Subscribed to The Indian Debt Pulse
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            A confirmation dispatch has been logged for <strong className="text-slate-900">{email}</strong>. Every Friday morning, you will receive real-time rate updates, RBI MPC stances, and senior citizen yield notices.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                if (onClose) onClose();
              }}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Bell className="w-4 h-4" />
            <span>Weekly Fixed Income Digest</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900">
            Subscribe to &ldquo;The Indian Debt Pulse&rdquo;
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            Never miss an RBI Repo rate shift, new bank FD rate peak, or sovereign bond tranche. Curated weekly by fixed-income research analysts specifically for Indian retirees and conservative debt investors.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="newsletter-email-input"
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Investor Category
                </label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value as any)}
                  id="newsletter-investor-type-select"
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Senior Citizen (60+)">Senior Citizen (Age 60+)</option>
                  <option value="Retirement Planner">Retirement Planner</option>
                  <option value="Retail Investor">Retail Debt Investor</option>
                  <option value="NRI / HNI">NRI / High Networth</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Focus
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  id="newsletter-interest-select"
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Senior Citizen FDs & SCSS Quarterly Payouts">Senior Citizen FDs & SCSS</option>
                  <option value="RBI Floating Bonds & G-Secs">RBI Floating Bonds & G-Secs</option>
                  <option value="High-Yield Small Finance Banks (9%+) & DICGC">SFB High Yields (9%+) & DICGC</option>
                  <option value="AAA Corporate FDs & Tax-Free Bonds">AAA Corporate FDs & Tax-Free Bonds</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero spam. Direct unsubscribe anytime.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="newsletter-submit-btn"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Join Free Weekly Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}
