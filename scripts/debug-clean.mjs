import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const BESX_PATH = path.join(
  __dir,
  "..",
  "geo",
  "intelligence",
  "MerkabaBeEyeSwarm.js",
);
const raw = await readFile(BESX_PATH, "utf8");

// Replicate sanitize() from BESX exactly
const BT = String.fromCharCode(96);
const reTemplateLiteral = new RegExp(
  BT + "(?:[^" + BT + "\\\\]|\\\\.)*" + BT,
  "g",
);

let clean = raw;
clean = clean.replace(/\/\*[\s\S]*?\*\//g, "/**/"); // block comments
clean = clean.replace(/\/\/[^\n]*/g, "//"); // line comments
clean = clean.replace(reTemplateLiteral, BT + BT); // template literals
clean = clean.replace(/\x22(?:[^\x22\\]|\\.)*\x22/g, "\x22\x22"); // double-quoted
clean = clean.replace(/\x27(?:[^\x27\\]|\\.)*\x27/g, "\x27\x27"); // single-quoted

// Test the three failing patterns
const RE_HOLO_432 = new RegExp("holographic\\s*[=:]\\s*4" + "32\\b", "i");
const RE_STALE_432 = new RegExp("\\b4" + "32\\b");
const RE_FEDERATION = new RegExp("s4ai-" + "federation-v1");

function findContext(text, pattern, label) {
  const m = text.match(pattern);
  if (!m) {
    console.log(`${label}: NO MATCH`);
    return;
  }
  const idx = text.indexOf(m[0]);
  // Get lines around the match
  const linesBefore = text.slice(0, idx).split("\n");
  const lineNum = linesBefore.length;
  const context = text
    .slice(Math.max(0, idx - 80), idx + m[0].length + 80)
    .replace(/\n/g, "↵");
  console.log(`${label}: MATCHED "${m[0]}" at line ${lineNum}`);
  console.log(`  context: ...${context}...`);
}

findContext(clean, RE_HOLO_432, "holographic:432");
findContext(clean, RE_STALE_432, "\\b432\\b");
findContext(clean, RE_FEDERATION, "federation-v1");

// Also check raw code for federation-v1 (for snippet)
const fedInRaw = raw.match(new RegExp(".{0,40}s4ai-" + "federation-v1.{0,40}"));
if (fedInRaw)
  console.log("\nfederation-v1 in raw:", JSON.stringify(fedInRaw[0]));
