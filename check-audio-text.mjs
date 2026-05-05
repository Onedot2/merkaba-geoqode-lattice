import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);
// Find lines around audioCtx var block
const audioLine = lines.findIndex((l) => l.includes("var _audioCtx = null"));
console.log("audioCtx at line:", audioLine + 1);
// Print 10 lines around it
lines.slice(audioLine, audioLine + 10).forEach((l, i) => {
  console.log(`${audioLine + i + 1}: ${JSON.stringify(l)}`);
});

console.log("\n--- _ensureAudio ---");
const ensureLine = lines.findIndex((l) =>
  l.includes("function _ensureAudio()"),
);
console.log("_ensureAudio at line:", ensureLine + 1);
lines.slice(ensureLine, ensureLine + 12).forEach((l, i) => {
  console.log(`${ensureLine + i + 1}: ${JSON.stringify(l)}`);
});
