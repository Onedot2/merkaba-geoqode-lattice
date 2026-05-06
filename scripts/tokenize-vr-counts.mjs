import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "public");
const files = readdirSync(dir).filter((f) => f.endsWith(".html"));

// Order matters — more specific patterns first
const replacements = [
  // Title/meta tag patterns (very specific)
  [/AIOS VR Hub — 23 Live/g, "AIOS VR Hub — __VR_LIVE__ Live"],
  [/AIOS VR — 23 Live/g, "AIOS VR — __VR_LIVE__ Live"],
  [/23 live WebXR experiences/g, "__VR_LIVE__ live WebXR experiences"],
  [/23 live immersive worlds/g, "__VR_LIVE__ live immersive worlds"],
  [/23 Live WebXR Ex/g, "__VR_LIVE__ Live WebXR Ex"],
  [/23 Live Immersive/g, "__VR_LIVE__ Live Immersive"],
  // Body content patterns
  [/\b23 live now\b/g, "__VR_LIVE__ live now"],
  [/\b23 VR\b/g, "__VR_LIVE__ VR"],
  [/>23 Live Now</g, ">__VR_LIVE__ Live Now<"],
  [/>All 23 Live XP</g, ">All __VR_LIVE__ Live XP<"],
  [/All 23 VR/g, "All __VR_LIVE__ VR"],
  [/of the 23 live/g, "of the __VR_LIVE__ live"],
  [/All 23 VR/g, "All __VR_LIVE__ VR"],
  [/\b23 live WebXR\b/g, "__VR_LIVE__ live WebXR"],
  [/>✓ 23 Live Now</g, ">✓ __VR_LIVE__ Live Now<"],
  // 25 patterns
  [/\b25 VR Worlds\b/g, "__VR_LIVE__ VR Worlds"],
  [/>25 live →</g, ">__VR_LIVE__ live →<"],
  [/>25 live now\.</g, ">__VR_LIVE__ live now.<"],
  [/25 live now\b/g, "__VR_LIVE__ live now"],
  [/\b25 VR\b/g, "__VR_LIVE__ VR"],
  [/4 free browser games, 25 VR/g, "4 free browser games, __VR_LIVE__ VR"],
  [
    /4 free browser games, explo.*?25 VR/g,
    (m) => m.replace("25 VR", "__VR_LIVE__ VR"),
  ],
  [/🥽 25 VR world/g, "🥽 __VR_LIVE__ VR world"],
  [
    /👾 4 games.*?🥽 25 VR worlds/g,
    (m) => m.replace("25 VR worlds", "__VR_LIVE__ VR worlds"),
  ],
  // Ticker/badge patterns
  [/25 VR worlds/g, "__VR_LIVE__ VR worlds"],
  // 48 total patterns
  [/48 WebXR experiences/g, "__VR_TOTAL__ WebXR experiences"],
  [/48 catalogued/g, "__VR_TOTAL__ catalogued"],
  [/50 XP AVAILABLE/g, "__VR_TOTAL__ XP AVAILABLE"],
  [/50\+ XP AVAILABLE/g, "__VR_TOTAL__+ XP AVAILABLE"],
];

let totalChanges = 0;
for (const file of files) {
  const p = join(dir, file);
  let c = readFileSync(p, "utf-8");
  const orig = c;
  for (const [pat, rep] of replacements) {
    c = c.replace(pat, rep);
  }
  if (c !== orig) {
    writeFileSync(p, c, "utf-8");
    const count = (c.match(/__VR_LIVE__|__VR_TOTAL__/g) || []).length;
    console.log(`${file}: ${count} tokens`);
    totalChanges++;
  }
}
console.log(`Done. Files changed: ${totalChanges}`);
