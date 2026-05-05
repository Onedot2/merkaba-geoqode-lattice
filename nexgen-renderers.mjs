/**
 * nexgen-renderers.mjs
 * Cinematic Renderer Upgrade — Bloom post-processor + targeted renderer enhancements
 * Patches to public/aiosdream.html
 */
import fs from "fs";

let dream = fs.readFileSync("public/aiosdream.html", "utf8");
const results = [];
let passed = 0,
  failed = 0;

/**
 * Smart patch: tries both CRLF and LF variants of the search string
 */
function patch(label, search, replace) {
  let idx = dream.indexOf(search);
  let usedSearch = search;
  if (idx === -1) {
    // try opposite NL
    const alt = search.includes("\r\n")
      ? search.replace(/\r\n/g, "\n")
      : search.replace(/\n/g, "\r\n");
    idx = dream.indexOf(alt);
    if (idx !== -1) usedSearch = alt;
  }
  if (idx === -1) {
    results.push(`  ✗ MISS  [${label}]`);
    failed++;
    return;
  }
  dream = dream.slice(0, idx) + replace + dream.slice(idx + usedSearch.length);
  results.push(`  ✓ OK    [${label}]`);
  passed++;
}

// ══════════════════════════════════════════════════════════════════════════════
// PATCH A — Bloom canvas CSS
// Insert before the MOBILE media-query comment inside the <style> block
// ══════════════════════════════════════════════════════════════════════════════
const BLOOM_CSS = `
    /* ── BLOOM post-processor ── */
    #player-bloom-cv {
      position: absolute; inset: 0; width: 100%; height: 100%;
      display: block; pointer-events: none; z-index: 2;
      mix-blend-mode: screen; opacity: 0.26;
    }

    /* ── SCANLINE atmosphere ── */
    #player-scanlines {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 3;
      background: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.06) 3px,
        rgba(0,0,0,0.06) 4px
      );
      opacity: 0;
      transition: opacity 0.5s;
    }
    #player.active #player-scanlines { opacity: 1; }

`;

patch("bloom-css", "    /* ── MOBILE ──", BLOOM_CSS + "    /* ── MOBILE ──");

// ══════════════════════════════════════════════════════════════════════════════
// PATCH B — Bloom canvas + Scanlines div HTML
// Insert after player-canvas-fade, before player-vignette
// ══════════════════════════════════════════════════════════════════════════════
patch(
  "bloom-html",
  `<canvas id="player-canvas-fade"></canvas>
  <div id="player-vignette">`,
  `<canvas id="player-canvas-fade"></canvas>
  <canvas id="player-bloom-cv"></canvas>
  <div id="player-scanlines"></div>
  <div id="player-vignette">`,
);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH C — Merkaba renderer: add translucent face fills for 3D depth
// Insert a face-fill pass BEFORE the TET_E edge loop
// ══════════════════════════════════════════════════════════════════════════════
const MERKABA_SEARCH = `        const color = flip ? '#00e5ff' : '#f5a623';
        TET_E.forEach(([a, b]) => {`;
const MERKABA_REPLACE = `        const color = flip ? '#00e5ff' : '#f5a623';
        // Translucent face fills for 3D depth
        [[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(([fa,fb,fc]) => {
          ctx.beginPath();
          ctx.moveTo(pts[fa][0], pts[fa][1]);
          ctx.lineTo(pts[fb][0], pts[fb][1]);
          ctx.lineTo(pts[fc][0], pts[fc][1]);
          ctx.closePath();
          ctx.fillStyle = flip ? 'rgba(0,229,255,0.05)' : 'rgba(245,166,35,0.05)';
          ctx.fill();
        });
        TET_E.forEach(([a, b]) => {`;

patch("merkaba-face-fills", MERKABA_SEARCH, MERKABA_REPLACE);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH D — Matrix renderer: bright head char with shadow glow
// Enhance the leading character draw call
// ══════════════════════════════════════════════════════════════════════════════
const MATRIX_SEARCH = `          ctx.fillStyle = \`rgba(200,255,210,0.95)\`;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y * fs);`;
const MATRIX_REPLACE = `          ctx.save();
          ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,255,80,0.9)';
          ctx.fillStyle = \`rgba(240,255,240,1.0)\`;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y * fs);
          ctx.restore();`;

patch("matrix-head-glow", MATRIX_SEARCH, MATRIX_REPLACE);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH E — Hyperspace: intensify star streaks + add central corona
// Enhance the star streak line drawing
// ══════════════════════════════════════════════════════════════════════════════
const HYPER_SEARCH = `        ctx.strokeStyle = \`rgba(\${s.c[0]},\${s.c[1]},\${s.c[2]},\${alpha})\`;
          ctx.lineWidth = s.z * 0.003;`;
