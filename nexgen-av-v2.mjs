/**
 * nexgen-av-v2.mjs — AIOS AV Quality Engine
 *
 * Theatre (aiosdream.html):
 *   - WebAudio Analyser + Convolver Reverb + Stereo Panner (signal chain upgrade)
 *   - Real-time spectrum visualizer canvas (mountain waveform, accent-coloured, glow)
 *   - Scene crossfade (canvas snapshot → opacity fade reveals new renderer)
 *   - Film grain canvas overlay (randomised pixel noise, 20fps, mix-blend: overlay)
 *   - Cinematic vignette (radial-gradient edge darkening)
 *   - Colour overlay (per-programme mood tint, mix-blend: multiply)
 *   - Per-programme colour grade (CSS filter on player-canvas)
 *   - Programme quality badge ("4K GENERATIVE", accent-coloured)
 *   - Spatial panner per programme (unique stereo position per world)
 *   - Mini-player audio duck (−40% gain in corner mode)
 *
 * AIOSOculus (vr-hub.html):
 *   - XP card hover spatial tones (oscillator + PHI-frequency sweep + stereo panner)
 *   - VR entry audio sting (sine + triangle sweep 80→800Hz, stereo)
 *   - Frequency-matched hover tones (reads Hz from card DOM text)
 */

import fs from "fs";

