import { supabase } from "../services/supabase.js";
import { theme } from "../theme.js";

export default async (ctx) => {
  if (!supabase) return ctx.reply(`${theme.warn} XP system offline.`);
  const tg_id = ctx.from.id;
  const { data: me } = await supabase.from("profiles").select("xp, username").eq("tg_id", tg_id).maybeSingle();
  const meXp = me?.xp ?? 0;
  const meLevel = Math.floor(meXp / 100);

  const { data: top } = await supabase.from("profiles").select("username, xp").order("xp", { ascending: false }).limit(10);
  const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
  const lines = (top || []).map((r,i)=>{
    const lvl = Math.floor((r.xp ?? 0)/100);
    return `${medals[i]||"•"} @${r.username||"pilot"} — Lv ${lvl} | ${r.xp??0} XP`;
  }).join("\n");

  return ctx.reply(
    `${theme.accent} ${theme.title("🏆 Leaderboard")}\n${lines || "No pilots yet."}\n${theme.br}\nYou: Lv ${meLevel} | ${meXp} XP`,
    { parse_mode: "Markdown" }
  );
};
