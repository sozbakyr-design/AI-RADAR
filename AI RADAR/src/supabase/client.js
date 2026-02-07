
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = window.env?.SUPABASE_URL || 'https://klurdslrynenjmocirvq.supabase.co';
const SUPABASE_ANON_KEY = window.env?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdXJkc2xyeW5lbmptb2NpcnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzU3NzgsImV4cCI6MjA4NTg1MTc3OH0._nP8M_31zXkmB_LwJ94Otqfcu2KWFrrOoDswdAe89sY';

let supabase = null;

export function initSupabase() {
    if (supabase) return supabase;

    if (!SUPABASE_URL.includes('http')) {
        console.warn('Supabase not configured. Using Mock mode.');
        return null; // Handle mock mode upstream
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized');
    return supabase;
}

export function getClient() {
    if (!supabase) return initSupabase();
    return supabase;
}
