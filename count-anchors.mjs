import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const NL = "\r\n";

// Count occurrences of player-close anchor
const anchor =
  NL + "</div>" + NL + NL + "<!-- \u2500\u2500 INFO MODAL \u2500\u2500 -->";
let count = 0,
  idx = -1;
while ((idx = f.indexOf(anchor, idx + 1)) !== -1) {
  count++;
  console.log(
    "Found at index:",
    idx,
    "  context:",
    JSON.stringify(f.slice(idx - 40, idx + 60)),
  );
}
console.log("Total occurrences:", count);
