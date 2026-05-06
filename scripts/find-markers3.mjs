import { readFileSync, writeFileSync } from "fs";

const file =
  "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
let lines = readFileSync(file, "utf-8").split("\n");
const orig = lines.length;

// Find 0-indexed line numbers for key anchors
const geoCommentIdx = lines.findIndex((l) => l.includes(".GEO vs MP4")); // comment line
const philoSecIdx = lines.findIndex((l) => l.includes('class="philosophy"')); // <section class="philosophy">
const devCommentIdx = lines.findIndex((l) => l.includes("BUILD FOR AIOS")); // comment line
const footerCommentIdx = lines.findIndex((l) =>
  l.includes("<!-- -- FOOTER --"),
); // footer comment

console.log({ geoCommentIdx, philoSecIdx, devCommentIdx, footerCommentIdx });

// We remove:
// Block 1: geoCommentIdx to philoSecIdx-3  (blank + comment before philosophy)
//   keep: ...lines up to geo comment... then philosophy comment + section
// Block 2: devCommentIdx-1 to footerCommentIdx-1 (blank before dev through blank before footer)
//   keep: ...lines up to blank before dev... then footer comment + footer

// Build new array — do from bottom to avoid index shifts
// Remove block 2 first (higher indices)
const b2Start = devCommentIdx - 1; // the blank line before BUILD FOR AIOS comment
const b2End = footerCommentIdx - 1; // the blank line before FOOTER comment
// Remove block 1
const b1Start = geoCommentIdx; // the geo comment itself (the blank before it stays)
const b1End = philoSecIdx - 3; // blank + PHILOSOPHY comment = 2 lines before the section, so philoSecIdx - 3 is the blank after slides </section>

console.log({ b1Start, b1End, b2Start, b2End });
console.log("Lines to remove block 1:", b1End - b1Start + 1);
console.log("Lines to remove block 2:", b2End - b2Start + 1);

// Verify: show what's at the boundaries
console.log("b1Start line:", JSON.stringify(lines[b1Start]));
console.log("b1End line:", JSON.stringify(lines[b1End]));
console.log("After b1End:", JSON.stringify(lines[b1End + 1]));
console.log("b2Start line:", JSON.stringify(lines[b2Start]));
console.log("b2End line:", JSON.stringify(lines[b2End]));
console.log("After b2End:", JSON.stringify(lines[b2End + 1]));
