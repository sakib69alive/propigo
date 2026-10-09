// Generated hero artwork: a luminous halo around the logo above a layered city skyline with
// gold-lit windows and sweeping light trails (property + road). Deterministic (seeded) output.
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

const W = 360, H = 300, BASE = 300;

function skyline(seed, o) {
  const rand = rng(seed);
  let x = -6, rects = "", spires = "";
  const wins = [[], [], []];
  while (x < W + 6) {
    const w = o.minW + rand() * (o.maxW - o.minW);
    const h = o.minH + rand() * (o.maxH - o.minH);
    const y = BASE - h;
    rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
    if (rand() < 0.35) {
      const tw = w * 0.6, th = 5 + rand() * 9;
      rects += `<rect x="${(x + (w - tw) / 2).toFixed(1)}" y="${(y - th).toFixed(1)}" width="${tw.toFixed(1)}" height="${th.toFixed(1)}"/>`;
    }
    if (o.spires && rand() < 0.16) spires += `M${(x + w / 2).toFixed(1)} ${y.toFixed(1)}v-${(10 + rand() * 14).toFixed(0)}`;
    if (o.windows) {
      for (let wy = y + 6; wy < BASE - 6; wy += 7)
        for (let wx = x + 3.5; wx < x + w - 4; wx += 5.5)
          if (rand() < o.windows) wins[Math.floor(rand() * 3)].push(`M${wx.toFixed(1)} ${wy.toFixed(1)}h2v3h-2z`);
    }
    x += w + (rand() < 0.3 ? 1.5 : 0.3);
  }
  const wsvg = [0.95, 0.6, 0.3].map((op, i) => (wins[i].length ? `<path fill="#e6b741" fill-opacity="${op}" d="${wins[i].join("")}"/>` : "")).join("");
  return { rects, wsvg, spires };
}

function heroArt() {
  const back = skyline(11, { minW: 12, maxW: 26, minH: 60, maxH: 135, windows: 0.12, spires: true });
  const mid = skyline(23, { minW: 14, maxW: 30, minH: 40, maxH: 100, windows: 0.3, spires: false });
  const front = skyline(37, { minW: 18, maxW: 38, minH: 18, maxH: 66, windows: 0.4, spires: false });
  return (
    `<svg class="hero-art" viewBox="0 0 ${W} ${H}" role="img" aria-label="Propigo mark above a city skyline">` +
    `<defs>` +
    `<radialGradient id="ha-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4f7fe0" stop-opacity=".65"/><stop offset=".55" stop-color="#27498f" stop-opacity=".25"/><stop offset="1" stop-color="#0b1f45" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="ha-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b53a3"/><stop offset="1" stop-color="#0c2250"/></linearGradient>` +
    `<linearGradient id="ha-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#173a80"/><stop offset="1" stop-color="#081a40"/></linearGradient>` +
    `<linearGradient id="ha-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c2252"/><stop offset="1" stop-color="#050f28"/></linearGradient>` +
    `<linearGradient id="ha-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6b741" stop-opacity="0"/><stop offset=".5" stop-color="#f1c85a"/><stop offset="1" stop-color="#e6b741" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    // halo + rings behind the mark
    `<circle cx="180" cy="104" r="118" fill="url(#ha-glow)"/>` +
    `<circle cx="180" cy="104" r="62" fill="none" stroke="#c9a13b" stroke-opacity=".55" stroke-width="1"/>` +
    `<circle cx="180" cy="104" r="84" fill="none" stroke="#7d9bd6" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 5"/>` +
    `<circle cx="180" cy="104" r="106" fill="none" stroke="#c9a13b" stroke-opacity=".22" stroke-width="1"/>` +
    `<circle cx="180" cy="104" r="40" fill="#071633" fill-opacity=".85"/>` +
    `<svg x="157" y="76" width="46" height="56" aria-hidden="true"><use href="#logo-l" width="46" height="56"/></svg>` +
    // skyline layers
    `<g fill="url(#ha-back)" opacity=".7">${back.rects}</g><path d="${back.spires}" stroke="#7d9bd6" stroke-opacity=".5" stroke-width="1" fill="none"/>${back.wsvg}` +
    `<g fill="url(#ha-mid)" opacity=".92">${mid.rects}</g>${mid.wsvg}` +
    `<g fill="url(#ha-front)">${front.rects}</g>${front.wsvg}` +
    // light trails (road / motion)
    `<path d="M-10 292 Q180 238 370 286" fill="none" stroke="url(#ha-trail)" stroke-width="2.2"/>` +
    `<path d="M-10 298 Q180 250 370 296" fill="none" stroke="url(#ha-trail)" stroke-width="1" stroke-opacity=".7"/>` +
    `</svg>`
  );
}

module.exports = { heroArt };