const results = [];
function patch(label, content, search, replace) {
  const idx = content.indexOf(search);
  if (idx === -1) {
    results.push(`  \u2717 MISSING (${label})`);
    return content;
  }
  const idx2 = content.indexOf(search, idx + 1);
  if (idx2 !== -1)
    results.push(`  \u26A0 DUPLICATE (${label}) — applying first`);
  results.push(`  \u2713 ${label}`);
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// ══════════════════════════════════════════════════════════════════════════════
// [1] THEATRE — aiosdream.html
// ══════════════════════════════════════════════════════════════════════════════
console.log("[1] Theatre AV Engine upgrade…");
let dream = fs.readFileSync("public/aiosdream.html", "utf8");
const N = dream.includes("\r\n") ? "\r\n" : "\n";

// ── A: AV CSS block ──────────────────────────────────────────────────────────
const avCSS =
  [
    `    /* ═══════════════════════════════════════════════════════════════`,
    `       NEXGEN AV ENGINE — Spectrum · Grain · Vignette · Crossfade`,
    `    ═══════════════════════════════════════════════════════════════ */`,
    ``,
    `    /* Crossfade canvas overlay */`,
    `    #player-canvas-fade {`,
    `      position: absolute; inset: 0; width: 100%; height: 100%;`,
    `      display: block; pointer-events: none; opacity: 0; z-index: 1;`,
    `    }`,
    `    /* Cinematic vignette */`,
    `    #player-vignette {`,
    `      position: absolute; inset: 0; z-index: 2; pointer-events: none;`,
    `      background: radial-gradient(ellipse 90% 85% at 50% 50%,`,
    `        transparent 28%, rgba(0,0,0,0.55) 100%);`,
    `    }`,
    `    /* Film grain canvas */`,
    `    #player-grain {`,
    `      position: absolute; inset: 0; width: 100%; height: 100%;`,
    `      display: block; pointer-events: none; z-index: 3;`,
    `      opacity: 0.052; mix-blend-mode: overlay; image-rendering: pixelated;`,
    `    }`,
    `    /* Per-programme colour mood overlay */`,
    `    #player-colour-overlay {`,
    `      position: absolute; inset: 0; z-index: 4; pointer-events: none;`,
    `      mix-blend-mode: multiply; transition: background 1.4s ease;`,
    `    }`,
    `    /* Quality badge — top right */`,
    `    #player-quality {`,
    `      position: absolute; top: 22px; right: 44px; z-index: 12;`,
    `      background: rgba(0,0,0,0.58); backdrop-filter: blur(8px);`,
    `      border: 1px solid rgba(255,255,255,0.12); border-radius: 4px;`,
    `      padding: 3px 9px; font-size: 9px; font-weight: 800; letter-spacing: 2px;`,
    `      text-transform: uppercase; color: rgba(255,255,255,0.45);`,
    `      pointer-events: none; transition: color 0.6s, border-color 0.6s;`,
    `    }`,
    `    #player-quality.lit { color: var(--paccent, var(--cyan)); border-color: rgba(255,255,255,0.22); }`,
    `    /* Spectrum canvas — between timeline and controls */`,
    `    #spectrum-cv {`,
    `      display: block; width: 100%; height: 42px; flex-shrink: 0;`,
    `      background: transparent; pointer-events: none;`,
    `      margin-bottom: 6px;`,
    `      mask-image: linear-gradient(to right, transparent 0%, #000 4%, #000 96%, transparent 100%);`,
    `      -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 4%, #000 96%, transparent 100%);`,
    `      opacity: 0; transition: opacity 0.6s;`,
    `    }`,
    `    #spectrum-cv.on { opacity: 1; }`,
    ``,
  ].join(N) + N;

dream = patch(
  "AV CSS",
  dream,
  `    /* \u2500\u2500 MOBILE \u2500\u2500 */`,
  avCSS + `    /* \u2500\u2500 MOBILE \u2500\u2500 */`,
);

// ── B: HTML — inject overlay layers after player-canvas ───────────────────
const oldPlayerCanvas =
  `  <canvas id="player-canvas"></canvas>` +
  N +
  `  <div class="player-ui" id="player-ui">`;

const newPlayerCanvas = [
  `  <canvas id="player-canvas"></canvas>`,
  `  <canvas id="player-canvas-fade"></canvas>`,
  `  <div id="player-vignette"></div>`,
  `  <canvas id="player-grain"></canvas>`,
  `  <div id="player-colour-overlay"></div>`,
  `  <div id="player-quality">4K GENERATIVE</div>`,
  `  <div class="player-ui" id="player-ui">`,
].join(N);

dream = patch("overlay layers HTML", dream, oldPlayerCanvas, newPlayerCanvas);

// ── C: HTML — spectrum canvas between timeline and ctrl-row ───────────────
const oldBeforeCtrl = [
  `      </div>`,
  `      <div class="ctrl-row">`,
  `        <button class="ctrl-btn xl" id="ctrl-play" title="Play / Pause (Space)">\u25B6</button>`,
].join(N);

const newBeforeCtrl = [
  `      </div>`,
  `      <canvas id="spectrum-cv"></canvas>`,
  `      <div class="ctrl-row">`,
  `        <button class="ctrl-btn xl" id="ctrl-play" title="Play / Pause (Space)">\u25B6</button>`,
].join(N);

dream = patch("spectrum canvas HTML", dream, oldBeforeCtrl, newBeforeCtrl);

// ── D: Add _analyserNode declaration ─────────────────────────────────────
const oldVarBlock = [
  `var _audioCtx = null;`,
  `var _masterGain = null;`,
  `var _ambientNodes = [];`,
].join(N);

const newVarBlock = [
  `var _audioCtx = null;`,
  `var _masterGain = null;`,
  `var _analyserNode = null;`,
  `var _ambientNodes = [];`,
].join(N);

dream = patch("_analyserNode var declaration", dream, oldVarBlock, newVarBlock);

// ── E: Upgrade _ensureAudio with analyser + reverb + panner ──────────────
const oldEnsureAudio = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  _masterGain.connect(_audioCtx.destination);`,
  `}`,
].join(N);

const newEnsureAudio = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  // ── Analyser (FFT for spectrum visualizer) ───────────────────────`,
  `  _analyserNode = _audioCtx.createAnalyser();`,
  `  _analyserNode.fftSize = 256;`,
  `  _analyserNode.smoothingTimeConstant = 0.86;`,
  `  _analyserNode.connect(_audioCtx.destination);`,
  `  // ── Convolver reverb (cinematic spatial depth) ───────────────────`,
  `  try {`,
  `    var sr = _audioCtx.sampleRate, rLen = Math.floor(sr * 1.8);`,
  `    var rBuf = _audioCtx.createBuffer(2, rLen, sr);`,
  `    for (var c = 0; c < 2; c++) {`,
  `      var d = rBuf.getChannelData(c);`,
  `      for (var k = 0; k < rLen; k++) d[k] = (Math.random()*2-1) * Math.pow(1-k/rLen, 2.6);`,
  `    }`,
  `    window._aiosReverb = _audioCtx.createConvolver();`,
  `    window._aiosReverb.buffer = rBuf;`,
  `    var rvbSend = _audioCtx.createGain();`,
  `    rvbSend.gain.value = 0.28;`,
  `    _masterGain.connect(window._aiosReverb);`,
  `    window._aiosReverb.connect(rvbSend);`,
  `    rvbSend.connect(_analyserNode);`,
  `  } catch(_ex) {}`,
  `  // ── Stereo panner (per-programme spatial position) ───────────────`,
  `  window._aiosPanner = _audioCtx.createStereoPanner`,
  `    ? _audioCtx.createStereoPanner() : null;`,
  `  if (window._aiosPanner) {`,
  `    window._aiosPanner.pan.value = 0;`,
  `    _masterGain.connect(window._aiosPanner);`,
  `    window._aiosPanner.connect(_analyserNode);`,
  `  } else {`,
  `    _masterGain.connect(_analyserNode);`,
  `  }`,
  `}`,
].join(N);

