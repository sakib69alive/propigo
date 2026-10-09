// Generated artwork (deterministic, pure vector):
//  - heroArt(): a quiet arch holding the logo
//  - contourBg(): a seamless topographic "contour line" tile. Land and flowing roads in one abstract
//    language, so it fits property and automotive without being literal.
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

function heroArt() {
  return (
    '<svg class="hero-art" viewBox="0 0 260 260" role="img" aria-label="Propigo mark">' +
    '<circle cx="130" cy="130" r="126" fill="none" stroke="#b8975a" stroke-opacity=".3"/>' +
    '<circle cx="130" cy="130" r="112" fill="none" stroke="#b8975a" stroke-opacity=".5" stroke-dasharray="1 6" stroke-linecap="round"/>' +
    '<circle cx="130" cy="130" r="96" fill="#fbf9f4" stroke="#b8975a" stroke-width="1"/>' +
    '<svg x="92" y="86" width="76" height="92" aria-hidden="true"><use href="#logo" width="76" height="92"/></svg>' +
    '</svg>'
  );
}

// Seamless contour tile: a periodic sum of sines, drawn as iso-lines with marching squares.
function contourBg() {
  const W = 480, H = 640, CELL = 10;
  const nx = W / CELL, ny = H / CELL;
  const rand = rng(31);
  // periodic waves: integer multiples of the tile size so the tile repeats without a seam
  const waves = [];
  for (let i = 0; i < 7; i++) {
    const m = 1 + Math.floor(rand() * 3), n = 1 + Math.floor(rand() * 3);
    waves.push({ kx: ((rand() < 0.5 ? -1 : 1) * 2 * Math.PI * m) / W, ky: ((rand() < 0.5 ? -1 : 1) * 2 * Math.PI * n) / H, ph: rand() * 6.283, a: 1 / (1 + 0.35 * (m + n)) });
  }
  const f = (x, y) => waves.reduce((s, w) => s + w.a * Math.sin(w.kx * x + w.ky * y + w.ph), 0);
  const grid = [];
  for (let j = 0; j <= ny; j++) {
    const row = [];
    for (let i = 0; i <= nx; i++) row.push(f(i * CELL, j * CELL));
    grid.push(row);
  }
  const lo = Math.min(...grid.flat()), hi = Math.max(...grid.flat());
  const LEVELS = 13;
  const r = (v) => Math.round(v * 10) / 10;
  const minor = [], major = [];
  for (let L = 1; L < LEVELS; L++) {
    const lv = lo + ((hi - lo) * L) / LEVELS;
    const out = L % 4 === 0 ? major : minor;
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x0 = i * CELL, y0 = j * CELL;
        const t = (p, q) => (lv - p) / (q - p);
        const top = [x0 + CELL * t(a, b), y0], right = [x0 + CELL, y0 + CELL * t(b, c)], bot = [x0 + CELL * t(d, c), y0 + CELL], left = [x0, y0 + CELL * t(a, d)];
        const seg = (p, q) => out.push(`M${r(p[0])} ${r(p[1])}L${r(q[0])} ${r(q[1])}`);
        switch (idx) {
          case 1: case 14: seg(left, bot); break;
          case 2: case 13: seg(bot, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bot); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(top, right); seg(left, bot); break;
          case 10: seg(left, top); seg(bot, right); break;
        }
      }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" stroke-linecap="round">` +
    `<path d="${minor.join("")}" stroke="#b8975a" stroke-opacity=".26" stroke-width=".7"/>` +
    `<path d="${major.join("")}" stroke="#b8975a" stroke-opacity=".5" stroke-width="1"/>` +
    `</svg>`
  );
}

module.exports = { heroArt, contourBg };
