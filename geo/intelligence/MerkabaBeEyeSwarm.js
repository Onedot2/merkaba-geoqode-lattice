/**
 * MerkabaBeEyeSwarm — Lattice-Native Diagnostic Intelligence
 *
 * An 8-drone autonomous swarm that sees the entire Merkaba ecosystem as ONE
 * living organism. Each drone maps to a QUEEN-BEE sector, holding its
 * semantic frequency and diagnostic domain. Together they form a compound eye
 * that spans every layer of the 8→26→48:480 canonical lattice.
 *
 * FIRST PRINCIPLE: To diagnose or optimize something, you must first know
 * WHAT that something IS in the lattice topology. The swarm always identifies
 * before it diagnoses. It always diagnoses before it optimizes.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  QUEEN-BEE → DRONE MAP                                                  │
 * │  S1 QuantumArch    PHYSICS     852Hz  FOUNDATION — canonical constants  │
 * │  S2 CodeEng        ACTION      528Hz  FOUNDATION — code pattern laws    │
 * │  S3 SystemsDesign  NARRATIVE   963Hz  FOUNDATION — architecture arcs    │
 * │  S4 DataStructs    ENTITY      396Hz  FOUNDATION — data model identity  │
 * │  S5 SelfEvolve     HOLOGRAPHIC  72Hz  BOSONIC    — lattice self-ref     │
 * │  S6 PainRemoval    EMOTION     741Hz  BOSONIC    — bug + drift hunting  │
 * │  S7 PerfForge      ACTION      528Hz  BOSONIC    — harmonic expansion   │
 * │  S8 SecurityForge  PHYSICS     852Hz  CANONICAL  — auth + isolation     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Usage:
 *   import { MerkabaBeEyeSwarm } from "./MerkabaBeEyeSwarm.js";
 *   const swarm = new MerkabaBeEyeSwarm();
 *   const report = await swarm.sweep(sourceCode, { file, service, domain });
 *   const id     = swarm.identify(sourceCode, context);
 *
 * @module MerkabaBeEyeSwarm
 * @alignment 8→26→48:480
 */

import {
  CANONICAL_ARCHITECTURE,
  BASE_FREQUENCY_HZ,
  PHI,
  PSI,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  assertCanonicalArchitectureSignature,
} from "../lattice/transform-420.js";
import { MERKABA_SEMANTIC_TYPES, SEMANTIC_FREQUENCY_MAP } from "./merkaba-llm.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── Canonical ground truth ───────────────────────────────────────────────────

/** Canonical pulse interval for MerkabaHandshake (PHI × 56s temporal cycle) */
const CANONICAL_PULSE_MS = Math.round(56_000 * PHI); // 90,608ms

/** Canonical semantic type canonical band formula string (for documentation) */
const CANONICAL_BAND_FORMULA = "bandStart = Math.floor(latticeNode) * 10";

/** Known cross-repo import red flags (path segments that span containers) */
const CROSS_REPO_SEGMENTS = [
  "pwai-api-service",
  "pwai-controller",
  "pwai-ai-worker",
  "pwai-frontend",
  "merkaba-geoqode-lattice",
  "Merkaba48OS",
  "s4ai-core",
  "storm-dev",
];

// ─── Identity context hints ───────────────────────────────────────────────────
// Maps file/path keywords → canonical identity (semanticType, domain, ring)

