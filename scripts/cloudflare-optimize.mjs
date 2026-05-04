/**
 * Cloudflare Optimization Script for realaios.com
 * ─────────────────────────────────────────────────
 * Applies performance, security, and caching settings via the Cloudflare API.
 *
 * Usage:
 *   node scripts/cloudflare-optimize.mjs
 *
 * Prerequisites — set these env vars (from Railway shared vars):
 *   CLOUDFLARE_API_TOKEN   — Zone + Workers token
 *   CLOUDFLARE_API_ZONE_ID — Zone ID for realaios.com
 *   CLOUDFLARE_ACCOUNT_ID  — d53775f91e80e762230bcad12e4a70e6
 *
 * Or pass them inline:
 *   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_API_ZONE_ID=yyy node scripts/cloudflare-optimize.mjs
 */

const CF_API = "https://api.cloudflare.com/client/v4";
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_API_ZONE_ID;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "d53775f91e80e762230bcad12e4a70e6";

if (!TOKEN || !ZONE_ID) {
  console.error("❌ Missing CLOUDFLARE_API_TOKEN and/or CLOUDFLARE_API_ZONE_ID");
  console.error("   Get CLOUDFLARE_API_ZONE_ID from: https://dash.cloudflare.com → realaios.com → Overview");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function cf(method, path, body) {
  const url = `${CF_API}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return data;
}

async function patch(setting, value) {
  const res = await cf("PATCH", `/zones/${ZONE_ID}/settings/${setting}`, { value });
  if (res.success) {
    console.log(`  ✅ ${setting} = ${JSON.stringify(value)}`);
  } else {
    console.warn(`  ⚠️  ${setting}: ${res.errors?.[0]?.message || JSON.stringify(res.errors)}`);
  }
}

async function run() {
  console.log("🌩️  Cloudflare Optimization — realaios.com");
  console.log(`   Zone: ${ZONE_ID}`);
  console.log(`   Account: ${ACCOUNT_ID}\n`);

  // ── Verify zone is realaios.com ─────────────────────────────────────────
  const zoneInfo = await cf("GET", `/zones/${ZONE_ID}`);
  if (!zoneInfo.success) {
    console.error("❌ Cannot read zone info:", zoneInfo.errors?.[0]?.message);
    process.exit(1);
  }
  console.log(`   Domain: ${zoneInfo.result?.name || "unknown"}`);
  if (!zoneInfo.result?.name?.includes("realaios")) {
    console.error("❌ Zone does not appear to be realaios.com — aborting");
    process.exit(1);
  }
  console.log("");

  // ── Security settings ────────────────────────────────────────────────────
  console.log("🔒 Security:");
  await patch("ssl", "full");                         // SSL/TLS: Full
  await patch("min_tls_version", "1.2");              // Minimum TLS 1.2
  await patch("tls_1_3", "zrt");                      // TLS 1.3 + 0-RTT
  await patch("security_level", "medium");            // Security level: Medium
  await patch("browser_check", "on");                 // Browser integrity check
  await patch("hotlink_protection", "off");           // Allow embedding (AIOS VR iframes)

  // ── Performance settings ─────────────────────────────────────────────────
  console.log("\n⚡ Performance:");
  await patch("minify", { js: "on", css: "on", html: "off" }); // Minify JS+CSS (not HTML — server already does it)
  await patch("brotli", "on");                        // Brotli compression
  await patch("http2", "on");                         // HTTP/2
  await patch("http3", "on");                         // HTTP/3 (QUIC)
  await patch("0rtt", "on");                          // 0-RTT resumption
  await patch("early_hints", "on");                   // Early Hints (103)
  await patch("rocket_loader", "off");                // Rocket Loader OFF (server-rendered, causes issues)
  await patch("browser_cache_ttl", 14400);            // Browser cache: 4 hours (respects Cache-Control from server)
  await patch("always_use_https", "on");              // Force HTTPS
  await patch("automatic_https_rewrites", "on");      // Rewrite http:// links in HTML

  // ── Cache rules for static assets ────────────────────────────────────────
  console.log("\n📦 Cache Rules:");
  const existingRules = await cf("GET", `/zones/${ZONE_ID}/rulesets?phase=http_request_cache_settings`);
  // Check for existing rules to avoid duplicates
  const existingIds = (existingRules.result || []).map((r) => r.id);

  const cacheRuleBody = {
    name: "AIOS Static Asset Cache",
    kind: "zone",
    phase: "http_request_cache_settings",
    rules: [
      {
        description: "Cache /public/* static assets at edge for 7 days",
        expression: `(http.request.uri.path matches "^/public/")`,
        action: "set_cache_settings",
        action_parameters: {
          cache: true,
          edge_ttl: {
            mode: "override_origin",
            default: 604800, // 7 days
          },
          browser_ttl: {
            mode: "override_origin",
            default: 86400, // 1 day browser
          },
        },
      },
      {
        description: "Cache JSON API feeds (news, llms) for 5 min",
        expression: `(http.request.uri.path in {"/news.json" "/api/news" "/llms.txt"})`,
        action: "set_cache_settings",
        action_parameters: {
          cache: true,
          edge_ttl: {
            mode: "override_origin",
            default: 300, // 5 min
          },
        },
      },
      {
        description: "Cache HTML pages for 10 min at edge",
        expression: `(http.request.uri.path matches "^/(news|claude|experiences|products|vr-hub|start|ai)$")`,
        action: "set_cache_settings",
        action_parameters: {
          cache: true,
          edge_ttl: {
            mode: "override_origin",
            default: 600, // 10 min
          },
        },
      },
    ],
  };

  if (existingIds.length === 0) {
    const ruleRes = await cf("POST", `/zones/${ZONE_ID}/rulesets`, cacheRuleBody);
    if (ruleRes.success) {
      console.log(`  ✅ Cache ruleset created (ID: ${ruleRes.result?.id})`);
    } else {
      console.warn(`  ⚠️  Cache rules: ${ruleRes.errors?.[0]?.message || JSON.stringify(ruleRes.errors)}`);
    }
  } else {
    // Update existing ruleset
    const rulesetId = existingIds[0];
    const ruleRes = await cf("PUT", `/zones/${ZONE_ID}/rulesets/${rulesetId}`, cacheRuleBody);
    if (ruleRes.success) {
      console.log(`  ✅ Cache ruleset updated (ID: ${rulesetId})`);
    } else {
      console.warn(`  ⚠️  Cache rules: ${ruleRes.errors?.[0]?.message || JSON.stringify(ruleRes.errors)}`);
    }
  }

  // ── Polish + Speed ────────────────────────────────────────────────────────
  console.log("\n🖼️  Polish & Images:");
  await patch("polish", "lossy");                     // Image optimization (lossy)
  await patch("webp", "on");                          // Auto-convert to WebP

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("\n🏁 Done! Railway must be set to:\n");
  console.log("   GOOGLE_SITE_VERIFICATION=<your-GSC-token>   (after GSC setup)");
  console.log("   GA_MEASUREMENT_ID=G-E3NTLP8HS3              (analytics ID — optional, fallback hardcoded)");
  console.log("\n   Test GA4:   https://analytics.google.com → Realtime → realaios.com");
  console.log("   Test GSC:   https://search.google.com/search-console");
  console.log("   Test Speed: https://pagespeed.web.dev/report?url=https://realaios.com\n");
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
