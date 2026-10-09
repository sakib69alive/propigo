// Single source of truth for the logo mark geometry (traced from assets/source/logo-original.png).
const fs = require("fs");
const path = require("path");

const markSvg = fs.readFileSync(path.join(__dirname, "..", "assets", "logo", "logo-mark.svg"), "utf8");

// Inner content (defs + paths) for reuse inside inline <symbol>.
const inner = markSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();

module.exports = { markSvg, inner, viewBox: "334 102 548 660" };
