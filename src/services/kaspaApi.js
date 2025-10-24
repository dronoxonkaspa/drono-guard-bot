import fetch from "cross-fetch";
import { cfg } from "../config.js";

export async function getTokenPrice(symbol = "DRONO") {
  try {
    const res = await fetch(`${cfg.lfgApi}/token/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error("Price API error");
    const data = await res.json();
    return {
      symbol,
      priceKas: data.price_kas ?? data.price ?? null,
      change24h: data.change24h ?? null,
      volume24h: data.volume24h ?? null
    };
  } catch (e) {
    return { symbol, priceKas: null, error: e.message };
  }
}

export async function getKaspaNetworkStats() {
  try {
    const res = await fetch(`${cfg.kaspaApi}/stats`);
    if (!res.ok) throw new Error("Kaspa API error");
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

export async function getDronoxStatus() {
  if (!cfg.statusUrl) return null;
  try {
    const res = await fetch(cfg.statusUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Status API error");
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}
