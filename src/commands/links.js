import { theme } from "../theme.js";

/*
  Verified LFG coin links — each entry holds:
  address (contract), website, telegram, twitter, and optional extras.
*/
const tokenLinks = {
  DRONO: {
    address: "0x0C2192417e5e040529085e6f7566eF227A7E9337",
    website: "https://dronoxonkaspa.com/",
    telegram: "https://t.me/Dronox_on_Kaspa",
    twitter: "https://x.com/Dronox_on_Kaspa",
    dronowars: "https://t.me/Drono_Wars_bot"
  },
  BMT: {
    address: "0x0f5Dd78eB4b7b58FA08E4b5822d89467c1CBF7C9",
    website: "https://x.com/BTC_Maxi_Tears",
    telegram: "https://t.me/BTCMaxiTearsBMT",
    twitter: "https://x.com/BTC_Maxi_Tears"
  },
  KREP: {
    address: "0x90192c285663E38Be59D9569358A9d4554d3Ff05",
    website: "https://linktr.ee/KREP_onKaspa",
    telegram: "https://t.me/KreponKaspa",
    twitter: "https://x.com/KREP_onKaspa"
  },
  MUTANT: {
    address: "0x93D93a6aF23D3271E5Fd8A3fDB9b0BAbBEcDB7B9",
    website: "https://www.mutantecosystem.com/",
    telegram: "https://t.me/MUTANTOFC",
    twitter: "https://x.com/KasMutant"
  },
  SHITE: {
    address: "0x58D28db21fBEBC0f0AAfa75f9f87dBfef1181a78",
    website: "https://x.com/Kaspa_is_Shite",
    telegram: "https://t.me/kaspashitcoin",
    twitter: "https://x.com/Kaspa_is_Shite"
  },
  AXOL: {
    address: "0x8E640E2d25Bf379C9c7a54e46a8c167Fa6C530F7",
    website: "https://axolkas.com/",
    telegram: "https://t.me/AxelOnKas",
    twitter: "https://x.com/AxelOnKas"
  },
  KASTER: {
    address: "0xCaED750f73057a4631FDe08bCD6BB118C05C17D0",
    website: "https://www.kasterprotocol.com/",
    telegram: "https://t.me/kasterprotocol",
    twitter: "https://x.com/kasterOnkas"
  }
  // ➕ add more coins here anytime
};

export default (ctx) => {
  const parts = (ctx.message.text || "").trim().split(/\s+/);
  const symbol = (parts[1] || "DRONO").toUpperCase();
  const coin = tokenLinks[symbol];

  if (!coin) {
    const all = Object.keys(tokenLinks).join(", ");
    return ctx.reply(
      `${theme.warn} No profile found for ${symbol}.\nAvailable: ${all}`,
      { parse_mode: "Markdown" }
    );
  }

  let message =
    `${theme.accent} ${theme.title(`${symbol} Links`)}\n` +
    `💎 LFG: https://lfg.kaspa.com/app/token/${coin.address}\n` +
    `🌐 Website: ${coin.website}\n` +
    `📢 Telegram: ${coin.telegram}\n` +
    `🐦 Twitter: ${coin.twitter}\n`;

  if (coin.dronowars) {
    message += `🎮 Drono Wars: ${coin.dronowars}\n`;
  }

  message += theme.br;

  return ctx.reply(message, {
    disable_web_page_preview: true,
    parse_mode: "Markdown"
  });
};