dream = patch(
  "_ensureAudio spatial chain",
  dream,
  oldEnsureAudio,
  newEnsureAudio,
);

// ── F: jumpToScene — inject _crossfadeScene before startRenderer ──────────
const oldJumpCore = [
  `  currentScene = sceneIdx;`,
  `  playerElapsed = 0;`,
  `  startRenderer();`,
].join(N);

const newJumpCore = [
  `  currentScene = sceneIdx;`,
  `  playerElapsed = 0;`,
  `  _crossfadeScene(); // capture frame before renderer switches`,
  `  startRenderer();`,
].join(N);

dream = patch("jumpToScene crossfade hook", dream, oldJumpCore, newJumpCore);

// ── G: Append main AV JS block ────────────────────────────────────────────
const jsAnchor = N + `</script>` + N + `</body>` + N + `</html>`;

const avJS =
  N +
  [
    `// ════════════════════════════════════════════════════════════════════════`,
    `// AIOS AV ENGINE — Spectrum · Crossfade · Grain · ColourGrade · Spatial`,
    `// ════════════════════════════════════════════════════════════════════════`,
    ``,
    `// ── Per-programme stereo pan map ─────────────────────────────────────────`,
    `var _PROG_PAN = {`,
    `  matrix:-0.10, inception:0.16, apollo:0, hyperspace:0.20,`,
    `  nebula:-0.15, neural:0.12,  quantum:-0.22, merkaba:0,`,
    `  phoenix:0.14, ocean:-0.12,  escher:0.18,  chronos:-0.07`,
    `};`,
    `// ── Per-programme colour grade (CSS filter + mood overlay) ───────────────`,
    `var _PROG_GRADE = {`,
    `  matrix:    { f:'saturate(1.1) contrast(1.06)',                         ov:'rgba(0,40,8,0.14)' },`,
    `  inception: { f:'saturate(0.88) contrast(1.1) hue-rotate(-5deg)',       ov:'rgba(28,0,48,0.12)' },`,
    `  apollo:    { f:'saturate(1.15) brightness(1.04)',                      ov:'rgba(0,12,42,0.10)' },`,
    `  hyperspace:{ f:'saturate(1.22) brightness(1.05)',                      ov:'rgba(36,30,0,0.09)' },`,
    `  nebula:    { f:'saturate(1.28) hue-rotate(10deg)',                     ov:'rgba(42,0,52,0.11)' },`,
    `  neural:    { f:'saturate(1.14) contrast(1.05)',                        ov:'rgba(0,18,40,0.10)' },`,
    `  quantum:   { f:'saturate(0.93) contrast(1.09) hue-rotate(-10deg)',     ov:'rgba(18,0,38,0.12)' },`,
    `  merkaba:   { f:'saturate(1.20) brightness(1.03)',                      ov:'rgba(40,24,0,0.10)' },`,
    `  phoenix:   { f:'saturate(1.32) contrast(1.06)',                        ov:'rgba(52,18,0,0.10)' },`,
    `  ocean:     { f:'saturate(1.22) hue-rotate(8deg)',                      ov:'rgba(0,24,44,0.10)' },`,
    `  escher:    { f:'contrast(1.14) saturate(0.90)',                        ov:'rgba(14,14,20,0.12)' },`,
    `  chronos:   { f:'saturate(1.12) brightness(1.04) hue-rotate(-3deg)',    ov:'rgba(36,26,0,0.10)' },`,
    `};`,
    ``,
    `// ── Colour grade application ─────────────────────────────────────────────`,
    `function _applyColourGrade(progId) {`,
    `  var g = _PROG_GRADE[progId] || { f:'', ov:'transparent' };`,
    `  var cv = document.getElementById('player-canvas');`,
    `  if (cv) cv.style.filter = g.f;`,
    `  var ov = document.getElementById('player-colour-overlay');`,
    `  if (ov) ov.style.background = g.ov;`,
    `  // Quality badge — light up in accent`,
    `  var qb = document.getElementById('player-quality');`,
    `  if (qb) {`,
    `    qb.textContent = '4K GENERATIVE';`,
    `    setTimeout(() => qb && qb.classList.add('lit'), 300);`,
    `  }`,
    `}`,
    `function _clearColourGrade() {`,
    `  var cv = document.getElementById('player-canvas');`,
    `  if (cv) cv.style.filter = '';`,
    `  var ov = document.getElementById('player-colour-overlay');`,
    `  if (ov) ov.style.background = 'transparent';`,
    `  var qb = document.getElementById('player-quality');`,
    `  if (qb) qb.classList.remove('lit');`,
    `}`,
    ``,
    `// ── Scene crossfade ──────────────────────────────────────────────────────`,
    `function _crossfadeScene() {`,
    `  var mainCv = document.getElementById('player-canvas');`,
    `  var fadeCv = document.getElementById('player-canvas-fade');`,
    `  if (!fadeCv || !mainCv) return;`,
    `  try {`,
    `    var W = mainCv.width || mainCv.offsetWidth || 1920;`,
    `    var H = mainCv.height || mainCv.offsetHeight || 1080;`,
    `    fadeCv.width = W; fadeCv.height = H;`,
    `    var fCtx = fadeCv.getContext('2d');`,
    `    fCtx.drawImage(mainCv, 0, 0, W, H);`,
    `    fadeCv.style.transition = 'none';`,
    `    fadeCv.style.opacity = '1';`,
    `    requestAnimationFrame(function() {`,
    `      fadeCv.style.transition = 'opacity 0.72s cubic-bezier(.16,1,.3,1)';`,
    `      fadeCv.style.opacity = '0';`,
    `    });`,
    `  } catch(_) {}`,
    `}`,
    ``,
    `// ── Spectrum visualizer ──────────────────────────────────────────────────`,
    `var _specRaf = null;`,
    `var _specBins = new Uint8Array(128);  // pre-allocated`,
    `var _specPeak = new Float32Array(128); // peak hold`,
    ``,
    `function _startSpectrum() {`,
    `  _stopSpectrum();`,
    `  var cv = document.getElementById('spectrum-cv');`,
    `  if (!cv) return;`,
    `  cv.classList.add('on');`,
    `  function loop() {`,
    `    if (!cv.classList.contains('on')) { _specRaf = null; return; }`,
    `    var W = cv.offsetWidth, H = cv.offsetHeight;`,
    `    if (W === 0 || H === 0) { _specRaf = requestAnimationFrame(loop); return; }`,
    `    cv.width = W; cv.height = H;`,
    `    var ctx = cv.getContext('2d');`,
    `    ctx.clearRect(0, 0, W, H);`,
    `    if (!_analyserNode) { _specRaf = requestAnimationFrame(loop); return; }`,
    `    var n = _analyserNode.frequencyBinCount; // 128`,
    `    var data = _specBins.length === n ? _specBins : (_specBins = new Uint8Array(n));`,
    `    _analyserNode.getByteFrequencyData(data);`,
    `    // Read current programme accent`,
    `    var accent = getComputedStyle(document.getElementById('player')).getPropertyValue('--paccent').trim() || 'var(--cyan)';`,
    `    if (!accent || accent === 'var(--cyan)') accent = '#00d4ff';`,
    `    // ── Mountain waveform path ──`,
    `    var grad = ctx.createLinearGradient(0, 0, 0, H);`,
    `    grad.addColorStop(0, accent);`,
    `    grad.addColorStop(0.7, accent.replace(/rgb\(/, 'rgba(').replace(/\)/, ',0.35)') || 'rgba(0,212,255,0.35)');`,
    `    grad.addColorStop(1, 'transparent');`,
    `    ctx.save();`,
    `    ctx.shadowBlur = 10; ctx.shadowColor = accent;`,
    `    ctx.beginPath();`,
    `    ctx.moveTo(0, H);`,
    `    var step = W / n;`,
    `    for (var i = 0; i < n; i++) {`,
    `      var v = data[i] / 255;`,
    `      var x = i * step;`,
    `      var y = H - v * H * 0.92;`,
    `      if (i === 0) ctx.lineTo(x, y); else ctx.lineTo(x, y);`,
    `    }`,
    `    ctx.lineTo(W, H);`,
    `    ctx.closePath();`,
    `    ctx.fillStyle = grad;`,
    `    ctx.fill();`,
    `    // ── Peak dots ──`,
    `    ctx.shadowBlur = 0;`,
    `    for (var j = 0; j < n; j++) {`,
    `      var pv = data[j] / 255;`,
    `      if (pv > _specPeak[j]) _specPeak[j] = pv;`,
    `      else _specPeak[j] *= 0.982;`,
    `      if (_specPeak[j] > 0.05) {`,
    `        var px = j * step + step * 0.5;`,
    `        var py = H - _specPeak[j] * H * 0.92 - 1;`,
    `        ctx.fillStyle = accent;`,
    `        ctx.fillRect(px - 1, py, 2, 2);`,
    `      }`,
    `    }`,
    `    ctx.restore();`,
    `    _specRaf = requestAnimationFrame(loop);`,
    `  }`,
    `  loop();`,
    `}`,
    `function _stopSpectrum() {`,
    `  if (_specRaf) { cancelAnimationFrame(_specRaf); _specRaf = null; }`,
    `  var cv = document.getElementById('spectrum-cv');`,
    `  if (!cv) return;`,
    `  cv.classList.remove('on');`,
    `  var ctx = cv.getContext('2d');`,
    `  if (ctx) ctx.clearRect(0, 0, cv.width, cv.height);`,
    `}`,
    ``,
    `// ── Film grain canvas — runs 20fps ──────────────────────────────────────`,
    `(function initGrain() {`,
    `  var cv = document.getElementById('player-grain');`,
    `  if (!cv || !cv.getContext) return;`,
    `  var G = 180;`,
    `  cv.width = G; cv.height = G;`,
    `  var ctx = cv.getContext('2d');`,
    `  function drawGrain() {`,
    `    if (!document.getElementById('player').classList.contains('active')) return;`,
    `    var img = ctx.createImageData(G, G);`,
    `    var d = img.data;`,
    `    for (var i = 0; i < d.length; i += 4) {`,
    `      var v = Math.random() * 255 | 0;`,
    `      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;`,
    `    }`,
    `    ctx.putImageData(img, 0, 0);`,
    `  }`,
    `  drawGrain();`,
    `  setInterval(drawGrain, 50);`,
    `})();`,
    ``,
    `// ── Hook openPlayer: colour grade + spectrum + spatial pan ───────────────`,
    `(function() {`,
    `  var _base = openPlayer;`,
    `  openPlayer = function(progId, startScene, e) {`,
    `    _base(progId, startScene, e);`,
    `    setTimeout(function() {`,
    `      _applyColourGrade(progId);`,
    `      _startSpectrum();`,
    `      // Apply spatial pan for this programme`,
    `      if (window._aiosPanner && _audioCtx) {`,
    `        var pan = _PROG_PAN[progId] || 0;`,
    `        window._aiosPanner.pan.setTargetAtTime(pan, _audioCtx.currentTime, 0.5);`,
    `      }`,
    `    }, 90);`,
    `  };`,
    `})();`,
    ``,
    `// ── Hook closePlayer: clean up AV ────────────────────────────────────────`,
    `(function() {`,
    `  var _base = closePlayer;`,
    `  closePlayer = function() {`,
    `    _base();`,
    `    _stopSpectrum();`,
    `    _clearColourGrade();`,
    `    if (window._aiosPanner && _audioCtx) {`,
    `      window._aiosPanner.pan.setTargetAtTime(0, _audioCtx.currentTime, 0.3);`,
    `    }`,
    `  };`,
    `})();`,
    ``,
    `// ── Mini-player audio duck (−40% when entering corner mode) ─────────────`,
    `(function() {`,
    `  var _baseMini = _activateMiniPlayer;`,
    `  _activateMiniPlayer = function() {`,
    `    _baseMini();`,
    `    if (_masterGain && _audioCtx) {`,
    `      _masterGain.gain.setTargetAtTime(`,
    `        parseFloat(document.getElementById('vol-slider').value) * 0.22 * 0.6,`,
    `        _audioCtx.currentTime, 0.3`,
    `      );`,
    `    }`,
    `  };`,
    `  var _baseExpand = _expandMiniPlayer;`,
    `  _expandMiniPlayer = function() {`,
    `    _baseExpand();`,
    `    if (_masterGain && _audioCtx) {`,
    `      var v = parseFloat(document.getElementById('vol-slider').value);`,
    `      _masterGain.gain.setTargetAtTime(v * 0.22, _audioCtx.currentTime, 0.3);`,
    `    }`,
    `  };`,
    `})();`,
  ].join(N);