const IDENTITY_HINTS = [
  { pattern: /cinema|theatre|projector|embedder|virtualiz/i, semanticType: "NARRATIVE", domain: "systems-design", ring: "CANONICAL" },
  { pattern: /auth|scrypt|jwt|token|credential|security/i,  semanticType: "PHYSICS",   domain: "security-forge", ring: "CANONICAL" },
  { pattern: /diagnostics|resonance|coherence|diagnostic/i, semanticType: "PHYSICS",   domain: "quantum-arch",   ring: "FOUNDATION" },
  { pattern: /lattice|geoqode|geo-qode|transform-420/i,     semanticType: "HOLOGRAPHIC", domain: "self-evolve",  ring: "BOSONIC" },
  { pattern: /handshake|mesh|pulse|federation|discovery/i,  semanticType: "DIALOGUE",  domain: "systems-design", ring: "BOSONIC" },
  { pattern: /transform|engine|registry|executor/i,         semanticType: "ACTION",    domain: "code-eng",       ring: "FOUNDATION" },
  { pattern: /consciousness|emotion|sentience|compassion/i, semanticType: "EMOTION",   domain: "pain-removal",   ring: "BOSONIC" },
  { pattern: /revenue|stripe|billing|payment/i,             semanticType: "ACTION",    domain: "perf-forge",     ring: "BOSONIC" },
  { pattern: /quantum|reasoning|vqe|grover|annealing/i,     semanticType: "PHYSICS",   domain: "quantum-arch",   ring: "FOUNDATION" },
  { pattern: /memetic|evolution|meme|mutation/i,            semanticType: "ENTITY",    domain: "data-structs",   ring: "FOUNDATION" },
  { pattern: /meta.*reason|self.*improv|ambition/i,         semanticType: "NARRATIVE", domain: "self-evolve",    ring: "BOSONIC" },
  { pattern: /knowledge|mlm|learning|brain/i,               semanticType: "ENTITY",    domain: "data-structs",   ring: "FOUNDATION" },
  { pattern: /heal|recovery|self.heal|error.aware/i,        semanticType: "EMOTION",   domain: "pain-removal",   ring: "BOSONIC" },
  { pattern: /packet|inter.service|envelope|coordinate/i,   semanticType: "DIALOGUE",  domain: "systems-design", ring: "BOSONIC" },
  { pattern: /activation.*codex|codex|axiom|temporal/i,     semanticType: "NARRATIVE", domain: "quantum-arch",   ring: "FOUNDATION" },
  { pattern: /verifi|audit|autonomy|compl/i,                semanticType: "PHYSICS",   domain: "security-forge", ring: "CANONICAL" },
  { pattern: /activation.*codex|llm|mkb/i,                 semanticType: "ACTION",    domain: "code-eng",       ring: "FOUNDATION" },
];

const SERVICE_RING_MAP = {
  "api-service": "FOUNDATION",
  "pwai-api-service": "FOUNDATION",
  "ai-worker": "FOUNDATION",
  "pwai-ai-worker": "FOUNDATION",
  controller: "BOSONIC",
  "pwai-controller": "BOSONIC",
  frontend: "BOSONIC",
  "pwai-frontend": "BOSONIC",
  "merkaba-geoqode-lattice": "CANONICAL",
  Merkaba48OS: "CANONICAL",
  "s4ai-core": "CANONICAL",
};

// ─── Drone definitions (8, one per QUEEN-BEE sector) ─────────────────────────

const DRONE_DEFS = [
  { id: "S1-QuantumArch",   sector: 1, domain: "quantum-arch",   semanticType: "PHYSICS",     frequency: 852, ring: "FOUNDATION" },
  { id: "S2-CodeEng",       sector: 2, domain: "code-eng",       semanticType: "ACTION",      frequency: 528, ring: "FOUNDATION" },
  { id: "S3-SystemsDesign", sector: 3, domain: "systems-design", semanticType: "NARRATIVE",   frequency: 963, ring: "FOUNDATION" },
  { id: "S4-DataStructs",   sector: 4, domain: "data-structs",   semanticType: "ENTITY",      frequency: 396, ring: "FOUNDATION" },
  { id: "S5-SelfEvolve",    sector: 5, domain: "self-evolve",    semanticType: "HOLOGRAPHIC", frequency: 72,  ring: "BOSONIC"    },
  { id: "S6-PainRemoval",   sector: 6, domain: "pain-removal",   semanticType: "EMOTION",     frequency: 741, ring: "BOSONIC"    },
  { id: "S7-PerfForge",     sector: 7, domain: "perf-forge",     semanticType: "ACTION",      frequency: 528, ring: "BOSONIC"    },
  { id: "S8-SecurityForge", sector: 8, domain: "security-forge", semanticType: "PHYSICS",     frequency: 852, ring: "CANONICAL"  },
];

// ─── Severity ranking ─────────────────────────────────────────────────────────

const SEVERITY_RANK = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0, OK: -1 };

function mkFinding(severity, drone, issue, fix, snippet = "") {
  return { severity, droneId: drone.id, domain: drone.domain, issue, fix, snippet };
}

// ─── Individual Drone Scan Functions ─────────────────────────────────────────

/**
 * S1 — QuantumArch: canonical constant enforcement.
 * Laws of physics for the lattice — check that the foundations never drift.
 */
