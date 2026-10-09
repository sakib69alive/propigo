// Generated artwork: an accurate honeycomb background tile and the hexagon-cluster hero art.
// Everything is deterministic (seeded) so builds are reproducible.
const S3 = Math.sqrt(3);

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 100) / 100;
// Pointy-top regular hexagon (same orientation as the logo) as an SVG path.
function hexPath(cx, cy, r) {
  let d = "";
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 180) * (60 * k - 30);
    d += (k ? "L" : "M") + f(cx + r * Math.cos(a)) + " " + f(cy + r * Math.sin(a));
  }
  return d + "Z";
}

// Seamless honeycomb tile. Cell choice depends on (col mod N, row mod M) so the tile repeats without seams.
function bgTile() {
  const r = 26, N = 12, M = 20;
  const W = f(N * S3 * r), H = f(M * 1.5 * r);
  const rand = rng(20261009);
  const tones = {};
  const kinds = [];
  for (let i = 0; i < N * M; i++) {
    const p = rand();
    let tone = null;
    if (p > 0.34) tone = ["a", "b", "c", "d", "e"][Math.floor(rand() * 5)];
    if (p > 0.965) tone = "g";
    kinds.push({ tone, inner: rand() < 0.2, dots: rand() < 0.16, ring: rand() < 0.05 });
  }
  const fills = { a: "#12306a", b: "#1a428f", c: "#0c2252", d: "#2150a8", e: "#071a40", g: "#c9a13b" };
  const opac = { a: 0.6, b: 0.5, c: 0.7, d: 0.4, e: 0.8, g: 0.14 };
  let lines = "", inner = "", dots = "", rings = "";
  const groups = {};
  for (let row = -1; row <= M; row++) {
    for (let col = -1; col <= N; col++) {
      const cx = S3 * r * (col + 0.5 * (((row % 2) + 2) % 2));
      const cy = 1.5 * r * row;
      const k = kinds[((((row % M) + M) % M) * N) + ((col % N) + N) % N];
      lines += hexPath(cx, cy, r);
      if (k.tone) (groups[k.tone] = groups[k.tone] || []).push(hexPath(cx, cy, r - 1.2));
      if (k.inner) inner += hexPath(cx, cy, r * 0.58);
      if (k.ring) rings += hexPath(cx, cy, r * 0.8);
      if (k.dots)
        for (let v = 0; v < 6; v += 2) {
          const a = (Math.PI / 180) * (60 * v - 30);
          dots += `<circle cx="${f(cx + r * Math.cos(a))}" cy="${f(cy + r * Math.sin(a))}" r="1.5"/>`;
        }
    }
  }
  const fillSvg = Object.keys(groups)
    .map((t) => `<path fill="${fills[t]}" fill-opacity="${opac[t]}" d="${groups[t].join("")}"/>`)
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    fillSvg +
    `<path fill="none" stroke="#7d9bd6" stroke-opacity=".24" stroke-width="1.1" d="${lines}"/>` +
    `<path fill="none" stroke="#7d9bd6" stroke-opacity=".18" stroke-width=".9" d="${inner}"/>` +
    `<path fill="none" stroke="#c9a13b" stroke-opacity=".7" stroke-width="1.2" d="${rings}"/>` +
    `<g fill="#c9a13b" fill-opacity=".55">${dots}</g>` +
    `</svg>`
  );
}

// Hero art: 19 hexagons (centre + 2 rings) with the logo in the centre cell. Inline SVG.
function heroArt() {
  const r = 38, rand = rng(7);
  const cells = [];
  for (let q = -2; q <= 2; q++)
    for (let s = -2; s <= 2; s++) {
      const t = -q - s;
      if (Math.abs(t) > 2) continue;
      cells.push({ q, s, dist: Math.max(Math.abs(q), Math.abs(s), Math.abs(t)) });
    }
  const px = (c) => ({ x: S3 * r * (c.q + c.s / 2), y: 1.5 * r * c.s });
  const palette = ["url(#ha-b1)", "url(#ha-b2)", "url(#ha-b3)", "url(#ha-b4)"];
  const icon = {
    // building and car glyphs (stroke icons) for two ring-1 cells
    "1,0": `<g transform="translate(-13 -13) scale(1.08)" fill="none" stroke="#e6b741" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></g>`,
    "-1,0": `<g transform="translate(-14 -13) scale(1.1)" fill="none" stroke="#e6b741" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></g>`,
  };
  let body = "";
  cells
    .sort((a, b) => b.dist - a.dist)
    .forEach((c) => {
      const { x, y } = px(c);
      if (c.dist === 0) {
        body += `<path d="${hexPath(x, y, r * 0.97)}" fill="#f7f5f0" stroke="#e6b741" stroke-width="2.5" stroke-linejoin="round"/>` +
          `<path d="${hexPath(x, y, r * 0.8)}" fill="none" stroke="#c9a13b" stroke-opacity=".55" stroke-width="1"/>` +
          `<svg x="${f(x - 19)}" y="${f(y - 23)}" width="38" height="46" aria-hidden="true"><use href="#logo" width="38" height="46"/></svg>`;
        return;
      }
      const fill = palette[Math.floor(rand() * palette.length)];
      const ic = icon[`${c.q},${c.s}`];
      const gold = ic || (c.dist === 2 && rand() < 0.2);
      const op = c.dist === 2 ? 0.55 + rand() * 0.35 : 1;
      body += `<g opacity="${f(op)}"><path d="${hexPath(x, y, r * 0.93)}" fill="${fill}" stroke="${gold ? "#c9a13b" : "#4a6fb8"}" stroke-opacity="${gold ? 0.9 : 0.45}" stroke-width="${gold ? 1.6 : 1}" stroke-linejoin="round"/>` +
        (c.dist === 1 ? `<path d="${hexPath(x, y, r * 0.66)}" fill="none" stroke="#7d9bd6" stroke-opacity=".22"/>` : "") +
        (ic ? `<g transform="translate(${f(x)} ${f(y)})">${ic}</g>` : "") +
        `</g>`;
    });
  return (
    `<svg class="hero-art" viewBox="-168 -158 336 316" role="img" aria-label="Honeycomb of hexagons around the Propigo mark">` +
    `<defs>` +
    `<linearGradient id="ha-b1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c3f86"/><stop offset="1" stop-color="#0c2556"/></linearGradient>` +
    `<linearGradient id="ha-b2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#143272"/><stop offset="1" stop-color="#081a40"/></linearGradient>` +
    `<linearGradient id="ha-b3" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0b2250"/><stop offset="1" stop-color="#244a96"/></linearGradient>` +
    `<linearGradient id="ha-b4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4f9a"/><stop offset="1" stop-color="#0a1f4a"/></linearGradient>` +
    `</defs>${body}</svg>`
  );
}

module.exports = { bgTile, heroArt };
