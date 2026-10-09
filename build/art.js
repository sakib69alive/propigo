// Hero artwork: a quiet architectural arch holding the logo. Matte, no glow.
function heroArt() {
  return (
    '<svg class="hero-art" viewBox="0 0 200 250" role="img" aria-label="Propigo mark inside an arch">' +
    '<defs><linearGradient id="ha-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10285a"/><stop offset="1" stop-color="#071633"/></linearGradient></defs>' +
    '<path d="M6 250V100a94 94 0 0 1 188 0v150Z" fill="url(#ha-fill)" stroke="#c9a13b" stroke-opacity=".75" stroke-width="1"/>' +
    '<path d="M16 250V100a84 84 0 0 1 168 0v150" fill="none" stroke="#c9a13b" stroke-opacity=".25" stroke-width="1"/>' +
    '<svg x="70" y="86" width="60" height="72" aria-hidden="true"><use href="#logo-l" width="60" height="72"/></svg>' +
    '<path d="M70 190h60" stroke="#c9a13b" stroke-opacity=".6" stroke-width="1"/>' +
    '</svg>'
  );
}


// ---- Gold line-art city skyline + low-poly ground (pure vector, crisp at any size) ----
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function skylineBg() {
  const rand = rng(9);
  const W = 800, H = 400, G = 340;
  const r = (n) => Math.round(n * 10) / 10;
  let main = "", fine = "";

  // helpers
  const mullions = (x, w, top, step) => { for (let xx = x + step; xx < x + w - 1; xx += step) fine += `M${r(xx)} ${r(top)}V${G}`; };
  const bands = (x, w, top, step) => { for (let y = top + step; y < G - 4; y += step) fine += `M${r(x)} ${r(y)}H${r(x + w)}`; };

  const kinds = {
    // parallelogram top, glass curtain wall
    slant(x, w, h) {
      const t = G - h;
      main += `M${x} ${G}V${r(t + h * 0.2)}L${r(x + w)} ${r(t)}V${G}`;
      mullions(x, w, t + h * 0.12, 7); bands(x, w, t + h * 0.2, 18);
    },
    slantR(x, w, h) {
      const t = G - h;
      main += `M${x} ${G}V${r(t)}L${r(x + w)} ${r(t + h * 0.2)}V${G}`;
      mullions(x, w, t + h * 0.12, 7); bands(x, w, t + h * 0.2, 18);
    },
    // three setbacks and an antenna
    setback(x, w, h) {
      const t = G - h, w2 = w * 0.78, w3 = w * 0.5, o2 = (w - w2) / 2, o3 = (w - w3) / 2;
      const y2 = t + h * 0.18, y3 = t + h * 0.06;
      main += `M${x} ${G}V${r(y2 + h * 0.1)}H${r(x + o2)}V${r(y3 + h * 0.06)}H${r(x + o3)}V${r(t)}H${r(x + o3 + w3)}V${r(y3 + h * 0.06)}H${r(x + o2 + w2)}V${r(y2 + h * 0.1)}H${r(x + w)}V${G}`;
      main += `M${r(x + w / 2)} ${r(t)}V${r(t - 34)}`;
      mullions(x, w, y2 + h * 0.1, 8); bands(x, w, y2 + h * 0.1, 16);
    },
    // tapering needle tower
    needle(x, w, h) {
      const t = G - h, m = x + w / 2;
      main += `M${x} ${G}L${r(x + w * 0.06)} ${r(G - h * 0.45)}L${r(x + w * 0.3)} ${r(G - h * 0.82)}L${r(m)} ${r(t)}L${r(x + w * 0.7)} ${r(G - h * 0.82)}L${r(x + w * 0.94)} ${r(G - h * 0.45)}L${r(x + w)} ${G}`;
      main += `M${r(m)} ${r(t)}V${r(t - 44)}`;
      fine += `M${r(m)} ${r(t)}V${G}M${r(x + w * 0.3)} ${r(G - h * 0.82)}L${r(x + w * 0.2)} ${G}M${r(x + w * 0.7)} ${r(G - h * 0.82)}L${r(x + w * 0.8)} ${G}`;
      bands(x + w * 0.2, w * 0.6, t + h * 0.2, 20);
    },
    // chamfered-corner supertall
    chamfer(x, w, h) {
      const t = G - h, c = w * 0.2;
      main += `M${x} ${G}V${r(t + c)}L${r(x + c)} ${r(t)}H${r(x + w - c)}L${r(x + w)} ${r(t + c)}V${G}`;
      fine += `M${r(x + c)} ${r(t)}V${G}M${r(x + w - c)} ${r(t)}V${G}`;
      mullions(x + c, w - 2 * c, t, 7); bands(x, w, t + c, 16);
    },
    // tallest: tiered body, tapered crown, spire
    spire(x, w, h) {
      const t = G - h, m = x + w / 2, w2 = w * 0.7, o2 = (w - w2) / 2;
      const y1 = G - h * 0.62, y2 = G - h * 0.86;
      main += `M${x} ${G}V${r(y1)}H${r(x + o2)}V${r(y2)}L${r(m)} ${r(t)}L${r(x + o2 + w2)} ${r(y2)}V${r(y1)}H${r(x + w)}V${G}`;
      main += `M${r(m)} ${r(t)}V${r(t - 52)}`;
      fine += `M${r(m)} ${r(t)}V${G}`;
      mullions(x, w, y1, 8); bands(x, w, y1, 15);
    },
    // rounded capsule top
    round(x, w, h) {
      const t = G - h, rr = w / 2;
      main += `M${x} ${G}V${r(t + rr)}A${rr} ${rr} 0 0 1 ${r(x + w)} ${r(t + rr)}V${G}`;
      fine += `M${r(x + w / 2)} ${r(t)}V${G}`;
      mullions(x, w, t + rr, 8); bands(x, w, t + rr, 16);
      for (let k = 1; k < 4; k++) fine += `M${r(x + rr - rr * Math.cos(k * 0.5))} ${r(t + rr - rr * Math.sin(k * 0.5))}H${r(x + rr + rr * Math.cos(k * 0.5))}`;
    },
    // flat glass slab with diagonal bracing
    glass(x, w, h) {
      const t = G - h;
      main += `M${x} ${G}V${r(t)}H${r(x + w)}V${G}`;
      fine += `M${x} ${r(t)}L${r(x + w)} ${r(t + h * 0.5)}M${r(x + w)} ${r(t)}L${x} ${r(t + h * 0.5)}`;
      mullions(x, w, t, 9); bands(x, w, t, 20);
    },
  };

  const plan = [
    ["slant", 14, 52, 150], ["setback", 78, 46, 196], ["glass", 136, 58, 140], ["needle", 204, 56, 226],
    ["chamfer", 272, 70, 262], ["spire", 352, 62, 300], ["round", 428, 56, 226], ["chamfer", 494, 66, 250],
    ["slantR", 570, 52, 172], ["setback", 632, 56, 212], ["glass", 700, 70, 146],
  ];
  plan.forEach(([k, x, w, h]) => kinds[k](x, w, h));
  main += `M0 ${G}H${W}`;

  // low-poly ground
  const rows = [], cols = 22;
  for (let q = 0; q < 4; q++) {
    const row = [];
    for (let i = 0; i <= cols; i++)
      row.push([r((i * W) / cols + (q ? (rand() - 0.5) * 18 : 0)), r(G + q * 17 + (q ? (rand() - 0.5) * 9 : 0))]);
    rows.push(row);
  }
  let mesh = "";
  for (let q = 0; q < rows.length; q++)
    for (let i = 0; i <= cols; i++) {
      const p = rows[q][i];
      if (i < cols) mesh += `M${p[0]} ${p[1]}L${rows[q][i + 1][0]} ${rows[q][i + 1][1]}`;
      if (q < rows.length - 1) {
        const n = rows[q + 1][i];
        mesh += `M${p[0]} ${p[1]}L${n[0]} ${n[1]}`;
        if (i < cols && (i + q) % 2 === 0) mesh += `M${p[0]} ${p[1]}L${rows[q + 1][i + 1][0]} ${rows[q + 1][i + 1][1]}`;
      }
    }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" fill="none" stroke-linejoin="round" stroke-linecap="round">` +
    `<path d="${fine}" stroke="#c9a13b" stroke-opacity=".3" stroke-width=".7"/>` +
    `<path d="${mesh}" stroke="#c9a13b" stroke-opacity=".5" stroke-width=".8"/>` +
    `<path d="${main}" stroke="#e0bb58" stroke-opacity=".95" stroke-width="1.2"/>` +
    `</svg>`
  );
}

module.exports = { heroArt, skylineBg };
