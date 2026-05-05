/**
 * nexgen-renderers-fix.mjs
 * Fix the 3 missed patches from nexgen-renderers.mjs
 */
import fs from "fs";

let dream = fs.readFileSync("public/aiosdream.html", "utf8");
const results = [];
let passed = 0,
  failed = 0;

function patch(label, search, replace) {
  let idx = dream.indexOf(search);
  let usedSearch = search;
  if (idx === -1) {
    const alt = search.includes("\r\n")
      ? search.replace(/\r\n/g, "\n")
      : search.replace(/\n/g, "\r\n");
    idx = dream.indexOf(alt);
    if (idx !== -1) usedSearch = alt;
  }
  if (idx === -1) {
    results.push(`  ✗ MISS  [${label}]`);
    failed++;
    return;
  }
  dream = dream.slice(0, idx) + replace + dream.slice(idx + usedSearch.length);
  results.push(`  ✓ OK    [${label}]`);
  passed++;
}

// ── FIX 1: Merkaba face fills (correct 10-space indentation + CRLF) ──────────
patch(
  "merkaba-face-fills",
  `          const color = flip ? '#00e5ff' : '#f5a623';\r\n          TET_E.forEach(([a, b]) => {`,
  `          const color = flip ? '#00e5ff' : '#f5a623';\r\n          // Translucent face fills for 3D depth\r\n          [[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(([fa,fb,fc]) => {\r\n            ctx.beginPath();\r\n            ctx.moveTo(pts[fa][0], pts[fa][1]);\r\n            ctx.lineTo(pts[fb][0], pts[fb][1]);\r\n            ctx.lineTo(pts[fc][0], pts[fc][1]);\r\n            ctx.closePath();\r\n            ctx.fillStyle = flip ? 'rgba(0,229,255,0.05)' : 'rgba(245,166,35,0.05)';\r\n            ctx.fill();\r\n          });\r\n          TET_E.forEach(([a, b]) => {`,
);

// ── FIX 2: Hyperspace streak glow (correct dist-based code) ──────────────────
patch(
  "hyperspace-streak-glow",
  `          ctx.lineWidth = s.dist * 2.5 * spd;\r\n          ctx.beginPath();`,
  `          ctx.shadowBlur = s.dist > 0.5 ? 8 : 0;\r\n          ctx.shadowColor = \`rgba(180,200,255,0.7)\`;\r\n          ctx.lineWidth = s.dist * 3.0 * spd;\r\n          ctx.beginPath();`,
);

// ── FIX 3: Neural gradient connections ───────────────────────────────────────
// Replace the static non-firing strokeStyle with a gradient for energy visualisation
patch(
  "neural-gradient-edges",
  `            const alpha = (1 - dist / connDist) * 0.25;\r\n            const firing = a.firing || b.firing;\r\n            ctx.strokeStyle = firing`,
  `            const alpha = (1 - dist / connDist) * 0.25;\r\n            const firing = a.firing || b.firing;\r\n            if (!firing) {\r\n              const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);\r\n              grad.addColorStop(0, \`rgba(0,229,255,\${alpha})\`);\r\n              grad.addColorStop(0.5, \`rgba(124,58,237,\${alpha * 1.5})\`);\r\n              grad.addColorStop(1, \`rgba(0,229,255,\${alpha})\`);\r\n              ctx.strokeStyle = grad;\r\n              ctx.lineWidth = 0.9;\r\n              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();\r\n            }\r\n            if (firing) ctx.strokeStyle = firing`,
);

// Write
fs.writeFileSync("public/aiosdream.html", dream, "utf8");

console.log("\nnexgen-renderers-fix.mjs — RESULTS");
console.log("═".repeat(50));
results.forEach((r) => console.log(r));
console.log("─".repeat(50));
console.log(`  Total: ${passed} passed, ${failed} failed`);
console.log(`  aiosdream.html: ${dream.length} bytes\n`);
process.exit(failed > 0 ? 1 : 0);
