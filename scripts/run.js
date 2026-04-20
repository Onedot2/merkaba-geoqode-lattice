// scripts/run.js
// Run a GeoQode program

import fs from "fs";
import path from "path";
import MerkabageoqodeOS from "../geo/index.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node scripts/run.js <program.geo>");
    process.exit(1);
  }

  const programFile = args[0];

  if (!fs.existsSync(programFile)) {
    console.error(`File not found: ${programFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(programFile, "utf-8");

  console.log(`\n🌌 MERKABA_geoqode OS`);
  console.log(`📝 Executing: ${path.basename(programFile)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const os = new MerkabageoqodeOS();

  try {
    const result = await os.run(source);

    if (result.success) {
      console.log(`\n✅ Execution Complete`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      if (result.statusReport) {
        console.log("📊 STATUS_REPORT:");
        console.log(JSON.stringify(result.statusReport, null, 2));
      }
    } else {
      console.error(`\n❌ Execution Failed`);
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n🚨 Critical Error: ${error.message}`);
    process.exit(1);
  }
}

main();
