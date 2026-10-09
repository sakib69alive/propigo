// Runs after Eleventy writes the pages: generates QR files, vCard, logo/icon PNGs, OG image, font and portrait.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { qrSvg, qrPng } = require("./qr");
const { buildVcard } = require("./vcard");
const { markSvg } = require("./logo-svg");
const { bgTile } = require("./art");

const root = path.join(__dirname, "..");
const BG = { r: 247, g: 245, b: 240, alpha: 1 }; // warm off-white

async function post(site, outDir) {
  const out = (p) => path.join(outDir, p);
  const write = (p, data) => {
    fs.mkdirSync(path.dirname(out(p)), { recursive: true });
    fs.writeFileSync(out(p), data);
  };

  // --- QR (encodes the permanent <site.url>c/ address)
  const qrUrl = site.site.url + "c/";
  write("qr/propigo-qr.svg", await qrSvg(qrUrl));
  write("qr/propigo-qr.png", await qrPng(qrUrl, 2048));

  // --- Founder portrait + vCard
  let photoB64 = "";
  if (site.founder.photo) {
    const src = path.join(root, "assets", site.founder.photo);
    if (!fs.existsSync(src)) throw new Error(`founder.photo "${site.founder.photo}" not found in assets/.`);
    const img = sharp(src).rotate().resize(640, 640, { fit: "cover", position: "attention" });
    write("assets/founder.webp", await img.clone().webp({ quality: 78 }).toBuffer());
    photoB64 = (await img.clone().resize(256, 256).jpeg({ quality: 80 }).toBuffer()).toString("base64");
  }
  write("propigo.vcf", buildVcard(site, photoB64));

  // --- Logo + icons (rendered from the traced SVG)
  write("assets/logo/logo-mark.svg", markSvg);
  write("favicon.svg", markSvg);
  const mark = (h) => sharp(Buffer.from(markSvg), { density: 300 }).resize({ height: h });
  write("assets/logo/logo-mark.png", await mark(1024).png().toBuffer());

  const icon = async (size, padRatio, bg) => {
    const inner = await mark(Math.round(size * (1 - padRatio * 2))).png().toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: inner, gravity: "centre" }])
      .png()
      .toBuffer();
  };
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  write("favicon-32.png", await icon(32, 0.04, clear));
  write("apple-touch-icon.png", await icon(180, 0.14, BG));
  write("icon-192.png", await icon(192, 0.14, BG));
  write("icon-512.png", await icon(512, 0.14, BG));

  // --- Open Graph image (1200x630): mark on off-white with a gold hairline; no text so it renders identically everywhere
  const ogMark = await mark(430).png().toBuffer();
  const rule = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="0" y="618" width="1200" height="12" fill="#0B1F45"/><rect x="0" y="612" width="1200" height="3" fill="#C9A13B"/></svg>`);
  write(
    "assets/og-image.png",
    await sharp({ create: { width: 1200, height: 630, channels: 4, background: BG } })
      .composite([{ input: ogMark, gravity: "centre" }, { input: rule, top: 0, left: 0 }])
      .png({ compressionLevel: 9 })
      .toBuffer()
  );

  // --- Self-hosted font (Manrope variable, Latin subset)
  const fontSrc = path.join(root, "node_modules", "@fontsource-variable", "manrope", "files", "manrope-latin-wght-normal.woff2");
  write("assets/fonts/manrope.woff2", fs.readFileSync(fontSrc));

  write("assets/bg.svg", bgTile());
  write("robots.txt", "User-agent: *\nAllow: /\n");
}

module.exports = { post };