const HYPER_REPLACE = `        ctx.strokeStyle = \`rgba(\${s.c[0]},\${s.c[1]},\${s.c[2]},\${alpha})\`;
          ctx.shadowBlur = s.z > 400 ? 6 : 0;
          ctx.shadowColor = \`rgba(\${s.c[0]},\${s.c[1]},\${s.c[2]},0.8)\`;
          ctx.lineWidth = s.z * 0.004;`;

patch("hyperspace-glow", HYPER_SEARCH, HYPER_REPLACE);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH F — Chronos: increase Fibonacci spiral visibility + arm-tip glow
// ══════════════════════════════════════════════════════════════════════════════
const CHRONO_SEARCH = `        ctx.strokeStyle = 'rgba(251,191,36,0.06)';`;
const CHRONO_REPLACE = `        ctx.strokeStyle = 'rgba(251,191,36,0.14)';`;

patch("chronos-spiral-bright", CHRONO_SEARCH, CHRONO_REPLACE);

const CHRONO_TIP_SEARCH = `          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();`;
const CHRONO_TIP_REPLACE = `          ctx.save();
          ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(251,191,36,0.9)';
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
          ctx.restore();`;

patch("chronos-tip-glow", CHRONO_TIP_SEARCH, CHRONO_TIP_REPLACE);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH G — Neural: gradient energy connections + glow on firing nodes
// ══════════════════════════════════════════════════════════════════════════════
const NEURAL_EDGE_SEARCH = `              ctx.strokeStyle = \`rgba(0,229,255,\${edgeAlpha})\`;
              ctx.lineWidth = 0.8;`;
const NEURAL_EDGE_REPLACE = `              const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              grad.addColorStop(0, \`rgba(0,229,255,\${edgeAlpha})\`);
              grad.addColorStop(0.5, \`rgba(124,58,237,\${edgeAlpha * 1.4})\`);
              grad.addColorStop(1, \`rgba(0,229,255,\${edgeAlpha})\`);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.9;`;

patch("neural-gradient-edges", NEURAL_EDGE_SEARCH, NEURAL_EDGE_REPLACE);

