/**
 * sweep-debug.mjs — Full site debug sweep
 * Checks: broken internal links, JSON-LD validity, stale tokens,
 *         missing meta tags, image alts, duplicate IDs, unsafe inline,
 *         open graph completeness, canonical mismatches.
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const SERVER = join(ROOT, "server.js");

const serverSrc = readFileSync(SERVER, "utf8");
const htmlFiles = readdirSync(PUBLIC).filter((f) => f.endsWith(".html"));

// ── 1. Extract served routes from server.js ───────────────────────────────
const routePat = new RegExp("pathname\\s*===?\\s*['\"](\\/[^'\"]*)['\"]", "g");
const routes = new Set([...serverSrc.matchAll(routePat)].map((m) => m[1]));
routes.add("/");

// ── 2. Run checks on each HTML file ──────────────────────────────────────
const issues = [];
const warn = (file, type, msg) => issues.push({ file, type, msg });

for (const file of htmlFiles) {
  const html = readFileSync(join(PUBLIC, file), "utf8");
  const page = `/${file.replace("index.html", "").replace(".html", "")}` || "/";

  // --- Stale tokens (not replaced by withMeta) ---
  for (const tok of [
    "__VR_LIVE__",
    "__VR_TOTAL__",
    "__VR_CATS__",
    "__GAME_COUNT__",
  ]) {
    if (html.includes(tok))
      warn(
        file,
        "STALE_TOKEN",
        `Token ${tok} not replaced — is this file served via withMeta()?`,
      );
  }

  // --- Broken internal links ---
  const hrefPat2 = new RegExp("href=[\"'](\\/[a-z0-9][a-z0-9/_-]*)[\"']", "g");
  const hrefs = [...html.matchAll(hrefPat2)].map(
    (m) => m[1].split("?")[0].split("#")[0].replace(/\/$/, "") || "/",
  );
  for (const href of new Set(hrefs)) {
    const covered = [...routes].some(
      (r) => href === r || href.startsWith(r + "/"),
    );
    if (
      !covered &&
      href.length > 1 &&
      !href.startsWith("/api/") &&
      !href.startsWith("/games/")
    ) {
      warn(
        file,
        "BROKEN_LINK",
        `href="${href}" — not served by any server.js route`,
      );
    }
  }

  // --- Missing <title> ---
  if (!/<title>/i.test(html)) warn(file, "MISSING_TITLE", "No <title> tag");

  // --- Missing meta description ---
  if (!/<meta\s+name="description"/i.test(html))
    warn(file, "MISSING_META_DESC", "No meta description");

  // --- Missing OG tags ---
  if (!/<meta\s+property="og:title"/i.test(html))
    warn(file, "MISSING_OG", "No og:title");
  if (!/<meta\s+property="og:image"/i.test(html))
    warn(file, "MISSING_OG", "No og:image");

  // --- Missing canonical ---
  if (!/<link\s+rel="canonical"/i.test(html))
    warn(file, "MISSING_CANONICAL", "No canonical link");

  // --- JSON-LD validity (basic) ---
  const jsonLdMatches = [
    ...html.matchAll(
      /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    ),
  ];
  for (const m of jsonLdMatches) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      warn(
        file,
        "INVALID_JSON_LD",
        `JSON-LD parse error: ${e.message.slice(0, 80)}`,
      );
    }
  }

  // --- Images missing alt ---
  const imgNoAlt = [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/gi)];
  if (imgNoAlt.length)
    warn(file, "IMG_NO_ALT", `${imgNoAlt.length} <img> tag(s) missing alt`);

  // --- Duplicate IDs ---
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length)
    warn(
      file,
      "DUPLICATE_ID",
      `Duplicate IDs: ${[...new Set(dupes)].join(", ")}`,
    );

  // --- Low-contrast danger signals (very dark inline colors on dark bg pages) ---
  const darkOnDark = [
    ...html.matchAll(/color:\s*rgba\([\d,\s]*,\s*0\.[0-2]\d*\)/g),
  ];
  if (darkOnDark.length > 3)
    warn(
      file,
      "LOW_CONTRAST",
      `${darkOnDark.length} rgba colors with opacity ≤0.29 (potential contrast issue)`,
    );

  // --- Hardcoded stale counts not yet tokenized ---
  const staleNums = [
    ...html.matchAll(
      /\b(23|48)\s+(live|VR|XP|XPs|Live|categories|WebXR|experience|experiences|slots)/g,
    ),
  ];
  if (staleNums.length)
    warn(
      file,
      "STALE_COUNT",
      `Hardcoded stale numbers: ${staleNums.map((m) => m[0]).join(" | ")}`,
    );

  // --- Console.log in inline scripts (debug noise) ---
  const consoleLogs = [...html.matchAll(/console\.log\s*\(/g)];
  if (consoleLogs.length > 3)
    warn(
      file,
      "CONSOLE_LOG",
      `${consoleLogs.length} console.log() calls in inline scripts`,
    );

  // --- Mixed content risk: http:// in src/href ---
  const httpRefs = [
    ...html.matchAll(/(?:src|href)=["']http:\/\/(?!localhost)[^"']+["']/g),
  ];
  if (httpRefs.length)
    warn(
      file,
      "MIXED_CONTENT",
      `http:// refs: ${httpRefs.map((m) => m[0].slice(0, 60)).join(", ")}`,
    );
}

// ── 3. server.js specific checks ─────────────────────────────────────────
// CSP connect-src coverage
const cspLine = serverSrc.match(/connect-src[^;'"`]+/)?.[0] || "";
const requiredCspDomains = [
  "googletagmanager.com",
  "google-analytics.com",
  "analytics.google.com",
];
for (const d of requiredCspDomains) {
  if (!cspLine.includes(d))
    warn("server.js", "CSP_GAP", `connect-src missing ${d}`);
}

// Routes with no HTML var guard (serving null crashes)
const nullGuards = [...serverSrc.matchAll(/if\s*\(!([A-Z_]+_HTML)\)/g)].map(
  (m) => m[1],
);
const htmlVars = [...serverSrc.matchAll(/const\s+([A-Z_]+_HTML)\s*=/g)].map(
  (m) => m[1],
);
for (const v of htmlVars) {
  if (!nullGuards.includes(v) && v !== "AIOS67_HTML") {
    // Only flag if it's actually used in a res.end() call
    if (serverSrc.includes(`res.end(${v})`)) {
      warn(
        "server.js",
        "NO_NULL_GUARD",
        `${v} used in res.end() but may lack null check`,
      );
    }
  }
}

// ── 4. Output ─────────────────────────────────────────────────────────────
const byType = {};
for (const i of issues) {
  byType[i.type] = byType[i.type] || [];
  byType[i.type].push(i);
}

console.log("\n═══ SWEEP DEBUG REPORT ═══\n");
const typeOrder = [
  "STALE_TOKEN",
  "STALE_COUNT",
  "BROKEN_LINK",
  "INVALID_JSON_LD",
  "MISSING_CANONICAL",
  "MISSING_OG",
  "MISSING_META_DESC",
  "MISSING_TITLE",
  "IMG_NO_ALT",
  "DUPLICATE_ID",
  "LOW_CONTRAST",
  "CONSOLE_LOG",
  "MIXED_CONTENT",
  "CSP_GAP",
  "NO_NULL_GUARD",
];
for (const type of typeOrder) {
  const group = byType[type];
  if (!group) continue;
  console.log(`\n▸ ${type} (${group.length})`);
  for (const i of group) console.log(`  [${i.file}] ${i.msg}`);
}
const uncategorized = Object.keys(byType).filter((k) => !typeOrder.includes(k));
for (const type of uncategorized) {
  console.log(`\n▸ ${type} (${byType[type].length})`);
  for (const i of byType[type]) console.log(`  [${i.file}] ${i.msg}`);
}
console.log(`\n═══ ${issues.length} total issues found ═══\n`);
