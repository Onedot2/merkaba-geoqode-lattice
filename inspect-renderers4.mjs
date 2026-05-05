import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);

const rLine = lines.findIndex((l) =>
  l.match(/^(const|var|let)\s+RENDERERS\s*=/),
);
// Print lines 1223 to end of RENDERERS (find closing };)
let depth = 0,
  started = false,
  endLine = rLine;
for (let i = rLine; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes("{")) depth += (l.match(/\{/g) || []).length;
  if (l.includes("}")) depth -= (l.match(/\}/g) || []).length;
  if (i === rLine) {
    started = true;
  }
  if (started && depth === 0) {
    endLine = i;
    break;
  }
}
console.log(`RENDERERS closes at line ${endLine + 1}`);
// Print from 1220 to end
lines
  .slice(1220, endLine + 2)
  .forEach((l, i) => console.log(`${1221 + i}: ${l}`));
