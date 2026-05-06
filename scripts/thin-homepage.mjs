import { readFileSync, writeFileSync } from "fs";

const file =
  "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
let lines = readFileSync(file, "utf-8").split("\n");
const orig = lines.length;

const geoCommentIdx = lines.findIndex((l) => l.includes(".GEO vs MP4"));
const philoSecIdx = lines.findIndex((l) => l.includes('class="philosophy"'));
const devCommentIdx = lines.findIndex((l) => l.includes("BUILD FOR AIOS"));
const footerCommentIdx = lines.findIndex((l) =>
  l.includes("<!-- -- FOOTER --"),
);

const b1Start = geoCommentIdx;
const b1End = philoSecIdx - 3; // last line of slides </section>
const b2Start = devCommentIdx - 1; // blank line before dev comment
const b2End = footerCommentIdx - 1; // blank line before footer comment

// Remove from bottom to avoid index shifts
// Block 2 (higher indices first)
lines.splice(b2Start, b2End - b2Start + 1);
// Block 1
lines.splice(b1Start, b1End - b1Start + 1);

// Update footer link if present
const footerGamesIdx = lines.findIndex((l) => l.includes("/aios-playground"));
if (footerGamesIdx >= 0) {
  lines[footerGamesIdx] = lines[footerGamesIdx].replace(
    '<a href="/aios-playground">🎮 NEXGEN</a>',
    '<a href="/games">🎮 Games</a>',
  );
  console.log("Footer link updated at line", footerGamesIdx + 1);
}

writeFileSync(file, lines.join("\n"), "utf-8");
console.log(
  `Done: ${orig} → ${lines.length} lines (removed ${orig - lines.length})`,
);
