import { createClient } from "@supabase/supabase-js";
import { Telegraf } from "telegraf";
import "dotenv/config";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const bot = new Telegraf(process.env.BOT_TOKEN);

async function checkAlerts() {
  // read alerts that are still active
  const { data: alerts } = await supabase.from("alerts").select("*").eq("active", true);
  const { data: prices } = await supabase.from("prices").select("token, price");
  if (!alerts?.length || !prices?.length) return console.log("No alerts or prices yet.");

  for (const alert of alerts) {
    const priceRow = prices.find(p => p.token === alert.token);
    if (!priceRow) continue;

    // right now there’s no real market feed, so this will just demo the alert
    await bot.telegram.sendMessage(
      alert.tg_id,
      `⚡ ${alert.token} moved ${alert.direction} ${alert.threshold_pct}%\nCurrent price: ${priceRow.price}`
    );

    // deactivate alert after it fires once
    await supabase.from("alerts").update({ active: false }).eq("id", alert.id);
  }
  console.log("✅ Alerts checked");
}

checkAlerts();
