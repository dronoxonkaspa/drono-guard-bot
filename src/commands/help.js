import { theme } from "../theme.js";
export default (ctx) => ctx.reply(
  `${theme.primary} ${theme.title("Help")}\n` +
  `This bot is non-custodial & read-only.\n` +
  `Set alerts, check prices, earn XP. No wallet connections.\n` +
  `${theme.br}`,
  { parse_mode: "Markdown" }
);
