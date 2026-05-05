import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const NL = f.includes("\r\n") ? "\r\n" : "\n";
console.log("File NL type:", NL === "\r\n" ? "CRLF" : "LF");
console.log("File size:", f.length);

// Check var block raw match
const search1 = `var _audioCtx = null;${NL}var _masterGain = null;${NL}var _ambientNodes = [];`;
console.log("\nvar block search (CRLF):", f.indexOf(search1) !== -1);

const search1b = `var _audioCtx = null;\nvar _masterGain = null;\nvar _ambientNodes = [];`;
console.log("var block search (LF):", f.indexOf(search1b) !== -1);

// Check _ensureAudio raw match
const search2 = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  _masterGain.connect(_audioCtx.destination);`,
  `}`,
].join(NL);
console.log("\n_ensureAudio search (CRLF):", f.indexOf(search2) !== -1);

const search2b = [
  `function _ensureAudio() {`,
  `  if (_audioCtx) return;`,
  `  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();`,
  `  _masterGain = _audioCtx.createGain();`,
  `  _masterGain.gain.value = 0;`,
  `  _masterGain.connect(_audioCtx.destination);`,
  `}`,
].join("\n");
console.log("_ensureAudio search (LF):", f.indexOf(search2b) !== -1);

// Check if _ensureAudio was already upgraded
console.log("\n_analyserNode already in file:", f.includes("_analyserNode"));
console.log("createAnalyser in file:", f.includes("createAnalyser"));
console.log(
  "_analyserNode = null in file:",
  f.includes("_analyserNode = null"),
);

// Print raw bytes around audioCtx line
const idx = f.indexOf("var _audioCtx = null;");
console.log("\nRaw bytes -2..+60 from audioCtx:");
console.log(JSON.stringify(f.slice(Math.max(0, idx - 2), idx + 80)));
