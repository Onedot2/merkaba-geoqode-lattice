import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);

// Find getRenderer function
const grLine = lines.findIndex((l) => l.includes("function getRenderer"));
console.log(`getRenderer at line ${grLine + 1}`);
lines
  .slice(grLine, grLine + 200)
  .forEach((l, i) => console.log(`${grLine + i + 1}: ${l}`));
