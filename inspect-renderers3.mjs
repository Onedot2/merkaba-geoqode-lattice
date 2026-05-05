import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);

// Find RENDERERS = {
const rLine = lines.findIndex((l) =>
  l.match(/^(const|var|let)\s+RENDERERS\s*=/),
);
console.log(`RENDERERS at line ${rLine + 1}`);
// Print 300 lines from there
lines
  .slice(rLine, rLine + 300)
  .forEach((l, i) => console.log(`${rLine + i + 1}: ${l}`));
