/**
 * scripts/post-kb-round7.mjs
 * Posts Round 7 Merkaba canonical hardening results to Storm Knowledge Base.
 * Run: node scripts/post-kb-round7.mjs
 */

const JWT =
  process.env.ADMIN_JWT ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYnJhZGxleWxldml0YW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzc3MjU1NTk3LCJleHAiOjE4MDg3OTE1OTd9.XAb1braPST8F2Na-GG2gUitRYwUoze3Px_ww3ef09mU";

const BASE = "https://api.getbrains4ai.com/api/knowledge";
const HEADERS = {
  Authorization: `Bearer ${JWT}`,
  "Content-Type": "application/json",
};

async function postKB(key, data, metadata) {
  try {
    const res = await fetch(`${BASE}/${key}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ data, metadata }),
    });
    const json = await res.json();
    const status = res.ok ? "✅" : "❌";
    console.log(
      `${status} ${key}: ${res.status} ${JSON.stringify(json).slice(0, 80)}`,
    );
    return res.ok;
  } catch (e) {
    console.error(`❌ ${key}: ${e.message}`);
    return false;
  }
}

const ENTRIES = [
  {
    key: "merkaba-swarm-first-flight",
    data: {
      event: "MerkabaBeEyeSwarm 8-drone first-flight ecosystem sweep",
      date: "2026-04-30",
      session: "Round 7",
      architecture: "8,26,48:480",
      filesSwept: 20,
      findingsTotal: 50,
      findingsBySeverity: { CRITICAL: 8, HIGH: 10, MEDIUM: 16, LOW: 16 },
      ecosystemCoherence: 0.954,
      swarmScript: "merkaba-geoqode-lattice/scripts/run-swarm-sweep.mjs",
      swarmUsage:
        "node scripts/run-swarm-sweep.mjs [--file <path>] [--json] [--kb]",
      confirmedRealFindings: [
        "MerkabaPacket.js cross-repo re-export bomb (CRITICAL — defused)",
        "9 files missing canonical arch assertions (MEDIUM — all added)",
        "3 files missing @alignment JSDoc (LOW — all added)",
        "SEMANTIC_FREQUENCY_MAP imported from wrong source in BeEyeSwarm",
      ],
      confirmedFalsePositives: [
        "SCRYPT scrypt N=2: drone matched '2^' in comment; actual N=1<<14=16384",
        "geoqode-native stale sigs: in DEPRECATED_ARCHITECTURE_SIGNATURES detection array (intentional)",
        "BeEyeSwarm self-scan: drone detection strings appear in swarm message templates",
      ],
      roundCommits: {
        "merkaba-geoqode-lattice": "7fce943",
        Merkaba48OS: "605d61a",
        "pwai-ai-worker": "8ee2838",
        "s4ai-core": "886ef39",
      },
    },
    metadata: {
      category: "merkaba-diagnostics",
      session: "Round7",
      date: "2026-04-30",
    },
  },
  {
    key: "merkaba-packet-self-contained",
    data: {
      event: "MerkabaPacket.js cross-repo import bomb defused",
      date: "2026-04-30",
      severity: "CRITICAL",
      problem:
        "Merkaba48OS/core/MerkabaPacket.js was a 13-line re-export: export * from '../../pwai-ai-worker/src/core/MerkabaPacket.js'",
      whyBad:
        "Railway runs each repo in separate container. Cross-repo relative imports fail with MODULE_NOT_FOUND at boot.",
      solution:
        "Full self-contained implementation ported to Merkaba48OS/core/MerkabaPacket.js",
      keyChanges: [
        "Uses crypto.randomUUID() instead of uuid package (Node >=14.17 native, no dep needed)",
        "Embeds canonical constants: CANONICAL_ARCHITECTURE, PHI, FOUNDATION_NODES, CANONICAL_LATTICE_NODES, etc.",
        "assertCanonicalArchitectureSignature() defined inline + called at module load",
        "MERKABA_ADJACENCY + TETRAHEDRA wrapped in Object.freeze()",
        "@alignment 8→26→48:480 + @railway-safe in module JSDoc",
        "PHI-aligned phase shift default: Math.PI / PHI (was hardcoded Math.PI / 4)",
      ],
      exports: [
        "MerkabaPacket (default)",
        "MerkabaPacket",
        "MERKABA_ADJACENCY",
        "TETRAHEDRA",
        "PacketFactory",
      ],
      commit: "605d61a",
    },
    metadata: {
      category: "merkaba-architecture",
      session: "Round7",
      date: "2026-04-30",
    },
  },
  {
    key: "merkaba-arch-assertions",
    data: {
      event:
        "Canonical architecture boot assertions added across 9 files in 4 repos",
      date: "2026-04-30",
      session: "Round 7",
      pattern:
        "All modules assert CANONICAL_ARCHITECTURE === '8,26,48:480' at load time",
      assertionVariants: {
        "Merkaba48OS (inline)":
          "const CANONICAL_ARCHITECTURE='8,26,48:480'; if (CANONICAL_LATTICE!==48||...) throw...",
        "pwai-ai-worker (import)":
          "import { CANONICAL_ARCHITECTURE } from './geoqode-native.js'; if (...) throw...",
        "s4ai-core (inline)":
          "const _CANONICAL_ARCH='8,26,48:480'; const _CANONICAL_LATTICE=48; if (...) throw...",
      },
      filesFixed: [
        "Merkaba48OS/core/MerkabaPacket.js — inline",
        "Merkaba48OS/core/MerkabaSCRYPT.js — inline",
        "Merkaba48OS/core/MerkabaHandshake.js — inline (from MerkabaSCRYPT export)",
        "pwai-ai-worker/src/core/quantum-reasoning-v3.js — import",
        "pwai-ai-worker/src/core/consciousness-metrics.js — import",
        "pwai-ai-worker/src/core/memetic-evolution-engine.js — import",
        "pwai-ai-worker/src/core/meta-reasoning.js — import",
        "s4ai-core/src/intelligence/consciousness-metrics.js — inline",
        "s4ai-core/src/intelligence/quantum-enhanced-reasoning.js — inline",
        "s4ai-core/src/intelligence/merkaba-routing-contract.js — inline",
      ],
      alreadyHadAssertions: [
        "geo/lattice/transform-420.js",
        "pwai-ai-worker/src/core/geoqode-native.js",
        "pwai-api-service/src/core/geoqode-native.js",
        "pwai-controller/src/core/geoqode-native.js",
      ],
    },
    metadata: {
      category: "merkaba-hardening",
      session: "Round7",
      date: "2026-04-30",
    },
  },
  {
    key: "merkaba-round7-complete",
    data: {
      event: "Round 7 Merkaba canonical hardening arc COMPLETE",
      date: "2026-04-30",
      architecture: "8,26,48:480",
      roundSummary:
        "Live ecosystem sweep + all REAL critical/high/medium findings fixed across 4 repos",
      completedThisRound: [
        "MerkabaBeEyeSwarm.js: 8-drone autonomous compound-eye diagnostic (788 lines, committed)",
        "run-swarm-sweep.mjs: live sweep script, 20/20 canonical files in one command",
        "MerkabaPacket.js: cross-repo import bomb → self-contained (CRITICAL fix)",
        "CONSCIOUSNESS_LATTICE_MAP: canonical 8-sector lattice map added to ai-worker + s4ai-core",
        "MEME_LATTICE_MAP: 5 seed meme patterns with canonical Hz in memetic-evolution-engine",
        "meta-reasoning.js: exportState() carries full GeoQode coordinate envelope",
        "quantum-reasoning-v3.js: semanticDimensions 64→48 (canonical lattice dimension)",
        "9 files: canonical arch assertions added (fail-fast at module load)",
        "6 files: @alignment 8→26→48:480 JSDoc annotations added",
        "CONSCIOUSNESS_LATTICE_MAP: exported from s4ai-core/src/intelligence/index.js",
      ],
      kbEntriesLive: 18,
      ecosystemCoherenceBeforeRound7: 0.954,
      expectedCoherenceAfter: 0.98,
      nextFocus:
        "Run second swarm sweep to verify all fixes, check harmonicNode formula in BeEyeSwarm",
    },
    metadata: {
      category: "merkaba-milestones",
      session: "Round7",
      date: "2026-04-30",
    },
  },
];

let ok = 0;
for (const e of ENTRIES) {
  const success = await postKB(e.key, e.data, e.metadata);
  if (success) ok++;
}
console.log(`\n${ok}/${ENTRIES.length} KB entries posted.`);
