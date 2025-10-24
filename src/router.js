import start from "./commands/start.js";
import help from "./commands/help.js";
import links from "./commands/links.js";
import price from "./commands/price.js";
import alert from "./commands/alert.js";
import address from "./commands/address.js";
import rank from "./commands/rank.js";
import status from "./commands/status.js";

export default function register(bot) {
  bot.start(start);
  bot.command("help", help);
  bot.command("links", links);
  bot.command("price", price);
  bot.command("alert", alert);
  bot.command("address", address);
  bot.command("rank", rank);
  bot.command("status", status);
}