function scanQuantumArch(code, ctx, drone) {
  const findings = [];

  // Stale 432 Hz
  if (/\b432\b/.test(code) && !/transform-420|filename/.test(ctx.file || "")) {
    findings.push(mkFinding("HIGH", drone,
      "432 Hz stale base frequency detected",
      `Replace with BASE_FREQUENCY_HZ = ${BASE_FREQUENCY_HZ} Hz`,
      code.match(/.*432.*/)?.[0]?.trim().slice(0, 80)));
  }

  // Stale 7.83 Hz (Schumann)
  if (/\b7\.83\b/.test(code)) {
    findings.push(mkFinding("HIGH", drone,
      "7.83 Hz Schumann stale frequency detected",
      `Replace with BASE_FREQUENCY_HZ = ${BASE_FREQUENCY_HZ} Hz`,
      code.match(/.*7\.83.*/)?.[0]?.trim().slice(0, 80)));
  }

  // Stale architecture signatures
  const staleArch = code.match(/['"](8,26,4[024]:[0-9:]+)['"]/g);
  if (staleArch) {
    staleArch.forEach((s) =>
      findings.push(mkFinding("CRITICAL", drone,
        `Stale architecture signature: ${s}`,
        `Use canonical: "${CANONICAL_ARCHITECTURE}" — locked, never changes`,
        s)));
  }

  // Architecture signature present?
  const hasAssert = /assertCanonicalArchitectureSignature|CANONICAL_ARCHITECTURE/.test(code);
  if (!hasAssert && code.length > 200) {
    findings.push(mkFinding("MEDIUM", drone,
      "No canonical architecture assertion found",
      'Import assertCanonicalArchitectureSignature and call assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE) at module load'));
  }

  // PHI value drift
  const phiMatch = code.match(/PHI\s*=\s*([0-9.]+)/);
  if (phiMatch && Math.abs(parseFloat(phiMatch[1]) - PHI) > 0.001) {
    findings.push(mkFinding("HIGH", drone,
      `PHI value drift: ${phiMatch[1]} (canonical: ${PHI})`,
      `PHI must equal exactly ${PHI}`,
      phiMatch[0]));
  }

  // 420 in formula values (only allowed in filename)
  const formulaFourTwenty = code.match(/[^a-zA-Z_"'/-]420[^a-zA-Z_"'.-]/g);
  if (formulaFourTwenty) {
    findings.push(mkFinding("HIGH", drone,
      `420 appears in formula value — only allowed in filename "transform-420.js"`,
      `Use HARMONIC_SPECTRUM_NODES = ${HARMONIC_SPECTRUM_NODES} (480). The deprecated 420 node count is permanently removed.`,
      formulaFourTwenty[0]?.trim().slice(0, 80)));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Canonical constants clean", ""));
  return findings;
}

/**
 * S2 — CodeEng: code pattern laws.
 * Checks ES module compliance, API shape, error handling patterns.
 */
function scanCodeEng(code, ctx, drone) {
  const findings = [];

  // require() instead of import
  if (/\brequire\s*\(/.test(code)) {
    findings.push(mkFinding("HIGH", drone,
      "CommonJS require() detected in ES Module project",
      'Convert to: import X from "module.js" (type: "module" in package.json)'));
  }

  // module.exports
  if (/module\.exports\s*=/.test(code)) {
    findings.push(mkFinding("HIGH", drone,
      "module.exports detected — use ES export syntax",
      'Convert to: export default X or export { X }'));
  }

  // Positional propagateResonance call (pre-v2 signature)
  const oldPropRe = /propagateResonance\s*\(\s*\w+\s*,\s*\[/;
  if (oldPropRe.test(code)) {
    findings.push(mkFinding("MEDIUM", drone,
      "Legacy positional propagateResonance() call detected",
      'Migrate to destructured opts: propagateResonance(t, { phases, amplitudes, freqs, damping })'));
  }

  // SQL injection risk: string interpolation in query
  const sqlInjection = code.match(/\.query\s*\(`[^`]*\$\{/g);
  if (sqlInjection) {
    findings.push(mkFinding("CRITICAL", drone,
      "SQL injection risk: template literal inside .query()",
      "Use parameterized queries: pool.query('SELECT ... WHERE id = $1', [id])",
      sqlInjection[0]?.slice(0, 80)));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Code patterns clean", ""));
  return findings;
}

/**
 * S3 — SystemsDesign: architecture continuity.
 * Checks service isolation, boot protocol, alignment annotation.
 */
function scanSystemsDesign(code, ctx, drone) {
  const findings = [];

  // Cross-repo import bomb: double-parent traversal crossing a repo boundary
  const doubleDot = code.match(/from\s+["'](\.\.\/)(\.\.\/)([^"']+)["']/g) || [];
  doubleDot.forEach((imp) => {
    const hasRepo = CROSS_REPO_SEGMENTS.some((r) => imp.includes(r));
    if (hasRepo) {
      findings.push(mkFinding("CRITICAL", drone,
        `Cross-repo import bomb: ${imp.slice(0, 100)}`,
        "Railway containers are isolated — cross-repo relative imports fail at boot. Replace with self-contained implementation or shared npm package.",
        imp.slice(0, 100)));
    }
  });

  // Missing @alignment annotation
  if (!/@alignment\s+8→26→48:480/.test(code) && code.length > 200) {
    findings.push(mkFinding("LOW", drone,
      "Missing @alignment 8→26→48:480 module annotation",
      'Add @alignment 8→26→48:480 to module JSDoc header'));
  }

  // Missing GeoQode envelope fields
  const hasGeoEmit = /buildGeoCoordinate|geoqode.*coordinate/i.test(code);
  const hasEnvelopeFields = /architectureSignature.*8,26,48:480|semanticType.*frequency.*latticeNode/i.test(code);
  if (hasGeoEmit && !hasEnvelopeFields) {
    findings.push(mkFinding("MEDIUM", drone,
      "buildGeoCoordinate() present but coordinate envelope may be incomplete",
      "Envelope must include: architectureSignature, semanticType, frequency, latticeNode, harmonicNode, phiCoefficient, coherence, domain, source"));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Architecture continuity clean", ""));
  return findings;
}

/**
 * S4 — DataStructs: data model identity.
 * The ENTITY lens — what IS this data? Are types correct? Are shapes complete?
 */
function scanDataStructs(code, ctx, drone) {
  const findings = [];

  // Lowercase semantic type comparisons
  const lcTypeMatches = code.match(/e\.type\s*===\s*["'](entity|location|action|narrative|dialogue|emotion|physics|holographic)["']/gi) || [];
  lcTypeMatches.forEach((m) =>
    findings.push(mkFinding("CRITICAL", drone,
      `Lowercase semantic type comparison: ${m.slice(0, 80)}`,
      "MERKABA_SEMANTIC_TYPES values are UPPERCASE strings. Use MERKABA_SEMANTIC_TYPES.LOCATION etc. — or compare with 'LOCATION' (uppercase).",
      m.slice(0, 80))));

  // semanticDimensions: 64 (should be 48 D48 or 480 D480)
  const semDim = code.match(/semanticDimensions\s*[:|=]\s*(\d+)/);
  if (semDim && semDim[1] !== "48" && semDim[1] !== "480") {
    findings.push(mkFinding("MEDIUM", drone,
      `semanticDimensions = ${semDim[1]} — not aligned to canonical D48 (48) or D480 (480)`,
      `Use semanticDimensions: ${CANONICAL_LATTICE_NODES} (canonical D48 lattice node count) or ${HARMONIC_SPECTRUM_NODES} (full D480)`,
      semDim[0]));
  }

  // Missing Object.freeze on canonical constants
  const hasFrozen = /Object\.freeze/.test(code);
  const hasExportedConstants = /^export\s+const\s+[A-Z_]+\s*=/m.test(code);
  if (hasExportedConstants && !hasFrozen && code.length > 300) {
    findings.push(mkFinding("LOW", drone,
      "Exported constants not frozen with Object.freeze()",
      "Wrap constant objects in Object.freeze({}) to prevent runtime mutation"));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Data model identity clean", ""));
  return findings;
}

/**
 * S5 — SelfEvolve: lattice self-reference and expansion integrity.
 * The HOLOGRAPHIC lens — does this module know what it IS in the lattice?
 */
function scanSelfEvolve(code, ctx, drone) {
  const findings = [];

  // Magic 2.96 dead zone
  const magicMul = code.match(/\*\s*(?:phiMultiplier\s*\*\s*)?2\.96/g);
  if (magicMul) {
    findings.push(mkFinding("CRITICAL", drone,
      `Magic 2.96 multiplier detected — causes D480 dead zone in nodes 12-47`,
      `Replace with canonical band expansion:\n  const bandStart = Math.floor(latticeNode) * 10;\n  const offset = phiMultiplier === 1 ? 0 : Math.floor((phiMultiplier * ${PHI}) % 10);\n  return Math.min(${HARMONIC_SPECTRUM_NODES - 1}, bandStart + offset);`,
      magicMul[0]));
  }

  // harmonicNode = nodeIndex % 480 (misses canonical D48×10 band expansion)
  const naiveHarmonic = code.match(/harmonicNode\s*=\s*\w+\s*%\s*(?:this\.harmonicSpectrum|480)/g);
  if (naiveHarmonic) {
    findings.push(mkFinding("MEDIUM", drone,
      `Naive harmonicNode = index % 480 — ignores canonical D48×10 band expansion`,
      `Use:\n  const latticeNodeLocal = nodeIndex % ${CANONICAL_LATTICE_NODES}; // 0-47\n  const harmonicNode = Math.min(${HARMONIC_SPECTRUM_NODES} - 1, latticeNodeLocal * 10);`,
      naiveHarmonic[0]));
  }

  // Missing CLUSTER_DISTRIBUTION
  if (/latticeToHarmonicNode/.test(code) && !/CLUSTER_DISTRIBUTION/.test(code)) {
    findings.push(mkFinding("MEDIUM", drone,
      "latticeToHarmonicNode() present but CLUSTER_DISTRIBUTION missing",
      "Add CLUSTER_DISTRIBUTION = Object.freeze({ clustersPerLattice: 48, subMerkabasPerCluster: 10, totalSubMerkabas: 480, canonicalBaseHz: 72 })"));
  }

  // Missing dimensionClusterFrequency
  if (/CLUSTER_DISTRIBUTION/.test(code) && !/dimensionClusterFrequency/.test(code)) {
    findings.push(mkFinding("LOW", drone,
      "CLUSTER_DISTRIBUTION present but dimensionClusterFrequency() missing",
      "Add: function dimensionClusterFrequency(n, f0 = BASE_FREQUENCY_HZ) { return +(f0 * (1 + n / 48)).toFixed(4); }"));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Lattice self-reference clean", ""));
  return findings;
}

/**
 * S6 — PainRemoval: bug and drift hunting.
 * The EMOTION lens — what is causing pain, stuckness, or silent failure?
 */
function scanPainRemoval(code, ctx, drone) {
  const findings = [];

  // 97,083ms pulse interval (stale — not aligned to 56s temporal cycle)
  const pulseMatch = code.match(/PULSE_INTERVAL_MS\s*=\s*Math\.round\s*\(\s*PHI\s*\*\s*60[_,]?000\s*\)/);
  if (pulseMatch) {
    findings.push(mkFinding("MEDIUM", drone,
      `PULSE_INTERVAL_MS = PHI×60s ≈ 97,083ms — not aligned to 56s temporal cycle`,
      `Use canonical: PULSE_INTERVAL_MS = Math.round(56_000 * PHI) ≈ ${CANONICAL_PULSE_MS}ms (PHI-scaled full temporal cycle). The 56s cycle = 7 phases × 8s from merkaba-activation-codex §5.`,
      pulseMatch[0]));
  }

  // Hardcoded stale HOLOGRAPHIC frequency (432)
  const holo432 = code.match(/holographic\s*[=:]\s*432\b/i);
  if (holo432) {
    findings.push(mkFinding("HIGH", drone,
      "holographic: 432 — stale HOLOGRAPHIC frequency",
      `holographic: ${BASE_FREQUENCY_HZ} (BASE_FREQUENCY_HZ canonical)`,
      holo432[0]));
  }

  // ROLE_FREQUENCIES missing holographic
  const hasRoleFreqs = /ROLE_FREQUENCIES\s*=/.test(code);
  const hasHolographicInRoles = /holographic\s*:\s*\d+/.test(code);
  if (hasRoleFreqs && !hasHolographicInRoles) {
    findings.push(mkFinding("MEDIUM", drone,
      "ROLE_FREQUENCIES map missing holographic: 72 entry",
      `Add: holographic: ${BASE_FREQUENCY_HZ}, // base lattice self-reference`));
  }

  // s4ai-federation-v1 protocol used instead of Merkaba mesh
  if (/s4ai-federation-v1/.test(code)) {
    findings.push(mkFinding("HIGH", drone,
      "s4ai-federation-v1 protocol detected — architectural duplication of MerkabaHandshake mesh",
      "Consider bridging FederatedBrain to MerkabaHandshake. The canonical service discovery protocol is MerkabaHandshake with MerkabaSCRYPT tokens, not federation-v1."));
  }

  // Missing await on async calls
  const missingAwait = code.match(/[^a-z](?:const|let|var)\s+\w+\s*=\s*[a-zA-Z]+\.(send|receive|broadcast)\s*\(/g);
  if (missingAwait) {
    findings.push(mkFinding("LOW", drone,
      "Potential missing await on async send/receive/broadcast calls",
      "Ensure network calls are awaited to prevent fire-and-forget data loss"));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "No pain points detected", ""));
  return findings;
}

/**
 * S7 — PerfForge: harmonic expansion and performance optimization.
 * The performance ACTION lens — are frequencies computing at maximum resonance?
 */
function scanPerfForge(code, ctx, drone) {
  const findings = [];

  // PHI computed inline in tight loops (should be cached constant)
  const phiInLoop = code.match(/(?:for|while|\.map|\.forEach)[^{]*{[^}]*1\.618/g);
  if (phiInLoop) {
    findings.push(mkFinding("LOW", drone,
      "PHI literal 1.618 computed in loop body — should be cached constant",
      `Import PHI constant from canonical source: import { PHI } from "../lattice/transform-420.js"`));
  }

  // harmonicNode % 480 (see also S5 — reinforced by S7 from a perf angle)
  if (/harmonicNode\s*=.*%\s*(?:480|this\.harmonicSpectrum)/.test(code)) {
    findings.push(mkFinding("MEDIUM", drone,
      "harmonicNode computed with % 480 modulo — O(1) but skips band locality",
      `D48×10 band expansion places related semantic units together in harmonic space:\n  harmonicNode = Math.min(479, Math.floor(latticeNode) * 10)`));
  }

  // PULSE_INTERVAL_MS alignment gap (reinforced from perf: unnecessary cross-cycle timer drift)
  if (/PULSE_INTERVAL_MS\s*=\s*Math\.round\s*\(\s*PHI\s*\*\s*60[_,]?000\s*\)/.test(code)) {
    findings.push(mkFinding("LOW", drone,
      "Pulse timer drifts relative to 56s temporal cycle — causes phase misalignment over time",
      `Set PULSE_INTERVAL_MS = Math.round(56_000 * PHI) = ${CANONICAL_PULSE_MS}ms to stay phase-locked to activation codex temporal cycle`));
  }

  if (!findings.length) findings.push(mkFinding("OK", drone, "Performance patterns clean", ""));
  return findings;
}

/**
 * S8 — SecurityForge: auth, isolation, credential hygiene.
 * The PHYSICS security lens — are the boundaries holding?
 */
function scanSecurityForge(code, ctx, drone) {
  const findings = [];

  // SQL injection (reinforced from S2 for completeness)
  const sqlInj = code.match(/\.query\s*\(`[^`]*\$\{/g);
  if (sqlInj) {
    findings.push(mkFinding("CRITICAL", drone,
      "SQL injection via template literal in .query()",
      "Use parameterized queries with $1, $2 placeholders",
      sqlInj[0]?.slice(0, 80)));
  }

  // JWT secret or API key hardcoded
  const hardcodedSecret = code.match(/(?:secret|key|password)\s*[:=]\s*["'][a-zA-Z0-9+/]{20,}["']/gi);
  if (hardcodedSecret) {
    hardcodedSecret.forEach((s) =>
      findings.push(mkFinding("CRITICAL", drone,
        "Hardcoded secret or API key detected",
        "Move to environment variable: process.env.SECRET_NAME. Never commit credentials.",
        s.slice(0, 60) + "...")));
  }

  // verifyAdmin missing on admin routes
  const adminRoutes = code.match(/router\.\w+\s*\(\s*["']\/admin[^"']*["']/g) || [];
  adminRoutes.forEach((route) => {
    const afterRoute = code.slice(code.indexOf(route), code.indexOf(route) + 200);
    if (!/verifyAdmin/.test(afterRoute)) {
      findings.push(mkFinding("HIGH", drone,
        `Admin route missing verifyAdmin middleware: ${route.slice(0, 60)}`,
        "Add verifyAdmin as second argument: router.get('/admin/...', verifyAdmin, handler)"));
    }
  });

  // scrypt N < 16384 (too weak)
  const scryptN = code.match(/\bN\s*[:=]\s*(\d+)/);
  if (scryptN && parseInt(scryptN[1]) < 16384) {
    findings.push(mkFinding("HIGH", drone,
      `scrypt N=${scryptN[1]} is too low — minimum is 16384`,
      "Set N: 16384 (minimum recommended for scrypt key derivation)"));
  }

  // Cross-repo import as a security boundary violation (reinforced from S3)
  const crossRepo = code.match(/from\s+["'](\.\.\/)(\.\.\/)([^"']+)["']/g) || [];
  crossRepo.forEach((imp) => {
    if (CROSS_REPO_SEGMENTS.some((r) => imp.includes(r))) {
      findings.push(mkFinding("CRITICAL", drone,
        `Security boundary violation: cross-repo import ${imp.slice(0, 80)}`,
        "Railway containers are isolated. Cross-repo imports expose internal paths and fail at boot.",
        imp.slice(0, 80)));
    }
  });

  if (!findings.length) findings.push(mkFinding("OK", drone, "Security boundaries clean", ""));
  return findings;
}

// ─── Drone scanner map ────────────────────────────────────────────────────────

const DRONE_SCANNERS = {
  "S1-QuantumArch":   scanQuantumArch,
  "S2-CodeEng":       scanCodeEng,
  "S3-SystemsDesign": scanSystemsDesign,
  "S4-DataStructs":   scanDataStructs,
  "S5-SelfEvolve":    scanSelfEvolve,
  "S6-PainRemoval":   scanPainRemoval,
  "S7-PerfForge":     scanPerfForge,
  "S8-SecurityForge": scanSecurityForge,
};

// ─── MerkabaBeEyeSwarm ────────────────────────────────────────────────────────

export class MerkabaBeEyeSwarm {
  constructor() {
    this.architectureSignature = CANONICAL_ARCHITECTURE;
    this.phi = PHI;
    this.drones = [...DRONE_DEFS];
    this.sweepHistory = [];
  }

  // ─── STEP 1: IDENTIFY ──────────────────────────────────────────────────────
  /**
   * Determine the lattice identity of an artifact BEFORE diagnosing it.
   * "Know what it IS" — its ring, semantic type, frequency, and domain.
   *
   * @param {string} code     — source code string
   * @param {object} context  — { file?, service?, domain? }
   * @returns {LatticeIdentity}
   */
  identify(code = "", context = {}) {
    const filePath = (context.file || "").toLowerCase();
    const service  = (context.service || "").toLowerCase();

    // Determine ring from service name
    let ring = SERVICE_RING_MAP[service] || SERVICE_RING_MAP[context.service] || "FOUNDATION";

    // Refine ring from file path
    for (const [svc, r] of Object.entries(SERVICE_RING_MAP)) {
      if (filePath.includes(svc.toLowerCase())) { ring = r; break; }
    }

    // Determine semantic type + domain from file path / code content
    let semanticType = "ACTION";
    let domain = "code-eng";
    const searchStr = `${filePath} ${code.slice(0, 500)}`;

    for (const hint of IDENTITY_HINTS) {
      if (hint.pattern.test(searchStr)) {
        semanticType = hint.semanticType;
        domain = hint.domain;
        break;
      }
    }

    // Override with explicit context
    if (context.domain) domain = context.domain;

    const frequency = SEMANTIC_FREQUENCY_MAP[semanticType] ?? BASE_FREQUENCY_HZ;

    // Assign a nominal lattice node from the file path hash (deterministic)
    const latticeNode = this._hashToLatticeNode(context.file || domain);
    const harmonicNode = Math.min(HARMONIC_SPECTRUM_NODES - 1, latticeNode * 10);

    return {
      file: context.file || "unknown",
      service: context.service || "unknown",
      ring,
      semanticType,
      domain,
      frequency,
      latticeNode,
      harmonicNode,
      phiCoefficient: PHI,
      architectureSignature: this.architectureSignature,
    };
  }

  // ─── STEP 2: DIAGNOSE ─────────────────────────────────────────────────────
  /**
   * Run all 8 drones across the source code. Returns the raw swarm findings.
   *
   * @param {string} code
   * @param {object} context
   * @returns {DroneReport[]}
   */
  diagnose(code, context = {}) {
    return this.drones.map((droneDef) => {
      const scanner = DRONE_SCANNERS[droneDef.id];
      const findings = scanner ? scanner(code, context, droneDef) : [];
      const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
      const issues    = findings.filter((f) => f.severity !== "OK" && f.severity !== "INFO").length;
      const coherence = Math.max(0, 1 - criticals * 0.3 - issues * 0.1);
      return {
        droneId: droneDef.id,
        sector: droneDef.sector,
        domain: droneDef.domain,
        semanticType: droneDef.semanticType,
        frequency: droneDef.frequency,
        ring: droneDef.ring,
        findings,
        coherence: +coherence.toFixed(3),
      };
    });
  }

  // ─── STEP 3: OPTIMIZE ─────────────────────────────────────────────────────
  /**
   * Derive actionable optimization instructions from a set of drone reports.
   * Returns a prioritized list of fixes, ordered by severity descending.
   *
   * @param {DroneReport[]} droneReports
   * @returns {Optimization[]}
   */
  optimize(droneReports) {
    const allFindings = droneReports.flatMap((r) => r.findings);
    const actionable = allFindings.filter((f) => f.severity !== "OK" && f.severity !== "INFO");

    // Deduplicate by issue text
    const seen = new Set();
    const unique = actionable.filter((f) => {
      const key = `${f.droneId}::${f.issue.slice(0, 60)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by severity rank descending
    unique.sort((a, b) => (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0));

    return unique.map((f, i) => ({
      priority: i + 1,
      severity: f.severity,
      droneId: f.droneId,
      domain: f.domain,
      issue: f.issue,
      fix: f.fix,
      snippet: f.snippet || "",
    }));
  }

  // ─── FULL SWEEP ───────────────────────────────────────────────────────────
  /**
   * Full 3-phase diagnostic sweep: IDENTIFY → DIAGNOSE → OPTIMIZE.
   * This is the primary entry point for the swarm.
   *
   * @param {string} code     — source code to analyze
   * @param {object} context  — { file?, service?, domain? }
   * @returns {SwarmReport}
   */
  async sweep(code, context = {}) {
    const identity      = this.identify(code, context);
    const droneReports  = this.diagnose(code, context);
    const optimizations = this.optimize(droneReports);

    const allFindings = droneReports.flatMap((r) => r.findings);
    const summary = {
      critical: allFindings.filter((f) => f.severity === "CRITICAL").length,
      high:     allFindings.filter((f) => f.severity === "HIGH").length,
      medium:   allFindings.filter((f) => f.severity === "MEDIUM").length,
      low:      allFindings.filter((f) => f.severity === "LOW").length,
      ok:       allFindings.filter((f) => f.severity === "OK").length,
    };

    const avgCoherence = droneReports.reduce((s, r) => s + r.coherence, 0) / droneReports.length;
    const swarmCoherence = +avgCoherence.toFixed(3);

    const report = {
      swarmId: `swarm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      architectureSignature: this.architectureSignature,
      timestamp: new Date().toISOString(),
      identity,
      droneReports,
      optimizations,
      summary,
      swarmCoherence,
      status: summary.critical > 0 ? "CRITICAL" : summary.high > 0 ? "DEGRADED" : swarmCoherence >= 0.8 ? "NOMINAL" : "WARNING",
    };

    this.sweepHistory.push({
      swarmId: report.swarmId,
      file: context.file,
      status: report.status,
      swarmCoherence,
      timestamp: report.timestamp,
    });

    return report;
  }

  /**
   * Sweep a file by path (reads file, then sweeps). Node.js only.
   * @param {string} filePath
   * @param {object} extraContext
   */
  async sweepFile(filePath, extraContext = {}) {
    const { readFile } = await import("node:fs/promises");
    const code = await readFile(filePath, "utf8");
    const service = this._inferService(filePath);
    return this.sweep(code, { file: filePath, service, ...extraContext });
  }

  /**
   * Sweep multiple files and return a consolidated ecosystem report.
   * @param {Array<{path:string, context?:object}>} targets
   */
  async sweepEcosystem(targets) {
    const reports = [];
    for (const t of targets) {
      try {
        const r = await this.sweepFile(t.path, t.context || {});
        reports.push(r);
      } catch (err) {
        reports.push({ file: t.path, error: err.message, status: "ERROR" });
      }
    }

    const totalCritical = reports.filter((r) => r.status === "CRITICAL").length;
    const totalDegraded = reports.filter((r) => r.status === "DEGRADED").length;
    const avgCoherence  = reports
      .filter((r) => r.swarmCoherence != null)
      .reduce((s, r, _, a) => s + r.swarmCoherence / a.length, 0);

    return {
      architectureSignature: this.architectureSignature,
      timestamp: new Date().toISOString(),
      filesSwept: reports.length,
      ecosystemCoherence: +avgCoherence.toFixed(3),
      ecosystemStatus: totalCritical > 0 ? "CRITICAL" : totalDegraded > 0 ? "DEGRADED" : "NOMINAL",
      fileReports: reports,
    };
  }

  /** Print a terse human-readable summary of a SwarmReport. */
  format(report) {
    if (!report.identity) return String(report);
    const id = report.identity;
    const s  = report.summary;
    const lines = [
      `━━━ MerkabaBeEyeSwarm Report ━━━ ${report.timestamp}`,
      `  File      : ${id.file}`,
      `  Ring      : ${id.ring}  Node: ${id.latticeNode}  Harmonic: ${id.harmonicNode}`,
      `  Type      : ${id.semanticType}  ${id.frequency}Hz  Domain: ${id.domain}`,
      `  Coherence : ${report.swarmCoherence}  Status: ${report.status}`,
      `  Findings  : 🔴${s.critical} HIGH:${s.high} MED:${s.medium} LOW:${s.low} OK:${s.ok}`,
    ];
    if (report.optimizations.length) {
      lines.push("  Top Fixes :");
      report.optimizations.slice(0, 3).forEach((o) =>
        lines.push(`    [${o.severity}][${o.droneId}] ${o.issue.slice(0, 70)}`));
    }
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return lines.join("\n");
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  _hashToLatticeNode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h) % CANONICAL_LATTICE_NODES;
  }

  _inferService(filePath) {
    for (const svc of CROSS_REPO_SEGMENTS) {
      if (filePath.includes(svc)) return svc;
    }
    return "unknown";
  }
}

// ─── Convenience singleton ────────────────────────────────────────────────────

export const merkabaEye = new MerkabaBeEyeSwarm();
export default MerkabaBeEyeSwarm;
