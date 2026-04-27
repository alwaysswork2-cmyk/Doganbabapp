import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fydurqmkuoukpewnhpkt.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZHVycW1rdW91a3Bld25ocGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzcxODgsImV4cCI6MjA4ODMxMzE4OH0.3IhAzWIPZMFYFQGGR-byc_Fa13deUB4qBw_S3X63hLg";

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
