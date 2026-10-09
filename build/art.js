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

module.exports = { heroArt };
