import { createClient } from "@supabase/supabase-js";
import { cfg } from "../config.js";

let supabase = null;

if (cfg.supabaseUrl && cfg.supabaseKey) {
  supabase = createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: false }
  });
}

export { supabase };
