import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");

// --- Merkaba: show the whole color + TET_E region with exact chars ---
const mi = f.indexOf("const color = flip ? '#00e5ff'");
if (mi !== -1) {
  const chunk = f.slice(mi, mi + 400);
  console.log("=== MERKABA exact ===");
  // Show with pipe-separated lines to see indentation clearly
  chunk
    .replace(/\r\n/g, "↵\n")
    .replace(/\n/g, "→\n")
    .split("\n")
    .forEach((l, i) => console.log(i, JSON.stringify(l)));
}

// --- Hyperspace: find star lineWidth ---
const lines = f.split("\n");
lines.forEach((l, i) => {
  if (l.includes("lineWidth") && i > 1090 && i < 1160) {
    console.log("\nHYPER lineWidth line", i, ":", JSON.stringify(l));
  }
  if (l.includes("strokeStyle") && l.includes("s.c[") && i > 1090 && i < 1160) {
    console.log("HYPER strokeStyle line", i, ":", JSON.stringify(l));
  }
});

// --- Neural: find the connection drawing code ---
lines.forEach((l, i) => {
  if (
    (l.includes("strokeStyle") || l.includes("lineWidth")) &&
    i > 1180 &&
    i < 1260
  ) {
    console.log("\nNEURAL line", i, ":", JSON.stringify(l));
  }
  if (l.includes("connect") && i > 1180 && i < 1260) {
    console.log("NEURAL connect line", i, ":", JSON.stringify(l));
  }
});
