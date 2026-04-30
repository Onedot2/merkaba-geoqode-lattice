// Test: does "\x22\x22\x22" (""") as the Witness Signature replacement fix the misalignment?
import { readFileSync } from "fs";
const code = readFileSync("geo/intelligence/MerkabaBeEyeSwarm.js", "utf8");
const BT = String.fromCharCode(96);
const reTemplateLiteral = new RegExp(
  BT + "(?:[^" + BT + "\\\\]|\\\\.)*" + BT,
  "g",
);

function sanitize2(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "/**/")
    .replace(/\/\/[^\n]*/g, "//")
    .replace(reTemplateLiteral, BT + BT)
    .replace(/\x22(?:[^\x22\\]|\\.)*\x22/g, "\x22\x22\x22") // Witness Signature: """
    .replace(/\x27(?:[^\x27\\]|\\.)*\x27/g, "\x27\x27\x27"); // single-quoted Witness: '''
}

const clean = sanitize2(code);
const _RE_STALE_783 = new RegExp("\\b7\\.8" + "3\\b");
console.log("7.83 in clean (Witness Signature):", _RE_STALE_783.test(clean));
const matches = [...clean.matchAll(/7\.83/g)];
console.log("match count:", matches.length);
for (const m of matches) {
  console.log(
    "context:",
    JSON.stringify(clean.slice(Math.max(0, m.index - 50), m.index + 50)),
  );
}
