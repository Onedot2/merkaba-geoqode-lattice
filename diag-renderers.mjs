import fs from "fs";
const f = fs.readFileSync("public/aiosdream.html", "utf8");

// --- Merkaba ---
const mi = f.indexOf("TET_E.forEach(([a, b])");
console.log("=== MERKABA context ===");
console.log(JSON.stringify(f.slice(Math.max(0, mi - 200), mi + 20)));

// --- Hyperspace ---
const hi = f.indexOf("s.z * 0.003");
console.log("\n=== HYPERSPACE not found:", hi);
const hi2 = f.indexOf("ctx.lineWidth = s.z");
console.log("lineWidth s.z found at:", hi2);
if (hi2 !== -1) console.log(JSON.stringify(f.slice(hi2 - 120, hi2 + 60)));

// --- Neural ---
const ni = f.indexOf("edgeAlpha");
console.log("\n=== NEURAL edgeAlpha ===");
if (ni !== -1) console.log(JSON.stringify(f.slice(ni - 80, ni + 120)));
else console.log("NOT FOUND");
