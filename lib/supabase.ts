import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project Supabase defaults
const FALLBACK_SUPABASE_URL = 'https://cmgqwpnuddynznmgjqsp.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZ3F3cG51ZGR5bnpubWdqcXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMzk2MTIsImV4cCI6MjEwNDcxNTYxMn0.vtIUV7Q7RDKm89jeG8vCZyVMPxxzvhxN33HldhOc7uk';
const FALLBACK_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZ3F3cG51ZGR5bnpubWdqcXNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTEzOTYxMiwiZXhwIjoyMTA0NzE1NjEyfQ.NzxRCs38jnXl42TawAQJgCAglQG6bC8jtQPM3XQzVco';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Sanitizes the Supabase URL by removing accidental path additions like /rest/v1 or trailing slashes
 */
export function cleanSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

export function getCleanSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return cleanSupabaseUrl(envUrl || FALLBACK_SUPABASE_URL);
}

/**
 * Returns a public anon client for Supabase.
 * Uses lazy initialization to prevent crashes when environment variables are missing.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const url = cleanSupabaseUrl(rawUrl);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project') || anonKey.includes('your-anon-key')) {
    return null;
  }

  try {
    supabaseClient = createClient(url, anonKey, {
      auth: { persistSession: false }
    });
    return supabaseClient;
  } catch (error) {
    console.warn('Failed to initialize Supabase public client:', error);
    return null;
  }
}

/**
 * Returns a server-side admin client using the service role key for backend operations.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (supabaseAdminClient) return supabaseAdminClient;

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const url = cleanSupabaseUrl(rawUrl);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || url.includes('your-project') || serviceKey.includes('your-')) {
    return null;
  }

  try {
    supabaseAdminClient = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });
    return supabaseAdminClient;
  } catch (error) {
    console.warn('Failed to initialize Supabase admin client:', error);
    return null;
  }
}
