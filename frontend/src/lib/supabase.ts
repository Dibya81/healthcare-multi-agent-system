import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isPlaceholder = supabaseUrl === 'your-supabase-url' || !supabaseUrl;

export const supabase = (isValidUrl(supabaseUrl) && !isPlaceholder)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      if (typeof window !== 'undefined') {
        console.warn('Supabase: Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Authentication features are mocked for development.');
      }
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
          signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
          signOut: async () => ({ error: null }),
          resetPasswordForEmail: async () => ({ data: {}, error: new Error("Supabase not configured") }),
        },
      };
    })() as any;
