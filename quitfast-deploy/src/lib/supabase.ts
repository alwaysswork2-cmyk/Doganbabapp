import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase bağlantısı için VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ayarlanmalı.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}