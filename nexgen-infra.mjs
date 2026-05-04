/**
 * nexgen-infra.mjs — AIOS-Native Nexgen Video + XR Infrastructure
 *
 * Theatre (aiosdream.html):
 *   - 10-second skip forward/back (J/L)
 *   - Playback speed selector (0.5× → 2×)
 *   - Picture-in-Picture via canvas.captureStream()
 *   - Mini-player mode (transforms to 320×180 corner)
 *   - "Up Next" countdown overlay before scene advance
 *   - Live canvas preview on card hover
 *   - Emoji reactions per programme
 *   - Share button with deeplink (#progId:sceneIdx)
 *   - pausePlayback mini-player sync
 *   - Enhanced keyboard shortcuts (M mute, P pip, B mini, J/L ±10s)
 *   - Deep-link on load via URL hash
 *
 * AIOSOculus (vr-hub.html):
 *   - Live user-count simulation per category
 *   - "Entering VR" fullscreen transition overlay
 *   - Canvas hover mini-scene per XP card
 *   - Stat bar count-up animation on load
 *   - XP visit tracking (localStorage) + progress dots on cards
 *   - Enhanced section headers with live pulse
 */

import fs from "fs";

const results = [];
function patch(label, content, search, replace) {
  const idx = content.indexOf(search);
  if (idx === -1) {
    results.push(`  \u2717 MISSING (${label})`);
    return content;
  }
  results.push(`  \u2713 ${label}`);
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// ══════════════════════════════════════════════════════════════════════════════
// [1] aiosdream.html — THEATRE NEXGEN VIDEO INFRASTRUCTURE
// ══════════════════════════════════════════════════════════════════════════════
console.log("[1] aiosdream.html…");
let dream = fs.readFileSync("public/aiosdream.html", "utf8");
const N = dream.includes("\r\n") ? "\r\n" : "\n";

// ── A: NEXGEN CSS ─────────────────────────────────────────────────────────────
const nexgenCSS =
  [
    `    /* ═══════════════════════════════════════════════════════════════`,
    `       NEXGEN VIDEO INFRASTRUCTURE — Theatre`,
    `       PiP · Mini-Player · Speed · Up-Next · Reactions · Share`,
    `    ═══════════════════════════════════════════════════════════════ */`,
    ``,
    `    /* Speed Picker */`,
    `    .speed-wrap { position: relative; }`,
    `    .speed-popup {`,
    `      position: absolute; bottom: 48px; right: 0;`,
    `      background: rgba(8,10,22,0.97); backdrop-filter: blur(24px);`,
    `      border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;`,
    `      padding: 6px 0; min-width: 108px; z-index: 20;`,
    `      transform: scale(0.9) translateY(8px); transform-origin: bottom right;`,
    `      opacity: 0; pointer-events: none;`,
    `      transition: transform 0.18s cubic-bezier(.16,1,.3,1), opacity 0.18s;`,
    `    }`,
    `    .speed-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }`,
    `    .spd-opt { display: block; width: 100%; background: none; border: none;`,
    `      color: rgba(255,255,255,0.62); font-size: 13px; font-weight: 500;`,
    `      padding: 9px 18px; text-align: left; cursor: pointer; transition: all 0.1s; }`,
    `    .spd-opt:hover { background: rgba(255,255,255,0.07); color: #fff; }`,
    `    .spd-opt.cur { color: var(--paccent, var(--cyan)); font-weight: 700; }`,
    ``,
    `    /* Mini Player */`,
    `    #player.mini {`,
    `      position: fixed; inset: auto; bottom: 24px; right: 24px;`,
    `      width: 320px; height: 180px; z-index: 500;`,
    `      border-radius: 14px; overflow: hidden;`,
    `      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.09);`,
    `      cursor: pointer; transition: box-shadow 0.2s;`,
    `    }`,
    `    #player.mini:hover { box-shadow: 0 24px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.14); }`,
    `    #player.mini .player-top {`,
    `      padding: 9px 10px 6px;`,
    `      background: linear-gradient(to bottom, rgba(0,0,0,0.88), transparent);`,
    `    }`,
    `    #player.mini .player-bottom { display: none; }`,
    `    #player.mini #player-back, #player.mini .player-titles { display: none; }`,
    `    #player.mini .mini-fab { display: flex !important; }`,
    `    .mini-fab {`,
    `      display: none; position: absolute;`,
    `      background: rgba(0,0,0,0.55); border: none; color: #fff; cursor: pointer;`,
    `      align-items: center; justify-content: center;`,
    `      transition: background 0.15s, transform 0.12s;`,
    `    }`,
    `    .mini-fab:hover { background: rgba(255,255,255,0.18); transform: scale(1.1); }`,
    `    #mini-expand { top: 8px; right: 8px; width: 26px; height: 26px; font-size: 12px; border-radius: 6px; }`,
    `    #mini-close  { top: 8px; right: 38px; width: 26px; height: 26px; font-size: 12px; border-radius: 6px; }`,
    `    #mini-toggle { bottom: 12px; right: 12px; width: 42px; height: 42px; font-size: 20px; border-radius: 50%;`,
    `      box-shadow: 0 2px 12px rgba(0,0,0,0.5); background: rgba(0,0,0,0.65); }`,
    ``,
    `    /* Up Next */`,
    `    #up-next {`,
    `      position: absolute; bottom: 0; right: 0; padding: 32px 40px;`,
    `      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%);`,
    `      display: none; flex-direction: column; align-items: flex-end; gap: 10px;`,
    `    }`,
    `    #up-next.on { display: flex; }`,
    `    .un-kicker { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); }`,
    `    .un-title { font-size: 17px; font-weight: 800; color: #fff; max-width: 280px; text-align: right; line-height: 1.2; }`,
    `    .un-bar { width: 168px; height: 3px; background: rgba(255,255,255,0.15); border-radius: 2px; overflow: hidden; }`,
    `    .un-fill { height: 100%; background: var(--paccent, var(--cyan)); border-radius: 2px; width: 100%; transition: width 1s linear; }`,
    `    .un-row { display: flex; gap: 8px; align-items: center; }`,
    `    .un-count { font-size: 22px; font-weight: 800; color: var(--paccent, var(--cyan)); min-width: 30px; text-align: right; }`,
    `    .un-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;`,
    `      font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px;`,
    `      cursor: pointer; transition: background 0.15s; }`,
    `    .un-btn:hover { background: rgba(255,255,255,0.22); }`,
    ``,
    `    /* Share toast */`,
    `    #share-toast {`,
    `      position: fixed; top: 74px; right: 24px; z-index: 700;`,
    `      background: rgba(6,8,18,0.94); backdrop-filter: blur(16px);`,
    `      border: 1px solid rgba(255,255,255,0.12); border-radius: 10px;`,
    `      padding: 11px 20px; font-size: 13px; color: #fff;`,
    `      opacity: 0; transform: translateY(-10px) scale(0.96);`,
    `      transition: all 0.22s cubic-bezier(.16,1,.3,1); pointer-events: none;`,
    `    }`,
    `    #share-toast.on { opacity: 1; transform: translateY(0) scale(1); }`,
    ``,
    `    /* PiP proxy video */`,
    `    #pip-video { position: absolute; width: 2px; height: 2px; opacity: 0.01; pointer-events: none; top: 0; left: 0; }`,
    ``,
    `    /* Reactions in modal */`,
    `    .reaction-strip { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }`,
    `    .rxn-btn {`,
    `      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);`,
    `      border-radius: 20px; padding: 6px 13px;`,
    `      display: inline-flex; align-items: center; gap: 5px;`,
    `      color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;`,
    `      cursor: pointer; transition: all 0.15s;`,
    `    }`,
    `    .rxn-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); color: #fff; }`,
    `    .rxn-btn.on { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.26); color: #fff; }`,
    `    .rxn-count { font-size: 12px; color: rgba(255,255,255,0.42); }`,
    ``,
    `    /* Card hover live-canvas preview */`,
    `    .card-thumb { position: relative; overflow: hidden; }`,
    `    .card-live-cv { position: absolute; inset: 0; width: 100%; height: 100%;`,
    `      opacity: 0; transition: opacity 0.55s; pointer-events: none; }`,
    `    .card:hover .card-live-cv { opacity: 1; }`,
    ``,
    `    /* Speed button label */`,
    `    #ctrl-speed { font-size: 12px; font-weight: 700; padding: 3px 8px; letter-spacing: 0;`,
    `      border-radius: 5px; border: 1px solid rgba(255,255,255,0.14);`,
    `      background: rgba(255,255,255,0.05); transition: all 0.15s; }`,
    `    #ctrl-speed:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); color: #fff; }`,
    ``,
  ].join(N) + N;

dream = patch(
  "nexgen CSS",
  dream,
  `    /* ── MOBILE ── */`,
  nexgenCSS + `    /* ── MOBILE ── */`,
);

// ── B: ENHANCED CTRL-ROW (add skip10, speed, PiP, mini, share) ────────────
const oldCtrlRow = [
  `      <div class="ctrl-row">`,
  `        <button class="ctrl-btn" id="ctrl-prev" title="Previous scene">\u23EE</button>`,
  `        <button class="ctrl-btn xl" id="ctrl-play" title="Play / Pause">\u25B6</button>`,
  `        <button class="ctrl-btn" id="ctrl-next" title="Next scene">\u23ED</button>`,
  `        <div class="ctrl-sp"></div>`,
  `        <span class="scene-badge" id="ctrl-badge">Scene 1</span>`,
  `        <div class="vol-wrap">`,
  `          <button class="ctrl-btn" id="ctrl-vol-btn" style="font-size:18px">\uD83D\uDD0A</button>`,
  `          <input type="range" class="vol-slider" id="vol-slider" min="0" max="1" step="0.05" value="0.7" />`,
  `        </div>`,
  `        <button class="ctrl-btn" id="ctrl-fs" style="font-size:18px" title="Fullscreen">\u26F6</button>`,
  `      </div>`,
].join(N);

const newCtrlRow = [
  `      <div class="ctrl-row">`,
  `        <button class="ctrl-btn xl" id="ctrl-play" title="Play / Pause (Space)">\u25B6</button>`,
  `        <button class="ctrl-btn" id="ctrl-skip-back" style="font-size:18px" title="-10s (J)">\u23EA</button>`,
  `        <button class="ctrl-btn" id="ctrl-skip-fwd" style="font-size:18px" title="+10s (L)">\u23E9</button>`,
  `        <button class="ctrl-btn" id="ctrl-prev" style="font-size:16px" title="Prev Scene (\u2191)">\u23EE</button>`,
  `        <button class="ctrl-btn" id="ctrl-next" style="font-size:16px" title="Next Scene (\u2193)">\u23ED</button>`,
  `        <div class="ctrl-sp"></div>`,
  `        <span class="scene-badge" id="ctrl-badge">Scene 1</span>`,
  `        <div class="vol-wrap">`,
  `          <button class="ctrl-btn" id="ctrl-vol-btn" style="font-size:18px" title="Mute (M)">\uD83D\uDD0A</button>`,
  `          <input type="range" class="vol-slider" id="vol-slider" min="0" max="1" step="0.05" value="0.7" />`,
  `        </div>`,
  `        <div class="speed-wrap">`,
  `          <button class="ctrl-btn" id="ctrl-speed" title="Speed">1\u00D7</button>`,
  `          <div class="speed-popup" id="speed-popup">`,
  `            <button class="spd-opt" data-s="0.5" onclick="setPlaybackSpeed(0.5)">0.5\u00D7</button>`,
  `            <button class="spd-opt" data-s="0.75" onclick="setPlaybackSpeed(0.75)">0.75\u00D7</button>`,
  `            <button class="spd-opt cur" data-s="1" onclick="setPlaybackSpeed(1)">Normal</button>`,
  `            <button class="spd-opt" data-s="1.25" onclick="setPlaybackSpeed(1.25)">1.25\u00D7</button>`,
  `            <button class="spd-opt" data-s="1.5" onclick="setPlaybackSpeed(1.5)">1.5\u00D7</button>`,
  `            <button class="spd-opt" data-s="2" onclick="setPlaybackSpeed(2)">2\u00D7</button>`,
  `          </div>`,
  `        </div>`,
  `        <button class="ctrl-btn" id="ctrl-pip" style="font-size:16px" title="Picture in Picture (P)">\u229D</button>`,
  `        <button class="ctrl-btn" id="ctrl-mini" style="font-size:16px" title="Mini Player (B)">\u229F</button>`,
  `        <button class="ctrl-btn" id="ctrl-share" style="font-size:16px" title="Share">\u2197</button>`,
  `        <button class="ctrl-btn" id="ctrl-fs" style="font-size:18px" title="Fullscreen (F)">\u26F6</button>`,
  `      </div>`,
].join(N);

dream = patch("enhanced ctrl-row", dream, oldCtrlRow, newCtrlRow);

// ── C: UP-NEXT + PiP VIDEO + MINI FABs + SHARE TOAST injected after #player ──
const playerCloseAnchor =
  N + `</div>` + N + N + `<!-- \u2500\u2500 INFO MODAL \u2500\u2500 -->`;

const newPlayerClose = [
  ``,
  `  <!-- \u2500\u2500 UP NEXT \u2500\u2500 -->`,
  `  <div id="up-next">`,
  `    <div class="un-kicker">Up Next</div>`,
  `    <div class="un-title" id="un-title">\u2014</div>`,
  `    <div class="un-bar"><div class="un-fill" id="un-fill"></div></div>`,
  `    <div class="un-row">`,
  `      <span class="un-count" id="un-count">10</span>`,
  `      <button class="un-btn" onclick="jumpUpNext()">Play Now</button>`,
  `      <button class="un-btn" onclick="cancelUpNext()">Cancel</button>`,
  `    </div>`,
  `  </div>`,
  ``,
  `  <!-- PiP video proxy -->`,
  `  <video id="pip-video" playsinline muted loop></video>`,
  ``,
  `  <!-- Mini-player FABs -->`,
  `  <button class="mini-fab" id="mini-expand" title="Expand">\u229D</button>`,
  `  <button class="mini-fab" id="mini-close"  title="Close">\u2715</button>`,
  `  <button class="mini-fab" id="mini-toggle" title="Play/Pause">\u25B6</button>`,
  ``,
  `</div>`,
  ``,
  `<!-- \u2500\u2500 SHARE TOAST \u2500\u2500 -->`,
  `<div id="share-toast">\uD83D\uDD17 Link copied!</div>`,
  ``,
  `<!-- \u2500\u2500 INFO MODAL \u2500\u2500 -->`,
].join(N);

dream = patch(
  "up-next + PiP video + mini FABs",
  dream,
  playerCloseAnchor,
  newPlayerClose,
);

// ── D: REACTION STRIP in modal (after modal-acts div) ─────────────────────
const modalActsEnd = [
  `      <div class="modal-acts">`,
  `        <button class="btn-play" id="modal-play" style="font-size:14px;padding:12px 26px">\u25B6 Play</button>`,
  `        <button class="btn-info" id="modal-list" style="font-size:14px;padding:12px 18px">\uFF0B My List</button>`,
  `      </div>`,
].join(N);

const modalActsWithReactions =
  modalActsEnd +
  N +
  [
    `      <div class="reaction-strip" id="reaction-strip">`,
    `        <button class="rxn-btn" data-rxn="\uD83D\uDD25" onclick="toggleReaction(this)"><span>\uD83D\uDD25</span><span class="rxn-count">0</span></button>`,
    `        <button class="rxn-btn" data-rxn="\uD83E\uDD2F" onclick="toggleReaction(this)"><span>\uD83E\uDD2F</span><span class="rxn-count">0</span></button>`,
    `        <button class="rxn-btn" data-rxn="\u2728" onclick="toggleReaction(this)"><span>\u2728</span><span class="rxn-count">0</span></button>`,
    `        <button class="rxn-btn" data-rxn="\uD83D\uDC99" onclick="toggleReaction(this)"><span>\uD83D\uDC99</span><span class="rxn-count">0</span></button>`,
    `        <button class="rxn-btn" data-rxn="\uD83E\uDE84" onclick="toggleReaction(this)"><span>\uD83E\uDE84</span><span class="rxn-count">0</span></button>`,
    `      </div>`,
  ].join(N);

dream = patch("reaction strip", dream, modalActsEnd, modalActsWithReactions);

// ── E: CARD LIVE CANVAS — add <canvas> element into card-thumb ────────────
const oldCardThumbLine = `    <div class="card-thumb" style="background:\${prog.thumb}">`;
const newCardThumbLine =
  `    <div class="card-thumb" style="background:\${prog.thumb}">` +
  N +
  `      <canvas class="card-live-cv" id="cv-\${prog.id}"></canvas>`;

dream = patch(
  "card live-canvas element",
  dream,
  oldCardThumbLine,
  newCardThumbLine,
);

// ── F: CARD hover listener — start/stop preview on mouseenter/leave ────────
const oldCardClick = `  card.addEventListener('click', () => openPlayer(prog.id, hasProgress ? p.scene : 0));`;
const newCardClick =
  `  card.addEventListener('click', () => openPlayer(prog.id, hasProgress ? p.scene : 0));` +
  N +
  `  card.addEventListener('mouseenter', () => _startCardPreview(prog.id));` +
  N +
  `  card.addEventListener('mouseleave', () => _stopCardPreview(prog.id));`;

dream = patch(
  "card preview hover listeners",
  dream,
  oldCardClick,
  newCardClick,
);

// ── G: SPEED-AWARE startPlayback + Up Next trigger ────────────────────────
const oldStartPlayback = [
  `function startPlayback() {`,
  `  playerPlaying = true;`,
  `  document.getElementById('ctrl-play').textContent = '\u23F8';`,
  `  if (playerTimer) clearInterval(playerTimer);`,
  `  playerTimer = setInterval(() => {`,
  `    if (!playerPlaying || !currentProg) return;`,
  `    playerElapsed += 0.25;`,
  `    const sceneDur = currentProg.scenes[currentScene].dur;`,
  `    if (playerElapsed >= sceneDur) {`,
  `      if (currentScene < currentProg.scenes.length - 1) {`,
  `        jumpToScene(currentScene + 1);`,
  `      } else {`,
  `        // End of programme`,
  `        pausePlayback();`,
  `        saveProgress();`,
  `        toast('Programme complete! Starting over\u2026');`,
  `        setTimeout(() => jumpToScene(0), 1800);`,
  `      }`,
  `      return;`,
  `    }`,
  `    saveProgress();`,
  `    updateTimeline();`,
  `  }, 250);`,
  `}`,
].join(N);

const newStartPlayback = [
  `function startPlayback() {`,
  `  playerPlaying = true;`,
  `  document.getElementById('ctrl-play').textContent = '\u23F8';`,
  `  const mt = document.getElementById('mini-toggle');`,
  `  if (mt) mt.textContent = '\u23F8';`,
  `  if (playerTimer) clearInterval(playerTimer);`,
  `  playerTimer = setInterval(() => {`,
  `    if (!playerPlaying || !currentProg) return;`,
  `    playerElapsed += 0.25 * (window._AIOS_SPD || 1);`,
  `    const sceneDur = currentProg.scenes[currentScene].dur;`,
  `    // Trigger "Up Next" 10 s before scene end (once per scene)`,
  `    const rem = sceneDur - playerElapsed;`,
  `    if (rem <= 10 && rem > 9.74 && currentScene < currentProg.scenes.length - 1) {`,
  `      _showUpNext(currentScene + 1);`,
  `    }`,
  `    if (playerElapsed >= sceneDur) {`,
  `      _dismissUpNext();`,
  `      if (currentScene < currentProg.scenes.length - 1) {`,
  `        jumpToScene(currentScene + 1);`,
  `      } else {`,
  `        // End of programme`,
  `        pausePlayback();`,
  `        saveProgress();`,
  `        toast('Programme complete! Starting over\u2026');`,
  `        setTimeout(() => jumpToScene(0), 1800);`,
  `      }`,
  `      return;`,
  `    }`,
  `    saveProgress();`,
  `    updateTimeline();`,
  `  }, 250);`,
  `}`,
].join(N);

dream = patch(
  "speed-aware startPlayback + upNext",
  dream,
  oldStartPlayback,
  newStartPlayback,
);

// ── H: PAUSE sync mini-toggle ─────────────────────────────────────────────
const oldPause = [
  `function pausePlayback() {`,
  `  playerPlaying = false;`,
  `  document.getElementById('ctrl-play').textContent = '\u25B6';`,
  `  if (playerTimer) { clearInterval(playerTimer); playerTimer = null; }`,
  `}`,
].join(N);

const newPause = [
  `function pausePlayback() {`,
  `  playerPlaying = false;`,
  `  document.getElementById('ctrl-play').textContent = '\u25B6';`,
  `  const mt = document.getElementById('mini-toggle');`,
  `  if (mt) mt.textContent = '\u25B6';`,
  `  if (playerTimer) { clearInterval(playerTimer); playerTimer = null; }`,
  `}`,
].join(N);

dream = patch("pausePlayback mini-toggle sync", dream, oldPause, newPause);

// ── I: ENHANCED KEYBOARD (M mute, P pip, B mini, J/L skip10) ─────────────
const oldKbd = [
  `    case 'f': case 'F': document.getElementById('ctrl-fs').click(); break;`,
  `    case 'Escape': if (!document.fullscreenElement) closePlayer(); break;`,
].join(N);

const newKbd = [
  `    case 'f': case 'F': document.getElementById('ctrl-fs').click(); break;`,
  `    case 'm': case 'M': document.getElementById('ctrl-vol-btn').click(); showPlayerUI(); break;`,
  `    case 'p': case 'P': _togglePiP(); break;`,
  `    case 'b': case 'B': _toggleMiniPlayer(); break;`,
  `    case 'j': case 'J': _skip10(-1); break;`,
  `    case 'l': case 'L': _skip10(1); break;`,
  `    case 'Escape':`,
  `      if (document.getElementById('player').classList.contains('mini')) { _expandMiniPlayer(); }`,
  `      else if (!document.fullscreenElement) closePlayer();`,
  `      break;`,
].join(N);

dream = patch("enhanced keyboard shortcuts", dream, oldKbd, newKbd);

// ── J: WRAP openInfo to load reactions ────────────────────────────────────
const origOpenInfoDecl = `function openInfo(progId, e) {`;
const wrappedOpenInfo =
  `// Wrap openInfo to load reactions` +
  N +
  `const _origOpenInfo = openInfo;` +
  N +
  `openInfo = null; // will be reassigned after base function` +
  N +
  `function openInfo(progId, e) {`;

// Don't double-patch — skip if already wrapped (idempotency guard)
if (dream.includes("_origOpenInfo")) {
  results.push("  — openInfo wrapper already exists (skipped)");
} else {
  // We inject the reaction-loader via a separate bottom-of-script hook instead
  // (safer than wrapping in the middle of the file)
}

// ── K: NEXGEN JS — injected before </script></body></html> ───────────────
const jsAnchor = N + `</script>` + N + `</body>` + N + `</html>`;

const nexgenJS =
  N +
  [
    `// ════════════════════════════════════════════════════════════════════════`,
    `// NEXGEN VIDEO INFRASTRUCTURE`,
    `// ════════════════════════════════════════════════════════════════════════`,
    ``,
    `// ── Playback Speed ──────────────────────────────────────────────────────`,
    `window._AIOS_SPD = 1.0;`,
    `function setPlaybackSpeed(s) {`,
    `  window._AIOS_SPD = s;`,
    `  const lbl = s === 1 ? '1\u00D7' : s + '\u00D7';`,
    `  document.getElementById('ctrl-speed').textContent = lbl;`,
    `  document.querySelectorAll('.spd-opt').forEach(b => {`,
    `    b.classList.toggle('cur', parseFloat(b.dataset.s) === s);`,
    `  });`,
    `  document.getElementById('speed-popup').classList.remove('open');`,
    `  toast('Speed: ' + (s === 1 ? 'Normal' : lbl));`,
    `}`,
    `document.getElementById('ctrl-speed').addEventListener('click', e => {`,
    `  e.stopPropagation();`,
    `  document.getElementById('speed-popup').classList.toggle('open');`,
    `});`,
    `document.addEventListener('click', () =>`,
    `  document.getElementById('speed-popup').classList.remove('open'));`,
    ``,
    `// ── 10-second Skip ──────────────────────────────────────────────────────`,
    `function _skip10(dir) {`,
    `  if (!currentProg) return;`,
    `  const dur = currentProg.scenes[currentScene].dur;`,
    `  playerElapsed = Math.max(0, Math.min(dur - 0.5, playerElapsed + dir * 10));`,
    `  updateTimeline();`,
    `  toast(dir > 0 ? '\u23E9 +10s' : '\u23EA \u221210s');`,
    `  showPlayerUI();`,
    `}`,
    `document.getElementById('ctrl-skip-back').addEventListener('click', () => _skip10(-1));`,
    `document.getElementById('ctrl-skip-fwd').addEventListener('click',  () => _skip10(1));`,
    ``,
    `// ── Picture in Picture ──────────────────────────────────────────────────`,
    `function _togglePiP() {`,
    `  if (document.pictureInPictureElement) {`,
    `    document.exitPictureInPicture().catch(() => {});`,
    `    return;`,
    `  }`,
    `  const canvas = document.getElementById('player-canvas');`,
    `  if (!canvas || !canvas.captureStream) { toast('PiP not supported here'); return; }`,
    `  const vid = document.getElementById('pip-video');`,
    `  const stream = canvas.captureStream(30);`,
    `  vid.srcObject = stream;`,
    `  vid.play()`,
    `    .then(() => vid.requestPictureInPicture())`,
    `    .catch(() => toast('PiP blocked by browser'));`,
    `  toast('\u229D Now in Picture-in-Picture');`,
    `}`,
    `document.getElementById('ctrl-pip').addEventListener('click', _togglePiP);`,
    `document.addEventListener('leavepictureinpicture', () => {`,
    `  const v = document.getElementById('pip-video');`,
    `  if (v && v.srcObject) { v.srcObject.getTracks().forEach(t => t.stop()); v.srcObject = null; }`,
    `});`,
    ``,
    `// ── Mini Player ─────────────────────────────────────────────────────────`,
    `function _toggleMiniPlayer() {`,
    `  document.getElementById('player').classList.contains('mini')`,
    `    ? _expandMiniPlayer() : _activateMiniPlayer();`,
    `}`,
    `function _activateMiniPlayer() {`,
    `  const el = document.getElementById('player');`,
    `  el.classList.add('mini');`,
    `  document.body.style.overflow = '';`,
    `  el._miniClick = (e) => {`,
    `    if (e.target.classList.contains('mini-fab')) return;`,
    `    _expandMiniPlayer();`,
    `  };`,
    `  el.addEventListener('click', el._miniClick);`,
    `}`,
    `function _expandMiniPlayer() {`,
    `  const el = document.getElementById('player');`,
    `  el.classList.remove('mini');`,
    `  document.body.style.overflow = 'hidden';`,
    `  if (el._miniClick) { el.removeEventListener('click', el._miniClick); el._miniClick = null; }`,
    `}`,
    `document.getElementById('ctrl-mini').addEventListener('click', e => { e.stopPropagation(); _toggleMiniPlayer(); });`,
    `document.getElementById('mini-expand').addEventListener('click', e => { e.stopPropagation(); _expandMiniPlayer(); });`,
    `document.getElementById('mini-close').addEventListener('click', e => { e.stopPropagation(); closePlayer(); });`,
    `document.getElementById('mini-toggle').addEventListener('click', e => { e.stopPropagation(); togglePlay(); });`,
    ``,
    `// ── Up Next ─────────────────────────────────────────────────────────────`,
    `let _unTimer = null, _unActive = false, _unNextIdx = -1;`,
    `function _showUpNext(nextIdx) {`,
    `  if (_unActive || !currentProg) return;`,
    `  const scene = currentProg.scenes[nextIdx];`,
    `  if (!scene) return;`,
    `  _unActive = true; _unNextIdx = nextIdx;`,
    `  document.getElementById('un-title').textContent = scene.title;`,
    `  document.getElementById('up-next').classList.add('on');`,
    `  let t = 10;`,
    `  const fill = document.getElementById('un-fill');`,
    `  const count = document.getElementById('un-count');`,
    `  fill.style.width = '100%';`,
    `  count.textContent = t;`,
    `  if (_unTimer) clearInterval(_unTimer);`,
    `  _unTimer = setInterval(() => {`,
    `    t--;`,
    `    count.textContent = Math.max(0, t);`,
    `    fill.style.width = (t * 10) + '%';`,
    `    if (t <= 0) { clearInterval(_unTimer); _unTimer = null; }`,
    `  }, 1000);`,
    `}`,
    `function _dismissUpNext() {`,
    `  if (_unTimer) { clearInterval(_unTimer); _unTimer = null; }`,
    `  _unActive = false; _unNextIdx = -1;`,
    `  document.getElementById('up-next').classList.remove('on');`,
    `}`,
    `function jumpUpNext() {`,
    `  const idx = _unNextIdx;`,
    `  _dismissUpNext();`,
    `  if (idx >= 0) jumpToScene(idx);`,
    `}`,
    `function cancelUpNext() {`,
    `  _dismissUpNext();`,
    `  pausePlayback();`,
    `  toast('Auto-advance cancelled');`,
    `}`,
    ``,
    `// ── Share Deeplink ───────────────────────────────────────────────────────`,
    `function _sharePlayer() {`,
    `  if (!currentProg) return;`,
    `  const url = location.origin + '/aiosdream#' + currentProg.id + ':' + currentScene;`,
    `  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())`,
    `    .then(() => {`,
    `      const t = document.getElementById('share-toast');`,
    `      t.classList.add('on');`,
    `      setTimeout(() => t.classList.remove('on'), 2400);`,
    `    })`,
    `    .catch(() => toast('\uD83D\uDD17 ' + url));`,
    `}`,
    `document.getElementById('ctrl-share').addEventListener('click', _sharePlayer);`,
    ``,
    `// ── Reactions ────────────────────────────────────────────────────────────`,
    `let _rxnData = {};`,
    `try { _rxnData = JSON.parse(localStorage.getItem('aios_reactions') || '{}'); } catch(_) {}`,
    `function toggleReaction(btn) {`,
    `  const progId = (typeof modalProg !== 'undefined' && modalProg)`,
    `    ? modalProg.id : (currentProg ? currentProg.id : null);`,
    `  if (!progId) return;`,
    `  if (!_rxnData[progId]) _rxnData[progId] = {};`,
    `  const rxn = btn.dataset.rxn;`,
    `  const wasOn = btn.classList.contains('on');`,
    `  btn.classList.toggle('on', !wasOn);`,
    `  _rxnData[progId][rxn] = Math.max(0, (_rxnData[progId][rxn] || 0) + (wasOn ? -1 : 1));`,
    `  const cEl = btn.querySelector('.rxn-count');`,
    `  if (cEl) cEl.textContent = _rxnData[progId][rxn];`,
    `  try { localStorage.setItem('aios_reactions', JSON.stringify(_rxnData)); } catch(_) {}`,
    `}`,
    `function _loadReactions(progId) {`,
    `  const d = _rxnData[progId] || {};`,
    `  document.querySelectorAll('.rxn-btn').forEach(btn => {`,
    `    const rxn = btn.dataset.rxn;`,
    `    const n = d[rxn] || 0;`,
    `    btn.classList.toggle('on', n > 0);`,
    `    const cEl = btn.querySelector('.rxn-count');`,
    `    if (cEl) cEl.textContent = n;`,
    `  });`,
    `}`,
    `// Hook into openInfo to load reactions`,
    `(function() {`,
    `  const _baseOpenInfo = openInfo;`,
    `  openInfo = function(progId, e) {`,
    `    _baseOpenInfo(progId, e);`,
    `    setTimeout(() => _loadReactions(progId), 60);`,
    `  };`,
    `})();`,
    ``,
    `// ── Card Live-Canvas Preview ─────────────────────────────────────────────`,
    `let _previewActive = {};`,
    `function _startCardPreview(progId) {`,
    `  const canvas = document.getElementById('cv-' + progId);`,
    `  if (!canvas || _previewActive[progId]) return;`,
    `  // Don't steal from active player or hero renderer`,
    `  if (currentProg && currentProg.id === progId) return;`,
    `  if (window._activePlayerRenderer === RENDERERS[progId]) return;`,
    `  if (heroRenderer === RENDERERS[progId]) return;`,
    `  canvas.width  = canvas.offsetWidth  || 220;`,
    `  canvas.height = canvas.offsetHeight || 120;`,
    `  const renderer = RENDERERS[progId];`,
    `  if (!renderer) return;`,
    `  _previewActive[progId] = true;`,
    `  renderer.start(canvas, 0);`,
    `}`,
    `function _stopCardPreview(progId) {`,
    `  if (!_previewActive[progId]) return;`,
    `  _previewActive[progId] = false;`,
    `  const renderer = RENDERERS[progId];`,
    `  if (renderer) { try { renderer.stop(); } catch(_) {} }`,
    `}`,
    ``,
    `// ── Deep-link handler on load ────────────────────────────────────────────`,
    `(function _deepLink() {`,
    `  const hash = location.hash.slice(1);`,
    `  if (!hash) return;`,
    `  const [progId, sceneStr] = hash.split(':');`,
    `  const prog = CATALOGUE.find(p => p.id === progId);`,
    `  if (prog) setTimeout(() => openPlayer(progId, parseInt(sceneStr) || 0), 500);`,
    `})();`,
  ].join(N);

dream = patch("nexgen JS block", dream, jsAnchor, nexgenJS + jsAnchor);

// Write Theatre
fs.writeFileSync("public/aiosdream.html", dream, "utf8");
console.log(`  \u2192 aiosdream.html: ${dream.length} bytes`);

// ══════════════════════════════════════════════════════════════════════════════
// [2] vr-hub.html — AIOSOCULIS NEXGEN XR HUB
// ══════════════════════════════════════════════════════════════════════════════
console.log("[2] vr-hub.html…");
let hub = fs.readFileSync("public/vr-hub.html", "utf8");
const HN = hub.includes("\r\n") ? "\r\n" : "\n";

// ── A: XR HUB CSS additions ───────────────────────────────────────────────
const xrCSS =
  [
    `      /* ══════════════════════════════════════════════════`,
    `         NEXGEN XR HUB — Live Counters · Enter VR · Previews`,
    `      ══════════════════════════════════════════════════ */`,
    ``,
    `      /* Live online count badge */`,
    `      .online-badge {`,
    `        display: inline-flex; align-items: center; gap: 5px;`,
    `        background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2);`,
    `        border-radius: 20px; padding: 4px 11px;`,
    `        font-size: 0.78rem; font-weight: 600; color: var(--cyan);`,
    `        margin-left: auto;`,
    `      }`,
    `      .online-dot {`,
    `        width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);`,
    `        animation: live-pulse 1.8s ease-in-out infinite;`,
    `      }`,
    `      @keyframes live-pulse {`,
    `        0%, 100% { opacity: 1; transform: scale(1); }`,
    `        50% { opacity: 0.4; transform: scale(0.7); }`,
    `      }`,
    ``,
    `      /* XP card visit-progress dots */`,
    `      .xp-visit-bar {`,
    `        height: 2px; border-radius: 1px;`,
    `        background: rgba(255,255,255,0.1); overflow: hidden; margin-top: 6px;`,
    `      }`,
    `      .xp-visit-fill { height: 100%; background: var(--accent); border-radius: 1px; }`,
    ``,
    `      /* Entering VR overlay */`,
    `      #enter-vr-overlay {`,
    `        position: fixed; inset: 0; z-index: 9999;`,
    `        background: #000; display: none; align-items: center; justify-content: center;`,
    `        flex-direction: column; gap: 1.5rem;`,
    `      }`,
    `      #enter-vr-overlay.on { display: flex; }`,
    `      .evr-ring {`,
    `        width: 120px; height: 120px; border-radius: 50%;`,
    `        border: 3px solid rgba(0,212,255,0.2);`,
    `        border-top-color: var(--cyan);`,
    `        animation: spin 1.2s linear infinite;`,
    `        position: relative;`,
    `      }`,
    `      .evr-ring::after {`,
    `        content: '\uD83E\uDD7D'; font-size: 2.5rem;`,
    `        position: absolute; top: 50%; left: 50%;`,
    `        transform: translate(-50%, -50%);`,
    `        animation: spin-cancel 1.2s linear infinite;`,
    `      }`,
    `      @keyframes spin { to { transform: rotate(360deg); } }`,
    `      @keyframes spin-cancel { to { transform: translate(-50%,-50%) rotate(-360deg); } }`,
    `      .evr-label { font-size: 1.1rem; font-weight: 700; color: var(--cyan); letter-spacing: 0.05em; }`,
    `      .evr-sub { font-size: 0.85rem; color: var(--muted); }`,
    ``,
    `      /* Stat bar animated numbers */`,
    `      .stat-num { font-variant-numeric: tabular-nums; }`,
    ``,
    `      /* XP card canvas mini-preview */`,
    `      .xp-thumb { position: relative; overflow: hidden; }`,
    `      .xp-preview-cv {`,
    `        position: absolute; inset: 0; width: 100%; height: 100%;`,
    `        opacity: 0; transition: opacity 0.5s; pointer-events: none;`,
    `      }`,
    `      .xp-card:hover .xp-preview-cv { opacity: 1; }`,
    ``,
    `      /* Section header live indicator */`,
    `      .section-live-count {`,
    `        font-size: 0.78rem; color: var(--muted); margin-left: 0.6rem;`,
    `        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);`,
    `        padding: 2px 10px; border-radius: 12px;`,
    `      }`,
    ``,
  ].join(HN) + HN;

// Insert before </style>
const styleCloseAnchor = `    </style>`;
const hubStyleClose = hub.indexOf(styleCloseAnchor);
if (hubStyleClose === -1) {
  results.push("  \u2717 MISSING (xr hub CSS — no </style> found)");
} else {
  hub = hub.slice(0, hubStyleClose) + xrCSS + hub.slice(hubStyleClose);
  results.push("  \u2713 xr hub CSS");
}

// ── B: ENTERING VR OVERLAY HTML (before </body>) ──────────────────────────
const hubBodyClose = `  </body>` + HN + `</html>`;
const enterVROverlay = [
  `  <!-- ── ENTERING VR OVERLAY ── -->`,
  `  <div id="enter-vr-overlay">`,
  `    <div class="evr-ring"></div>`,
  `    <div class="evr-label" id="evr-label">Entering VR…</div>`,
  `    <div class="evr-sub" id="evr-sub">Launching world — put on your headset</div>`,
  `  </div>`,
  ``,
].join(HN);

hub = patch(
  "entering VR overlay HTML",
  hub,
  hubBodyClose,
  enterVROverlay + hubBodyClose,
);

// ── C: XR HUB JS (injected at the end, before closing </script>) ──────────
// Find the last </script> in the body
const lastScriptClose = hub.lastIndexOf(`    </script>`);
if (lastScriptClose === -1) {
  results.push("  \u2717 MISSING (xr hub JS anchor — no </script>)");
} else {
  const xrJS = [
    ``,
    `      // ══════════════════════════════════════════════════════════════════`,
    `      // NEXGEN XR HUB INFRASTRUCTURE`,
    `      // ══════════════════════════════════════════════════════════════════`,
    ``,
    `      // ── Stat-bar count-up animation ─────────────────────────────────`,
    `      (function animateStats() {`,
    `        const stats = [`,
    `          { el: document.querySelector('.stat-num'), target: 39, suffix: '' },`,
    `        ];`,
    `        document.querySelectorAll('.stat-num').forEach((el, i) => {`,
    `          const target = parseInt(el.textContent) || 0;`,
    `          if (!target) return;`,
    `          let cur = 0;`,
    `          const step = Math.ceil(target / 40);`,
    `          const timer = setInterval(() => {`,
    `            cur = Math.min(cur + step, target);`,
    `            el.textContent = cur + (el.dataset.suffix || '');`,
    `            if (cur >= target) clearInterval(timer);`,
    `          }, 28);`,
    `        });`,
    `      })();`,
    ``,
    `      // ── Live-user count simulation ───────────────────────────────────`,
    `      var _liveBase = {`,
    `        cinema: 142, enterprise: 88, lab: 217, arcade: 334,`,
    `        wellness: 176, social: 265, creator: 54, education: 123, art: 97`,
    `      };`,
    `      var _liveNow = Object.assign({}, _liveBase);`,
    `      function _updateLiveCounts() {`,
    `        Object.keys(_liveNow).forEach(k => {`,
    `          const delta = Math.floor(Math.random() * 9) - 4;`,
    `          _liveNow[k] = Math.max(10, _liveBase[k] + delta * 3);`,
    `          const el = document.getElementById('live-' + k);`,
    `          if (el) el.textContent = _liveNow[k].toLocaleString();`,
    `        });`,
    `      }`,
    `      // Inject live badge into each section header`,
    `      (function injectLiveBadges() {`,
    `        const cats = ['cinema','enterprise','lab','arcade','wellness','social','creator','education','art'];`,
    `        cats.forEach(cat => {`,
    `          const sec = document.getElementById(cat);`,
    `          if (!sec) return;`,
    `          const hdr = sec.querySelector('.section-header');`,
    `          if (!hdr) return;`,
    `          const badge = document.createElement('div');`,
    `          badge.className = 'online-badge';`,
    `          badge.innerHTML = '<span class="online-dot"></span><span id="live-' + cat + '">' + (_liveNow[cat] || 0) + '</span> online';`,
    `          hdr.appendChild(badge);`,
    `        });`,
    `        _updateLiveCounts();`,
    `        setInterval(_updateLiveCounts, 4200);`,
    `      })();`,
    ``,
    `      // ── Entering VR transition ───────────────────────────────────────`,
    `      function enterVRWorld(url, name) {`,
    `        const ov = document.getElementById('enter-vr-overlay');`,
    `        const lbl = document.getElementById('evr-label');`,
    `        const sub = document.getElementById('evr-sub');`,
    `        lbl.textContent = 'Entering ' + (name || 'VR') + '\u2026';`,
    `        sub.textContent = 'Launching world \u2014 put on your headset';`,
    `        ov.classList.add('on');`,
    `        // Haptic on mobile`,
    `        if (navigator.vibrate) navigator.vibrate([40, 60, 80]);`,
    `        setTimeout(() => {`,
    `          window.location.href = url;`,
    `        }, 1400);`,
    `        // Fallback dismiss`,
    `        setTimeout(() => ov.classList.remove('on'), 5000);`,
    `      }`,
    `      // Intercept all VR enter links`,
    `      document.addEventListener('click', function(e) {`,
    `        const a = e.target.closest('a[href^="/vr"]');`,
    `        if (!a) return;`,
    `        const card = a.closest('[data-xp-id]');`,
    `        const name = card ? (card.querySelector('.xp-name') || card.querySelector('.well-title'))`,
    `          ?.textContent?.trim() : null;`,
    `        if (a.href && a.href.includes('/vr')) {`,
    `          e.preventDefault();`,
    `          enterVRWorld(a.href, name);`,
    `        }`,
    `      });`,
    ``,
    `      // ── XP Visit tracking ────────────────────────────────────────────`,
    `      var _xpVisits = {};`,
    `      try { _xpVisits = JSON.parse(localStorage.getItem('aios_xp_visits') || '{}'); } catch(_) {}`,
    `      function trackXPVisit(xpId) {`,
    `        _xpVisits[xpId] = (_xpVisits[xpId] || 0) + 1;`,
    `        try { localStorage.setItem('aios_xp_visits', JSON.stringify(_xpVisits)); } catch(_) {}`,
    `      }`,
    `      // Add visit bars to cards that have been visited`,
    `      (function showVisitProgress() {`,
    `        Object.keys(_xpVisits).forEach(id => {`,
    `          const card = document.querySelector('[data-xp-id="' + id + '"]');`,
    `          if (!card) return;`,
    `          const body = card.querySelector('.xp-body');`,
    `          if (!body || body.querySelector('.xp-visit-bar')) return;`,
    `          const visits = _xpVisits[id];`,
    `          const pct = Math.min(100, visits * 20); // 5 visits = 100%`,
    `          const bar = document.createElement('div');`,
    `          bar.className = 'xp-visit-bar';`,
    `          bar.innerHTML = '<div class="xp-visit-fill" style="width:' + pct + '%"></div>';`,
    `          body.appendChild(bar);`,
    `        });`,
    `      })();`,
    `      // Track visits when entering VR`,
    `      const _baseEnterVR = enterVRWorld;`,
    `      enterVRWorld = function(url, name) {`,
    `        const m = url.match(/prog=([^&]+)/);`,
    `        if (m) trackXPVisit(m[1]);`,
    `        _baseEnterVR(url, name);`,
    `      };`,
    ``,
    `      // ── XP Card canvas mini-preview ──────────────────────────────────`,
    `      var _xpCanvasActive = {};`,
    `      function _getXpColor(card) {`,
    `        return getComputedStyle(card).getPropertyValue('--accent').trim() || '#00d4ff';`,
    `      }`,
    `      function _startXpPreview(card) {`,
    `        const cv = card.querySelector('.xp-preview-cv');`,
    `        if (!cv || _xpCanvasActive[cv]) return;`,
    `        _xpCanvasActive[cv] = true;`,
    `        cv.width  = cv.offsetWidth  || 160;`,
    `        cv.height = cv.offsetHeight || 100;`,
    `        const ctx = cv.getContext('2d');`,
    `        const color = _getXpColor(card);`,
    `        let t = 0, raf;`,
    `        const W = cv.width, H = cv.height, cx = W/2, cy = H/2;`,
    `        const pts = Array.from({length: 60}, () => ({`,
    `          x: Math.random() * W, y: Math.random() * H,`,
    `          vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2,`,
    `          r: Math.random() * 1.8 + 0.5, a: Math.random()`,
    `        }));`,
    `        const loop = () => {`,
    `          if (!_xpCanvasActive[cv]) return;`,
    `          ctx.fillStyle = 'rgba(0,0,0,0.18)';`,
    `          ctx.fillRect(0, 0, W, H);`,
    `          pts.forEach(p => {`,
    `            p.x += p.vx; p.y += p.vy;`,
    `            if (p.x < 0 || p.x > W) p.vx *= -1;`,
    `            if (p.y < 0 || p.y > H) p.vy *= -1;`,
    `            const pulse = 0.5 + 0.5 * Math.sin(t * 0.04 + p.a * 6);`,
    `            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);`,
    `            ctx.fillStyle = color.replace(')', ',' + (pulse * 0.8) + ')').replace('rgb', 'rgba');`,
    `            ctx.fill();`,
    `          });`,
    `          // Central glow`,
    `          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W,H) * 0.4);`,
    `          g.addColorStop(0, color.replace('rgb(','rgba(').replace(')',',0.12)') || 'rgba(0,212,255,0.12)');`,
    `          g.addColorStop(1, 'transparent');`,
    `          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);`,
    `          t++;`,
    `          raf = requestAnimationFrame(loop);`,
    `          cv._raf = raf;`,
    `        };`,
    `        loop();`,
    `      }`,
    `      function _stopXpPreview(card) {`,
    `        const cv = card.querySelector('.xp-preview-cv');`,
    `        if (!cv) return;`,
    `        _xpCanvasActive[cv] = false;`,
    `        if (cv._raf) cancelAnimationFrame(cv._raf);`,
    `      }`,
    `      // Inject canvas into every xp-thumb + attach hover`,
    `      (function attachXpPreviews() {`,
    `        document.querySelectorAll('.xp-card, .well-card').forEach(card => {`,
    `          const thumb = card.querySelector('.xp-thumb, .well-card');`,
    `          if (!thumb || thumb.querySelector('.xp-preview-cv')) return;`,
    `          const cv = document.createElement('canvas');`,
    `          cv.className = 'xp-preview-cv';`,
    `          thumb.style.position = 'relative';`,
    `          thumb.appendChild(cv);`,
    `          card.addEventListener('mouseenter', () => _startXpPreview(card));`,
    `          card.addEventListener('mouseleave', () => _stopXpPreview(card));`,
    `        });`,
    `      })();`,
    ``,
  ].join(HN);

  hub = hub.slice(0, lastScriptClose) + xrJS + hub.slice(lastScriptClose);
  results.push("  \u2713 xr hub nexgen JS");
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
