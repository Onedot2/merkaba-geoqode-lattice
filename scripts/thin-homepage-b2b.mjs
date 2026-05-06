import { readFileSync, writeFileSync } from "fs";

const file =
  "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
let c = readFileSync(file, "utf-8");

// Remove B2B block 1: .GEO vs MP4 section through end of COMPARISON SLIDES
// Spans from the geo-vs-mp4 comment up to (but not including) the PHILOSOPHY comment
const start1 =
  "\n    <!-- ── .GEO vs MP4 — THE FORMAT WAR ──────────────────────────────────── -->";
const end1 = "\n    <!-- -- PHILOSOPHY -->";
const i1 = c.indexOf(start1);
const i2 = c.indexOf(end1);
if (i1 >= 0 && i2 > i1) {
  c = c.slice(0, i1) + c.slice(i2);
  console.log(`Removed B2B block 1 (geo-vs-mp4 → slides): ${i2 - i1} chars`);
} else {
  console.log(`WARNING: Block 1 not found (i1=${i1}, i2=${i2})`);
  console.log("Searching for partial match...");
  const idx = c.indexOf("geo-vs-mp4");
  console.log(
    "geo-vs-mp4 at:",
    idx,
    "|",
    c.slice(Math.max(0, idx - 5), idx + 20),
  );
}

// Remove B2B block 2: DEV SECTION (Build for AIOS)
const start2 = "\n    <!-- -- BUILD FOR AIOS -->";
const end2 = "\n    <!-- -- FOOTER -->";
const i3 = c.indexOf(start2);
const i4 = c.indexOf(end2);
if (i3 >= 0 && i4 > i3) {
  c = c.slice(0, i3) + c.slice(i4);
  console.log(`Removed B2B block 2 (dev section): ${i4 - i3} chars`);
} else {
  console.log(`WARNING: Block 2 not found (i3=${i3}, i4=${i4})`);
}

// Update footer: /aios-playground -> /games
const oldFooter = '<a href="/aios-playground">🎮 NEXGEN</a>';
const newFooter = '<a href="/games">🎮 Games</a>';
if (c.includes(oldFooter)) {
  c = c.replace(oldFooter, newFooter);
  console.log("Updated footer nav link");
} else {
  console.log("Footer link not found (may already be updated)");
}

writeFileSync(file, c, "utf-8");
console.log(`Done. Lines: ${c.split("\n").length}`);
