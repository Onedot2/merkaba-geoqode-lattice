// scripts/compliance-check.js
// Check program compliance

import fs from "fs";
import path from "path";
import { Parser } from "../geo/grammar/parser.js";
import { ComplianceValidator } from "../geo/runtime/compliance.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node scripts/compliance-check.js <program.geo>");
    process.exit(1);
  }

  const programFile = args[0];

  if (!fs.existsSync(programFile)) {
    console.error(`File not found: ${programFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(programFile, "utf-8");

  console.log(`\n🌌 GeoQode Compliance Checker`);
  console.log(`📝 Checking: ${path.basename(programFile)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  try {
    const parser = new Parser(source);
    const ast = parser.parse();

    const validator = new ComplianceValidator();
    const isSyntaxValid = validator.validateSyntax(ast);

    if (!isSyntaxValid) {
      console.error("❌ Syntax validation failed");
      process.exit(1);
    }

    const report = validator.getComplianceReport();

    console.log("✅ Compliance Check Complete\n");
    console.log("📋 Compliance Report:");
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
