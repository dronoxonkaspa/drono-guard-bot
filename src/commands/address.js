import { theme } from "../theme.js";
export default async (ctx) => {
  const parts = (ctx.message.text || "").trim().split(/\s+/);
  const addr = parts[1];
  if (!addr) return ctx.reply(`${theme.warn} Usage: /address <kaspa_address>`);
  return ctx.reply(
    `${theme.primary} ${theme.title("Address (read-only)")}\n` +
    `Kaspa: ${theme.code(addr)}\nTip: never share private keys or seeds.`,
    { parse_mode: "Markdown" }
  );
};
