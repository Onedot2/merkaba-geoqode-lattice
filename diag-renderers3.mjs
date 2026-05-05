import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");
const lines = f.split("\n");

// Hyperspace: show lines 1100-1160
console.log("=== HYPERSPACE lines 1100-1160 ===");
lines
  .slice(1095, 1160)
  .forEach((l, i) => console.log(1095 + i, JSON.stringify(l)));

// Neural: show lines 1190-1260
console.log("\n=== NEURAL lines 1190-1260 ===");
lines
  .slice(1190, 1260)
  .forEach((l, i) => console.log(1190 + i, JSON.stringify(l)));
