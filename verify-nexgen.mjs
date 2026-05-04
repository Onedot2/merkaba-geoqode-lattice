import fs from "fs";

// Theatre
const dream = fs.readFileSync("public/aiosdream.html", "utf8");
const checks_dream = [
  ["speed popup", dream.includes("speed-popup")],
  ["ctrl-skip-back", dream.includes("ctrl-skip-back")],
  ["ctrl-speed", dream.includes("ctrl-speed")],
  ["ctrl-pip", dream.includes("ctrl-pip")],
  ["ctrl-mini", dream.includes("ctrl-mini")],
  ["ctrl-share", dream.includes("ctrl-share")],
  ["up-next div", dream.includes('id="up-next"')],
  ["pip-video", dream.includes("pip-video")],
  ["mini-expand", dream.includes("mini-expand")],
  ["share-toast", dream.includes("share-toast")],
  ["reaction-strip", dream.includes("reaction-strip")],
  ["card-live-cv", dream.includes("card-live-cv")],
  ["_startCardPreview", dream.includes("_startCardPreview")],
  ["setPlaybackSpeed", dream.includes("setPlaybackSpeed")],
  ["_togglePiP", dream.includes("_togglePiP")],
  ["_toggleMiniPlayer", dream.includes("_toggleMiniPlayer")],
  ["_showUpNext", dream.includes("_showUpNext")],
  ["_sharePlayer", dream.includes("_sharePlayer")],
  ["deep-link handler", dream.includes("_deepLink")],
  ["window._AIOS_SPD", dream.includes("_AIOS_SPD")],
  ["speed-aware tick", dream.includes("0.25 * (window._AIOS_SPD || 1)")],
];
console.log("Theatre (aiosdream.html):");
checks_dream.forEach(([k, v]) => console.log("  " + (v ? "✓" : "✗") + " " + k));

// AIOSOculus
const hub = fs.readFileSync("public/vr-hub.html", "utf8");
const checks_hub = [
  ["online-badge CSS", hub.includes("online-badge")],
  ["enter-vr-overlay", hub.includes("enter-vr-overlay")],
  ["evr-ring", hub.includes("evr-ring")],
  ["xp-preview-cv", hub.includes("xp-preview-cv")],
  ["xp-visit-bar", hub.includes("xp-visit-bar")],
  ["_liveBase", hub.includes("_liveBase")],
  ["_updateLiveCounts", hub.includes("_updateLiveCounts")],
  ["enterVRWorld", hub.includes("enterVRWorld")],
  ["attachXpPreviews", hub.includes("attachXpPreviews")],
  ["_startXpPreview", hub.includes("_startXpPreview")],
  ["stat-num", hub.includes("stat-num")],
];
console.log("\nAIOSOculus (vr-hub.html):");
checks_hub.forEach(([k, v]) => console.log("  " + (v ? "✓" : "✗") + " " + k));

const allOk = [...checks_dream, ...checks_hub].every(([, v]) => v);
console.log("\n" + (allOk ? "✅ ALL GOOD" : "❌ SOME MISSING"));
