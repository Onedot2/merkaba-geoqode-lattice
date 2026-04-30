import { readFileSync } from "fs";
const code = readFileSync("geo/intelligence/MerkabaBeEyeSwarm.js", "utf8");
const BT = String.fromCharCode(96);
const reTemplateLiteral = new RegExp(
  BT + "(?:[^" + BT + "\\\\]|\\\\.)*" + BT,
  "g",
);

let s = code;
s = s.replace(/\/\*[\s\S]*?\*\//g, "/**/");
s = s.replace(/\/\/[^\n]*/g, "//");
s = s.replace(reTemplateLiteral, BT + BT);

// How many double-quote matches are there?
const dqMatches = [...s.matchAll(/\x22(?:[^\x22\\]|\\.)*\x22/g)];
console.log("Total double-quote matches:", dqMatches.length);

// Find which match covers position 7183
const idx783 = s.indexOf("7.83");
console.log("7.83 at index:", idx783);

// Find the closest double-quote match
for (const m of dqMatches) {
  if (m.index > idx783 - 200 && m.index < idx783 + 200) {
    console.log("nearby match:", m.index, JSON.stringify(m[0].slice(0, 50)));
  }
}

// Try the replacement on just a small slice
const slice = s.slice(idx783 - 100, idx783 + 200);
console.log("slice before:", JSON.stringify(slice));
const sliceReplaced = slice.replace(/\x22(?:[^\x22\\]|\\.)*\x22/g, "\x22\x22");
console.log("slice after:", JSON.stringify(sliceReplaced));
