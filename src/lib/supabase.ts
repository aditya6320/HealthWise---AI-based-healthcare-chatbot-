import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with direct connection
// Replace these with your actual Supabase URL and anon key when ready
const supabaseUrl = 'https://jfsrnekehszxekvmrlib.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3JuZWtlaHN6eGVrdm1ybGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjEzMjYsImV4cCI6MjA3MDQ5NzMyNn0.WXkkqVVUr8Ocu4f--IxTB8pfmU6NyktWFnFPhM1E-jc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);