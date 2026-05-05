import fs from "fs";
const dream = fs.readFileSync("public/aiosdream.html", "utf8");
const hub = fs.readFileSync("public/vr-hub.html", "utf8");
const studio = fs.readFileSync("public/aios-studio.html", "utf8");

const checks = [
  // Bloom
  ["bloom CSS", dream.includes("#player-bloom-cv")],
  ["bloom HTML", dream.includes('<canvas id="player-bloom-cv">')],
  ["scanlines div", dream.includes('<div id="player-scanlines">')],
  ["bloom JS engine", dream.includes("initBloom()")],
  ["bloom rAF loop", dream.includes("bloomLoop(now)")],
  ["bloom offscreen", dream.includes("_bloomOff = document.createElement")],
  // Renderer upgrades
  ["matrix head glow", dream.includes("ctx.shadowBlur = 12")],
  [
    "merkaba face fills",
    dream.includes("[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(([fa"),
  ],
  [
    "hyperspace glow",
    dream.includes("ctx.shadowColor = `rgba(180,200,255,0.7)`"),
  ],
  ["chronos spiral", dream.includes("'rgba(251,191,36,0.14)'")],
  ["chronos tip glow", dream.includes("ctx.shadowBlur = 16")],
  [
    "neural gradient",
    dream.includes("createLinearGradient(a.x, a.y, b.x, b.y)"),
  ],
  // Renderer wrappers in appended JS
  ["phoenix wrapper", dream.includes("enhancePhoenix()")],
  ["ocean wrapper", dream.includes("enhanceOcean()")],
  ["ember sparks", dream.includes("hot white")],
  // Studio page
  ["studio format", studio.includes("aios-geo-v1")],
  ["studio agents", studio.includes("QuantumDirector")],
  ["studio canvas", studio.includes("preview-canvas")],
  ["studio download", studio.includes("downloadGeo")],
  ["studio swarm", studio.includes("AIOSProducerSwarm")],
  ["studio geoqode", studio.includes("architectureSignature")],
  ["studio phi", studio.includes("const PHI = 1.618")],
  // Prev AV engine still intact
  ["spectrum still", dream.includes("_startSpectrum()")],
  ["crossfade still", dream.includes("_crossfadeScene()")],
  ["grain still", dream.includes("initGrain()")],
  ["colour grade", dream.includes("_applyColourGrade")],
  // Hub still intact
  ["vr-hub xp tones", hub.includes("_xpHoverTone(")],
  ["vr-hub sting", hub.includes("_playVrSting()")],
];

let pass = 0,
  fail = 0;
console.log("\nnexgen-renderers verify — ALL CHECKS");
console.log("═".repeat(50));
checks.forEach(([label, ok]) => {
  console.log((ok ? "  ✓" : "  ✗") + "  " + label);
  ok ? pass++ : fail++;
});
console.log("─".repeat(50));
console.log(`  ${pass}/${checks.length} passed`);
console.log(`  aiosdream.html : ${dream.length} bytes`);
console.log(`  vr-hub.html    : ${hub.length} bytes`);
console.log(`  aios-studio.html: ${studio.length} bytes\n`);
process.exit(fail > 0 ? 1 : 0);
