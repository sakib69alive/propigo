// Inline icon paths: brands from Simple Icons (CC0), UI icons from Lucide (ISC).
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "node_modules");
const brandNames = {
  facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube",
  linkedin: "LinkedIn", x: "X", threads: "Threads", telegram: "Telegram", whatsapp: "WhatsApp",
};

function brand(slug) {
  const svg = fs.readFileSync(path.join(root, "simple-icons", "icons", slug + ".svg"), "utf8");
  const d = svg.match(/<path d="([^"]+)"/)[1];
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`;
}

function ui(name) {
  const svg = fs.readFileSync(path.join(root, "lucide-static", "icons", name + ".svg"), "utf8");
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

const icons = {};
Object.keys(brandNames).forEach((s) => (icons[s] = brand(s)));
["external-link", "arrow-right", "arrow-left", "handshake", "user", "phone", "mail", "share-2", "copy", "download", "globe", "user-plus", "building-2", "car", "arrow-up", "check", "message-circle"].forEach(
  (n) => (icons[n] = ui(n))
);
icons.building = icons["building-2"];

module.exports = { icons, brandNames };
