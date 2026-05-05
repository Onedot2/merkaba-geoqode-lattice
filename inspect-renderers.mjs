import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);

// Find all _drawScene / renderer functions
const targets = [
  "_drawScene",
  "startRenderer",
  "function startRenderer",
  "PROG_COLOURS",
  "SCENE_DATA",
  "currentRenderer",
  "function render",
  "ctx.fillRect",
  "ctx.beginPath",
  "particles",
  "clearRect",
];

targets.forEach((t) => {
  const idx = lines.findIndex((l) => l.includes(t));
  if (idx !== -1)
    console.log(`"${t}" at line ${idx + 1}: ${lines[idx].trim().slice(0, 80)}`);
});

// Show 60 lines from startRenderer
const srLine = lines.findIndex((l) => l.includes("function startRenderer"));
console.log(
  `\n\n=== startRenderer context (lines ${srLine + 1}-${srLine + 60}) ===`,
);
lines
  .slice(srLine, srLine + 60)
  .forEach((l, i) => console.log(`${srLine + i + 1}: ${l}`));
