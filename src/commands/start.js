import { asset } from "../services/images.js";
import { theme } from "../theme.js";

export default async (ctx) => {
  try {
    await ctx.replyWithPhoto({ source: asset("dronox-bg.png") }, {
      caption: `${theme.logo} *Drono Guard online.*\n${theme.br}\nWelcome, pilot @${ctx.from.username || ctx.from.id}.`,
      parse_mode: "Markdown"
    });
  } catch {}
  return ctx.reply(
    `${theme.primary} ${theme.title("Commands")}\n` +
    `• /links – Open Drono Wars, LFG, Website\n` +
    `• /price DRONO – Price in KAS (+24h)\n` +
    `• /alert DRONO 10 up – Alert when +10%\n` +
    `• /rank – Your XP & leaderboard\n` +
    `• /status – Bot & (optional) site status\n` +
    `${theme.br}`,
    { parse_mode: "Markdown" }
  );
};