dream = patch("AV engine JS", dream, jsAnchor, avJS + jsAnchor);

fs.writeFileSync("public/aiosdream.html", dream, "utf8");
console.log(`  \u2192 aiosdream.html: ${dream.length} bytes`);

// ══════════════════════════════════════════════════════════════════════════════
// [2] AIOSOCULIS — vr-hub.html
// ══════════════════════════════════════════════════════════════════════════════
console.log("[2] AIOSOculus AV upgrade…");
let hub = fs.readFileSync("public/vr-hub.html", "utf8");
const HN = hub.includes("\r\n") ? "\r\n" : "\n";

// ── Hub CSS: audio indicator ──────────────────────────────────────────────
const hubAVCSS = [
  `      /* ── XP Hover Audio Indicator ── */`,
  `      .xp-card, .well-card {`,
  `        --xp-freq-clr: rgba(0,212,255,0.7);`,
  `      }`,
  `      .xp-card:hover .xp-freq,`,
  `      .xp-card:hover [class*="freq"],`,
  `      .well-card:hover [class*="freq"] {`,
  `        color: var(--accent, var(--cyan));`,
  `        text-shadow: 0 0 10px currentColor;`,
  `        transition: color 0.3s, text-shadow 0.3s;`,
  `      }`,
  `      /* Audio sting pulse on VR overlay */`,
  `      #enter-vr-overlay.playing .evr-ring {`,
  `        border-top-color: #fff;`,
  `        box-shadow: 0 0 30px rgba(0,212,255,0.4);`,
  `      }`,
  ``,
].join(HN);

