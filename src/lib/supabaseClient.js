import { createClient } from '@supabase/supabase-js'

// Read variables from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Throw an error during development if variables are missing
    throw new Error("Error: Supabase URL or Anon Key missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
    // In production builds, Vite might replace these checks, 
    // but it's good practice to have them for local dev.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 