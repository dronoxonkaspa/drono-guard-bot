import { getDronoxStatus, getKaspaNetworkStats } from "../services/kaspaApi.js";
import { theme } from "../theme.js";
export default async (ctx) => {
  const [site, net] = await Promise.all([getDronoxStatus(), getKaspaNetworkStats()]);
  const siteLine = site ? (site.error ? `${theme.warn} Site status: error` : `Site: ${site.game_online ? "🟢 Online" : "🔴 Offline"}`) : "Site: (not linked)";
  const netLine = net?.error ? `${theme.warn} Kaspa stats unavailable` : `Kaspa OK`;
  return ctx.reply(`${theme.primary} ${theme.title("Status")}\n${siteLine}\n${netLine}\n${theme.br}`, { parse_mode:"Markdown" });
};
