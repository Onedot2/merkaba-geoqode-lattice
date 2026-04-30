import { readFile } from "node:fs/promises";
import MerkabaBeEyeSwarm from "../geo/intelligence/MerkabaBeEyeSwarm.js";
import { MerkabaBeEyeSwarmWitness } from "../geo/intelligence/MerkabaBeEyeSwarmWitness.js";
import { attestScanner } from "../geo/intelligence/MerkabaDualAttestation.js";

import { fileURLToPath } from "node:url";
import path from "node:path";
const __dir = path.dirname(fileURLToPath(import.meta.url));
const BESX_PATH = path.join(
  __dir,
  "..",
  "geo",
  "intelligence",
  "MerkabaBeEyeSwarm.js",
);
const code = await readFile(BESX_PATH, "utf8");

// Test 1: Raw sweep of BESX source (bypass sweepFile guard)
const swarm = new MerkabaBeEyeSwarm();
const r = await swarm.sweep(code, {
  file: "MerkabaBeEyeSwarm.js",
  service: "merkaba-geoqode-lattice",
});
console.log("=== TEST 1: BESX genuine self-sweep (no guard bypass) ===");
console.log(
  "coherence:",
  r.swarmCoherence,
  "| status:",
  r.status,
  "| findings:",
  JSON.stringify(r.summary),
);

// Test 2: Witness scans BESX source via sweepFile (should NOT self-exclude)
const witness = new MerkabaBeEyeSwarmWitness();
const r2 = await witness.sweepFile(BESX_PATH);
console.log("\n=== TEST 2: Witness scans BESX via sweepFile ===");
console.log(
  "coherence:",
  r2.swarmCoherence,
  "| status:",
  r2.status,
  "| selfExcluded:",
  r2.selfExcluded ?? false,
);

// Test 3: BESX scans Witness via sweepFile (should NOT self-exclude)
const WITNESS_PATH = path.join(
  __dir,
  "..",
  "geo",
  "intelligence",
  "MerkabaBeEyeSwarmWitness.js",
);
const r3 = await swarm.sweepFile(WITNESS_PATH);
console.log("\n=== TEST 3: BESX scans Witness via sweepFile ===");
console.log(
  "coherence:",
  r3.swarmCoherence,
  "| status:",
  r3.status,
  "| selfExcluded:",
  r3.selfExcluded ?? false,
);

// Test 4: Full scanner mutual attestation
const mut = await attestScanner();
console.log("\n=== TEST 4: Full Mutual Attestation (attestScanner) ===");
console.log(
  "alphaOnOmega coherence:",
  mut.alphaOnOmega.swarmCoherence,
  "status:",
  mut.alphaOnOmega.status,
);
console.log(
  "omegaOnAlpha coherence:",
  mut.omegaOnAlpha.swarmCoherence,
  "status:",
  mut.omegaOnAlpha.status,
);
console.log(
  "consensus:",
  mut.consensus,
  "| scannerTrusted:",
  mut.scannerTrusted,
);
console.log("status:", mut.status);