const hubStyleClose = hub.lastIndexOf(`    </style>`);
if (hubStyleClose !== -1) {
  hub = hub.slice(0, hubStyleClose) + hubAVCSS + hub.slice(hubStyleClose);
  results.push("  \u2713 hub AV CSS");
} else {
  results.push("  \u2717 MISSING (hub AV CSS)");
}

// ── Hub JS: hover tones + VR sting ───────────────────────────────────────
const hubLastScript = hub.lastIndexOf(`    </script>`);
if (hubLastScript !== -1) {
  const hubAVJS = [
    ``,
    `      // ═══════════════════════════════════════════════════════════════════`,
    `      // AIOS AV ENGINE — XP Hover Spatial Tones + VR Entry Sting`,
    `      // ═══════════════════════════════════════════════════════════════════`,
    ``,
    `      var _xpACtx = null, _xpHoverOsc = null;`,
    ``,
    `      function _ensureXpAudio() {`,
    `        if (_xpACtx) return;`,
    `        _xpACtx = new (window.AudioContext || window.webkitAudioContext)();`,
    `      }`,
    ``,
    `      // XP card hover tone — PHI-frequency sweep, stereo-panned`,
    `      function _xpHoverTone(hz) {`,
    `        try {`,
    `          _ensureXpAudio();`,
    `          if (_xpACtx.state === 'suspended') _xpACtx.resume();`,
    `          if (_xpHoverOsc) { try { _xpHoverOsc.stop(); } catch(_) {} }`,
    `          var ctx = _xpACtx, now = ctx.currentTime;`,
    `          var osc  = ctx.createOscillator();`,
    `          var gain = ctx.createGain();`,
    `          var osc2 = ctx.createOscillator(); // overtone at hz * PHI`,
    `          var g2   = ctx.createGain();`,
    `          var pan  = ctx.createStereoPanner ? ctx.createStereoPanner() : null;`,
    `          osc.type = 'sine';`,
    `          osc.frequency.setValueAtTime(hz * 0.5, now);`,
    `          osc.frequency.exponentialRampToValueAtTime(hz * 1.618, now + 0.9); // PHI sweep`,
    `          gain.gain.setValueAtTime(0, now);`,
    `          gain.gain.linearRampToValueAtTime(0.045, now + 0.25);`,
    `          gain.gain.setTargetAtTime(0, now + 0.55, 0.28);`,
    `          osc2.type = 'triangle';`,
    `          osc2.frequency.setValueAtTime(hz, now);`,
    `          g2.gain.setValueAtTime(0, now);`,
    `          g2.gain.linearRampToValueAtTime(0.018, now + 0.3);`,
    `          g2.gain.setTargetAtTime(0, now + 0.6, 0.25);`,
    `          osc.connect(gain);`,
    `          osc2.connect(g2);`,
    `          if (pan) {`,
    `            pan.pan.value = (Math.random() - 0.5) * 0.5;`,
    `            gain.connect(pan); g2.connect(pan);`,
    `            pan.connect(ctx.destination);`,
    `          } else {`,
    `            gain.connect(ctx.destination); g2.connect(ctx.destination);`,
    `          }`,
    `          osc.start(now);  osc.stop(now + 1.8);`,
    `          osc2.start(now); osc2.stop(now + 1.8);`,
    `          _xpHoverOsc = osc;`,
    `        } catch(_) {}`,
    `      }`,
    ``,
    `      // Attach hover tones to all XP cards`,
    `      (function attachXpHoverAudio() {`,
    `        document.querySelectorAll('.xp-card, .well-card').forEach(function(card) {`,
    `          if (card._xpAudioReady) return;`,
    `          card._xpAudioReady = true;`,
    `          card.addEventListener('mouseenter', function() {`,
    `            // Extract Hz frequency from any text in card`,
    `            var text = card.textContent;`,
    `            var m = text.match(/(\d{2,4})\s*(?:Hz|hz)/);`,
    `            var freq = m ? parseInt(m[1]) : 528;`,
    `            // Sanity clamp to audible musical range`,
    `            freq = Math.max(80, Math.min(2000, freq));`,
    `            _xpHoverTone(freq);`,
    `          });`,
    `        });`,
    `      })();`,
    ``,
    `      // VR entry audio sting — rising dual-sine sweep`,
    `      function _playVrSting() {`,
    `        try {`,
    `          _ensureXpAudio();`,
    `          var ctx = _xpACtx;`,
    `          if (ctx.state === 'suspended') ctx.resume();`,
    `          var now = ctx.currentTime;`,
    `          // Layer 1: deep sine sweep 72Hz (HOLOGRAPHIC base) → 432Hz`,
    `          var o1 = ctx.createOscillator(), g1 = ctx.createGain();`,
    `          o1.type = 'sine';`,
    `          o1.frequency.setValueAtTime(72, now);`,
    `          o1.frequency.exponentialRampToValueAtTime(864, now + 1.1);`,
    `          g1.gain.setValueAtTime(0, now);`,
    `          g1.gain.linearRampToValueAtTime(0.18, now + 0.12);`,
    `          g1.gain.exponentialRampToValueAtTime(0.001, now + 1.3);`,
    `          o1.connect(g1); g1.connect(ctx.destination);`,
    `          o1.start(now); o1.stop(now + 1.4);`,
    `          // Layer 2: triangle sweep 144Hz → 1728Hz (upper harmonic)`,
    `          var o2 = ctx.createOscillator(), g2 = ctx.createGain();`,
    `          o2.type = 'triangle';`,
    `          o2.frequency.setValueAtTime(144, now);`,
    `          o2.frequency.exponentialRampToValueAtTime(1728, now + 1.1);`,
    `          g2.gain.setValueAtTime(0, now);`,
    `          g2.gain.linearRampToValueAtTime(0.08, now + 0.2);`,
    `          g2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);`,
    `          o2.connect(g2); g2.connect(ctx.destination);`,
    `          o2.start(now + 0.05); o2.stop(now + 1.3);`,
    `          // Layer 3: short impact click at 528Hz (ACTION freq)`,
    `          var o3 = ctx.createOscillator(), g3 = ctx.createGain();`,
    `          o3.type = 'sine';`,
    `          o3.frequency.value = 528;`,
    `          g3.gain.setValueAtTime(0.12, now);`,
    `          g3.gain.exponentialRampToValueAtTime(0.001, now + 0.18);`,
    `          o3.connect(g3); g3.connect(ctx.destination);`,
    `          o3.start(now); o3.stop(now + 0.2);`,
    `          // Pulse the VR overlay ring`,
    `          var ov = document.getElementById('enter-vr-overlay');`,
    `          if (ov) {`,
    `            ov.classList.add('playing');`,
    `            setTimeout(function() { ov && ov.classList.remove('playing'); }, 1400);`,
    `          }`,
    `        } catch(_) {}`,
    `      }`,
    ``,
    `      // Hook enterVRWorld to play sting (chaining from existing wrapper)`,
    `      (function() {`,
    `        var _prevEnter = enterVRWorld;`,
    `        enterVRWorld = function(url, name) {`,
    `          _playVrSting();`,
    `          _prevEnter(url, name);`,
    `        };`,
    `      })();`,
    ``,
  ].join(HN);

  hub = hub.slice(0, hubLastScript) + hubAVJS + hub.slice(hubLastScript);
  results.push("  \u2713 hub AV JS (hover tones + VR sting)");
} else {
  results.push("  \u2717 MISSING (hub AV JS anchor)");
}

fs.writeFileSync("public/vr-hub.html", hub, "utf8");
console.log(`  \u2192 vr-hub.html: ${hub.length} bytes`);

// ══════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════════════════════════════════════════
console.log("");
console.log("\u2550".repeat(60));
const ok = results.filter((r) => r.includes("\u2713")).length;
const bad = results.filter((r) => r.includes("\u2717")).length;
results.forEach((r) => console.log(r));
console.log(`\u2550\u2550 \u2705 ${ok} applied   \u274C ${bad} failed`);
if (bad > 0) process.exit(1);
