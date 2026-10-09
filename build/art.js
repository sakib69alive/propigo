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
  const rand = rng(5);
  const W = 800, H = 250, G = 175;
  const r1 = (n) => Math.round(n * 10) / 10;
  let main = "", fine = "";
  let x = 6;
  while (x < W - 24) {
    const w = 22 + rand() * 30;
    const bump = 80 * Math.exp(-Math.pow((x - W * 0.52) / 170, 2));
    const h = 34 + rand() * 62 + bump;
    const type = rand();
    const t = G - h;
    if (type < 0.25) {
      // tower with stepped taper and antenna
      const m = x + w / 2;
      main += `M${r1(x)} ${G}V${r1(t + h * 0.25)}L${r1(x + w * 0.3)} ${r1(t + h * 0.08)}L${r1(m)} ${r1(t - 26)}L${r1(x + w * 0.7)} ${r1(t + h * 0.08)}L${r1(x + w)} ${r1(t + h * 0.25)}V${G}`;
      fine += `M${r1(m)} ${r1(t - 26)}V${G}M${r1(x + w * 0.3)} ${r1(t + h * 0.08)}V${G}M${r1(x + w * 0.7)} ${r1(t + h * 0.08)}V${G}`;
    } else if (type < 0.5) {
      // slanted roof
      main += `M${r1(x)} ${G}V${r1(t)}L${r1(x + w)} ${r1(t + h * 0.22)}V${G}`;
      fine += `M${r1(x + w * 0.5)} ${r1(t + h * 0.11)}V${G}`;
    } else if (type < 0.78) {
      // stepped block
      const sw = w * 0.6;
      main += `M${r1(x)} ${G}V${r1(t + 10)}H${r1(x + (w - sw) / 2)}V${r1(t)}H${r1(x + (w + sw) / 2)}V${r1(t + 10)}H${r1(x + w)}V${G}`;
      fine += `M${r1(x + w * 0.33)} ${r1(t + 10)}V${G}M${r1(x + w * 0.66)} ${r1(t + 10)}V${G}`;
    } else {
      // glass slab with facet lines
      main += `M${r1(x)} ${G}V${r1(t)}H${r1(x + w)}V${G}`;
      fine += `M${r1(x)} ${r1(t)}L${r1(x + w)} ${r1(t + h * 0.55)}M${r1(x + w)} ${r1(t)}L${r1(x)} ${r1(t + h * 0.55)}`;
    }
    for (let y = t + 12; y < G - 4; y += 11) if (rand() < 0.45) fine += `M${r1(x)} ${r1(y)}H${r1(x + w)}`;
    x += w + 2 + rand() * 6;
  }
  main += `M0 ${G}H${W}`;

  // low-poly ground: three rows of jittered points joined as a triangulated mesh
  const rows = [], cols = 24;
  for (let r = 0; r < 4; r++) {
    const row = [];
    for (let i = 0; i <= cols; i++) {
      const base = G + r * 22;
      row.push([r1((i * W) / cols + (r ? (rand() - 0.5) * 16 : 0)), r1(base + (r === 0 ? Math.sin(i * 0.7) * 5 : 0) + (rand() - 0.5) * (r ? 12 : 0))]);
    }
    rows.push(row);
  }
  let mesh = "";
  for (let r = 0; r < rows.length; r++)
    for (let i = 0; i <= cols; i++) {
      const p = rows[r][i];
      if (i < cols) mesh += `M${p[0]} ${p[1]}L${rows[r][i + 1][0]} ${rows[r][i + 1][1]}`;
      if (r < rows.length - 1) {
        const q = rows[r + 1][i];
        mesh += `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`;
        const q2 = rows[r + 1][(i + 1) % (cols + 1)];
        if (i < cols && (i + r) % 2 === 0) mesh += `M${p[0]} ${p[1]}L${q2[0]} ${q2[1]}`;
      }
    }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" fill="none" stroke-linejoin="round" stroke-linecap="round">` +
    `<path d="${fine}" stroke="#c9a13b" stroke-opacity=".35" stroke-width=".7"/>` +
    `<path d="${mesh}" stroke="#c9a13b" stroke-opacity=".55" stroke-width=".8"/>` +
    `<path d="${main}" stroke="#d9b552" stroke-opacity=".95" stroke-width="1.1"/>` +
    `</svg>`
  );
}

module.exports = { heroArt, skylineBg };
