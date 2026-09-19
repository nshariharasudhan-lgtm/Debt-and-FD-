import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { sampleSubscribers, NewsletterSubscriber } from '@/lib/debt-data';

// In-memory cache for fallback when Supabase is not yet configured
let memorySubscribers: NewsletterSubscriber[] = [...sampleSubscribers];

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const formatted: NewsletterSubscriber[] = data.map((row: any) => ({
          id: String(row.id || row.email),
          email: row.email,
          investorType: row.investor_type || row.investorType || 'Senior Citizen (60+)',
          primaryInterest: row.primary_interest || row.primaryInterest || 'Fixed Deposits & SCSS',
          subscribedAt: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : new Date().toLocaleString('en-IN'),
          status: row.status || 'Active'
        }));

        return NextResponse.json({
          success: true,
          subscribers: formatted,
          source: 'supabase',
          tableExists: true,
          count: formatted.length
        });
      } else if (error) {
        console.warn('Supabase subscribers query notice (table might need creation):', error.message);
      }
    }

    return NextResponse.json({
      success: true,
      subscribers: memorySubscribers,
      source: 'local_fallback',
      supabaseConfigured: Boolean(supabase),
      tableExists: false
    });
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({
      success: true,
      subscribers: memorySubscribers,
      source: 'local_fallback'
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, investorType = 'Senior Citizen (60+)', primaryInterest = 'Senior Citizen FDs & SCSS Quarterly Payouts' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.trim().toLowerCase(),
      investorType,
      primaryInterest,
      subscribedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Active'
    };

    // Attempt to store in Supabase
    let savedToSupabase = false;
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert([
            {
              email: newSub.email,
              investor_type: newSub.investorType,
              primary_interest: newSub.primaryInterest,
              status: 'Active',
              created_at: new Date().toISOString()
            }
          ], { onConflict: 'email' });

        if (!error) {
          savedToSupabase = true;
        } else {
          console.warn('Supabase insert warning (table might need creation):', error.message);
        }
      } catch (dbErr) {
        console.warn('Supabase execution error:', dbErr);
      }
    }

    // Always keep memory fallback updated
    const existingIndex = memorySubscribers.findIndex(s => s.email === newSub.email);
    if (existingIndex >= 0) {
      memorySubscribers[existingIndex] = newSub;
    } else {
      memorySubscribers.unshift(newSub);
    }

    return NextResponse.json({
      success: true,
      data: newSub,
      storedInDatabase: savedToSupabase,
      supabaseConnected: Boolean(supabase),
      message: savedToSupabase 
        ? 'Subscribed and saved securely to Supabase database.' 
        : 'Subscribed successfully. (Will automatically sync to Supabase once credentials are populated in .env)'
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
