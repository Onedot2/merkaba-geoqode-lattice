import { readFileSync } from "fs";
const code = readFileSync("geo/intelligence/MerkabaBeEyeSwarm.js", "utf8");

// Step by step sanitize
let s = code;
s = s.replace(/\/\*[\s\S]*?\*\//g, "/**/");
s = s.replace(/\/\/[^\n]*/g, "//");

// Check if 7.83 present after comment strip
const matches = [...s.matchAll(/7\.83/g)];
console.log("After comment strip, 7.83 count:", matches.length);
for (const m of matches) {
  console.log(
    "at:",
    m.index,
    JSON.stringify(s.slice(Math.max(0, m.index - 40), m.index + 60)),
  );
}