// ══════════════════════════════════════════════════════════════════════════════
// PATCH H — Appended JS block: Bloom post-processor + Phoenix ember layer
// ══════════════════════════════════════════════════════════════════════════════
const BLOOM_JS = `

// ═══════════════════════════════════════════════════════════════════════════════
// AIOS CINEMATIC ENGINE — Bloom Post-Processor + Renderer Enhancements
// Appended by nexgen-renderers.mjs
// ═══════════════════════════════════════════════════════════════════════════════

// ── Global Bloom Post-Processor ──────────────────────────────────────────────
(function initBloom() {
  var _bloomOff = document.createElement('canvas');
  var _bloomRaf  = null;
  var _lastT     = 0;
  var FPS30      = 1000 / 30;

  function bloomLoop(now) {
    _bloomRaf = requestAnimationFrame(bloomLoop);
    if (now - _lastT < FPS30) return;
    _lastT = now;

    var bloomCv = document.getElementById('player-bloom-cv');
    var mainCv  = document.getElementById('player-canvas');
    var player  = document.getElementById('player');
    if (!bloomCv || !mainCv || !player) return;

    if (!player.classList.contains('active')) {
      var bCtxClear = bloomCv.getContext('2d');
      if (bCtxClear && bloomCv.width > 1) bCtxClear.clearRect(0, 0, bloomCv.width, bloomCv.height);
      return;
    }

    var W = mainCv.offsetWidth || mainCv.width;
    var H = mainCv.offsetHeight || mainCv.height;
    if (!W || !H) return;

    // Half-size offscreen for performance (blur is scale-independent)
    var bW = Math.max(2, W >> 1), bH = Math.max(2, H >> 1);
    if (_bloomOff.width !== bW || _bloomOff.height !== bH) {
      _bloomOff.width = bW; _bloomOff.height = bH;
    }
    var offCtx = _bloomOff.getContext('2d');
    offCtx.save();
    offCtx.filter = 'blur(9px)';
    try { offCtx.drawImage(mainCv, 0, 0, bW, bH); } catch(_e) {}
    offCtx.restore();

    if (bloomCv.width !== W || bloomCv.height !== H) {
      bloomCv.width = W; bloomCv.height = H;
    }
    var bCtx = bloomCv.getContext('2d');
    bCtx.clearRect(0, 0, W, H);
    bCtx.drawImage(_bloomOff, 0, 0, W, H);
  }

  // Start immediately; self-detects active state
  requestAnimationFrame(bloomLoop);
})();


// ── Enhanced Phoenix Renderer — ember sparks layer ───────────────────────────
(function enhancePhoenix() {
  if (!window.RENDERERS || !RENDERERS.phoenix) return;
  var _orig = RENDERERS.phoenix;

  RENDERERS.phoenix = {
    _raf: null,
    _extraRaf: null,
    start(canvas, si) {
      _orig.start.call(_orig, canvas, si);
      this._raf = _orig._raf; // mirror for stop()

      var ctx  = canvas.getContext('2d');
      var W    = canvas.width, H = canvas.height;
      var heat = [0.5, 0.75, 1.0, 1.35, 1.1][si] || 1.0;
      var embers = [];
      var self = this;

      function emit() {
        embers.push({
          x: W * 0.5 + (Math.random() - 0.5) * 80 * heat,
          y: H * 0.80,
          vx: (Math.random() - 0.5) * 2.8 * heat,
          vy: -(Math.random() * 5.5 + 2.5) * heat,
          life: 1.0,
          decay: 0.006 + Math.random() * 0.006,
          r: Math.random() * 1.8 + 0.4
        });
      }

      var loop = function() {
        // Emit burst
        var count = Math.ceil(4 * heat);
        for (var i = 0; i < count; i++) emit();
        if (embers.length > 500) embers.splice(0, 100);

        for (var j = embers.length - 1; j >= 0; j--) {
          var p = embers[j];
          p.x  += p.vx + Math.sin(p.life * 14 + j * 0.3) * 0.7;
          p.y  += p.vy;
          p.vx *= 0.982;
          p.vy *= 0.979;
          p.life -= p.decay;
          if (p.life <= 0) { embers.splice(j, 1); continue; }
          var lf = p.life;
          // hot white → gold → orange → purple fade
          var rv = lf > 0.6 ? 255 : Math.floor(255 * (lf / 0.6));
          var gv = lf > 0.55 ? Math.floor(220 * lf) : Math.floor(80 * lf);
          var bv = lf < 0.25 ? Math.floor(160 * ((0.25 - lf) / 0.25)) : 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * lf * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + rv + ',' + gv + ',' + bv + ',' + (lf * 0.85) + ')';
          ctx.fill();
        }
        self._extraRaf = requestAnimationFrame(loop);
      };
      loop();
    },
    stop() {
      _orig.stop.call(_orig);
      if (this._extraRaf) { cancelAnimationFrame(this._extraRaf); this._extraRaf = null; }
    }
  };
})();


// ── Enhanced Ocean Renderer — bioluminescent pulse bloom ─────────────────────
(function enhanceOcean() {
  if (!window.RENDERERS || !RENDERERS.ocean) return;
  var _orig = RENDERERS.ocean;

  RENDERERS.ocean = {
    _raf: null,
    _extraRaf: null,
    start(canvas, si) {
      _orig.start.call(_orig, canvas, si);
      this._raf = _orig._raf;

      var ctx  = canvas.getContext('2d');
      var W    = canvas.width, H = canvas.height;
      var bright = [0.08, 0.12, 0.2, 0.3, 0.15][si] || 0.15;
      var self = this;
      var t2 = 0;

      var loop = function() {
        // Floating bioluminescent orbs — slow, atmospheric
        for (var i = 0; i < 3; i++) {
          var ox = (W * (0.2 + i * 0.3) + Math.sin(t2 * 0.15 + i) * 40);
          var oy = (H * (0.3 + i * 0.2) + Math.cos(t2 * 0.12 + i * 1.7) * 50);
          var pulse = 0.5 + 0.5 * Math.sin(t2 * 0.4 + i * 2.1);
          var r = 30 + pulse * 20;
          var grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
          grd.addColorStop(0, 'rgba(0,229,255,' + (bright * pulse * 0.25) + ')');
          grd.addColorStop(1, 'rgba(0,180,200,0)');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fill();
        }
        t2 += 0.016;
        self._extraRaf = requestAnimationFrame(loop);
      };
      loop();
    },
    stop() {
      _orig.stop.call(_orig);
      if (this._extraRaf) { cancelAnimationFrame(this._extraRaf); this._extraRaf = null; }
    }
  };
})();

`;

// Append to end of <script> block — find the last </script> before </body>
patch("bloom-js-append", "</script>\n</body>", BLOOM_JS + "</script>\n</body>");

// ══════════════════════════════════════════════════════════════════════════════
// Write & Report
// ══════════════════════════════════════════════════════════════════════════════
fs.writeFileSync("public/aiosdream.html", dream, "utf8");

console.log("\nnexgen-renderers.mjs — RESULTS");
console.log("═".repeat(50));
results.forEach((r) => console.log(r));
console.log("─".repeat(50));
console.log(`  Total: ${passed} passed, ${failed} failed`);
console.log(`  aiosdream.html: ${dream.length} bytes\n`);
process.exit(failed > 0 ? 1 : 0);
