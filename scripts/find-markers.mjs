import { readFileSync, writeFileSync } from "fs";

const file =
  "c:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
const c = readFileSync(file, "utf-8");

// Find the geo-vs-mp4 section
const geoIdx = c.indexOf('id="geo-vs-mp4"');
const beforeGeo = c.lastIndexOf("<!--", geoIdx);
const snippet = c.slice(beforeGeo, beforeGeo + 100);
console.log("Comment before geo-vs-mp4:", JSON.stringify(snippet));
console.log("Hex:", Buffer.from(snippet.slice(0, 40)).toString("hex"));

// Find the philosophy comment
const philoIdx = c.indexOf("PHILOSOPHY");
const beforePhilo = c.lastIndexOf("<!--", philoIdx);
const philoSnippet = c.slice(beforePhilo - 5, beforePhilo + 30);
console.log("Philosophy comment:", JSON.stringify(philoSnippet));

// Find BUILD FOR AIOS
const devIdx = c.indexOf("dev-section");
const beforeDev = c.lastIndexOf("<!--", devIdx);
console.log(
  "Dev section comment:",
  JSON.stringify(c.slice(beforeDev - 5, beforeDev + 40)),
);

// Find FOOTER comment
const footerIdx = c.indexOf("footer-brand");
const beforeFooter = c.lastIndexOf("<!--", footerIdx);
console.log(
  "Footer comment:",
  JSON.stringify(c.slice(beforeFooter - 5, beforeFooter + 30)),
);
