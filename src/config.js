import "dotenv/config";

export const cfg = {
  botToken: process.env.BOT_TOKEN,
  webhookUrl: process.env.WEBHOOK_URL || null,
  lfgApi: process.env.LFG_API_BASE || "https://api.lfg.kaspa.com/api/v1",
  kaspaApi: process.env.KASPA_API_BASE || "https://api.kaspa.org",
  statusUrl: process.env.DRONOX_STATUS_URL || null,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY
};

if (!cfg.botToken) throw new Error("Missing BOT_TOKEN");
