import { supabase } from "../services/supabase.js";
import { theme } from "../theme.js";
import { v4 as uuid } from "uuid";

export default async (ctx) => {
  if (!supabase) return ctx.reply(`${theme.warn} Alerts temporarily unavailable.`);

  const parts = (ctx.message.text || "").trim().split(/\s+/);
  const symbol = (parts[1] || "DRONO").toUpperCase();
  const pct = Number(parts[2] || "10");
  const dir = (parts[3] || "up").toLowerCase();
  if (!["up","down"].includes(dir) || Number.isNaN(pct) || pct <= 0)
    return ctx.reply(`${theme.warn} Usage: /alert DRONO 10 up|down`);

  const tg_id = ctx.from.id;
  await supabase.from("profiles").upsert({ tg_id, username: ctx.from.username, last_seen_at: new Date().toISOString() });
  const { error } = await supabase.from("alerts").insert({ id: uuid(), tg_id, token: symbol, direction: dir, threshold_pct: pct });
  if (error) return ctx.reply(`${theme.err} Could not save alert.`);
  return ctx.reply(`${theme.ok} Alert set: ${symbol} ${dir} ${pct}%`);
};
