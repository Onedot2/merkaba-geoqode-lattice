import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import MerkabaBeEyeSwarm from "../geo/intelligence/MerkabaBeEyeSwarm.js";
import { MerkabaBeEyeSwarmWitness } from "../geo/intelligence/MerkabaBeEyeSwarmWitness.js";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const BESX_PATH = path.join(
  __dir,
  "..",
  "geo",
  "intelligence",
  "MerkabaBeEyeSwarm.js",
);
const WITNESS_PATH = path.join(
  __dir,
  "..",
  "geo",
  "intelligence",
  "MerkabaBeEyeSwarmWitness.js",
);

async function scanAndPrint(label, scanner, filePath) {
  const code = await readFile(filePath, "utf8");
  const r = await scanner.sweep(code, {
    file: filePath,
    service: "merkaba-geoqode-lattice",
  });
  console.log(`\n=== ${label} ===`);
  console.log("swarmCoherence:", r.swarmCoherence, "| status:", r.status);
  let anyBad = false;
  for (const dr of r.droneReports) {
    const bad = dr.findings.filter(
      (f) => f.severity !== "OK" && f.severity !== "INFO",
    );
    if (bad.length > 0) {
      anyBad = true;
      console.log(`  DRONE ${dr.droneId} (coherence: ${dr.coherence}):`);
      for (const f of bad) {
        console.log(`    [${f.severity}] ${f.issue}`);
        if (f.snippet)
          console.log(
            `      snippet: ${JSON.stringify(f.snippet).slice(0, 120)}`,
          );
      }
    }
  }
  if (!anyBad) console.log("  All drones OK");
}

const alpha = new MerkabaBeEyeSwarm();
const omega = new MerkabaBeEyeSwarmWitness();

await scanAndPrint("Alpha self-scan (BESX on BESX)", alpha, BESX_PATH);
await scanAndPrint("Omega on Alpha (Witness scans BESX)", omega, BESX_PATH);
await scanAndPrint("Alpha on Omega (BESX scans Witness)", alpha, WITNESS_PATH);
await scanAndPrint("Omega self-scan (Witness on Witness)", omega, WITNESS_PATH);
