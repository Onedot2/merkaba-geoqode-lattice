/**
 * run-swarm-sweep.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * MerkabaBeEyeSwarm — Live Ecosystem Sweep
 *
 * Flies all 8 drones over the canonical Storm ecosystem. Identifies lattice
 * violations, stale constants, SQL injection risks, cross-repo bombs, and
 * semantic type inconsistencies. Every finding is tagged with its drone sector,
 * frequency, and severity.
 *
 * Usage:
 *   node scripts/run-swarm-sweep.mjs [--file <path>] [--json] [--kb]
 *
 *   (no args)     — sweep all canonical ecosystem targets
 *   --file <p>    — sweep a single file at absolute path <p>
 *   --json        — print full JSON report instead of formatted summary
 *   --kb          — also POST findings summary to Storm KB
 *
 * Architecture: 8→26→48:480  PHI=1.618  BASE_FREQUENCY_HZ=72
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { fileURLToPath, pathToFileURL } from "url";
import { dirname, resolve, join } from "path";
import { access } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);
const REPO_ROOT = resolve(__dir, ".."); // merkaba-geoqode-lattice/

// ─── Import the swarm (Windows-safe: convert path → file:// URL) ──────────
const { MerkabaBeEyeSwarm } = await import(
  pathToFileURL(join(REPO_ROOT, "geo", "intelligence", "MerkabaBeEyeSwarm.js"))
    .href
);

const swarm = new MerkabaBeEyeSwarm();

// ─── Canonical ecosystem targets ─────────────────────────────────────────
// Absolute paths relative to the workspace root (one level above each repo).
const WORKSPACE = resolve(REPO_ROOT, "..");

const ECOSYSTEM_TARGETS = [
  // merkaba-geoqode-lattice — lattice source of truth
  {
    path: join(REPO_ROOT, "geo", "lattice", "transform-420.js"),
    label: "canonical-constants",
  },
  {
    path: join(REPO_ROOT, "geo", "intelligence", "merkaba-llm.js"),
    label: "merkaba-llm",
  },
  {
    path: join(REPO_ROOT, "geo", "intelligence", "resonance-diagnostics.js"),
    label: "resonance-diagnostics",
  },
  {
    path: join(REPO_ROOT, "geo", "intelligence", "MerkabaBeEyeSwarm.js"),
    label: "eye-swarm-self",
  },
  {
    path: join(REPO_ROOT, "geo", "cinema", "narrative-embedder.js"),
    label: "narrative-embedder",
  },
  {
    path: join(REPO_ROOT, "geo", "cinema", "cinema-projector.js"),
    label: "cinema-projector",
  },

  // Merkaba48OS — OS mesh
  {
    path: join(WORKSPACE, "Merkaba48OS", "core", "MerkabaHandshake.js"),
    label: "handshake",
  },
  {
    path: join(WORKSPACE, "Merkaba48OS", "core", "MerkabaSCRYPT.js"),
    label: "scrypt",
  },
  {
    path: join(WORKSPACE, "Merkaba48OS", "core", "MerkabaPacket.js"),
    label: "packet",
  },
  {
    path: join(WORKSPACE, "Merkaba48OS", "core", "MerkabaTransforms.js"),
    label: "transforms",
  },

  // pwai-api-service — api bridge
  {
    path: join(
      WORKSPACE,
      "pwai-api-service",
      "src",
      "core",
      "geoqode-native.js",
    ),
    label: "api-geoqode-native",
  },

  // pwai-ai-worker — intelligence core
  {
    path: join(WORKSPACE, "pwai-ai-worker", "src", "core", "geoqode-native.js"),
    label: "worker-geoqode-native",
  },
  {
    path: join(
      WORKSPACE,
      "pwai-ai-worker",
      "src",
      "core",
      "quantum-reasoning-v3.js",
    ),
    label: "quantum-reasoning-v3",
  },
  {
    path: join(
      WORKSPACE,
      "pwai-ai-worker",
      "src",
      "core",
      "consciousness-metrics.js",
    ),
    label: "consciousness-metrics",
  },
  {
    path: join(
      WORKSPACE,
      "pwai-ai-worker",
      "src",
      "core",
      "memetic-evolution-engine.js",
    ),
    label: "memetic-evolution",
  },
  {
    path: join(WORKSPACE, "pwai-ai-worker", "src", "core", "meta-reasoning.js"),
    label: "meta-reasoning",
  },

  // pwai-controller — orchestration bridge
  {
    path: join(
      WORKSPACE,
      "pwai-controller",
      "src",
      "core",
      "geoqode-native.js",
    ),
    label: "controller-geoqode-native",
  },

  // s4ai-core — canonical intelligence source
  {
    path: join(
      WORKSPACE,
      "s4ai-core",
      "src",
      "intelligence",
      "consciousness-metrics.js",
    ),
    label: "s4ai-consciousness-metrics",
  },
  {
    path: join(
      WORKSPACE,
      "s4ai-core",
      "src",
      "intelligence",
      "quantum-enhanced-reasoning.js",
    ),
    label: "s4ai-quantum-enhanced",
  },
  {
    path: join(
      WORKSPACE,
      "s4ai-core",
      "src",
      "intelligence",
      "merkaba-routing-contract.js",
    ),
    label: "s4ai-routing-contract",
  },

  // merkaba-geoqode-lattice — bridge, certification, runtime, distributed
  {
    path: join(REPO_ROOT, "geo", "bridge", "merkaba-bridge.js"),
    label: "merkaba-bridge",
  },
  {
    path: join(REPO_ROOT, "geo", "bridge", "storm-adapter.js"),
    label: "storm-adapter",
  },
  {
    path: join(REPO_ROOT, "geo", "certification", "audit-trail.js"),
    label: "audit-trail",
  },
  {
    path: join(REPO_ROOT, "geo", "certification", "enterprise-certifier.js"),
    label: "enterprise-certifier",
  },
  {
    path: join(REPO_ROOT, "geo", "runtime", "compliance.js"),
    label: "runtime-compliance",
  },
  {
    path: join(REPO_ROOT, "geo", "runtime", "execution-engine.js"),
    label: "execution-engine",
  },
  {
    path: join(REPO_ROOT, "geo", "runtime", "lattice-scheduler.js"),
    label: "lattice-scheduler",
  },
  {
    path: join(REPO_ROOT, "geo", "distributed", "cluster.js"),
    label: "distributed-cluster",
  },
  {
    path: join(REPO_ROOT, "geo", "distributed", "coordinator.js"),
    label: "distributed-coordinator",
  },
];

// ─── Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const fileArg = args.includes("--file")
  ? args[args.indexOf("--file") + 1]
  : null;
const jsonOut = args.includes("--json");
const postKB = args.includes("--kb");

// ─── Helpers ──────────────────────────────────────────────────────────────
function sev(s) {
  return (
    { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", LOW: "🟢", INFO: "⚪" }[s] ||
    "⚪"
  );
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function printBanner() {
  console.log("\n" + "═".repeat(72));
  console.log("  MerkabaBeEyeSwarm — Ecosystem Sweep");
  console.log("  Architecture: 8→26→48:480  |  PHI=1.618  |  BASE_HZ=72");
  console.log(
    "  8 drones × compound-eye scan  |  identify → diagnose → optimize",
  );
  console.log("═".repeat(72) + "\n");
}

// ─── Single-file mode ─────────────────────────────────────────────────────
if (fileArg) {
  const abs = resolve(fileArg);
  if (!(await fileExists(abs))) {
    console.error(`[sweep] File not found: ${abs}`);
    process.exit(1);
  }
  printBanner();
  console.log(`Sweeping single file: ${abs}\n`);
  const report = await swarm.sweepFile(abs);
  if (jsonOut) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(swarm.format(report));
  }
  process.exit(0);
}

// ─── Ecosystem sweep ───────────────────────────────────────────────────────
printBanner();

const targets = [];
for (const t of ECOSYSTEM_TARGETS) {
  if (await fileExists(t.path)) {
    targets.push(t);
  } else {
    console.warn(`  ⚠️  [skip] Not found: ${t.path}`);
  }
}

console.log(
  `\nSweeping ${targets.length}/${ECOSYSTEM_TARGETS.length} targets...\n`,
);
console.log("─".repeat(72));

const ecoReport = await swarm.sweepEcosystem(targets);

if (jsonOut) {
  console.log(JSON.stringify(ecoReport, null, 2));
  process.exit(0);
}

// ─── Print consolidated report ────────────────────────────────────────────
const fileReports = ecoReport.fileReports ?? [];

let totalFindings = 0;
let criticalCount = 0;
let highCount = 0;
let mediumCount = 0;
let lowCount = 0;
let cleanFiles = 0;
let coherenceSum = 0;

for (const report of fileReports) {
  if (report.error) {
    console.log(`❌ [${report.file}]  ERROR: ${report.error}`);
    continue;
  }
  const label = report.identity?.file ?? report.file ?? "unknown";
  const summary = report.summary ?? {};
  const findCount =
    (summary.critical ?? 0) +
    (summary.high ?? 0) +
    (summary.medium ?? 0) +
    (summary.low ?? 0);
  const coherence = report.swarmCoherence ?? 0;
  const status = report.status ?? "UNKNOWN";
  const coherencePct = (coherence * 100).toFixed(1);
  const statusIcon =
    status === "NOMINAL"
      ? "✅"
      : status === "WARNING"
        ? "⚠️ "
        : status === "DEGRADED"
          ? "🟠"
          : status === "CRITICAL"
            ? "🔴"
            : "❓";

  console.log(
    `${statusIcon} [${label}]  coherence=${coherencePct}%  findings=${findCount}`,
  );

  // Print all findings from all drones
  const allFindings = (report.droneReports ?? []).flatMap(
    (dr) => dr.findings ?? [],
  );
  for (const f of allFindings) {
    console.log(
      `     ${sev(f.severity)} ${f.severity.padEnd(8)} [${f.droneId}]  ${f.issue}`,
    );
    if (f.fix) console.log(`        ↳ fix: ${f.fix}`);
  }

  totalFindings += findCount;
  coherenceSum += coherence;
  if (status === "NOMINAL") cleanFiles++;
  criticalCount += summary.critical ?? 0;
  highCount += summary.high ?? 0;
  mediumCount += summary.medium ?? 0;
  lowCount += summary.low ?? 0;
}

const avgCoherence =
  targets.length > 0
    ? ((coherenceSum / targets.length) * 100).toFixed(1)
    : "0.0";

console.log("\n" + "═".repeat(72));
console.log("  ECOSYSTEM SUMMARY");
console.log("─".repeat(72));
console.log(
  `  Files swept:      ${targets.length}  (${cleanFiles} clean, ${targets.length - cleanFiles} with findings)`,
);
console.log(
  `  Ecosystem status: ${ecoReport.ecosystemStatus === "NOMINAL" ? "✅ NOMINAL" : ecoReport.ecosystemStatus === "DEGRADED" ? "🟠 DEGRADED" : ecoReport.ecosystemStatus === "CRITICAL" ? "🔴 CRITICAL" : (ecoReport.ecosystemStatus ?? "UNKNOWN")}`,
);
console.log(
  `  Ecosystem coh.:   ${((ecoReport.ecosystemCoherence ?? 0) * 100).toFixed(1)}%`,
);
console.log(`  Total findings:   ${totalFindings}`);
console.log(`    🔴 CRITICAL:  ${criticalCount}`);
console.log(`    🟠 HIGH:      ${highCount}`);
console.log(`    🟡 MEDIUM:    ${mediumCount}`);
console.log(`    🟢 LOW:       ${lowCount}`);
console.log("═".repeat(72));

// ─── Consolidated optimizations ───────────────────────────────────────────
const allOptimizations = fileReports
  .flatMap((r) => r.optimizations ?? [])
  .sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (order[a.severity] ?? 9) - (order[b.severity] ?? 9);
  });

if (allOptimizations.length > 0) {
  console.log("\n  TOP OPTIMIZATIONS (priority order):");
  console.log("─".repeat(72));
  for (const opt of allOptimizations.slice(0, 10)) {
    console.log(`  ${sev(opt.severity)} [${opt.droneId}]  ${opt.issue}`);
    if (opt.fix) console.log(`     ↳ ${opt.fix}`);
  }
}

console.log("\n" + "═".repeat(72) + "\n");

// ─── Post to Storm KB ─────────────────────────────────────────────────────
if (postKB) {
  const ADMIN_JWT = process.env.ADMIN_JWT;
  const API_BASE = process.env.API_BASE || "https://api.getbrains4ai.com";

  if (!ADMIN_JWT) {
    console.warn("[KB] Skipping KB post — ADMIN_JWT not set");
    process.exit(0);
  }

  const payload = {
    data: {
      sweepDate: new Date().toISOString(),
      filesSwept: targets.length,
      cleanFiles,
      totalFindings,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgCoherence: parseFloat(avgCoherence),
      architectureSignature: "8,26,48:480",
      topOptimizations: (consolidated?.optimizations ?? []).slice(0, 5),
    },
    metadata: {
      source: "run-swarm-sweep.mjs",
      swarm: "MerkabaBeEyeSwarm",
      drones: 8,
      frequency: "holographic-72hz",
    },
  };

  try {
    const res = await fetch(
      `${API_BASE}/api/knowledge/merkaba-swarm-sweep-${Date.now()}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (res.ok) {
      console.log(`[KB] ✅ Sweep report posted to Storm KB`);
    } else {
      console.warn(`[KB] ⚠️  KB post returned ${res.status}`);
    }
  } catch (err) {
    console.warn(`[KB] ⚠️  KB post failed: ${err.message}`);
  }
}
