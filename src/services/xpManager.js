import { supabase } from "./supabase.js";
import { asset } from "./images.js";
import fs from "node:fs";

const milestoneLevels = [1,5,10,15,20,25,30,35,40,45,50];
const XP_PER_ACTION = 10;

export async function addXP(ctx, amount = XP_PER_ACTION, kind = "command") {
  if (!supabase) return;
  const tg_id = ctx.from.id;
  const username = ctx.from.username || "pilot";

  // fetch current xp
  const { data: prof } = await supabase.from("profiles").select("xp").eq("tg_id", tg_id).maybeSingle();
  const oldXP = prof?.xp ?? 0;
  const newXP = oldXP + amount;
  const oldLevel = Math.floor(oldXP / 100);
  const newLevel = Math.floor(newXP / 100);

  // update xp
  await supabase.from("profiles").upsert({
    tg_id,
    username,
    xp: newXP,
    last_seen_at: new Date().toISOString()
  });

  // log event
  await supabase.from("xp_events").insert({
    tg_id,
    kind,
    amount
  });

  // milestone check
  if (milestoneLevels.includes(newLevel) && newLevel !== oldLevel) {
    const imgPath = asset(`level${newLevel}.png`);
    const caption = `🐂 Pilot @${username} leveled up to Level ${newLevel}!\n💎 Keep flying high — Dronox watches the skies.`;
    if (fs.existsSync(imgPath)) {
      await ctx.replyWithPhoto({ source: imgPath }, { caption });
    } else {
      await ctx.reply(caption);
    }
  } else if (newLevel !== oldLevel) {
    await ctx.reply(`💠 +${amount} XP | Level ${newLevel}`);
  }
}
