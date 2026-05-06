import { readFileSync, writeFileSync } from "fs";

const file =
  "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
const c = readFileSync(file, "utf-8");
const lines = c.split("\n");
console.log("Total lines:", lines.length);

// Show context around key boundaries using id anchors
const geoLine = lines.findIndex((l) => l.includes('id="geo-vs-mp4"'));
console.log("geo-vs-mp4 section at line:", geoLine + 1);
// Show 2 lines before (will include the comment marker)
console.log(
  "Context:",
  JSON.stringify(lines.slice(geoLine - 3, geoLine + 1).join("\n")),
);

const philoLine = lines.findIndex((l) => l.includes('class="philosophy"'));
console.log("philosophy section at line:", philoLine + 1);
console.log(
  "Context:",
  JSON.stringify(lines.slice(philoLine - 3, philoLine + 1).join("\n")),
);

const devLine = lines.findIndex((l) => l.includes('class="dev-section"'));
console.log("dev-section at line:", devLine + 1);
console.log(
  "Context:",
  JSON.stringify(lines.slice(devLine - 3, devLine + 1).join("\n")),
);

const footerLine = lines.findIndex((l) => l.includes("<footer>"));
console.log("footer at line:", footerLine + 1);
console.log(
  "Context:",
  JSON.stringify(lines.slice(footerLine - 3, footerLine + 1).join("\n")),
);
