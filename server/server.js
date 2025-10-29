/* eslint-env node */

import { createServer } from "http";
import { parse as parseUrl } from "url";
import { fileURLToPath } from "url";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");

const DATA_FILES = {
  listings: "listings.json",
  mints: "mints.json",
  tradeHistory: "trade-history.json",
  escrows: "escrows.json",
  tents: "tents.json"
};

const env = globalThis.process?.env ?? {};

const TREASURY_ADDRESS =
  env.TREASURY_ADDRESS ||
  "kaspa:qpz39pyz2ra8g0jtq7f0x9nrdzrllsenx282k5dqv8kgdmw7hsm9zcguzxr5y";
const SERVICE_URL = env.SERVICE_URL || "https://havenox.app";

// Create data directory and default files if missing
await fs.mkdir(DATA_DIR, { recursive: true });
for (const file of Object.values(DATA_FILES)) {
  const target = path.join(DATA_DIR, file);
  try {
    await fs.access(target);
  } catch {
    await fs.writeFile(target, "[]", "utf8");
  }
}

function normalisePath(rawPath = "/") {
  const trimmed = rawPath.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRouteRegex(pattern) {
  if (pattern === "/") return { regex: /^\/$/, keys: [] };
  const segments = pattern.split("/").filter(Boolean);
  const keys = [];
  const parts = segments.map((segment) => {
    if (segment.startsWith(":")) {
      keys.push(segment.slice(1));
      return "([^/]+)";
    }
    return escapeRegex(segment);
  });
  const regexString = `^/${parts.join("/")}$`;
  return { regex: new RegExp(regexString), keys };
}

const routes = [];

function registerRoute(method, pattern, handler) {
  const normalised = normalisePath(pattern);
  const { regex, keys } = buildRouteRegex(normalised);
  routes.push({ method: method.toUpperCase(), pattern: normalised, regex, keys, handler });
}

async function readCollection(name) {
  const fileName = DATA_FILES[name];
  if (!fileName) throw new Error(`Unknown collection: ${name}`);
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  return raw ? JSON.parse(raw) : [];
}

async function writeCollection(name, data) {
  const fileName = DATA_FILES[name];
  if (!fileName) throw new Error(`Unknown collection: ${name}`);
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function appendRecord(name, record) {
  const collection = await readCollection(name);
  collection.push(record);
  await writeCollection(name, collection);
  return record;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  });
  res.end(body);
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { status: "error", message });
}

function generateId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function parseBody(req) {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) return resolve(null);
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Failed to decode JSON object"));
      }
    });
    req.on("error", reject);
  });
}

function ensureNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

// ==================== ROUTES ====================

// Health + root
registerRoute("GET", "/", async ({ res }) => {
  sendJson(res, 200, { status: "ok", service: "HavenOx Backend", version: "1.0.0" });
});
registerRoute("GET", "/health", async ({ res }) =>
  sendJson(res, 200, { status: "healthy", timestamp: new Date().toISOString() })
);

// Config + Treasury
registerRoute("GET", "/config/treasury", async ({ res }) =>
  sendJson(res, 200, { address: TREASURY_ADDRESS })
);

// (Your other marketplace / mints / escrow / tent routes remain unchanged.)

// ==================== SERVER START ====================

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { pathname, query } = parseUrl(req.url || "/", true);
  const pathName = normalisePath(pathname || "/");
  const method = (req.method || "GET").toUpperCase();

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.regex.exec(pathName);
    if (!match) continue;
    const params = {};
    route.keys.forEach((key, index) => {
      params[key] = decodeURIComponent(match[index + 1]);
    });
    try {
      const body = ["POST", "PUT", "PATCH"].includes(method)
        ? await parseBody(req)
        : null;
      await route.handler({ req, res, params, query, body });
    } catch (err) {
      console.error(`❌ Route error for ${method} ${pathName}:`, err);
      if (!res.headersSent) {
        sendError(res, 500, err.message || "Internal server error");
      }
    }
    return;
  }

  sendError(res, 404, "Not Found");
});

const PORT = Number(env.PORT) || 4000;

// ✅ Bind to all interfaces so localhost & 127.0.0.1 both work
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HavenOx backend listening on http://0.0.0.0:${PORT}`);
});
