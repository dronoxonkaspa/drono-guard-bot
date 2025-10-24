import { Telegraf } from "telegraf";
import { cfg } from "./config.js";
import register from "./router.js";

const bot = new Telegraf(cfg.botToken);

bot.use(async (ctx, next) => {
  if (ctx.chat?.type === "channel") return;
  return next();
});

register(bot);

bot.launch()
  .then(() => console.log("💠 Bot started (polling)..."))
  .catch((err) => console.error("Launch error:", err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
