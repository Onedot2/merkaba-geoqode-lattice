import fs from "fs";
const dream = fs.readFileSync("public/aiosdream.html", "utf8");
const hub = fs.readFileSync("public/vr-hub.html", "utf8");

const c = (label, ok) => console.log("  " + (ok ? "✓" : "✗") + " " + label);

console.log("Theatre (aiosdream.html):");
c("AV CSS block", dream.includes("#player-canvas-fade"));
c("crossfade canvas HTML", dream.includes('id="player-canvas-fade"'));
c("vignette div", dream.includes('id="player-vignette"'));
c("grain canvas", dream.includes('id="player-grain"'));
c("colour overlay", dream.includes('id="player-colour-overlay"'));
c("quality badge", dream.includes('id="player-quality"'));
c("spectrum canvas HTML", dream.includes('id="spectrum-cv"'));
c("_analyserNode declared", dream.includes("_analyserNode = null"));
c("createAnalyser present", dream.includes("createAnalyser"));
c("createConvolver (reverb)", dream.includes("createConvolver"));
c("createStereoPanner", dream.includes("createStereoPanner"));
c(
  "crossfadeScene in jumpToScene",
  dream.includes(
    "_crossfadeScene(); // capture frame before renderer switches",
  ),
);
c("_crossfadeScene function", dream.includes("function _crossfadeScene()"));
c("_startSpectrum function", dream.includes("function _startSpectrum()"));
c("_stopSpectrum function", dream.includes("function _stopSpectrum()"));
c("_PROG_GRADE defined", dream.includes("_PROG_GRADE"));
c("_PROG_PAN defined", dream.includes("_PROG_PAN"));
c("_applyColourGrade", dream.includes("function _applyColourGrade"));
c("initGrain (film grain rAF)", dream.includes("initGrain"));
c("openPlayer hook + spectrum", dream.includes("_startSpectrum()"));
c("closePlayer hook + cleanup", dream.includes("_stopSpectrum()"));
c("mini duck hook", dream.includes("_baseMini"));
c("peak hold dots in spectrum", dream.includes("_specPeak"));
c("grain 20fps interval", dream.includes("setInterval(drawGrain, 50)"));

console.log("\nAIOSOculus (vr-hub.html):");
c("hover freq CSS glow", hub.includes("text-shadow: 0 0 10px"));
c("enter-vr playing class CSS", hub.includes(".playing .evr-ring"));
c("_xpACtx declared", hub.includes("_xpACtx"));
c("_xpHoverTone function", hub.includes("function _xpHoverTone"));
c("PHI sweep in hover tone", hub.includes("1.618"));
c("attachXpHoverAudio", hub.includes("attachXpHoverAudio"));
c("_playVrSting function", hub.includes("function _playVrSting"));
c("72Hz HOLOGRAPHIC base sting", hub.includes("setValueAtTime(72"));
c("528Hz ACTION click", hub.includes("528"));
c("enterVRWorld sting hook", hub.includes("_prevEnter"));

const allOk = [
  dream.includes("#player-canvas-fade"),
  dream.includes("createAnalyser"),
  dream.includes("createConvolver"),
  dream.includes("_crossfadeScene"),
  dream.includes("_startSpectrum"),
  hub.includes("_xpHoverTone"),
  hub.includes("_playVrSting"),
].every(Boolean);

console.log("\n" + (allOk ? "✅ ALL CRITICAL CHECKS PASS" : "❌ ISSUES FOUND"));
console.log("Theatre size:", dream.length, "bytes");
console.log("Hub size:", hub.length, "bytes");
