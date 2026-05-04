#!/usr/bin/env node
/**
 * deploy-vr-experiences.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * CI/CD script: Publishes all AIOS VR experiences to PLAIstore API.
 *
 * Usage:
 *   node scripts/deploy-vr-experiences.mjs
 *   node scripts/deploy-vr-experiences.mjs --dry-run
 *   node scripts/deploy-vr-experiences.mjs --category=cinema
 *   node scripts/deploy-vr-experiences.mjs --status=live
 *   node scripts/deploy-vr-experiences.mjs --dry-run --category=lab
 *
 * Environment:
 *   ADMIN_JWT   — required (365d admin token)
 *   API_BASE    — optional (default: https://api.getbrains4ai.com)
 *
 * Outputs:
 *   - Publishes each "live" experience to POST /api/plai/developer/apps
 *   - Writes deploy status to KB: POST /api/knowledge/aios-vr-deploy-status
 *   - Prints summary table to stdout
 *
 * Canonical Merkaba constants:
 *   PHI = 1.618 · PSI = 1.414 · CANONICAL_ARCHITECTURE = "8,26,48:480"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Constants ─────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT  = join(__dirname, "..");
const TAXONOMY_PATH = join(REPO_ROOT, "data", "vr-taxonomy.json");
const API_BASE   = process.env.API_BASE || "https://api.getbrains4ai.com";
const ADMIN_JWT  = process.env.ADMIN_JWT || "";

const PHI = 1.618;
const PSI = 1.414;
const CANONICAL_ARCHITECTURE = "8,26,48:480";
const AIOS_ENTRY = process.env.AIOS_ENTRY || "https://realaios.com";

// ── CLI arg parsing ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN        = args.includes("--dry-run");
const filterCategory = (args.find(a => a.startsWith("--category=")) || "").replace("--category=", "") || null;
const filterStatus   = (args.find(a => a.startsWith("--status="))   || "").replace("--status=",   "") || "live";

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad(str, n) { return String(str).padEnd(n); }
function log(msg)    { console.log(`[deploy-vr] ${msg}`); }
function warn(msg)   { console.warn(`[deploy-vr] ⚠️  ${msg}`); }
function ok(msg)     { console.log(`[deploy-vr] ✅ ${msg}`); }
function fail(msg)   { console.error(`[deploy-vr] ❌ ${msg}`); }

async function postJSON(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, ok: res.ok, json };
}

function buildAuthHeaders() {
  if (!ADMIN_JWT) throw new Error("ADMIN_JWT env var is required");
  return { Authorization: `Bearer ${ADMIN_JWT}` };
}

// ── Map taxonomy experience → PLAIstore app payload ──────────────────────────
function experienceToAppPayload(xp, category) {
  return {
    name:        xp.display,
    bundle_id:   `com.aios.vr.${xp.id}`,
    category:    "VR",
    type:        "experience",
    version:     xp.version || "1.0.0",
    short_desc:  xp.shortDesc || xp.description.slice(0, 120),
    description: xp.description,
    icon_url:    `${AIOS_ENTRY}/assets/icons/vr/${xp.id}.png`,
    entry_point: xp.vrUrl || `${AIOS_ENTRY}/vr?prog=${xp.id}`,
    price_cents: 0,
    tags:        [...(xp.tags || []), "vr", "aios", category.id, xp.semanticType?.toLowerCase()].filter(Boolean),
    meta: {
      frequencyHz:           xp.frequencyHz,
      latticeNode:           xp.latticeNode,
      harmonicNode:          xp.harmonicNode,
      semanticType:          xp.semanticType,
      questCompatible:       xp.questCompatible,
      flatCompatible:        xp.flatCompatible,
      estimatedDuration:     xp.estimatedDuration,
      canonicalArchitecture: CANONICAL_ARCHITECTURE,
      phi:                   PHI,
      psi:                   PSI,
      categoryAccent:        category.accent,
      vrHubUrl:              `${AIOS_ENTRY}/vr-hub#${category.id}`,
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // ── Guard: ADMIN_JWT ───────────────────────────────────────────────────────
  if (!ADMIN_JWT && !DRY_RUN) {
    fail("ADMIN_JWT env var is required. Export it before running.");
    fail("  export ADMIN_JWT=<your-admin-token>");
    fail("  Or run with --dry-run to simulate without auth.");
    process.exit(1);
  }

  // ── Load taxonomy ──────────────────────────────────────────────────────────
  if (!existsSync(TAXONOMY_PATH)) {
    fail(`Taxonomy file not found: ${TAXONOMY_PATH}`);
    process.exit(1);
  }

  let taxonomy;
  try {
    taxonomy = JSON.parse(readFileSync(TAXONOMY_PATH, "utf-8"));
  } catch (err) {
    fail(`Failed to parse vr-taxonomy.json: ${err.message}`);
    process.exit(1);
  }

  const { categories = [], version, platform } = taxonomy;
  log(`Loaded taxonomy v${version} — ${platform} — ${categories.length} categories`);
  log(`CANONICAL_ARCHITECTURE: ${CANONICAL_ARCHITECTURE} · PHI=${PHI} · PSI=${PSI}`);
  log(`API_BASE: ${API_BASE}`);
  if (DRY_RUN) log("🔶 DRY RUN mode — no actual API calls will be made");
  if (filterCategory) log(`Category filter: ${filterCategory}`);
  if (filterStatus)   log(`Status filter: ${filterStatus}`);
  console.log("");

  // ── Collect experiences to deploy ──────────────────────────────────────────
  const toPublish = [];
  const toSkip    = [];

  for (const cat of categories) {
    if (filterCategory && cat.id !== filterCategory) continue;
    for (const xp of cat.experiences || []) {
      if (filterStatus && xp.status !== filterStatus) {
        toSkip.push({ xp, cat, reason: `status=${xp.status}` });
        continue;
      }
      toPublish.push({ xp, cat });
    }
  }

  log(`Experiences to publish: ${toPublish.length} | Skipping: ${toSkip.length}`);
  console.log("");

  // ── Print plan table ───────────────────────────────────────────────────────
  console.log(pad("ID", 24) + pad("Category", 14) + pad("Status", 10) + "Freq/Lattice");
  console.log("─".repeat(72));
  for (const { xp, cat } of toPublish) {
    console.log(pad(xp.id, 24) + pad(cat.display, 14) + pad(xp.status, 10) + `${xp.frequencyHz}Hz · N${xp.latticeNode}`);
  }
  console.log("");

  // ── Deploy ─────────────────────────────────────────────────────────────────
  const results = { published: 0, skipped: toSkip.length, failed: 0, details: [] };

  for (const { xp, cat } of toPublish) {
    const payload = experienceToAppPayload(xp, cat);
    const label = `${xp.id} (${cat.display})`;

    if (DRY_RUN) {
      ok(`[DRY] Would publish: ${label}`);
      results.published++;
      results.details.push({ id: xp.id, category: cat.id, status: "dry-run", payload });
      continue;
    }

    try {
      const headers = buildAuthHeaders();
      const { status, ok: isOk, json } = await postJSON(
        `${API_BASE}/api/plai/developer/apps`,
        payload,
        headers
      );

      if (isOk) {
        ok(`Published: ${label} → app_id=${json.app?.id || json.id || "?"}`);
        results.published++;
        results.details.push({ id: xp.id, category: cat.id, status: "published", appId: json.app?.id || json.id });
      } else if (status === 409) {
        warn(`Already exists: ${label} (409 Conflict) — skipping`);
        results.skipped++;
        results.details.push({ id: xp.id, category: cat.id, status: "already_exists" });
      } else {
        fail(`Failed: ${label} — HTTP ${status}: ${JSON.stringify(json).slice(0, 120)}`);
        results.failed++;
        results.details.push({ id: xp.id, category: cat.id, status: "failed", httpStatus: status, error: json });
      }
    } catch (err) {
      fail(`Network error for ${label}: ${err.message}`);
      results.failed++;
      results.details.push({ id: xp.id, category: cat.id, status: "error", error: err.message });
    }

    // Brief pause to avoid rate-limiting
    await new Promise(r => setTimeout(r, 150));
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("");
  console.log("═".repeat(72));
  log(`DEPLOY SUMMARY`);
  console.log(`  Published : ${results.published}`);
  console.log(`  Skipped   : ${results.skipped}`);
  console.log(`  Failed    : ${results.failed}`);
  console.log(`  Total     : ${toPublish.length + toSkip.length}`);
  console.log("═".repeat(72));

  // ── Write status to KB ────────────────────────────────────────────────────
  if (!DRY_RUN && ADMIN_JWT) {
    try {
      const kbPayload = {
        data: {
          deployedAt:            new Date().toISOString(),
          taxonomyVersion:       version,
          platform,
          canonicalArchitecture: CANONICAL_ARCHITECTURE,
          phi:                   PHI,
          psi:                   PSI,
          summary: {
            published: results.published,
            skipped:   results.skipped,
            failed:    results.failed,
            total:     toPublish.length + toSkip.length,
          },
          filters: { category: filterCategory, status: filterStatus },
          details: results.details,
          cicdVersion: taxonomy.meta?.cicdVersion || "1.0.0",
        },
      };

      const { ok: kbOk, status: kbStatus } = await postJSON(
        `${API_BASE}/api/knowledge/aios-vr-deploy-status`,
        kbPayload,
        buildAuthHeaders()
      );

      if (kbOk) {
        ok(`KB updated: aios-vr-deploy-status`);
      } else {
        warn(`KB write returned HTTP ${kbStatus} — deploy still succeeded`);
      }
    } catch (err) {
      warn(`KB write failed: ${err.message} — deploy results not persisted`);
    }
  }

  // ── Exit code ─────────────────────────────────────────────────────────────
  if (results.failed > 0) {
    fail(`${results.failed} experience(s) failed to publish`);
    process.exit(1);
  }

  ok(`All done ⚡ PHI=${PHI} · PSI=${PSI} · ${CANONICAL_ARCHITECTURE}`);
}

main().catch(err => {
  fail(`Unhandled error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
