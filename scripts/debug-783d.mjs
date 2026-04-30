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
// Check if 7.83 present after template literal strip
const afterTemplate = [...s.matchAll(/7\.83/g)];
console.log("After template literal strip, 7.83 count:", afterTemplate.length);
for (const m of afterTemplate) {
  console.log(
    "ctx:",
    JSON.stringify(s.slice(Math.max(0, m.index - 40), m.index + 60)),
  );
}
s = s.replace(/\x22(?:[^\x22\\]|\\.)*\x22/g, "\x22\x22");
const afterDouble = [...s.matchAll(/7\.83/g)];
console.log("After double-quote strip, 7.83 count:", afterDouble.length);
for (const m of afterDouble) {
  console.log(
    "ctx:",
    JSON.stringify(s.slice(Math.max(0, m.index - 40), m.index + 60)),
  );
}
