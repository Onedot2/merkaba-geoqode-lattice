import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);
const targets = [
  "function jumpToScene",
  "function startAmbientAudio",
  "function stopAmbientAudio",
  "function startRenderer",
  "function openPlayer",
  "function closePlayer",
  "masterGain",
  "player-canvas",
  "function updateTimeline",
  "RENDERERS[",
  "audioCtx",
  "function startPlayback",
  'class="player-top"',
  "ctrl-fs",
  "function togglePlay",
  "function openInfo",
];
targets.forEach((t) => {
  const idx = lines.findIndex((l) => l.includes(t));
  if (idx !== -1) console.log(`${idx + 1}\t${t}`);
  else console.log(`---\tNOT FOUND: ${t}`);
});
console.log("\nTotal lines:", lines.length);
console.log("File size:", f.length);
