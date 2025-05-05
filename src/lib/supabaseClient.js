import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase project URL and Anon Key
const supabaseUrl = 'https://zoszvtikcqtcmvmmuvai.supabase.co' // Found in Project Settings > API
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3p2dGlrY3F0Y212bW11dmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Mjc2OTksImV4cCI6MjA2MjAwMzY5OX0.TKaDfhuDi_48CqWbNXG7Ans5tMQFDfdEiSG1qQdeU-Y' // Found in Project Settings > API

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Error: Supabase URL or Anon Key missing. Please check src/lib/supabaseClient.js");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 