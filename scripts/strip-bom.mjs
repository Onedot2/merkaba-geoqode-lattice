import { readFileSync, writeFileSync } from "fs";
import { readdirSync } from "fs";

const dir = "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public";
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);

const files = readdirSync(dir).filter((f) => f.endsWith(".html"));
let fixed = 0;
for (const f of files) {
  const path = `${dir}/${f}`;
  const buf = readFileSync(path);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    writeFileSync(path, buf.slice(3));
    console.log("Stripped BOM:", f);
    fixed++;
  }
}
console.log(`Fixed ${fixed} files`);
