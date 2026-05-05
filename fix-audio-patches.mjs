/**
 * fix-audio-patches.mjs
 * Apply the 2 missed patches using correct LF line endings
 * for the audio engine section (which was written with LF, not CRLF).
 */
import fs from "fs";

let f = fs.readFileSync("public/aiosdream.html", "utf8");

// ── 1. Add _analyserNode var declaration (LF section) ────────────────────────
const v1 = `var _audioCtx = null;\nvar _masterGain = null;\nvar _ambientNodes = [];`;
const v2 = `var _audioCtx = null;\nvar _masterGain = null;\nvar _analyserNode = null;\nvar _ambientNodes = [];`;

if (f.indexOf(v1) !== -1) {
  f = f.replace(v1, v2);
  console.log("✓ _analyserNode var declaration");
} else if (f.includes("_analyserNode = null;")) {
  console.log("— var already present (skipped)");
} else {
  console.log("✗ var block not found");
  process.exit(1);
}

// ── 2. Upgrade _ensureAudio (LF section) ─────────────────────────────────────
const oldEnsure = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  _masterGain.connect(_audioCtx.destination);`,
  `}`,
].join("\n");

const newEnsure = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  // Analyser (FFT for real-time spectrum visualizer)`,
  `  _analyserNode = _audioCtx.createAnalyser();`,
  `  _analyserNode.fftSize = 256;`,
  `  _analyserNode.smoothingTimeConstant = 0.86;`,
  `  _analyserNode.connect(_audioCtx.destination);`,
  `  // Convolver reverb — cinematic spatial depth`,
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
  `  // Stereo panner — per-programme spatial position`,
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
].join("\n");

if (f.includes("createAnalyser")) {
  console.log("— _ensureAudio already upgraded (skipped)");
} else if (f.indexOf(oldEnsure) !== -1) {
  f = f.replace(oldEnsure, newEnsure);
  console.log("✓ _ensureAudio spatial chain upgraded");
} else {
  console.log("✗ _ensureAudio not found");
  // Try to find what's there
  const idx = f.indexOf("function _ensureAudio");
  if (idx !== -1) {
    console.log(
      "  Found at:",
      idx,
      "— raw:",
      JSON.stringify(f.slice(idx, idx + 160)),
    );
  }
  process.exit(1);
}

fs.writeFileSync("public/aiosdream.html", f, "utf8");
console.log(`\n✅ Done — aiosdream.html: ${f.length} bytes`);
console.log("createAnalyser in file:", f.includes("createAnalyser"));
console.log(
  "_analyserNode = null in file:",
  f.includes("_analyserNode = null"),
);
