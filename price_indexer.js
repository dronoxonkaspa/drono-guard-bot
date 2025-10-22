import fetch from "cross-fetch";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✏️ Replace these manual numbers with real ones later
const manualPrices = {
  DRONO: 0.000021,
  KREP: 0.000018,
  BMT: 0.000012,
  MUTANT: 0.000045
};

async function updatePrices() {
  try {
    const now = new Date().toISOString();

    for (const [token, price] of Object.entries(manualPrices)) {
      await supabase.from("prices").upsert({ token, price, updated_at: now });
    }

    console.log("✅ Prices updated", now);
  } catch (e) {
    console.error("Price update error:", e);
  }
}

updatePrices();
