import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split(/\r?\n/);
// Get lines 1466-1680
lines.slice(1466, 1680).forEach((l, i) => console.log(`${1467 + i}: ${l}`));
