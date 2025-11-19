/**
 * Supabase Client for Frontend
 * Provides a configured Supabase client for form submissions
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables (injected at build time)
const SUPABASE_URL = 'https://saohpkchezarbhkuernf.supabase.co';

// IMPORTANT: This is the ANON key, not the service role key!
// The anon key should be used for client-side operations
// For now, we'll use a placeholder - this needs to be replaced with the actual anon key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb2hwa2NoZXphcmJoa3Vlcm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjYwMjYsImV4cCI6MjA3NDgwMjAyNn0.YOUR_ANON_KEY_HERE';

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Database Types
 */

export interface Contact {
  id?: string;
  name: string;
  email: string;
  inquiry_type: 'press' | 'store' | 'usage' | 'other';
  message: string;
  status?: 'unread' | 'in_progress' | 'resolved';
  created_at?: string;
  updated_at?: string;
}

export interface StoreApplication {
  id?: string;
  store_name: string;
  industry: 'supermarket' | 'convenience' | 'museum' | 'theater' | 'hospital' | 'other';
  poster_type: 'green' | 'orange';
  location?: string;
  email?: string;
  phone?: string;
  note?: string;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PressApplication {
  id?: string;
  media_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  coverage_content: string;
  publication_date?: string;
  required_period_start?: string;
  required_period_end?: string;
  note?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'expired';
  press_code?: string;
  code_expires_at?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Form submission functions
 */

export async function submitContact(contact: Contact) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function submitStoreApplication(application: StoreApplication) {
  const { data, error } = await supabase
    .from('store_applications')
    .insert([application])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function submitPressApplication(application: PressApplication) {
  const { data, error } = await supabase
    .from('press_applications')
    .insert([application])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
