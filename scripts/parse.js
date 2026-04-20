// scripts/parse.js
// Parse a GeoQode program and show AST

import fs from "fs";
import path from "path";
import { Parser } from "../geo/grammar/parser.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node scripts/parse.js <program.geo>");
    process.exit(1);
  }

  const programFile = args[0];

  if (!fs.existsSync(programFile)) {
    console.error(`File not found: ${programFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(programFile, "utf-8");

  console.log(`\n🌌 GeoQode Parser`);
  console.log(`📝 Parsing: ${path.basename(programFile)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  try {
    const parser = new Parser(source);
    const ast = parser.parse();

    console.log("✅ Parse Successful\n");
    console.log("📋 AST:");
    console.log(JSON.stringify(ast, null, 2));
  } catch (error) {
    console.error(`\n❌ Parse Error: ${error.message}`);
    process.exit(1);
  }
}

main();
