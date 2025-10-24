import { theme } from "../theme.js";

const tokenMap = {
  DRONO: "0x0C2192417e5e040529085e6f7566eF227A7E9337",
  KREP:  "0x90192c285663E38Be59D9569358A9d4554d3Ff05",
  BMT:   "0x0f5Dd78eB4b7b58FA08E4b5822d89467c1CBF7C9",
  KBRA:  "0x3f0730Aba8E53EeE4D38dF91C684a82D79dA85b3"
};

export default (ctx) => {
  const parts = (ctx.message.text || "").trim().split(/\s+/);
  const symbol = (parts[1] || "DRONO").toUpperCase();
  const address = tokenMap[symbol];

  if (!address) {
    const all = Object.keys(tokenMap).join(", ");
    return ctx.reply(`${theme.warn} No contract address found for ${symbol}.\nAvailable: ${all}`);
  }

  return ctx.reply(
    `${theme.primary} ${theme.title(`${symbol} Info`)}\n` +
    `💎 LFG Page:\nhttps://lfg.kaspa.com/app/token/${address}\n` +
    `⚠️ Live prices temporarily unavailable (LFG API 404)\n` +
    `${theme.br}`,
    { parse_mode: "Markdown", disable_web_page_preview: true }
  );
};
