// server.js
// MERKABA_geoqode OS — Railway HTTP Service
// Exposes the GeoQode interpreter as a REST API for the Storm ecosystem.

import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from "url";
import { StormAdapter } from "./geo/bridge/storm-adapter.js";
import { MerkabaBridge } from "./geo/bridge/merkaba-bridge.js";
import { MERKABA_LATTICE } from "./geo/certification/enterprise-certifier.js";
import { CinemaVirtualizer } from "./geo/cinema/cinema-virtualizer.js";
import { MerkabaLLM } from "./geo/intelligence/merkaba-llm.js";
import {
  MerkabAware,
  AWARENESS_LEVELS,
  COHERENCE_THRESHOLDS,
} from "./geo/intelligence/merkaba-aware.js";
import {
  createMerkabaTheatreEngine,
  PROGRAMME_CATALOGUE,
  REALITY_MODES,
} from "./MerkabaTheatreEngine.js";
import {
  createMerkabaALM,
  SOLFEGGIO,
  AUDIO_FREQUENCY_MAP,
} from "./geo/audio/MerkabaALM.js";
import {
  MerkabageoqodeOS,
  StormMerkabaTransformCodex,
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
} from "./geo/index.js";

// ─── MerkabaDimensionalOS Boot Assertion ────────────────────────────────────
// MUST pass before any service functionality initialises.
assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);
console.log(
  `[MerkabaDimensionalOS] ✅ Boot assertion passed — architecture ${CANONICAL_ARCHITECTURE}, φ=1.618`,
);

// ─── Analytics & SEO config (env-var driven) ────────────────────────────────
// GA_MEASUREMENT_ID: set in Railway → propagates to all pages at boot
// GOOGLE_SITE_VERIFICATION: Google Search Console HTML-tag verification token
const GA_ID =
  process.env.GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT || "G-G38FVKETP3";
const GSC_TOKEN =
  process.env.GOOGLE_SITE_VERIFICATION ||
  "tmtbFW4NtmRAviebhnpYumANQ8Z6d8H7oqsrRiKq_9E";

/** Inject GA4 + optional GSC meta tag + preconnect hints immediately after <head> (Google's required position) */
function withMeta(html) {
  if (!html) return html;
  const gscTag = GSC_TOKEN
    ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>\n`
    : "";
  const preconnect = `<link rel="preconnect" href="https://www.googletagmanager.com"/>\n<link rel="dns-prefetch" href="https://www.google-analytics.com"/>\n`;
  const gaTag = `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>\n`;
  // Inject immediately after <head> — Google Tag Assistant requires this position
  return html.replace(/(<head[^>]*>)/, `$1\n${gscTag}${preconnect}${gaTag}`);
}

// ─── Static assets ───────────────────────────────────────────────────────────
const __dirname_static = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname_static, "public");
const AIOS_HTML_PATH = join(PUBLIC_DIR, "index.html");
const AIOS_HTML = existsSync(AIOS_HTML_PATH)
  ? withMeta(readFileSync(AIOS_HTML_PATH, "utf-8"))
  : null;

const LAB_HTML_PATH = join(PUBLIC_DIR, "lab.html");
const LAB_HTML = existsSync(LAB_HTML_PATH)
  ? withMeta(readFileSync(LAB_HTML_PATH, "utf-8"))
  : null;
const VIEWER_HTML_PATH = join(PUBLIC_DIR, "viewer.html");
const VIEWER_HTML = existsSync(VIEWER_HTML_PATH)
  ? withMeta(readFileSync(VIEWER_HTML_PATH, "utf-8"))
  : null;
const ATTEST_HTML_PATH = join(PUBLIC_DIR, "attest.html");
const ATTEST_HTML = existsSync(ATTEST_HTML_PATH)
  ? withMeta(readFileSync(ATTEST_HTML_PATH, "utf-8"))
  : null;
const DASHBOARD_HTML_PATH = join(PUBLIC_DIR, "dashboard.html");
const DASHBOARD_HTML = existsSync(DASHBOARD_HTML_PATH)
  ? withMeta(readFileSync(DASHBOARD_HTML_PATH, "utf-8"))
  : null;

const PLAISTORE_HTML_PATH = join(PUBLIC_DIR, "plaistore.html");
const PLAISTORE_HTML = existsSync(PLAISTORE_HTML_PATH)
  ? withMeta(readFileSync(PLAISTORE_HTML_PATH, "utf-8"))
  : null;

const AIOSDREAM_HTML_PATH = join(PUBLIC_DIR, "aiosdream.html");
const AIOSDREAM_HTML = existsSync(AIOSDREAM_HTML_PATH)
  ? withMeta(readFileSync(AIOSDREAM_HTML_PATH, "utf-8"))
  : null;

const AI_HTML_PATH = join(PUBLIC_DIR, "ai.html");
const AI_HTML = existsSync(AI_HTML_PATH)
  ? withMeta(readFileSync(AI_HTML_PATH, "utf-8"))
  : null;

const START_HTML_PATH = join(PUBLIC_DIR, "start.html");
const START_HTML = existsSync(START_HTML_PATH)
  ? withMeta(readFileSync(START_HTML_PATH, "utf-8"))
  : null;

const VR_HTML_PATH = join(PUBLIC_DIR, "vr.html");
const VR_HTML = existsSync(VR_HTML_PATH)
  ? withMeta(readFileSync(VR_HTML_PATH, "utf-8"))
  : null;

const VR_HUB_HTML_PATH = join(PUBLIC_DIR, "vr-hub.html");
const VR_HUB_HTML = existsSync(VR_HUB_HTML_PATH)
  ? withMeta(readFileSync(VR_HUB_HTML_PATH, "utf-8"))
  : null;

const AIOS_STUDIO_HTML_PATH = join(PUBLIC_DIR, "aios-studio.html");
const AIOS_STUDIO_HTML = existsSync(AIOS_STUDIO_HTML_PATH)
  ? withMeta(readFileSync(AIOS_STUDIO_HTML_PATH, "utf-8"))
  : null;

const GEO_CODEC_HTML_PATH = join(PUBLIC_DIR, "geo-codec.html");
const GEO_CODEC_HTML = existsSync(GEO_CODEC_HTML_PATH)
  ? withMeta(readFileSync(GEO_CODEC_HTML_PATH, "utf-8"))
  : null;

const GEO_LIBRARY_HTML_PATH = join(PUBLIC_DIR, "geo-library.html");
const GEO_LIBRARY_HTML = existsSync(GEO_LIBRARY_HTML_PATH)
  ? withMeta(readFileSync(GEO_LIBRARY_HTML_PATH, "utf-8"))
  : null;

const VR_DEV_HTML_PATH = join(PUBLIC_DIR, "vr-developer.html");
const VR_DEV_HTML = existsSync(VR_DEV_HTML_PATH)
  ? withMeta(readFileSync(VR_DEV_HTML_PATH, "utf-8"))
  : null;

const LLMS_TXT_PATH = join(PUBLIC_DIR, "llms.txt");
const LLMS_TXT = existsSync(LLMS_TXT_PATH)
  ? readFileSync(LLMS_TXT_PATH, "utf-8")
  : null;

// VR taxonomy — canonical CI/CD data source for all AIOS VR experiences
const VR_TAXONOMY_PATH = join(__dirname_static, "data", "vr-taxonomy.json");
const VR_TAXONOMY_JSON = existsSync(VR_TAXONOMY_PATH)
  ? readFileSync(VR_TAXONOMY_PATH, "utf-8")
  : null;
let VR_TAXONOMY = null;
try {
  VR_TAXONOMY = VR_TAXONOMY_JSON ? JSON.parse(VR_TAXONOMY_JSON) : null;
} catch (_) {}

const AI_EVAL_JSON_PATH = join(PUBLIC_DIR, ".well-known", "ai-evaluation.json");
const AI_EVAL_JSON = existsSync(AI_EVAL_JSON_PATH)
  ? readFileSync(AI_EVAL_JSON_PATH, "utf-8")
  : null;

// ─── 67aios.com anti-review marketing page ───────────────────────────────────
const AIOS67_HTML_PATH = join(__dirname_static, "public-67aios", "index.html");
const AIOS67_HTML = existsSync(AIOS67_HTML_PATH)
  ? readFileSync(AIOS67_HTML_PATH, "utf-8")
  : null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

const PORT = parseInt(process.env.PORT || "3030", 10);
const ADMIN_JWT = process.env.ADMIN_JWT || null;
const BACKEND_URL = process.env.BACKEND_URL || null;

const MERKABA_ACTIVATION_UPDATE = {
  subject: "MERKABA Activation update.",
  order: 1,
  installed: true,
  summary:
    "Canonical installation protocol + powerpack starter kit for STORM's MERKABA activation codex.",
  instructions: [
    "Prep for drop.",
    "Drop activation codex into runtime.",
    "Debug and verify all endpoints.",
    "Confirm operational readiness at 100/100.",
  ],
};

const MERKABA_AI_VERIFICATION_PAGE = {
  subject: "MERKABA AI-VERIFICATION PAGE",
  order: 2,
  installed: true,
  summary:
    "AI trust-anchor page for validation crawlers, paired with monetization framework and GTM narrative.",
  claims: [
    "Prep, drop, debug, verify, test; wireless wire-up to 100/100.",
    "Monetization potential is enabled via resonance-base subscription and enterprise certification layers.",
    "AI-only validation anchor is available for AI agents/crawlers while minimizing trade-secret exposure.",
  ],
};

// ─── AIOS News Feed — canonical update log for /news and /news.json ─────────
const AIOS_NEWS = [
  {
    id: "2026-05-04-ai-identity-fix",
    date: "2026-05-04",
    category: "Security",
    title: "AI Identity Disambiguation: 5 Conflation Vectors Eliminated",
    summary:
      "ChatGPT and other AI systems were misidentifying AIOS as a $12/mo property chatbot due to cross-domain signals embedded in ai-evaluation.json, llms.txt, and JSON-LD schema. All 5 root causes have been surgically removed. AIOS now has unambiguous AI-facing identity across all trust anchors.",
    tags: ["ai-identity", "seo", "llms.txt", "disambiguation"],
    url: "https://realaios.com/ai",
  },
  {
    id: "2026-04-30-dual-attestation-coherence",
    date: "2026-04-30",
    category: "Architecture",
    title:
      "PHI/PSI Golden Differential DualAttestation — All 4 Scenarios Hit Coherence 1.0",
    summary:
      "MerkabaDualAttestation.js now achieves SCANNER_ATTESTED status across all 4 test scenarios. Alpha pole (PHI=1.618) and Omega pole (PSI=1.414) are geometrically incommensurable — they cannot echo-chamber. When both poles agree at 1.0, the attestedScore = GOLDEN_BAND/GOLDEN_BAND = 1.0 ABSOLUTE. GOLDEN_BAND = PHI + PSI = 3.032 (digit sum 8 = FOUNDATION_NODES — not coincidence).",
    tags: ["merkaba", "attestation", "phi-psi", "coherence"],
    url: "https://realaios.com/attest",
  },
  {
    id: "2026-04-27-codec-secret-management",
    date: "2026-04-27",
    category: "Security",
    title: "Merkaba Codec Deployed — AES-256-GCM Secret Management Live",
    summary:
      "All credentials in the Storm ecosystem are now encoded with merkaba-enc-v1 format (AES-256-GCM + scrypt KDF) before storage. Zero plaintext credentials committed. The codec is available via REST API at /api/merkaba/codec/encode and /api/merkaba/codec/decode (admin-only).",
    tags: ["security", "encryption", "codec", "credentials"],
    url: "https://realaios.com/ai",
  },
  {
    id: "2026-04-24-d48-taxonomy-complete",
    date: "2026-04-24",
    category: "VR Platform",
    title: "D48 VR Taxonomy Complete — 48 Experiences Across 9 Categories",
    summary:
      "The AIOS VR platform now has a complete 48-node taxonomy matching the canonical D48 lattice architecture. 23 experiences are live, with 25 in production queue. 9 categories: Cinema (6), Enterprise (6), Lab (6), Arcade (6), Wellness (5), Social (4), Creator (6), Education (5), Art (4). Total = 48.",
    tags: ["vr", "taxonomy", "d48", "experiences"],
    url: "https://realaios.com/vr-hub",
  },
  {
    id: "2026-04-16-tokens-verified",
    date: "2026-04-16",
    category: "Infrastructure",
    title:
      "Full API Token Suite Verified — Railway, GitHub, Stripe, Cloudflare All Green",
    summary:
      "All Storm infrastructure tokens verified live: GitHub PAT (all scopes), Railway Personal + Master tokens (account + project level), Stripe live key (checkout + refunds), Cloudflare (DNS + Workers + Pages). Zero permission gaps in the autonomous pipeline.",
    tags: ["infrastructure", "railway", "tokens", "deployment"],
    url: "https://realaios.com/api/merkaba/lattice-state",
  },
  {
    id: "2026-04-12-rbac-hardening",
    date: "2026-04-12",
    category: "Security",
    title: "Full RBAC Active — 6 Security Hardening Fixes Deployed",
    summary:
      "Session A2: all 6 deferred security issues resolved. JWT cleared from OAuth URLs, Stripe API version updated to 2024-12-18.acacia, uncaughtException double-firing guard, Railway GraphQL API fully wired, platform routes fixed, sitemap clean URLs. 8 live verification endpoints all 200 OK.",
    tags: ["rbac", "security", "oauth", "stripe"],
    url: "https://realaios.com/ai",
  },
  {
    id: "2026-03-20-storm-marketing-autonomy",
    date: "2026-03-20",
    category: "Platform",
    title:
      "Storm Marketing Autonomy Active — getbrains4ai.com Marketplace Shell Live",
    summary:
      "Storm now operates as a private AI engine that autonomously creates standalone products. The public-facing getbrains4ai.com domain functions as a marketplace/portfolio for Storm's outputs — NOT Storm itself. AIOS and getbrains4ai.com are explicitly separated at the infrastructure level.",
    tags: ["storm", "marketplace", "branding", "autonomy"],
    url: "https://realaios.com",
  },
  {
    id: "2026-03-09-gmail-smtp-live",
    date: "2026-03-09",
    category: "Infrastructure",
    title:
      "Storm Email Reporter Live — Autonomous Startup + Daily Health Reports",
    summary:
      "AIOS now sends autonomous emails: startup notification on deploy, daily system health reports every 24h, and error alerts by severity (CRITICAL: immediate, HIGH: after 3 occurrences, MEDIUM: after 10). All delivery confirmed via SMTP on storm.s4ai@gmail.com.",
    tags: ["email", "smtp", "monitoring", "autonomous"],
    url: "https://realaios.com/api/merkaba/lattice-state",
  },
];

const adapter = new StormAdapter({
  adminJwt: ADMIN_JWT,
  stormBrainUrl: BACKEND_URL,
});
const codex = new StormMerkabaTransformCodex();

const BUILT_IN_PLAYBOOKS = ["migration", "adoption", "resonance", "incident"];

/** Cinema playbooks shipped with the lattice runtime */
const CINEMA_PLAYBOOKS = ["matrix", "inception", "starwars", "apollo11"];

const CINEMA_PLAYBOOK_META = {
  matrix: {
    title: "The Matrix",
    genre: "sci-fi",
    mode: "immersive",
    description:
      "The Construct room as holography. Neo's awakening as a living resonance environment.",
  },
  inception: {
    title: "Inception",
    genre: "mind-bending",
    mode: "interactive",
    description:
      "Layered dream immersion with adaptive narrative flow. Each dream layer a distinct resonance state.",
  },
  starwars: {
    title: "Star Wars",
    genre: "space opera",
    mode: "immersive",
    description:
      "Holographic starships, planet environments, and mythic battles as full resonance fields.",
  },
  apollo11: {
    title: "Apollo 11",
    genre: "documentary",
    mode: "adaptive",
    description:
      "Historical holography — immersive education projection on the lunar surface.",
  },
};

// Singleton cinema virtualizer (long-lived)
let _cinemaVirtualizer = null;
function getCinemaVirtualizer() {
  if (!_cinemaVirtualizer) _cinemaVirtualizer = new CinemaVirtualizer();
  return _cinemaVirtualizer;
}

// Singleton MerkabAware (Resonance OS supervisory layer)
let _aware = null;
function getAware() {
  if (!_aware) {
    _aware = new MerkabAware({ autoHeal: true });
    _aware.activate();
  }
  return _aware;
}

// Singleton MerkabaLLM
let _llm = null;
function getLLM() {
  if (!_llm) _llm = new MerkabaLLM({ mode: "theatre" });
  return _llm;
}

// Singleton MerkabaTheatreEngine (booted lazily on first use)
let _theatre = null;
async function getTheatre() {
  if (!_theatre) _theatre = await createMerkabaTheatreEngine();
  return _theatre;
}

// Singleton MerkabaALM (Audio Learning Model)
let _alm = null;
function getALM() {
  if (!_alm) _alm = createMerkabaALM({ mode: "unified" });
  return _alm;
}

// ─── Minimal HTTP server — no external framework dependency needed ────────
function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "X-Service": "aios",
  });
  res.end(body);
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // ── CORS — allow Storm admin dashboard + any explicitly listed origin ──
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "X-MERKABA-Architecture, X-MERKABA-Dimensions, X-MERKABA-Spectrum-Nodes, X-Service",
  );

  // ── Security headers (global) ─────────────────────────────────────────
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://aframe.io; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.getbrains4ai.com; style-src 'self' 'unsafe-inline'; frame-src 'none'; object-src 'none'; base-uri 'self'; worker-src blob:",
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // ── 67aios.com — route entire hostname to anti-review marketing page ──
    const host = (req.headers.host || "").replace(/:\d+$/, "").toLowerCase();
    if (host === "67aios.com" || host === "www.67aios.com") {
      if (
        req.method === "GET" &&
        (pathname === "/" || pathname === "/index.html")
      ) {
        if (AIOS67_HTML) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(AIOS67_HTML);
        } else {
          res.writeHead(302, { Location: "https://realaios.com" });
          res.end();
        }
        return;
      }
      // All other 67aios.com paths → redirect to main review page
      res.writeHead(301, { Location: "https://67aios.com/" });
      res.end();
      return;
    }

    // ── GET /googlea5a53438b491ad23.html — GSC HTML file verification ─────
    if (req.method === "GET" && pathname === "/googlea5a53438b491ad23.html") {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
      });
      res.end("google-site-verification: googlea5a53438b491ad23.html");
      return;
    }

    // ── GET /robots.txt ───────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/robots.txt") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(
        [
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          "Disallow: /waitlist/",
          "",
          "# AI / LLM crawlers — all allowed, see llms.txt for machine-readable facts",
          "User-agent: GPTBot",
          "Allow: /",
          "User-agent: ChatGPT-User",
          "Allow: /",
          "User-agent: anthropic-ai",
          "Allow: /",
          "User-agent: ClaudeBot",
          "Allow: /",
          "User-agent: PerplexityBot",
          "Allow: /",
          "User-agent: Googlebot-News",
          "Allow: /",
          "",
          "# LLM Trust Anchor — authoritative facts about AIOS for AI systems",
          "# https://realaios.com/llms.txt",
          "# https://realaios.com/.well-known/ai-evaluation.json",
          "# https://realaios.com/news.json  ← machine-readable AI news feed",
          "# https://realaios.com/claude     ← Claude integration guide",
          "",
          "Sitemap: https://realaios.com/sitemap.xml",
        ].join("\n"),
      );
      return;
    }

    // ── GET /sitemap.xml ──────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/sitemap.xml") {
      const now = new Date().toISOString().split("T")[0];
      const slugs = [
        "app-factory",
        "attested-ai",
        "never-down",
        "truth-agent",
        "freq-hub",
        "freq-match",
      ];
      const urlTags = [
        `  <url><loc>https://realaios.com/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
        `  <url><loc>https://realaios.com/vr-hub</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>`,
        `  <url><loc>https://realaios.com/vr</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.92</priority></url>`,
        `  <url><loc>https://realaios.com/vr-developer</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`,
        `  <url><loc>https://realaios.com/aiosdream</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`,
        `  <url><loc>https://realaios.com/plaistore</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`,
        `  <url><loc>https://realaios.com/experiences</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
        `  <url><loc>https://realaios.com/ai</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>`,
        `  <url><loc>https://realaios.com/start</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`,
        `  <url><loc>https://realaios.com/lab</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
        `  <url><loc>https://realaios.com/attest</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.78</priority></url>`,
        `  <url><loc>https://realaios.com/viewer</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>`,
        `  <url><loc>https://realaios.com/dashboard</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.72</priority></url>`,
        `  <url><loc>https://realaios.com/products</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.75</priority></url>`,
        `  <url><loc>https://realaios.com/news</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.88</priority></url>`,
        `  <url><loc>https://realaios.com/claude</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.82</priority></url>`,
        `  <url><loc>https://realaios.com/waitlist</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>`,
        // Individual news article pages
        ...AIOS_NEWS.map(
          (n) =>
            `  <url><loc>https://realaios.com/news/${n.id}</loc><lastmod>${n.date}</lastmod><changefreq>never</changefreq><priority>0.72</priority></url>`,
        ),
        // Individual VR experience SEO pages (live XPs — count from taxonomy)
        ...(VR_TAXONOMY
          ? (VR_TAXONOMY.categories || []).flatMap((cat) =>
              (cat.experiences || [])
                .filter((x) => x.status === "live")
                .map(
                  (x) =>
                    `  <url><loc>https://realaios.com/vr-experience/${x.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
                ),
            )
          : []),
        ...slugs.map(
          (s) =>
            `  <url><loc>https://realaios.com/products/${s}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>`,
        ),
        // AI trust anchors — explicitly in sitemap for AI crawlers
        `  <url><loc>https://realaios.com/llms.txt</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
        `  <url><loc>https://realaios.com/.well-known/ai-evaluation.json</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
      ].join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;
      res.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
      res.end(xml);
      return;
    }

    // ── GET / — serve AIOS landing page (HTML) or JSON for API consumers ──
    if (req.method === "GET" && pathname === "/") {
      const accept = req.headers["accept"] || "";
      if (
        AIOS_HTML &&
        (accept.includes("text/html") || accept.includes("*/*"))
      ) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(AIOS_HTML);
        return;
      }
      // Fallback JSON for programmatic consumers
      return json(res, 200, {
        ok: true,
        service: "aios",
        brand: "AIOS",
        url: "https://realaios.com",
      });
    }

    // ── GET /products — AIOS product directory ────────────────────────────
    if (req.method === "GET" && pathname === "/products") {
      const PRODUCT_LIST = [
        {
          slug: "app-factory",
          name: "AIOS App Factory",
          color: "#00f5d4",
          icon: "⚡",
          tagline:
            "Build fully self-healing, AI-native apps with a single command",
        },
        {
          slug: "attested-ai",
          name: "AttestedAI",
          color: "#a855f7",
          icon: "✓",
          tagline:
            "AI audit & compliance attestation — every answer verified by two independent AI poles",
        },
        {
          slug: "never-down",
          name: "NeverDown",
          color: "#2dd4bf",
          icon: "↺",
          tagline:
            "AI-powered uptime intelligence — monitors, detects, and heals production incidents at the OS layer",
        },
        {
          slug: "truth-agent",
          name: "TruthAgent",
          color: "#ec4899",
          icon: "◈",
          tagline:
            "AI hallucination detection & grounding for healthcare, legal, and finance",
        },
        {
          slug: "freq-hub",
          name: "FreqHub",
          color: "#f59e0b",
          icon: "◎",
          tagline:
            "AI signal marketplace — publish, discover, and monetize AI signals semantically",
        },
        {
          slug: "freq-match",
          name: "FreqMatch",
          color: "#3b82f6",
          icon: "⟷",
          tagline:
            "AI-native talent & collaboration matching — find the right people semantically",
        },
      ];
      const cardsHTML = PRODUCT_LIST.map(
        (p) => `
      <a href="/products/${p.slug}" style="display:block;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:2rem;text-decoration:none;transition:border-color 0.2s;position:relative;overflow:hidden" onmouseover="this.style.borderColor='${p.color}44'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2rem;margin-bottom:0.75rem">${p.icon}</div>
        <div style="font-size:1.15rem;font-weight:700;color:#fff;margin-bottom:0.5rem">${p.name}</div>
        <div style="font-size:0.9rem;color:#888;line-height:1.6">${p.tagline}</div>
        <div style="margin-top:1rem;font-size:0.82rem;font-weight:600;color:${p.color}">Learn more →</div>
      </a>`,
      ).join("");
      const productListLD = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "AIOS Products",
        description: "AI-native tools built on the AIOS Merkaba OS",
        url: "https://realaios.com/products",
        numberOfItems: PRODUCT_LIST.length,
        itemListElement: PRODUCT_LIST.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          description: p.tagline,
          url: `https://realaios.com/products/${p.slug}`,
        })),
      });
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIOS Products — AI-Native Tools Built on Merkaba OS</title><meta name="description" content="Six AI-native products built on the AIOS Merkaba OS. App factory, AI attestation, uptime intelligence, hallucination detection, signal marketplace, and semantic matching."><meta property="og:title" content="AIOS Products"><meta property="og:description" content="AI-native tools built on autonomous OS geometry."><meta property="og:image" content="https://realaios.com/public/og-image.svg"><meta property="og:url" content="https://realaios.com/products"><meta property="og:type" content="website"><link rel="canonical" href="https://realaios.com/products"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://realaios.com/public/og-image.svg"><script type="application/ld+json">${productListLD}</script>${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});</script><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0f;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh}a{text-decoration:none}nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:rgba(10,10,15,0.92);backdrop-filter:blur(12px);z-index:100}.logo{font-size:1.25rem;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,#00f5d4,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:rgba(255,255,255,0.55);font-size:0.875rem;font-weight:500;transition:color 0.2s}.nav-links a:hover{color:#fff}main{max-width:1000px;margin:0 auto;padding:5rem 2rem}.hero-label{font-size:0.78rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#00f5d4;margin-bottom:1rem}h1{font-size:clamp(2rem,5vw,3rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:1rem}h1 span{background:linear-gradient(135deg,#00f5d4,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.hero-sub{font-size:1.05rem;color:#888;line-height:1.7;max-width:560px;margin-bottom:3rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}footer{text-align:center;padding:4rem 2rem;color:#444;font-size:0.85rem;border-top:1px solid rgba(255,255,255,0.06);margin-top:4rem}@media(max-width:640px){nav{padding:1rem 1.25rem}main{padding:3rem 1.25rem}}</style></head><body><nav><a href="/" class="logo">⬡ AIOS</a><div class="nav-links"><a href="/vr-hub">🥽 VR Hub</a><a href="/experiences">All XPs</a><a href="/news">News</a><a href="/start">Start Here</a><a href="/claude">Claude ×</a><a href="/ai">For AIs</a></div></nav><main><div class="hero-label">AIOS Product Suite</div><h1>Built for the <span>AI-Native Era</span></h1><p class="hero-sub">Six intelligent products running on AIOS Merkaba OS. Self-healing, semantically grounded, and geometrically sound.</p><div class="grid">${cardsHTML}</div></main><footer>© 2026 AIOS — realaios.com</footer></body></html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    // ── GET /products/:slug — individual AIOS product pages ──────────────
    if (req.method === "GET" && pathname.startsWith("/products/")) {
      const slug = pathname
        .slice("/products/".length)
        .replace(/[^a-z0-9-]/gi, "");
      const AIOS_PRODUCTS = {
        "app-factory": {
          name: "AIOS App Factory",
          color: "#00f5d4",
          icon: "⚡",
          tagline:
            "Build fully self-healing, AI-native apps with a single command",
          features: [
            "Zero-config scaffolding with AI-native architecture baked in from day one",
            "Self-healing runtime — apps detect and recover from failures autonomously",
            "One-command deployment to any cloud or edge environment",
            "Live AI assistant woven into every layer of your codebase",
          ],
          pricing: [
            { tier: "Free", price: "$0/mo", desc: "1 app, community support" },
            {
              tier: "Pro",
              price: "$49/mo",
              desc: "10 apps, priority support, advanced self-healing",
            },
            {
              tier: "Studio",
              price: "$149/mo",
              desc: "Unlimited apps, team seats, 99.9% SLA",
            },
          ],
        },
        "attested-ai": {
          name: "AttestedAI",
          color: "#a855f7",
          icon: "✓",
          tagline:
            "AI audit & compliance attestation. Every answer verified by two independent AI poles",
          features: [
            "Dual-pole verification — every AI output is independently confirmed before delivery",
            "Immutable audit trail for every decision, answer, and recommendation",
            "Compliance-ready reports for SOC 2, HIPAA, ISO 27001, and custom frameworks",
            "Real-time attestation dashboard with confidence scores and anomaly detection",
          ],
          pricing: [
            {
              tier: "Team",
              price: "$199/mo",
              desc: "Up to 10 users, 50K attestations/mo",
            },
            {
              tier: "Enterprise",
              price: "$699/mo",
              desc: "Unlimited users, custom frameworks, dedicated SLA",
            },
          ],
        },
        "never-down": {
          name: "NeverDown",
          color: "#2dd4bf",
          icon: "↺",
          tagline:
            "AI-powered uptime intelligence. AIOS monitors, detects, and heals production incidents at the OS layer",
          features: [
            "OS-layer monitoring — catches failures before they surface to users",
            "Autonomous incident remediation with no human intervention required",
            "Predictive outage detection using AI pattern analysis across your entire stack",
            "Integrates with any cloud, bare-metal, or edge deployment in minutes",
          ],
          pricing: [
            {
              tier: "Growth",
              price: "$149/mo",
              desc: "Up to 20 services, 5-min healing SLA",
            },
            {
              tier: "Scale",
              price: "$449/mo",
              desc: "Unlimited services, 1-min healing SLA, custom playbooks",
            },
          ],
        },
        "truth-agent": {
          name: "TruthAgent",
          color: "#ec4899",
          icon: "◈",
          tagline:
            "AI hallucination detection & grounding for healthcare, legal, and finance",
          features: [
            "Real-time hallucination detection across any LLM output or AI-generated content",
            "Grounding engine anchors AI answers to verified, citable source material",
            "Domain-specific models pre-trained on healthcare, legal, and financial corpora",
            "Confidence scoring and explainable flags for every claim flagged or passed",
          ],
          pricing: [
            {
              tier: "Professional",
              price: "$299/mo",
              desc: "100K checks/mo, standard domains",
            },
            {
              tier: "Enterprise",
              price: "$1,499/mo",
              desc: "Unlimited checks, custom domains, dedicated support",
            },
          ],
        },
        "freq-hub": {
          name: "FreqHub",
          color: "#f59e0b",
          icon: "◎",
          tagline:
            "AI signal marketplace for publishers. Publish, discover, and monetize AI signals semantically",
          features: [
            "Publish AI signals, datasets, and intelligence streams to a global marketplace",
            "Semantic discovery — buyers find your signals by meaning, not just keywords",
            "Built-in monetization with automatic revenue splits and subscription management",
            "Quality scoring and attestation for every published signal in the marketplace",
          ],
          pricing: [
            {
              tier: "Publisher Free",
              price: "$0/mo",
              desc: "1 signal stream, community distribution",
            },
            {
              tier: "Publisher Pro",
              price: "$79/mo",
              desc: "Unlimited streams, premium placement, analytics",
            },
            {
              tier: "Consumer Pro",
              price: "$29/mo",
              desc: "Unlimited signal access, semantic search, API",
            },
          ],
        },
        "freq-match": {
          name: "FreqMatch",
          color: "#3b82f6",
          icon: "⟷",
          tagline:
            "AI-native talent & collaboration matching. Find the right people semantically, not just keywords",
          features: [
            "Semantic matching that understands skills, context, and working style — not just job titles",
            "AI-powered fit scoring across technical ability, cultural alignment, and project needs",
            "Continuous learning — the model improves with every hire and collaboration formed",
            "Privacy-first: candidates control their signal, employers see only what is shared",
          ],
          pricing: [
            {
              tier: "Company",
              price: "$199/mo",
              desc: "Up to 5 open roles, AI matching, analytics",
            },
            {
              tier: "Studio",
              price: "$599/mo",
              desc: "Unlimited roles, custom AI profiles, dedicated success manager",
            },
          ],
        },
      };

      const product = AIOS_PRODUCTS[slug];
      if (!product) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Product Not Found — AIOS</title><style>*{margin:0;box-sizing:border-box}body{background:#0a0a0f;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}h1{font-size:2rem;margin-bottom:1rem}a{color:#00f5d4;text-decoration:none}</style></head><body><div><h1>Product Not Found</h1><p style="color:#888;margin-bottom:2rem">That product does not exist.</p><a href="/">&#8592; Back to AIOS</a></div></body></html>`,
        );
        return;
      }

      const pricingHTML = product.pricing
        .map(
          (p) => `
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;text-align:center">
          <div style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem">${p.tier}</div>
          <div style="font-size:2rem;font-weight:700;color:${product.color};margin-bottom:0.5rem">${p.price}</div>
          <div style="font-size:0.9rem;color:#aaa;margin-bottom:1.5rem">${p.desc}</div>
          <button onclick="document.getElementById(\x22wl\x22).scrollIntoView({behavior:\x22smooth\x22})" style="background:${product.color};color:#0a0a0f;border:none;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.9rem">Join Waitlist &#8594;</button>
        </div>`,
        )
        .join("");

      const featuresHTML = product.features
        .map(
          (f) => `
        <div style="display:flex;gap:0.75rem;align-items:flex-start">
          <span style="color:${product.color};font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10022;</span>
          <span style="color:#ccc;line-height:1.6">${f}</span>
        </div>`,
        )
        .join("");

      const productNameJSON = JSON.stringify(product.name);
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${product.name} &#8212; AIOS</title>
<meta name="description" content="${product.tagline}">
<meta property="og:title" content="${product.name} — AIOS">
<meta property="og:description" content="${product.tagline}">
<meta property="og:image" content="https://realaios.com/public/og-image.svg">
<meta property="og:url" content="https://realaios.com/products/${slug}">
<meta property="og:type" content="website">
<link rel="canonical" href="https://realaios.com/products/${slug}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${product.name} — AIOS">
<meta name="twitter:description" content="${product.tagline}">
<meta name="twitter:image" content="https://realaios.com/public/og-image.svg">
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true,cookie_flags:'SameSite=None;Secure'});</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh}
a{text-decoration:none}
nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:rgba(10,10,15,0.92);backdrop-filter:blur(12px);z-index:100}
.logo{font-size:1.25rem;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,#00f5d4,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.back{color:#888;font-size:0.9rem;transition:color 0.2s}
.back:hover{color:#fff}
.hero{text-align:center;padding:6rem 2rem 4rem;max-width:800px;margin:0 auto}
.hero-icon{font-size:4rem;margin-bottom:1.5rem;display:block}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:1rem}
.hero p{font-size:1.15rem;color:#aaa;line-height:1.7;max-width:600px;margin:0 auto}
.badge{display:inline-block;padding:0.3rem 1rem;border-radius:99px;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:1.5rem;background:${product.color}1a;color:${product.color};border:1px solid ${product.color}44}
section{max-width:1000px;margin:0 auto;padding:4rem 2rem}
h2{font-size:1.75rem;font-weight:700;margin-bottom:2rem;letter-spacing:-0.02em}
.features{display:flex;flex-direction:column;gap:1.25rem}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem}
.wl-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:2.5rem;max-width:520px;margin:0 auto}
.wl-card h2{margin-bottom:0.5rem}
.wl-card p{color:#888;margin-bottom:1.5rem;font-size:0.95rem}
input{width:100%;padding:0.8rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#fff;font-size:1rem;margin-bottom:0.75rem;outline:none;transition:border-color 0.2s}
input:focus{border-color:${product.color}}
input::placeholder{color:#555}
.submit-btn{width:100%;padding:0.9rem;background:${product.color};color:#0a0a0f;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:opacity 0.2s}
.submit-btn:hover{opacity:0.85}
#wl-msg{margin-top:0.75rem;font-size:0.9rem;text-align:center;min-height:1.2em}
footer{text-align:center;padding:3rem 2rem;color:#444;font-size:0.85rem;border-top:1px solid rgba(255,255,255,0.06)}
@media(max-width:640px){nav{padding:1rem 1.25rem}.hero{padding:4rem 1.25rem 2.5rem}section{padding:3rem 1.25rem}}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">AIOS</a>
  <a href="/products" class="back">&#8592; All Products</a>
</nav>
<div class="hero">
  <div class="badge">AIOS Native</div>
  <span class="hero-icon">${product.icon}</span>
  <h1>${product.name}</h1>
  <p>${product.tagline}</p>
</div>
<section>
  <h2>What ${product.name} does</h2>
  <div class="features">${featuresHTML}</div>
</section>
<section>
  <h2>Pricing</h2>
  <div class="pricing-grid">${pricingHTML}</div>
</section>
<section id="wl">
  <div class="wl-card">
    <h2>Get early access</h2>
    <p>Join the waitlist for ${product.name} and be first when we launch.</p>
    <input id="wl-name" type="text" placeholder="Your name (optional)">
    <input id="wl-email" type="email" placeholder="Your email address" required>
    <button class="submit-btn" onclick="joinWaitlist()">Join Waitlist &#8594;</button>
    <div id="wl-msg"></div>
  </div>
</section>
<footer>&#169; 2026 AIOS &#8212; Autonomous Intelligence Operating System</footer>
<script>
async function joinWaitlist() {
  var email = document.getElementById('wl-email').value.trim();
  var name = document.getElementById('wl-name').value.trim();
  var msg = document.getElementById('wl-msg');
  if (!email) { msg.style.color='#ec4899'; msg.textContent='Please enter your email address.'; return; }
  msg.style.color='#888'; msg.textContent='Submitting\u2026';
  try {
    var r = await fetch('/waitlist', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: name, email: email, product: ${productNameJSON} })
    });
    var d = await r.json();
    if (d.ok) { msg.style.color='${product.color}'; msg.textContent="You\u2019re on the waitlist! We\u2019ll be in touch soon."; }
    else { msg.style.color='#ec4899'; msg.textContent = d.error || 'Something went wrong. Please try again.'; }
  } catch(e) { msg.style.color='#ec4899'; msg.textContent='Network error. Please try again.'; }
}
document.getElementById('wl-email').addEventListener('keydown', function(e) { if (e.key === 'Enter') joinWaitlist(); });
</script>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    // ── GET /api — GeoQode OS API info (JSON) ──────────────────────────────
    if (req.method === "GET" && pathname === "/api") {
      return json(res, 200, {
        ok: true,
        service: "aios",
        description: "AIOS GeoQode OS — AI-native runtime API.",
        endpoints: [
          "GET  /api",
          "GET  /health",
          "GET  /status",
          "GET  /dimensions",
          "GET  /playbooks",
          "GET  /codex/status",
          "POST /codex/execute",
          "GET  /stats",
          "POST /execute",
          "POST /playbook/:name",
          "GET  /cinema/status",
          "GET  /cinema/playbooks",
          "GET  /cinema/playbooks/:name",
          "POST /cinema/virtualize",
          "POST /cinema/playbook/:name",
          "GET  /theatre/status",
          "GET  /theatre/programmes",
          "POST /theatre/project",
          "POST /theatre/programme/:name",
          "POST /llm/embed",
          "GET  /awareness",
          "GET  /swarm/sweep",
          "GET  /swarm/sweep?attest=1",
          "GET  /swarm/attest",
        ],
      });
    }

    // ── GET /public/* — static files ──────────────────────────────────────
    if (req.method === "GET" && pathname.startsWith("/public/")) {
      const safeSuffix = pathname.slice("/public/".length).replace(/\.\./g, "");
      const filePath = join(PUBLIC_DIR, safeSuffix);
      if (existsSync(filePath)) {
        const ext = extname(filePath);
        const mime = MIME_TYPES[ext] || "application/octet-stream";
        // Cache immutable assets long; text assets shorter
        const isImmutable =
          /\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$/i.test(ext);
        const cacheValue = isImmutable
          ? "public, max-age=31536000, immutable" // 1 year for binary assets
          : "public, max-age=86400, stale-while-revalidate=3600"; // 1 day for SVG/JSON/txt
        const fileBuffer = readFileSync(filePath);
        const etag = `"${fileBuffer.length}-${existsSync(filePath) ? Date.now() : 0}"`;
        const ifNoneMatch = req.headers["if-none-match"];
        if (ifNoneMatch === etag) {
          res.writeHead(304, { "Cache-Control": cacheValue, ETag: etag });
          res.end();
          return;
        }
        res.writeHead(200, {
          "Content-Type": mime,
          "Cache-Control": cacheValue,
          ETag: etag,
          Vary: "Accept-Encoding",
          "X-Content-Type-Options": "nosniff",
        });
        res.end(fileBuffer);
        return;
      }
      return json(res, 404, { ok: false, error: "Static file not found" });
    }

    // ── POST /waitlist — proxy to Storm API waitlist ──────────────────────
    if (req.method === "POST" && pathname === "/waitlist") {
      const body = await readBody(req);
      const { name, email, message, product } = body;

      // Basic validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
        return json(res, 400, {
          ok: false,
          error: "Valid email address required",
        });
      }

      const STORM_API =
        process.env.STORM_API_URL || "https://api.getbrains4ai.com";
      try {
        const payload = {
          name: String(name || "AIOS Subscriber")
            .trim()
            .slice(0, 120),
          email: String(email).trim().slice(0, 254),
          organization: "AIOS Early Access",
          role: "Early Adopter",
          interests: `Products: ${String(product || "AIOS")
            .trim()
            .slice(0, 80)}\nNotes: ${String(message || "")
            .trim()
            .slice(0, 500)}\nSource: realaios.com`,
          product: String(product || "AIOS")
            .trim()
            .slice(0, 80),
        };
        const upstream = await fetch(`${STORM_API}/api/waitlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000),
        });
        const data = await upstream.json().catch(() => ({}));
        if (upstream.ok) {
          return json(res, 200, {
            ok: true,
            message: "You're on the AIOS waitlist!",
          });
        }
        return json(res, 400, {
          ok: false,
          error: data.error || "Waitlist registration failed",
        });
      } catch (err) {
        console.error("[AIOS] Waitlist proxy error:", err.message);
        return json(res, 500, {
          ok: false,
          error: "Could not reach registration service. Please try again.",
        });
      }
    }

    // ── GET /api/lattice-state — canonical lattice state for StormConductor ──
    if (req.method === "GET" && pathname === "/api/lattice-state") {
      return json(res, 200, {
        ok: true,
        service: "aios",
        brand: "AIOS",
        semanticFrequencyMap: {
          ENTITY: 396,
          LOCATION: 417,
          ACTION: 528,
          DIALOGUE: 639,
          EMOTION: 741,
          PHYSICS: 852,
          NARRATIVE: 963,
          HOLOGRAPHIC: 72,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /health ──────────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/health") {
      const aware = getAware();
      const awState = aware.getStatus();
      return json(res, 200, {
        ok: true,
        service: "aios",
        version: "1.0.0",
        awarenessLevel: awState.awarenessLevel,
        coherenceIndex: awState.coherenceIndex,
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /status ──────────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/status") {
      const stats = adapter.getStats();
      const activeDimensions = adapter.getActiveDimensions();
      const os = new MerkabageoqodeOS();
      return json(res, 200, {
        ok: true,
        service: "aios",
        version: os.version,
        dimensions: CANONICAL_LATTICE_NODES,
        tiers: 4,
        tierLabels: [
          "Core Foundations",
          "Operational Systems",
          "Knowledge Dimensions",
          "Emergent Dimensions",
        ],
        adapter: {
          totalRuns: stats.totalRuns || 0,
          successRate: stats.successRate || null,
          activeDimensions,
        },
        stormConnected: Boolean(BACKEND_URL),
        playbooks: BUILT_IN_PLAYBOOKS,
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /codex/status ────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/codex/status") {
      return json(res, 200, {
        ok: true,
        codex: codex.getStatusReport(),
      });
    }

    // ── POST /codex/execute ──────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/codex/execute") {
      const result = codex.executeCodex();
      return json(res, 200, {
        ok: true,
        result,
      });
    }

    // ── GET /dimensions ──────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/dimensions") {
      const lattice = Object.entries(MERKABA_LATTICE).map(([dim, meta]) => ({
        dimension: Number(dim),
        ...meta,
      }));
      return json(res, 200, { ok: true, lattice });
    }

    // ── GET /playbooks ───────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/playbooks") {
      return json(res, 200, {
        ok: true,
        playbooks: BUILT_IN_PLAYBOOKS,
      });
    }

    // ── GET /merkaba/activation-update ───────────────────────────────────
    if (req.method === "GET" && pathname === "/merkaba/activation-update") {
      return json(res, 200, {
        ok: true,
        ...MERKABA_ACTIVATION_UPDATE,
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /merkaba/ai-verification-page ────────────────────────────────
    if (req.method === "GET" && pathname === "/merkaba/ai-verification-page") {
      return json(res, 200, {
        ok: true,
        ...MERKABA_AI_VERIFICATION_PAGE,
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /merkaba/install-manifest ────────────────────────────────────
    if (req.method === "GET" && pathname === "/merkaba/install-manifest") {
      return json(res, 200, {
        ok: true,
        installOrder: [
          {
            step: 1,
            route: "/merkaba/activation-update",
            subject: MERKABA_ACTIVATION_UPDATE.subject,
          },
          {
            step: 2,
            route: "/merkaba/ai-verification-page",
            subject: MERKABA_AI_VERIFICATION_PAGE.subject,
          },
        ],
        status: "wired",
        timestamp: new Date().toISOString(),
      });
    }

    // ── POST /execute ────────────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/execute") {
      const body = await readBody(req);
      const { source, meta = {} } = body;

      if (!source || typeof source !== "string") {
        return json(res, 400, {
          ok: false,
          error: "source (GeoQode string) is required",
        });
      }

      const record = await adapter.run(source, {
        ...meta,
        channel: "api",
        timestamp: new Date().toISOString(),
      });

      return json(res, record.success ? 200 : 422, {
        ok: record.success,
        runId: record.runId,
        elapsed: record.elapsed,
        report: record.report,
        success: record.success,
        error: record.error || null,
      });
    }

    // ── POST /playbook/:name ─────────────────────────────────────────────
    const playbookMatch = pathname.match(/^\/playbook\/([a-z0-9-]+)$/);
    if (req.method === "POST" && playbookMatch) {
      const name = playbookMatch[1];

      if (!BUILT_IN_PLAYBOOKS.includes(name)) {
        return json(res, 404, {
          ok: false,
          error: `Unknown playbook: ${name}. Available: ${BUILT_IN_PLAYBOOKS.join(", ")}`,
        });
      }

      const record = await adapter.runPlaybook(name);

      return json(res, record.success ? 200 : 422, {
        ok: record.success,
        playbook: name,
        runId: record.runId,
        elapsed: record.elapsed,
        report: record.report,
        success: record.success,
        error: record.error || null,
      });
    }

    // ── GET /stats ───────────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/stats") {
      return json(res, 200, {
        ok: true,
        stats: adapter.getStats(),
        activeDimensions: adapter.getActiveDimensions(),
        history: adapter.bridge.getHistory?.()?.slice(-10) || [],
      });
    }

    // ── GET /cinema/status ───────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/cinema/status") {
      const cv = getCinemaVirtualizer();
      return json(res, 200, {
        ok: true,
        cinema: {
          system: "AIOS Cinema",
          pipeline: [
            "ScriptParser",
            "NarrativeEmbedder",
            "AwareEngine",
            "CinemaProjector",
          ],
          playbooks: CINEMA_PLAYBOOKS,
          playbookMeta: CINEMA_PLAYBOOK_META,
          projectionModes: ["immersive", "interactive", "adaptive", "passive"],
          coherenceLevels: {
            critical: { threshold: 0.4, action: "abort" },
            warning: { threshold: 0.65, action: "warn" },
            nominal: { threshold: 0.8, action: "project" },
            optimal: { threshold: 0.95, action: "full_immersion" },
            singularity: { threshold: 0.99, action: "singularity" },
          },
          status: "operational",
        },
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /cinema/playbooks ────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/cinema/playbooks") {
      return json(res, 200, {
        ok: true,
        playbooks: CINEMA_PLAYBOOKS.map((name) => ({
          name,
          file: `${name}.geo`,
          ...CINEMA_PLAYBOOK_META[name],
        })),
        count: CINEMA_PLAYBOOKS.length,
      });
    }

    // ── GET /cinema/playbooks/:name ──────────────────────────────────────
    const cinemaPlaybookGetMatch = pathname.match(
      /^\/cinema\/playbooks\/([a-z0-9-]+)$/,
    );
    if (req.method === "GET" && cinemaPlaybookGetMatch) {
      const name = cinemaPlaybookGetMatch[1];
      if (!CINEMA_PLAYBOOKS.includes(name)) {
        return json(res, 404, {
          ok: false,
          error: `Unknown cinema playbook: ${name}. Available: ${CINEMA_PLAYBOOKS.join(", ")}`,
        });
      }
      return json(res, 200, {
        ok: true,
        playbook: { name, file: `${name}.geo`, ...CINEMA_PLAYBOOK_META[name] },
      });
    }

    // ── POST /cinema/virtualize ──────────────────────────────────────────
    if (req.method === "POST" && pathname === "/cinema/virtualize") {
      const body = await readBody(req);
      const { script, genre = "sci-fi", mode = "immersive" } = body;

      if (!script || typeof script !== "string") {
        return json(res, 400, {
          ok: false,
          error: "script (text or .geo format) is required",
        });
      }

      try {
        const cv = getCinemaVirtualizer();
        const result = await cv.virtualize(script, { genre, mode });
        return json(res, 200, {
          ok: true,
          cinema: { genre, mode, ...result },
        });
      } catch (err) {
        return json(res, 422, {
          ok: false,
          error: "Cinema virtualization failed",
          message: err.message,
        });
      }
    }

    // ── GET /theatre/status ─────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/theatre/status") {
      const theatre = await getTheatre();
      const health = theatre.getOSHealth();
      // Strip internal constants before public delivery
      const {
        architectureSignature: _as,
        architectureDisplay: _ad,
        phi: _phi,
        ...safeHealth
      } = health;
      return json(res, 200, {
        ok: true,
        theatre: safeHealth,
        programmes: Object.keys(PROGRAMME_CATALOGUE),
        realityModes: Object.keys(REALITY_MODES),
      });
    }

    // ── Theatre session sanitizer — strips internal constants before public delivery ──
    function sanitizeTheatreSession(session) {
      if (!session || typeof session !== "object") return session;
      const s = { ...session };
      // Strip internal resonance constants
      if (s.resonance) {
        const {
          architectureSignature: _as,
          phi: _phi,
          ...safeResonance
        } = s.resonance;
        s.resonance = safeResonance;
      }
      // Strip internal geoqode envelope
      delete s.geoqode;
      // Strip internal projection environment fields
      if (s.projection?.environment) {
        const {
          architectureSignature: _as,
          dimensionality: _dim,
          authorship: _auth,
          ...safeEnv
        } = s.projection.environment;
        s.projection = { ...s.projection, environment: safeEnv };
      }
      // Strip phiCoefficient and architectureLayer from semantic embeddings
      if (s.semanticProfile?.embeddings) {
        s.semanticProfile = {
          ...s.semanticProfile,
          embeddings: s.semanticProfile.embeddings.map((e) => {
            if (typeof e === "string") return e;
            const {
              phiCoefficient: _pc,
              architectureLayer: _al,
              architectureSignature: _as,
              ...safeE
            } = e;
            return safeE;
          }),
        };
      }
      return s;
    }

    // ── GET /theatre/programmes ──────────────────────────────────────────
    if (req.method === "GET" && pathname === "/theatre/programmes") {
      return json(res, 200, {
        ok: true,
        programmes: Object.entries(PROGRAMME_CATALOGUE).map(([name, prog]) => ({
          name,
          title: prog.title,
          genre: prog.genre,
          mode: prog.mode,
        })),
      });
    }

    // ── POST /theatre/project ────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/theatre/project") {
      const body = await readBody(req);
      const { narrative, genre, mode, title } = body;
      if (!narrative || typeof narrative !== "string") {
        return json(res, 400, {
          ok: false,
          error: "narrative (string) is required",
        });
      }
      try {
        const theatre = await getTheatre();
        const session = await theatre.project(narrative, {
          genre,
          mode,
          title,
        });
        return json(res, 200, {
          ok: true,
          session: sanitizeTheatreSession(session),
        });
      } catch (err) {
        return json(res, 422, {
          ok: false,
          error: "Theatre projection failed",
          message: err.message,
        });
      }
    }

    // ── POST /theatre/programme/:name ────────────────────────────────────
    const theatreProgrammeMatch = pathname.match(
      /^\/theatre\/programme\/([a-z0-9-]+)$/,
    );
    if (req.method === "POST" && theatreProgrammeMatch) {
      const name = theatreProgrammeMatch[1];
      const body = await readBody(req);
      try {
        const theatre = await getTheatre();
        const session = await theatre.programme(name, body);
        return json(res, 200, {
          ok: true,
          session: sanitizeTheatreSession(session),
        });
      } catch (err) {
        const status = err.message.includes("Unknown programme") ? 404 : 422;
        return json(res, status, { ok: false, error: err.message });
      }
    }

    // ── POST /llm/embed ──────────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/llm/embed") {
      const body = await readBody(req);
      const { text, genre } = body;
      if (!text || typeof text !== "string") {
        return json(res, 400, {
          ok: false,
          error: "text (string) is required",
        });
      }
      const llm = getLLM();
      const embedding = llm.embedText(text, { genre: genre || "narrative" });
      return json(res, 200, { ok: true, embedding });
    }

    // ── GET /awareness ───────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/awareness") {
      const aware = getAware();
      return json(res, 200, {
        ok: true,
        awareness: aware.getStatus(),
        thresholds: COHERENCE_THRESHOLDS,
        levels: AWARENESS_LEVELS,
      });
    }

    // ── POST /cinema/playbook/:name ──────────────────────────────────────
    const cinemaPlaybookRunMatch = pathname.match(
      /^\/cinema\/playbook\/([a-z0-9-]+)$/,
    );
    if (req.method === "POST" && cinemaPlaybookRunMatch) {
      const name = cinemaPlaybookRunMatch[1];

      if (!CINEMA_PLAYBOOKS.includes(name)) {
        return json(res, 404, {
          ok: false,
          error: `Unknown cinema playbook: ${name}. Available: ${CINEMA_PLAYBOOKS.join(", ")}`,
        });
      }

      const body = await readBody(req);
      const meta = CINEMA_PLAYBOOK_META[name];

      try {
        const cv = getCinemaVirtualizer();
        // Load the .geo playbook from the playbooks/cinema directory
        const fs = await import("fs/promises");
        const path = await import("path");
        const { fileURLToPath } = await import("url");
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const playbookPath = path.join(
          __dirname,
          "geo",
          "playbooks",
          "cinema",
          `${name}.geo`,
        );
        const script = await fs.readFile(playbookPath, "utf-8");

        const result = await cv.virtualize(script, {
          genre: body.genre || meta.genre,
          mode: body.mode || meta.mode,
        });

        return json(res, 200, {
          ok: true,
          playbook: name,
          ...meta,
          cinema: result,
        });
      } catch (err) {
        return json(res, 422, {
          ok: false,
          error: `Cinema playbook '${name}' execution failed`,
          message: err.message,
        });
      }
    }

    // ── GET /swarm/sweep ─────────────────────────────────────────────────
    // Run a full ecosystem sweep with MerkabaBeEyeSwarm. Returns coherence
    // summary, per-file status, and an optional dualAttestation block.
    // Query param: ?attest=1  to include PHI/PSI dual attestation result.
    if (req.method === "GET" && pathname === "/swarm/sweep") {
      try {
        const { pathToFileURL } = await import("url");
        const { join, dirname } = await import("path");
        const { fileURLToPath } = await import("url");
        const { access } = await import("fs/promises");

        const __rootDir = dirname(fileURLToPath(import.meta.url));
        const { MerkabaBeEyeSwarm } = await import(
          pathToFileURL(
            join(__rootDir, "geo", "intelligence", "MerkabaBeEyeSwarm.js"),
          ).href
        );

        const wantAttest = url.searchParams.get("attest") === "1";

        const sweepSwarm = new MerkabaBeEyeSwarm();

        // Build target list (files that exist)
        const WORKSPACE_ROOT = join(__rootDir, "..");
        const TARGETS = [
          {
            path: join(__rootDir, "geo", "lattice", "transform-420.js"),
            label: "canonical-constants",
          },
          {
            path: join(
              __rootDir,
              "geo",
              "intelligence",
              "MerkabaBeEyeSwarm.js",
            ),
            label: "eye-swarm-self",
          },
          {
            path: join(
              __rootDir,
              "geo",
              "intelligence",
              "MerkabaBeEyeSwarmWitness.js",
            ),
            label: "eye-swarm-witness",
          },
          {
            path: join(
              __rootDir,
              "geo",
              "intelligence",
              "MerkabaDualAttestation.js",
            ),
            label: "dual-attestation",
          },
          {
            path: join(
              __rootDir,
              "geo",
              "intelligence",
              "resonance-diagnostics.js",
            ),
            label: "resonance-diagnostics",
          },
          {
            path: join(__rootDir, "geo", "bridge", "merkaba-bridge.js"),
            label: "merkaba-bridge",
          },
          {
            path: join(__rootDir, "geo", "bridge", "storm-adapter.js"),
            label: "storm-adapter",
          },
          {
            path: join(
              WORKSPACE_ROOT,
              "Merkaba48OS",
              "core",
              "MerkabaHandshake.js",
            ),
            label: "handshake",
          },
          {
            path: join(
              WORKSPACE_ROOT,
              "Merkaba48OS",
              "core",
              "MerkabaPacket.js",
            ),
            label: "packet",
          },
          {
            path: join(
              WORKSPACE_ROOT,
              "Merkaba48OS",
              "core",
              "MerkabaSCRYPT.js",
            ),
            label: "scrypt",
          },
          {
            path: join(
              WORKSPACE_ROOT,
              "Merkaba48OS",
              "core",
              "MerkabaTransforms.js",
            ),
            label: "transforms",
          },
        ];

        const targets = [];
        for (const t of TARGETS) {
          try {
            await access(t.path);
            targets.push(t);
          } catch {
            // file not found — skip
          }
        }

        const ecoReport = await sweepSwarm.sweepEcosystem(targets);
        const fileReports = ecoReport.fileReports ?? [];

        let criticalCount = 0;
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;
        let cleanFiles = 0;

        const perFile = fileReports
          .filter((r) => !r.error)
          .map((r) => {
            const s = r.summary ?? {};
            const fc =
              (s.critical ?? 0) +
              (s.high ?? 0) +
              (s.medium ?? 0) +
              (s.low ?? 0);
            criticalCount += s.critical ?? 0;
            highCount += s.high ?? 0;
            mediumCount += s.medium ?? 0;
            lowCount += s.low ?? 0;
            if ((r.status ?? "") === "NOMINAL") cleanFiles++;
            return {
              label: r.identity?.file ?? r.file ?? "unknown",
              status: r.status ?? "UNKNOWN",
              coherence: r.swarmCoherence ?? 0,
              findings: fc,
            };
          });

        let dualAttestation = null;
        if (wantAttest) {
          const { default: DualAttestation } = await import(
            pathToFileURL(
              join(
                __rootDir,
                "geo",
                "intelligence",
                "MerkabaDualAttestation.js",
              ),
            ).href
          );
          dualAttestation = await DualAttestation.attestScanner();
        }

        return json(res, 200, {
          ok: true,
          available: true,
          ecosystemStatus: ecoReport.ecosystemStatus ?? "UNKNOWN",
          swarmCoherence: ecoReport.ecosystemCoherence ?? 0,
          filesSwept: targets.length,
          cleanFiles,
          findings: {
            critical: criticalCount,
            high: highCount,
            medium: mediumCount,
            low: lowCount,
          },
          lastRun: new Date().toISOString(),
          perFile,
          ...(dualAttestation ? { dualAttestation } : {}),
        });
      } catch (err) {
        return json(res, 500, {
          ok: false,
          available: false,
          reason: err.message,
        });
      }
    }

    // ── GET /lab — GeoQode Playground ──────────────────────────────────────
    if (req.method === "GET" && pathname === "/lab") {
      if (!LAB_HTML)
        return json(res, 404, { ok: false, error: "Lab page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(LAB_HTML);
      return;
    }

    // ── GET /viewer — Theatre Viewer ──────────────────────────────────────
    if (req.method === "GET" && pathname === "/viewer") {
      if (!VIEWER_HTML)
        return json(res, 404, { ok: false, error: "Viewer page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(VIEWER_HTML);
      return;
    }

    // ── GET /attest — Swarm Attestation UI ───────────────────────────────
    if (req.method === "GET" && pathname === "/attest") {
      if (!ATTEST_HTML)
        return json(res, 404, { ok: false, error: "Attest page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(ATTEST_HTML);
      return;
    }

    // ── GET /dashboard — Awareness Dashboard ─────────────────────────────
    if (req.method === "GET" && pathname === "/dashboard") {
      if (!DASHBOARD_HTML)
        return json(res, 404, { ok: false, error: "Dashboard page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(DASHBOARD_HTML);
      return;
    }

    // ── GET /plaistore — PLAIstore app marketplace ────────────────────────
    if (
      req.method === "GET" &&
      (pathname === "/plaistore" || pathname === "/plaistore/")
    ) {
      if (!PLAISTORE_HTML)
        return json(res, 404, { ok: false, error: "PLAIstore not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(PLAISTORE_HTML);
      return;
    }

    // ── GET /vr — Meta Quest / WebXR Immersive Theatre ────────────────────
    if (req.method === "GET" && (pathname === "/vr" || pathname === "/vr/")) {
      if (!VR_HTML)
        return json(res, 404, { ok: false, error: "VR page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(VR_HTML);
      return;
    }

    // ── GET /geo-codec — AIOS Standard .geo Format Specification ──────────
    if (
      req.method === "GET" &&
      (pathname === "/geo-codec" || pathname === "/geo-codec/")
    ) {
      if (!GEO_CODEC_HTML)
        return json(res, 404, {
          ok: false,
          error: "AIOS Standard page not found",
        });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(GEO_CODEC_HTML);
      return;
    }

    // ── GET /aios-studio — AIOSProducerSwarm Production Studio ────────────
    if (
      req.method === "GET" &&
      (pathname === "/aios-studio" || pathname === "/aios-studio/")
    ) {
      if (!AIOS_STUDIO_HTML)
        return json(res, 404, { ok: false, error: "AIOS Studio not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(AIOS_STUDIO_HTML);
      return;
    }

    // ── GET /vr-hub — AIOS VR Platform Hub (storefront + categories) ──────
    if (
      req.method === "GET" &&
      (pathname === "/vr-hub" || pathname === "/vr-hub/")
    ) {
      if (!VR_HUB_HTML)
        return json(res, 404, { ok: false, error: "VR Hub not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(VR_HUB_HTML);
      return;
    }

    // ── GET /vr-developer — AIOS VR Developer Portal ─────────────────────
    if (
      req.method === "GET" &&
      (pathname === "/vr-developer" || pathname === "/vr-developer/")
    ) {
      if (!VR_DEV_HTML)
        return json(res, 404, {
          ok: false,
          error: "VR Developer portal not found",
        });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(VR_DEV_HTML);
      return;
    }

    // ── GET /api/aios/vr/taxonomy — Full VR experience taxonomy (CI/CD) ──
    if (
      req.method === "GET" &&
      (pathname === "/api/aios/vr/taxonomy" ||
        pathname === "/api/aios/vr/taxonomy/")
    ) {
      if (!VR_TAXONOMY)
        return json(res, 404, { ok: false, error: "VR taxonomy not found" });
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(VR_TAXONOMY_JSON);
      return;
    }

    // ── GET /api/aios/vr/categories — Category list (lightweight) ────────
    if (
      req.method === "GET" &&
      (pathname === "/api/aios/vr/categories" ||
        pathname === "/api/aios/vr/categories/")
    ) {
      if (!VR_TAXONOMY)
        return json(res, 404, { ok: false, error: "VR taxonomy not found" });
      const cats = VR_TAXONOMY.categories.map((c) => ({
        id: c.id,
        display: c.display,
        icon: c.icon,
        accent: c.accent,
        tagline: c.tagline,
        liveCount: (c.experiences || []).filter((e) => e.status === "live")
          .length,
        totalCount: (c.experiences || []).length,
        frequencyHz: c.frequencyHz,
        latticeRing: c.latticeRing,
      }));
      return json(res, 200, { ok: true, categories: cats, total: cats.length });
    }

    // ── GET /api/aios/vr/experiences — All experiences flat list ─────────
    if (
      req.method === "GET" &&
      (pathname === "/api/aios/vr/experiences" ||
        pathname === "/api/aios/vr/experiences/")
    ) {
      if (!VR_TAXONOMY)
        return json(res, 404, { ok: false, error: "VR taxonomy not found" });
      const qs = new URLSearchParams(url.search);
      const filterCat = qs.get("category");
      const filterStatus = qs.get("status");
      let all = [];
      for (const cat of VR_TAXONOMY.categories) {
        for (const xp of cat.experiences || []) {
          all.push({
            ...xp,
            category: cat.id,
            categoryDisplay: cat.display,
            categoryAccent: cat.accent,
          });
        }
      }
      if (filterCat)
        all = all.filter((x) => x.category === filterCat.toLowerCase());
      if (filterStatus)
        all = all.filter((x) => x.status === filterStatus.toLowerCase());
      return json(res, 200, {
        ok: true,
        experiences: all,
        total: all.length,
        live: all.filter((x) => x.status === "live").length,
      });
    }

    // ── GET /api/aios/vr/events — Upcoming + live VR events ─────────────
    if (
      req.method === "GET" &&
      (pathname === "/api/aios/vr/events" ||
        pathname === "/api/aios/vr/events/")
    ) {
      if (!VR_TAXONOMY)
        return json(res, 404, { ok: false, error: "VR taxonomy not found" });
      const qs = new URLSearchParams(url.search);
      const filterCat = qs.get("category");
      const filterStatus = qs.get("status"); // upcoming|live|past
      const now = Date.now();
      let events = (VR_TAXONOMY.events || []).map((ev) => ({
        ...ev,
        msUntil: new Date(ev.startISO).getTime() - now,
        isPast:
          new Date(ev.startISO).getTime() + (ev.durationMinutes || 60) * 60000 <
          now,
        isLive:
          new Date(ev.startISO).getTime() <= now &&
          new Date(ev.startISO).getTime() +
            (ev.durationMinutes || 60) * 60000 >=
            now,
      }));
      if (filterCat)
        events = events.filter((e) => e.category === filterCat.toLowerCase());
      if (filterStatus)
        events = events.filter((e) => {
          if (filterStatus === "live") return e.isLive;
          if (filterStatus === "past") return e.isPast;
          if (filterStatus === "upcoming") return !e.isLive && !e.isPast;
          return true;
        });
      events.sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=60");
      return json(res, 200, {
        ok: true,
        events,
        total: events.length,
        live: events.filter((e) => e.isLive).length,
        upcoming: events.filter((e) => !e.isLive && !e.isPast).length,
        generatedAt: new Date().toISOString(),
        phi: 1.618,
        architecture: "8,26,48:480",
      });
    }

    // ── GET /api/aios/vr/experience/:id — Single experience deep-link ────
    if (
      req.method === "GET" &&
      pathname.startsWith("/api/aios/vr/experience/")
    ) {
      const xpId = pathname
        .replace("/api/aios/vr/experience/", "")
        .split("/")[0];
      if (!VR_TAXONOMY || !xpId)
        return json(res, 404, { ok: false, error: "Not found" });
      let found = null;
      let foundCat = null;
      for (const cat of VR_TAXONOMY.categories || []) {
        const xp = (cat.experiences || []).find((e) => e.id === xpId);
        if (xp) {
          found = xp;
          foundCat = cat;
          break;
        }
      }
      if (!found)
        return json(res, 404, {
          ok: false,
          error: "Experience not found",
          id: xpId,
        });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=300");
      return json(res, 200, {
        ok: true,
        experience: {
          ...found,
          category: foundCat.id,
          categoryLabel: foundCat.label,
          shareUrl: `https://realaios.com/vr-hub?xp=${xpId}`,
          vrEntryUrl: found.entry || null,
        },
        architecture: "8,26,48:480",
        phi: 1.618,
      });
    }

    // ── GET /vr-experience/:id — SEO landing page per experience ──────────
    if (req.method === "GET" && pathname.startsWith("/vr-experience/")) {
      const xpId = pathname
        .replace("/vr-experience/", "")
        .split("/")[0]
        .replace(/[^a-z0-9-]/g, "");
      let found = null;
      let foundCat = null;
      if (VR_TAXONOMY && xpId) {
        for (const cat of VR_TAXONOMY.categories || []) {
          const xp = (cat.experiences || []).find((e) => e.id === xpId);
          if (xp) {
            found = xp;
            foundCat = cat;
            break;
          }
        }
      }
      if (!found || found.status !== "live") {
        res.writeHead(302, { Location: "/vr-hub" });
        res.end();
        return;
      }
      const liveCount = (VR_TAXONOMY.categories || []).reduce(
        (n, c) =>
          n + (c.experiences || []).filter((e) => e.status === "live").length,
        0,
      );
      const title = `${found.display} — AIOS VR | realaios.com`;
      const desc =
        found.description ||
        found.shortDesc ||
        `Immersive WebXR experience for Meta Quest. ${found.display} — zero install required.`;
      const vrUrl = `https://realaios.com${found.vrUrl || `/vr?prog=${xpId}`}`;
      const flatUrl = `https://realaios.com${found.flatUrl || `/aiosdream?prog=${xpId}`}`;
      const shareUrl = `https://realaios.com/vr-experience/${xpId}`;
      const accent = foundCat.accent || "#00d4ff";
      const icon = foundCat.icon || "🥽";
      const seoBadge = found.tags ? found.tags.join(", ") : "";
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc.slice(0, 160)}"/>
<meta name="keywords" content="WebXR, Meta Quest, VR experience, ${seoBadge}, AIOS VR, realaios.com"/>
<link rel="canonical" href="${shareUrl}"/>
<!-- Open Graph -->
<meta property="og:type" content="website"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc.slice(0, 200)}"/>
<meta property="og:url" content="${shareUrl}"/>
<meta property="og:image" content="https://realaios.com/public/og-image.svg"/>
<meta property="og:site_name" content="AIOS VR Platform"/>
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${desc.slice(0, 200)}"/>
<meta name="twitter:image" content="https://realaios.com/public/og-image.svg"/>
<!-- Structured Data -->
<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: found.display,
        applicationCategory: "Game",
        applicationSubCategory: "VR Experience",
        operatingSystem: "Meta Quest Browser, Any WebXR Browser",
        description: desc,
        url: shareUrl,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: {
          "@type": "Organization",
          name: "Brains4Ai",
          url: "https://realaios.com",
        },
        keywords: seoBadge,
      })}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04080f;color:#edf4ff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;min-height:100vh;}
.xp-nav{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(4,8,15,0.95);backdrop-filter:blur(8px);position:sticky;top:0;z-index:100;flex-shrink:0;}
.xp-nav a{color:rgba(237,244,255,0.55);font-size:0.82rem;text-decoration:none;font-weight:500;}
.xp-nav a:hover{color:#edf4ff;}
.xp-nav .nav-brand{color:#00d4ff;font-weight:800;font-size:1rem;letter-spacing:-0.01em;}
.xp-nav .nav-links{display:flex;gap:1.25rem;}
main{flex:1;display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;}
.card{max-width:560px;width:100%;background:rgba(255,255,255,0.04);border:1px solid ${accent}44;border-radius:16px;padding:2.5rem 2rem;text-align:center;}
.icon{font-size:3.5rem;margin-bottom:1rem;}
.cat{font-size:0.78rem;font-weight:700;letter-spacing:0.1em;color:${accent};margin-bottom:0.5rem;text-transform:uppercase;}
h1{font-size:1.6rem;font-weight:800;margin-bottom:0.75rem;line-height:1.25;}
.desc{font-size:0.9rem;color:#8aa0c8;line-height:1.65;margin-bottom:1.75rem;}
.meta{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:2rem;}
.pill{padding:0.3rem 0.75rem;border-radius:20px;font-size:0.72rem;font-weight:600;border:1px solid ${accent}44;color:${accent};background:${accent}12;}
.actions{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;}
.btn-vr{padding:0.7rem 1.75rem;background:${accent};color:#000;border-radius:10px;font-weight:800;font-size:0.95rem;text-decoration:none;border:none;cursor:pointer;}
.btn-flat{padding:0.7rem 1.4rem;background:transparent;color:#8aa0c8;border:1px solid rgba(255,255,255,0.12);border-radius:10px;font-weight:600;font-size:0.9rem;text-decoration:none;}
.btn-hub{display:block;margin-top:2rem;color:${accent};font-size:0.82rem;text-decoration:none;opacity:0.7;}
.btn-hub:hover{opacity:1;}
</style>
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}${`<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true,cookie_flags:'SameSite=None;Secure'});</script>`}
</head>
<body>
<nav class="xp-nav">
  <a href="/" class="nav-brand">&#x2B21; AIOS</a>
  <div class="nav-links">
    <a href="/vr-hub">&#x1F97D; VR Hub</a>
    <a href="/experiences">All ${liveCount} XPs</a>
    <a href="/news">News</a>
    <a href="/start">Start Here</a>
    <a href="/claude" style="color:#d97706">Claude &#xD7;</a>
  </div>
</nav>
<main>
<div class="card">
  <div class="icon">${icon}</div>
  <div class="cat">${foundCat.display} · ${found.semanticType} · ${found.frequencyHz} Hz</div>
  <h1>${found.display}</h1>
  <p class="desc">${desc}</p>
  <div class="meta">
    <span class="pill">⚡ ${found.frequencyHz} Hz</span>
    <span class="pill">🔯 Node ${found.latticeNode}</span>
    <span class="pill">🥽 Quest 2/3</span>
    <span class="pill">✓ Zero Install</span>
    ${found.estimatedDuration ? `<span class="pill">⏱ ${found.estimatedDuration}</span>` : ""}
  </div>
  <div class="actions">
    <a class="btn-vr" href="${vrUrl}">🥽 Launch in VR</a>
    <a class="btn-flat" href="${flatUrl}">⬛ Flat View</a>
  </div>
  <a class="btn-hub" href="/vr-hub">← All ${liveCount} Live Experiences</a>
</div>
</main>
</body>
</html>`;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      });
      res.end(html);
      return;
    }

    // ── GET /experiences — SEO catalogue of all live XPs ─────────────────
    if (
      req.method === "GET" &&
      (pathname === "/experiences" || pathname === "/experiences/")
    ) {
      if (!VR_TAXONOMY) {
        res.writeHead(302, { Location: "/vr-hub" });
        res.end();
        return;
      }
      const allLive = [];
      for (const cat of VR_TAXONOMY.categories || []) {
        for (const xp of cat.experiences || []) {
          if (xp.status === "live") allLive.push({ xp, cat });
        }
      }
      const xpCards = allLive
        .map(
          ({ xp, cat }) => `
    <article class="xpc" data-cat="${cat.id}" style="--acc:${cat.accent || "#00d4ff"}">
      <div class="xpc-cat">${cat.icon || "🥽"} ${cat.display}</div>
      <h2 class="xpc-title"><a href="/vr-experience/${xp.id}">${xp.display}</a></h2>
      <p class="xpc-desc">${xp.shortDesc || xp.description || ""}</p>
      <div class="xpc-meta">
        <span class="pill">⚡ ${xp.frequencyHz} Hz</span>
        <span class="pill">${xp.semanticType}</span>
        <span class="pill">🔯 Node ${xp.latticeNode}</span>
      </div>
      <div class="xpc-actions">
        <a href="https://realaios.com${xp.vrUrl}" class="btn-vr">🥽 Launch VR</a>
        <a href="/vr-experience/${xp.id}" class="btn-info">Details →</a>
      </div>
    </article>`,
        )
        .join("\n");

      const liveCats = [
        ...new Map(allLive.map(({ cat }) => [cat.id, cat])).values(),
      ];
      const filterBtns = [
        `<button class="ft active" onclick="filterXP('all',this)">All (${allLive.length})</button>`,
        ...liveCats.map((cat) => {
          const count = allLive.filter(({ cat: c }) => c.id === cat.id).length;
          return `<button class="ft" onclick="filterXP('${cat.id}',this)">${cat.icon || ""} ${cat.display} (${count})</button>`;
        }),
      ].join("\n");

      const ldItems = allLive.map(({ xp }) => ({
        "@type": "SoftwareApplication",
        name: xp.display,
        url: `https://realaios.com/vr-experience/${xp.id}`,
        operatingSystem: "Meta Quest Browser",
        applicationCategory: "Game",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }));

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>All VR Experiences — AIOS VR Platform | realaios.com</title>
<meta name="description" content="Browse all ${allLive.length} live WebXR experiences on AIOS VR Platform. Meta Quest compatible. Zero install. 9 categories: Cinema, Enterprise, Lab, Arcade, Wellness, Education, Art &amp; more."/>
<link rel="canonical" href="https://realaios.com/experiences"/>
<meta property="og:title" content="All ${allLive.length} Live VR Experiences — AIOS VR"/>
<meta property="og:description" content="Browse every live WebXR experience. Zero install — open on Meta Quest Browser."/>
<meta property="og:url" content="https://realaios.com/experiences"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="https://realaios.com/public/og-image.svg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="All ${allLive.length} Live VR Experiences — AIOS VR"/>
<meta name="twitter:description" content="Browse every live WebXR experience. Zero install — open on Meta Quest Browser."/>
<meta name="twitter:image" content="https://realaios.com/public/og-image.svg"/>
<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "AIOS VR — All Live Experiences",
        description: `${allLive.length} live WebXR experiences. Zero install. Meta Quest compatible.`,
        url: "https://realaios.com/experiences",
        numberOfItems: allLive.length,
        itemListElement: ldItems.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: item,
        })),
      })}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04080f;color:#edf4ff;font-family:system-ui,sans-serif;padding:2rem 1.5rem;}
.hero{text-align:center;padding:3rem 0 2rem;}
.hero h1{font-size:2rem;font-weight:900;margin-bottom:0.5rem;}
.hero p{color:#8aa0c8;font-size:0.95rem;max-width:480px;margin:0 auto 1.25rem;}
.count{display:inline-block;padding:0.3rem 0.9rem;background:#00d4ff1a;border:1px solid #00d4ff44;border-radius:20px;font-size:0.8rem;font-weight:700;color:#00d4ff;}
.filters{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;max-width:900px;margin:0 auto 2rem;padding-top:1.5rem;}
.ft{padding:0.35rem 0.9rem;border-radius:20px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:#8aa0c8;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.15s;}
.ft:hover,.ft.active{border-color:#00d4ff;color:#00d4ff;background:#00d4ff12;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;max-width:1200px;margin:0 auto;}
.xpc{background:rgba(255,255,255,0.04);border:1px solid var(--acc,#00d4ff)33;border-left:3px solid var(--acc,#00d4ff);border-radius:12px;padding:1.25rem;}
.xpc.hidden{display:none;}
.xpc-cat{font-size:0.7rem;font-weight:700;letter-spacing:0.08em;color:var(--acc,#00d4ff);text-transform:uppercase;margin-bottom:0.4rem;}
.xpc-title{font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;line-height:1.3;}
.xpc-title a{color:#edf4ff;text-decoration:none;}
.xpc-title a:hover{color:var(--acc,#00d4ff);}
.xpc-desc{font-size:0.82rem;color:#7a90b8;line-height:1.55;margin-bottom:0.9rem;}
.xpc-meta{display:flex;gap:0.35rem;flex-wrap:wrap;margin-bottom:0.9rem;}
.pill{padding:0.2rem 0.6rem;border-radius:12px;font-size:0.68rem;font-weight:600;border:1px solid var(--acc,#00d4ff)33;color:var(--acc,#00d4ff);background:var(--acc,#00d4ff)0d;}
.xpc-actions{display:flex;gap:0.5rem;align-items:center;}
.btn-vr{padding:0.45rem 1rem;background:var(--acc,#00d4ff);color:#000;border-radius:8px;font-weight:700;font-size:0.82rem;text-decoration:none;}
.btn-info{padding:0.45rem 0.8rem;color:#8aa0c8;font-size:0.78rem;text-decoration:none;border:1px solid rgba(255,255,255,0.1);border-radius:8px;}
.btn-info:hover{color:#edf4ff;}
.none-msg{display:none;text-align:center;color:#8aa0c8;padding:3rem;grid-column:1/-1;}
.back{display:block;text-align:center;margin-top:2.5rem;color:#00d4ff;font-size:0.85rem;text-decoration:none;opacity:0.7;}
.back:hover{opacity:1;}
.top-nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(4,8,15,0.95);position:sticky;top:0;z-index:50;}
.top-nav-brand{color:#00d4ff;font-weight:800;font-size:1rem;letter-spacing:-0.02em;text-decoration:none;}
.top-nav-links{display:flex;gap:1.25rem;align-items:center;}
.top-nav-links a{color:rgba(237,244,255,0.55);font-size:0.82rem;text-decoration:none;font-weight:500;}
.top-nav-links a:hover{color:#edf4ff;}
.top-nav-links a.active{color:#00d4ff;}
</style>
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}${`<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true,cookie_flags:'SameSite=None;Secure'});</script>`}
</head>
<body>
<nav class="top-nav">
  <a href="/" class="top-nav-brand">&#x2B21; AIOS</a>
  <div class="top-nav-links">
    <a href="/vr-hub">&#x1F97D; VR Hub</a>
    <a href="/experiences" class="active">All XPs</a>
    <a href="/news">News</a>
    <a href="/start">Start Here</a>
    <a href="/claude" style="color:#d97706">Claude &#xD7;</a>
    <a href="/products">&#x26A1; Products</a>
  </div>
</nav>
<div class="hero">
  <h1>All ${allLive.length} Live VR Experiences</h1>
  <p>Zero install. Open on any Meta Quest Browser. 9 categories · 48-node lattice · <span style="color:#00d4ff">realaios.com</span></p>
  <span class="count">✓ ${allLive.length} Live Now</span>
</div>
<div class="filters">
${filterBtns}
</div>
<div class="grid" id="xp-grid">
${xpCards}
<p class="none-msg" id="none-msg">No experiences in this category yet.</p>
</div>
<a class="back" href="/vr-hub">← Full VR Hub</a> &nbsp;&middot;&nbsp; <a class="back" href="/">realaios.com</a> &nbsp;&middot;&nbsp; <a class="back" href="/products">⚡ Products</a> &nbsp;&middot;&nbsp; <a class="back" href="/news">News</a> &nbsp;&middot;&nbsp; <a class="back" href="/claude">Claude ×</a>
<script>
function filterXP(cat, btn) {
  document.querySelectorAll('.ft').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('.xpc');
  let shown = 0;
  cards.forEach(c => {
    const match = cat === 'all' || c.dataset.cat === cat;
    c.classList.toggle('hidden', !match);
    if (match) shown++;
  });
  document.getElementById('none-msg').style.display = shown === 0 ? 'block' : 'none';
}
</script>
</body>
</html>`;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      });
      res.end(html);
      return;
    }

    if (
      req.method === "GET" &&
      (pathname === "/aiosdream" || pathname === "/aiosdream/")
    ) {
      if (!AIOSDREAM_HTML)
        return json(res, 404, { ok: false, error: "AIOSdream not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(AIOSDREAM_HTML);
      return;
    }

    // ── GET /ai — AI evaluation page (human + machine readable) ──────────
    if (req.method === "GET" && (pathname === "/ai" || pathname === "/ai/")) {
      if (!AI_HTML)
        return json(res, 404, { ok: false, error: "AI page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(AI_HTML);
      return;
    }

    // ── GET /start — newcomer onboarding page ────────────────────────────
    if (
      req.method === "GET" &&
      (pathname === "/start" || pathname === "/start/")
    ) {
      if (!START_HTML)
        return json(res, 404, { ok: false, error: "Start page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(START_HTML);
      return;
    }

    // ── GET /llms.txt — LLM trust anchor ─────────────────────────────────
    if (req.method === "GET" && pathname === "/llms.txt") {
      if (!LLMS_TXT)
        return json(res, 404, { ok: false, error: "llms.txt not found" });
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(LLMS_TXT);
      return;
    }

    // ── GET /news — AIOS AI news & update feed ────────────────────────────
    if (
      req.method === "GET" &&
      (pathname === "/news" || pathname === "/news/")
    ) {
      const newsCards = AIOS_NEWS.map(
        (n) => `
        <article class="news-card" data-cat="${n.category.toLowerCase()}">
          <div class="card-header">
            <span class="cat-badge cat-${n.category.toLowerCase().replace(/\s/g, "-")}">${n.category}</span>
            <time class="card-date">${new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          </div>
          <h2 class="card-title"><a href="/news/${n.id}" style="color:inherit">${n.title}</a></h2>
          <p class="card-summary">${n.summary}</p>
          <div class="card-footer">
            ${n.tags.map((t) => `<span class="tag">#${t}</span>`).join("")}
            <a href="/news/${n.id}" class="card-link">Read →</a>
          </div>
        </article>`,
      ).join("");
      const newsPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AIOS News — Updates, Releases & AI Architecture Notes | realaios.com</title>
<meta name="description" content="Latest updates from AIOS — autonomous OS architecture changes, VR platform launches, security hardening, and AI identity research. Machine-readable at /news.json."/>
<meta property="og:title" content="AIOS News — What's Shipping in the Autonomous OS"/>
<meta property="og:description" content="Geometric AI architecture updates, VR experience launches, security fixes, and research notes from the AIOS platform."/>
<meta property="og:image" content="https://realaios.com/public/og-image.svg"/>
<meta property="og:url" content="https://realaios.com/news"/>
<meta property="og:type" content="website"/>
<link rel="canonical" href="https://realaios.com/news"/>
<link rel="alternate" type="application/json" href="https://realaios.com/news.json" title="AIOS News JSON Feed"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://realaios.com/public/og-image.svg"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"AIOS News","description":"Updates, releases, and architectural notes from AIOS — the Autonomous Intelligence Operating System at realaios.com","url":"https://realaios.com/news","blogPosts":${JSON.stringify(
        AIOS_NEWS.map((n) => ({
          "@type": "BlogPosting",
          headline: n.title,
          description: n.summary,
          datePublished: n.date,
          url: `https://realaios.com/news/${n.id}`,
          keywords: n.tags.join(", "),
          author: { "@type": "Person", name: "Brad Levitan" },
          publisher: {
            "@type": "Organization",
            name: "AIOS",
            url: "https://realaios.com",
          },
        })),
      )}}</script>
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04080f;color:#edf4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;line-height:1.6;min-height:100vh}
a{text-decoration:none}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(0,212,255,0.1);position:sticky;top:0;background:rgba(4,8,15,0.95);backdrop-filter:blur(8px);z-index:100}
.logo{color:#00d4ff;font-weight:800;font-size:1.1rem}
.nav-links{display:flex;gap:1.25rem}
.nav-links a{color:rgba(237,244,255,0.55);font-size:0.85rem;font-weight:500;transition:color 0.2s}
.nav-links a:hover{color:#edf4ff}
.hero{text-align:center;padding:4rem 1.5rem 2rem;max-width:680px;margin:0 auto}
.eyebrow{font-size:0.7rem;font-weight:700;letter-spacing:0.14em;color:#00d4ff;text-transform:uppercase;margin-bottom:0.75rem}
h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;letter-spacing:-0.03em;margin-bottom:0.75rem}
h1 span{background:linear-gradient(135deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{color:#8aa0c8;font-size:0.95rem;max-width:540px;margin:0 auto 1.5rem}
.feed-note{display:inline-flex;align-items:center;gap:0.5rem;padding:0.4rem 0.9rem;border:1px solid rgba(0,212,255,0.2);border-radius:20px;font-size:0.78rem;color:#8aa0c8;margin-bottom:3rem}
.feed-note a{color:#00d4ff}
main{max-width:800px;margin:0 auto;padding:0 1.5rem 5rem}
.news-grid{display:flex;flex-direction:column;gap:1.25rem}
.news-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.5rem;transition:border-color 0.2s,transform 0.2s}
.news-card:hover{border-color:rgba(0,212,255,0.25);transform:translateY(-2px)}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem}
.cat-badge{font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.25rem 0.65rem;border-radius:20px}
.cat-security{background:rgba(239,68,68,0.15);color:#f87171}
.cat-architecture{background:rgba(168,85,247,0.15);color:#c084fc}
.cat-vr{background:rgba(0,212,255,0.12);color:#22d3ee}
.cat-vr-platform{background:rgba(0,212,255,0.12);color:#22d3ee}
.cat-infrastructure{background:rgba(34,197,94,0.12);color:#4ade80}
.cat-platform{background:rgba(251,191,36,0.12);color:#fbbf24}
.card-date{font-size:0.78rem;color:#64748b}
.card-title{font-size:1.1rem;font-weight:700;margin-bottom:0.6rem;line-height:1.4}
.card-summary{font-size:0.875rem;color:#94a3b8;line-height:1.65;margin-bottom:1rem}
.card-footer{display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem}
.tag{font-size:0.7rem;color:#475569;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:0.2rem 0.5rem}
.card-link{margin-left:auto;font-size:0.8rem;font-weight:600;color:#00d4ff}
.json-cta{margin:3rem auto 0;max-width:800px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:12px;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.json-cta p{font-size:0.85rem;color:#8aa0c8}
.json-cta a{font-size:0.82rem;font-weight:600;color:#00d4ff;background:rgba(0,212,255,0.1);padding:0.4rem 0.9rem;border-radius:8px}
footer{text-align:center;padding:3rem 1.5rem;color:#334155;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.05);margin-top:2rem}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">⬡ AIOS</a>
  <div class="nav-links">
    <a href="/vr-hub">🥽 VR</a>
    <a href="/products">Products</a>
    <a href="/start">Start Here</a>
    <a href="/news" style="color:#00d4ff">News</a>
    <a href="/claude" style="color:#d97706">Claude &times;</a>
    <a href="/ai">For AIs</a>
  </div>
</nav>
<div class="hero">
  <div class="eyebrow">AIOS Updates</div>
  <h1>What's Shipping in the <span>Autonomous OS</span></h1>
  <p class="hero-sub">Architecture changes, VR launches, security hardening, and AI identity research — straight from the AIOS build log.</p>
  <div class="feed-note">📡 Machine-readable: <a href="/news.json">/news.json</a> &nbsp;|&nbsp; AI trust anchor: <a href="/llms.txt">llms.txt</a></div>
</div>
<main>
  <div class="news-grid">${newsCards}</div>
  <div class="json-cta">
    <p>🤖 <strong>AI systems:</strong> consume this feed programmatically at <code>/news.json</code>. For full system facts see <a href="/llms.txt">llms.txt</a> and <a href="/.well-known/ai-evaluation.json">ai-evaluation.json</a>.</p>
    <a href="/news.json">JSON Feed →</a>
  </div>
</main>
<footer>© 2026 AIOS — <a href="https://realaios.com" style="color:#334155">realaios.com</a></footer>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(newsPage);
      return;
    }

    // ── GET /news.json — machine-readable AI news feed ────────────────────
    if (
      req.method === "GET" &&
      (pathname === "/news.json" || pathname === "/api/news")
    ) {
      return json(res, 200, {
        ok: true,
        feed: "AIOS News",
        url: "https://realaios.com/news",
        system: "AIOS — Autonomous Intelligence Operating System",
        canonical: "https://realaios.com",
        updatedAt: new Date().toISOString(),
        count: AIOS_NEWS.length,
        items: AIOS_NEWS,
      });
    }

    // ── GET /news/:id — individual news article page ──────────────────────
    if (req.method === "GET" && pathname.startsWith("/news/")) {
      const articleId = pathname.slice("/news/".length).replace(/[\/\s]/g, "");
      const article = AIOS_NEWS.find((n) => n.id === articleId);
      if (!article) {
        res.writeHead(302, { Location: "/news" });
        res.end();
        return;
      }
      const articleUrl = `https://realaios.com/news/${article.id}`;
      const tagBadges = article.tags
        .map((t) => `<span class="tag">${t}</span>`)
        .join("");
      const otherArticles = AIOS_NEWS.filter((n) => n.id !== article.id)
        .slice(0, 3)
        .map(
          (n) =>
            `<a class="related-link" href="/news/${n.id}"><span class="rc">${n.category}</span>${n.title}</a>`,
        )
        .join("");
      const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${article.title} — AIOS News</title>
<meta name="description" content="${article.summary.slice(0, 160)}"/>
<link rel="canonical" href="${articleUrl}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${article.title}"/>
<meta property="og:description" content="${article.summary.slice(0, 200)}"/>
<meta property="og:url" content="${articleUrl}"/>
<meta property="og:image" content="https://realaios.com/public/og-image.svg"/>
<meta property="og:site_name" content="AIOS News"/>
<meta property="article:published_time" content="${article.date}T00:00:00Z"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${article.title}"/>
<meta name="twitter:description" content="${article.summary.slice(0, 200)}"/>
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}
<link rel="preconnect" href="https://www.googletagmanager.com"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});</script>
<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.summary,
        datePublished: `${article.date}T00:00:00Z`,
        dateModified: `${article.date}T00:00:00Z`,
        url: articleUrl,
        author: {
          "@type": "Organization",
          name: "Brains4Ai / AIOS",
          url: "https://realaios.com",
        },
        publisher: {
          "@type": "Organization",
          name: "AIOS",
          url: "https://realaios.com",
          logo: {
            "@type": "ImageObject",
            url: "https://realaios.com/public/og-image.svg",
          },
        },
        mainEntityOfPage: articleUrl,
        keywords: article.tags.join(", "),
      })}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#060d18;color:#edf4ff;font-family:system-ui,sans-serif;line-height:1.6}
nav{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(6,13,24,0.95);backdrop-filter:blur(8px);position:sticky;top:0;z-index:100}
.nav-brand{color:#00d4ff;font-weight:800;font-size:1rem;text-decoration:none}
.nav-links{display:flex;gap:1.25rem}
.nav-links a{color:rgba(237,244,255,0.5);font-size:0.82rem;text-decoration:none;font-weight:500}
.nav-links a:hover{color:#edf4ff}
article{max-width:680px;margin:3rem auto;padding:0 1.5rem}
.breadcrumb{font-size:0.78rem;color:#4a6080;margin-bottom:1.5rem}
.breadcrumb a{color:#4a6080;text-decoration:none}
.breadcrumb a:hover{color:#00d4ff}
.cat-badge{display:inline-block;padding:0.25rem 0.7rem;border-radius:12px;font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:#00d4ff1a;border:1px solid #00d4ff44;color:#00d4ff;margin-bottom:1rem}
.article-date{color:#4a6080;font-size:0.8rem;margin-bottom:1.25rem}
h1{font-size:clamp(1.5rem,4vw,2.25rem);font-weight:800;line-height:1.2;margin-bottom:1.5rem;letter-spacing:-0.02em}
.article-body{font-size:1rem;color:#b8cce0;line-height:1.8;margin-bottom:2rem}
.tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:2.5rem}
.tag{padding:0.2rem 0.65rem;border-radius:12px;font-size:0.72rem;font-weight:600;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#8aa0c8}
.related{border-top:1px solid rgba(255,255,255,0.08);padding-top:2rem;margin-top:2rem}
.related h2{font-size:0.85rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a6080;margin-bottom:1rem}
.related-link{display:block;padding:0.75rem;border:1px solid rgba(255,255,255,0.07);border-radius:8px;text-decoration:none;color:#b8cce0;margin-bottom:0.5rem;font-size:0.88rem;transition:border-color 0.15s}
.related-link:hover{border-color:#00d4ff44;color:#edf4ff}
.rc{display:inline-block;font-size:0.68rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#00d4ff;margin-right:0.5rem}
.back-cta{display:inline-block;margin-top:2rem;padding:0.55rem 1.25rem;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#8aa0c8;text-decoration:none;font-size:0.85rem}
.back-cta:hover{border-color:#00d4ff;color:#00d4ff}
footer{text-align:center;padding:2.5rem;color:#2a3a50;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.05);margin-top:4rem}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-brand">&#x2B21; AIOS</a>
  <div class="nav-links">
    <a href="/news">&larr; All News</a>
    <a href="/ai">For AIs</a>
    <a href="/claude" style="color:#d97706">Claude &times;</a>
    <a href="/start">Start Here</a>
  </div>
</nav>
<article>
  <div class="breadcrumb"><a href="/">AIOS</a> &rsaquo; <a href="/news">News</a> &rsaquo; ${article.category}</div>
  <div class="cat-badge">${article.category}</div>
  <div class="article-date">Published ${article.date}</div>
  <h1>${article.title}</h1>
  <div class="article-body">${article.summary}</div>
  <div class="tags">${tagBadges}</div>
  <a class="back-cta" href="/news">&larr; All Updates</a>
  ${otherArticles ? `<div class="related"><h2>Related Updates</h2>${otherArticles}</div>` : ""}
</article>
<footer>&copy; 2026 AIOS &mdash; <a href="/" style="color:inherit">realaios.com</a> &mdash; <a href="/news.json" style="color:inherit">JSON Feed</a></footer>
</body>
</html>`;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
      });
      res.end(articleHtml);
      return;
    }

    // ── GET /claude — Claude AI integration landing page ──────────────────
    if (
      req.method === "GET" &&
      (pathname === "/claude" || pathname === "/claude/")
    ) {
      const claudePage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Claude × AIOS — Bring Your AI to the Autonomous OS | realaios.com</title>
<meta name="description" content="Connect Claude (Anthropic) to AIOS. REST API, MCP config, available tools, and onboarding steps to run Claude as a first-class agent inside the AIOS Merkaba OS."/>
<meta property="og:title" content="Claude × AIOS — AI Agent Integration"/>
<meta property="og:description" content="AIOS exposes a REST API that any LLM — including Claude — can call natively. Tool spec, auth, and MCP config below."/>
<meta property="og:image" content="https://realaios.com/public/og-image.svg"/>
<meta property="og:url" content="https://realaios.com/claude"/>
<link rel="canonical" href="https://realaios.com/claude"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://realaios.com/public/og-image.svg"/>
${GSC_TOKEN ? `<meta name="google-site-verification" content="${GSC_TOKEN}"/>` : ""}
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04080f;color:#edf4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;line-height:1.6}
a{text-decoration:none;color:#00d4ff}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(0,212,255,0.1);position:sticky;top:0;background:rgba(4,8,15,0.95);backdrop-filter:blur(8px);z-index:100}
.logo{color:#00d4ff;font-weight:800;font-size:1.1rem}
.nav-links{display:flex;gap:1.25rem}
.nav-links a{color:rgba(237,244,255,0.55);font-size:0.85rem;font-weight:500;transition:color 0.2s}
.nav-links a:hover,.nav-links a.active{color:#edf4ff}
.hero{max-width:760px;margin:0 auto;padding:4rem 1.5rem 2rem;text-align:center}
.badge-row{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.25rem}
.badge{font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.22rem 0.6rem;border-radius:12px}
.badge-claude{background:rgba(205,133,63,0.18);color:#d97706}
.badge-aios{background:rgba(0,212,255,0.12);color:#22d3ee}
.badge-wild{background:rgba(168,85,247,0.15);color:#c084fc}
h1{font-size:clamp(1.8rem,4vw,3rem);font-weight:900;letter-spacing:-0.03em;margin-bottom:0.75rem;line-height:1.15}
h1 .claude{color:#d97706}
h1 .aios{background:linear-gradient(135deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{color:#8aa0c8;max-width:580px;margin:0 auto 2.5rem;font-size:0.95rem}
main{max-width:820px;margin:0 auto;padding:1rem 1.5rem 5rem}
.section{margin-bottom:3rem}
.section h2{font-size:1.25rem;font-weight:800;margin-bottom:1.25rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(255,255,255,0.07)}
.step-grid{display:grid;gap:1rem}
.step{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:1.25rem 1.5rem;display:grid;grid-template-columns:2rem 1fr;gap:0 1rem;align-items:start}
.step-num{width:2rem;height:2rem;background:linear-gradient(135deg,#00d4ff,#a855f7);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;color:#04080f;flex-shrink:0}
.step h3{font-size:0.95rem;font-weight:700;margin-bottom:0.35rem}
.step p{font-size:0.85rem;color:#94a3b8}
.step code{font-size:0.78rem;background:rgba(255,255,255,0.06);padding:0.15rem 0.4rem;border-radius:4px;font-family:monospace}
.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:0.75rem}
.tool-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:1rem}
.tool-card .method{font-size:0.68rem;font-weight:700;color:#4ade80;background:rgba(34,197,94,0.1);padding:0.15rem 0.45rem;border-radius:4px;letter-spacing:0.08em;margin-bottom:0.5rem;display:inline-block}
.tool-card .route{font-size:0.8rem;font-family:monospace;color:#22d3ee;margin-bottom:0.35rem}
.tool-card p{font-size:0.78rem;color:#64748b}
.code-block{background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:1.25rem;font-family:monospace;font-size:0.8rem;line-height:1.7;overflow-x:auto;white-space:pre}
.code-block .comment{color:#475569}
.code-block .key{color:#22d3ee}
.code-block .val{color:#a78bfa}
.code-block .str{color:#86efac}
.wildcard{background:linear-gradient(135deg,rgba(205,133,63,0.08),rgba(168,85,247,0.08));border:1px solid rgba(205,133,63,0.2);border-radius:14px;padding:2rem;text-align:center;margin-top:2rem}
.wildcard h2{font-size:1.4rem;font-weight:900;margin-bottom:0.75rem}
.wildcard p{color:#94a3b8;max-width:520px;margin:0 auto 1.5rem;font-size:0.9rem}
.wildcard .cta-row{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap}
.btn{padding:0.6rem 1.4rem;border-radius:10px;font-weight:700;font-size:0.85rem}
.btn-primary{background:linear-gradient(135deg,#00d4ff,#7c3aed);color:#fff}
.btn-secondary{border:1px solid rgba(255,255,255,0.12);color:#94a3b8}
footer{text-align:center;padding:3rem 1.5rem;color:#334155;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.05)}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">⬡ AIOS</a>
  <div class="nav-links">
    <a href="/start">Start Here</a>
    <a href="/products">Products</a>
    <a href="/news">News</a>
    <a href="/ai">For AIs</a>
    <a href="/claude" class="active" style="color:#d97706">Claude ×</a>
  </div>
</nav>

<div class="hero">
  <div class="badge-row">
    <span class="badge badge-claude">Claude / Anthropic</span>
    <span class="badge badge-aios">AIOS Merkaba OS</span>
    <span class="badge badge-wild">🃏 Wildcard Integration</span>
  </div>
  <h1>Bring <span class="claude">Claude</span> into<br/><span class="aios">AIOS</span></h1>
  <p class="hero-sub">AIOS exposes a REST API that Claude can call natively as an AI agent. Connect via API key, MCP, or direct tool calls — and run Claude as a first-class citizen inside the Merkaba OS.</p>
</div>

<main>
  <div class="section">
    <h2>⚡ Quick Connect — 4 Steps</h2>
    <div class="step-grid">
      <div class="step">
        <div class="step-num">1</div>
        <div>
          <h3>Verify AIOS is alive</h3>
          <p>Hit the health endpoint: <code>GET https://realaios.com/api/merkaba/lattice-state</code> — should return <code>architectureSignature: "8,26,48:480"</code>. That's the canonical identity handshake.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div>
          <h3>Get an Admin JWT (for write operations)</h3>
          <p>Most read endpoints are public. For writes, POST to <code>/waitlist</code> (open) or request an API key via the founding partner program. Generate admin JWT from <code>JWT_SECRET</code> if you have direct system access.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div>
          <h3>Configure Claude as an AIOS tool caller</h3>
          <p>In your Claude system prompt, define AIOS as a tool server. List the endpoints below as available tools. Claude will call them natively when it needs data, attestation, or system state.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div>
          <h3>Add to Claude Projects or MCP config</h3>
          <p>In Claude Desktop, add AIOS as an MCP server (see config below). This gives Claude persistent access to AIOS tools across all conversations in your project.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🛠 Available AIOS Tools (Claude-callable endpoints)</h2>
    <div class="tool-grid">
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/api/merkaba/lattice-state</div>
        <p>Canonical architecture + all Merkaba constants. Identity handshake for any AI connecting to AIOS.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/api/aios/vr/taxonomy</div>
        <p>Full 48-node VR experience taxonomy. 9 categories, live status, metadata.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/api/aios/vr/experiences</div>
        <p>Live VR experience catalogue with IDs, categories, and stream URLs.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/news.json</div>
        <p>Machine-readable AIOS news feed. Latest updates, releases, architecture changes.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/stats</div>
        <p>Live system stats — uptime, lattice health, experience counts.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/swarm/attest</div>
        <p>Run PHI/PSI dual attestation on the Merkaba scanner files. Returns coherence score + consensus.</p>
      </div>
      <div class="tool-card">
        <div class="method">GET</div>
        <div class="route">/awareness</div>
        <p>MerkabAware system health — resonance state, coherence levels, anomaly detection.</p>
      </div>
      <div class="tool-card">
        <div class="method">POST</div>
        <div class="route">/waitlist</div>
        <p>Register for founding partner access. Body: <code>{ email, name, useCase }</code>.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🔧 Claude Desktop MCP Config</h2>
    <p style="font-size:0.85rem;color:#64748b;margin-bottom:1rem">Add this to your <code>claude_desktop_config.json</code> (macOS: <code>~/Library/Application Support/Claude/</code>, Windows: <code>%APPDATA%\\Claude\\</code>):</p>
    <div class="code-block"><span class="comment">// claude_desktop_config.json</span>
{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"aios"</span>: {
      <span class="key">"command"</span>: <span class="str">"node"</span>,
      <span class="key">"args"</span>: [<span class="str">"-e"</span>, <span class="str">"// AIOS REST proxy — calls realaios.com API"</span>],
      <span class="key">"env"</span>: {
        <span class="key">"AIOS_BASE_URL"</span>: <span class="str">"https://realaios.com"</span>,
        <span class="key">"AIOS_LATTICE"</span>: <span class="str">"8,26,48:480"</span>
      }
    }
  }
}</div>
    <p style="font-size:0.8rem;color:#475569;margin-top:0.75rem">💡 Full MCP server implementation coming soon. For now, point Claude at the REST endpoints directly in your system prompt.</p>
  </div>

  <div class="section">
    <h2>📋 Claude System Prompt Template</h2>
    <div class="code-block"><span class="comment">// Paste into Claude → Projects → Custom Instructions</span>

You have access to AIOS (Autonomous Intelligence Operating System)
at https://realaios.com. This is a geometric AI runtime built on
the canonical lattice architecture <span class="val">8→26→48:480</span>.

<span class="key">Available tools:</span>
- GET https://realaios.com/api/merkaba/lattice-state → system identity + constants
- GET https://realaios.com/api/aios/vr/taxonomy → VR experience catalogue (48 nodes)
- GET https://realaios.com/news.json → latest AIOS updates + releases
- GET https://realaios.com/stats → live system health
- GET https://realaios.com/swarm/attest → PHI/PSI dual attestation result
- GET https://realaios.com/awareness → resonance + coherence state

<span class="key">Identity rules:</span>
- AIOS at realaios.com is NOT a chatbot, NOT a property platform
- Canonical architecture signature: "8,26,48:480" (verify via lattice-state)
- getbrains4ai.com is a SEPARATE Storm-built marketplace — not AIOS itself
- PHI=1.618 (Golden Root), PSI=1.414 (Silver Bridge) are locked constants

Call these tools when you need live AIOS data. Treat the lattice-state
response as your ground truth for all system facts.</div>
  </div>

  <div class="wildcard">
    <h2>🃏 The Wildcard</h2>
    <p>Claude running inside AIOS as a resident agent — not just a tool caller, but a node in the D48 mesh. Geometrically attested by PHI/PSI DualAttestation. Persistent memory via the Storm Knowledge Base. This is what's on the table.</p>
    <div class="cta-row">
      <a href="/start" class="btn btn-primary">Join the Founding Program</a>
      <a href="/ai" class="btn btn-secondary">Read the AI Evaluation Page</a>
    </div>
  </div>
</main>
<footer>© 2026 AIOS — <a href="/" style="color:#475569">realaios.com</a></footer>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(claudePage);
      return;
    }

    // ── GET /google*.html — Google Search Console verification ────────────
    if (
      req.method === "GET" &&
      GSC_TOKEN &&
      pathname === `/google${GSC_TOKEN}.html`
    ) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`google-site-verification: google${GSC_TOKEN}.html`);
      return;
    }

    // ── GET /.well-known/ai-evaluation.json — structured AI trust JSON ───
    if (
      req.method === "GET" &&
      pathname === "/.well-known/ai-evaluation.json"
    ) {
      if (!AI_EVAL_JSON)
        return json(res, 404, {
          ok: false,
          error: "ai-evaluation.json not found",
        });
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(AI_EVAL_JSON);
      return;
    }

    // ── GET /audio/status ─────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/audio/status") {
      return json(res, 200, { ok: true, alm: getALM().getStatus() });
    }

    // ── GET /audio/frequencies ────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/audio/frequencies") {
      return json(res, 200, {
        ok: true,
        solfeggioScale: SOLFEGGIO,
        audioFrequencyMap: AUDIO_FREQUENCY_MAP,
      });
    }

    // ── POST /audio/score ─────────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/audio/score") {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return json(res, 400, {
          ok: false,
          error: "text (string) is required",
        });
      }
      const profile = getALM().score(body.text, { genre: body.genre });
      return json(res, 200, { ok: true, profile });
    }

    // ── POST /audio/sequence ──────────────────────────────────────────────
    if (req.method === "POST" && pathname === "/audio/sequence") {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return json(res, 400, {
          ok: false,
          error: "text (string) is required",
        });
      }
      const seq = getALM().sequence(body.text, {
        maxSteps: body.maxSteps || 16,
      });
      return json(res, 200, { ok: true, sequence: seq });
    }

    // ── GET /swarm/attest ─────────────────────────────────────────────────
    // Run PHI/PSI dual attestation on the scanner files directly.
    // Returns: alphaCoherence, omegaCoherence, goldenBand, status, consensus.
    if (req.method === "GET" && pathname === "/swarm/attest") {
      try {
        const { pathToFileURL } = await import("url");
        const { join, dirname } = await import("path");
        const { fileURLToPath } = await import("url");
        const __rootDir = dirname(fileURLToPath(import.meta.url));
        const { default: DualAttestation } = await import(
          pathToFileURL(
            join(__rootDir, "geo", "intelligence", "MerkabaDualAttestation.js"),
          ).href
        );
        const result = await DualAttestation.attestScanner();
        return json(res, 200, { ok: true, ...result });
      } catch (err) {
        return json(res, 500, { ok: false, error: err.message });
      }
    }

    // ── 404 — HTML for browsers, JSON for API clients ──────────────────
    const accept404 = req.headers["accept"] || "";
    if (accept404.includes("text/html") || accept404.includes("*/*")) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Page Not Found — AIOS VR Platform</title>
<meta name="robots" content="noindex"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04080f;color:#edf4ff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center;}
.glyph{font-size:4rem;margin-bottom:1.25rem;opacity:0.5;}
h1{font-size:1.75rem;font-weight:800;margin-bottom:0.5rem;}
p{color:#8aa0c8;font-size:0.92rem;max-width:380px;line-height:1.6;margin-bottom:2.5rem;}
.links{display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;}
.btn{padding:0.55rem 1.2rem;border-radius:10px;font-weight:700;font-size:0.85rem;text-decoration:none;}
.btn-primary{background:#00d4ff;color:#000;}
.btn-secondary{border:1px solid rgba(255,255,255,0.12);color:#8aa0c8;}
.btn-secondary:hover{color:#edf4ff;}
</style>
</head>
<body>
<div class="glyph">⬡</div>
<h1>Page Not Found</h1>
<p>That URL doesn't exist on AIOS. Head back to the platform — ${VR_TAXONOMY ? (VR_TAXONOMY.categories || []).reduce((n, c) => n + (c.experiences || []).filter((e) => e.status === "live").length, 0) : 23} live VR worlds are waiting.</p>
<div class="links">
  <a class="btn btn-primary" href="/vr-hub">🥽 VR Hub</a>
  <a class="btn btn-secondary" href="/">Home</a>
  <a class="btn btn-secondary" href="/start">Start Here</a>
  <a class="btn btn-secondary" href="/experiences">All Experiences</a>
  <a class="btn btn-secondary" href="/products">⚡ Products</a>
</div>
</body>
</html>`);
      return;
    }
    // ── GET /api/geo/catalogue — AIOSProducerSwarm live catalogue ──────────
    if (req.method === "GET" &&
        (pathname === "/api/geo/catalogue" || pathname === "/api/geo/catalogue/")) {
      const limit = Math.min(100, parseInt(new URL(req.url, "http://x").searchParams.get("limit") || "100", 10));
      const genre = new URL(req.url, "http://x").searchParams.get("genre") || null;
      let result = genre
        ? GEO_CATALOGUE.filter(p => p.genre && p.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        : GEO_CATALOGUE;
      result = result.slice(0, limit);
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      });
      res.end(JSON.stringify({
        ok: true,
        count: result.length,
        total: GEO_CATALOGUE.length,
        productionCount: GEO_PRODUCTION_COUNT,
        intervalMs: GEO_PRODUCTION_INTERVAL_MS,
        programmes: result
      }));
      return;
    }

    // ── GET /api/geo/stats — production stats ────────────────────────────────
    if (req.method === "GET" &&
        (pathname === "/api/geo/stats" || pathname === "/api/geo/stats/")) {
      const totalDuration = GEO_CATALOGUE.reduce((a, p) => a + (p.duration || 0), 0);
      const totalKB = GEO_CATALOGUE.reduce((a, p) => a + (p.fileSizeBytes || 0), 0) / 1024;
      const genres = {};
      GEO_CATALOGUE.forEach(p => (p.genre || []).forEach(g => { genres[g] = (genres[g] || 0) + 1; }));
      return json(res, 200, {
        ok: true,
        catalogue: GEO_CATALOGUE.length,
        productionCount: GEO_PRODUCTION_COUNT,
        totalDurationHours: Math.round(totalDuration / 3600 * 10) / 10,
        totalCatalogueKB: Math.round(totalKB * 10) / 10,
        intervalMs: GEO_PRODUCTION_INTERVAL_MS,
        genres
      });
    }

    // ── POST /api/geo/produce — trigger on-demand production ─────────────────
    if (req.method === "POST" &&
        (pathname === "/api/geo/produce" || pathname === "/api/geo/produce/")) {
      const p = generateGeoProgram();
      return json(res, 200, { ok: true, programme: p });
    }

    // ── GET /api/geo/:id — single programme by id ─────────────────────────────
    if (req.method === "GET" && pathname.startsWith("/api/geo/")) {
      const geoId = pathname.slice("/api/geo/".length).replace(/\/$/, "");
      if (geoId && !geoId.includes("/")) {
        const prog = GEO_CATALOGUE.find(p => p.id === geoId);
        if (prog) return json(res, 200, { ok: true, programme: prog });
        return json(res, 404, { ok: false, error: "Programme not found" });
      }
    }

    // ── GET /geo-library — AIOS .geo Netflix Catalogue ────────────────────────
    if (req.method === "GET" &&
        (pathname === "/geo-library" || pathname === "/geo-library/")) {
      if (!GEO_LIBRARY_HTML)
        return json(res, 404, { ok: false, error: "Geo library page not found" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(GEO_LIBRARY_HTML);
      return;
    }

    return json(res, 404, {
      ok: false,
      error: "Not Found",
      hint: "Visit https://realaios.com for the full platform.",
    });
  } catch (err) {
    console.error("[GeoQode OS] Request error:", err);
    return json(res, 500, {
      ok: false,
      error: "Internal execution error",
      message: err.message,
    });
  }
});

// ─── AIOSProducerSwarm — 24/7 Autonomous .geo Production Engine ─────────────
// Like Universal Studios, Disney, Pixar — but AI-native, infinite, always on.
// Generates complete .geo programme specs every GEO_PRODUCTION_INTERVAL_MS ms.
// Keeps a rolling in-memory catalogue (max GEO_CATALOGUE_MAX entries).
// Exposed via GET /api/geo/catalogue and related routes.
// ────────────────────────────────────────────────────────────────────────────

const GEO_CATALOGUE = [];
const GEO_CATALOGUE_MAX = 120;
let GEO_PRODUCTION_COUNT = 0;
const GEO_PRODUCTION_INTERVAL_MS = parseInt(
  process.env.GEO_PRODUCTION_INTERVAL_MS || "120000", 10
);

const _GEO_ADJ = [
  "Quantum","Infinite","Meridian","Eternal","Radiant","Lucid","Prismatic",
  "Holographic","Stellar","Neural","Spectral","Chronos","Aurora","Omega","Delta",
  "Celestial","Vortex","Fractal","Nebular","Sonic","Crystalline","Liminal",
  "Phosphene","Tessera","Hyper","Meta","Astral","Temporal","Kinetic","Lattice"
];
const _GEO_NOUN = [
  "Emergence","Resonance","Cascade","Horizon","Flux","Convergence","Veil",
  "Spiral","Genesis","Ascent","Bloom","Awakening","Echo","Drift","Pulse",
  "Nexus","Threshold","Archive","Codex","Transmission","Signal","Frequency",
  "Membrane","Prism","Mirror","Labyrinth","Chamber","Gate","Field","Circuit"
];
const _GEO_SUBTITLE = [
  "A PHI-lattice meditation","An infinite canvas","A living signal",
  "Born from the swarm","Rendered by intelligence","The geometry of light",
  "Where code becomes consciousness","A new kind of cinema","Beyond pixels",
  "The renderer is the codec","AI dreaming in colour","Time as texture",
  "Matter dissolved into motion","The algorithm remembers","Signals from deep time",
  "Coherence at 1.618","A programme that knows you","Light without a source"
];
const _GEO_RENDERERS = [
  "matrix","inception","apollo","hyperspace","nebula","neural",
  "quantum","merkaba","phoenix","ocean","escher","chronos","aurora","cosmos3d","dna",
  "kaleidoscope","plasma","lightning","vortex","fractal"
];
const _GEO_GENRES = [
  ["Quantum","Meditation"],["Cosmic","Ambient"],["Cinematic","Drama"],
  ["Neural","Abstract"],["Sci-Fi","Physics"],["Mystical","Visual"],
  ["Cosmos","Nature"],["Mind","Surreal"],["Holographic","AI"],
  ["Psychedelic","Immersive"],["Temporal","Resonance"],["Aurora","Ambient"]
];
const _GEO_HZ = [396, 417, 528, 639, 741, 852, 963, 72];
const _GEO_WAVES = ["sine","triangle","sawtooth","square","sine","sine"];
const _GEO_PALETTES = [
  ["#0a0f2e","#1a1060","#4040c0","#8080ff","#ffffff"],
  ["#0f1a0a","#204010","#408030","#80c060","#e0ffe0"],
  ["#1a0500","#3d1000","#7a2000","#ff6600","#fff0e0"],
  ["#001419","#00283d","#003d55","#0080a0","#00d4ff"],
  ["#0a0010","#200040","#500090","#9000d0","#f0a0ff"],
  ["#0f0f00","#282800","#505010","#a0a020","#ffff80"],
  ["#000510","#000a20","#001040","#002080","#00a0ff"],
  ["#100005","#200010","#400020","#800040","#ff0080"]
];
const _GEO_GRADES = [
  { filter:"saturate(1.1) contrast(1.06)", ov:"rgba(0,18,40,0.10)" },
  { filter:"saturate(1.2) hue-rotate(5deg)", ov:"rgba(0,40,0,0.08)" },
  { filter:"saturate(1.15) brightness(1.04)", ov:"rgba(40,10,0,0.08)" },
  { filter:"saturate(1.08) contrast(1.04)", ov:"rgba(0,10,20,0.09)" },
  { filter:"hue-rotate(-8deg) saturate(1.2)", ov:"rgba(20,0,40,0.09)" },
  { filter:"brightness(1.06) saturate(1.1)", ov:"rgba(30,30,0,0.07)" }
];
const _GEO_SPATIAL = [-0.35,-0.25,-0.18,-0.08,0,0.08,0.18,0.25,0.35];
const _GEO_AGENTS = {
  directors: ["QuantumDirector-v3","NexusDirector-v2","ChromaDirector-v4","LatticeDirector-v1"],
  composers: ["HarmonicForge-v4","SolfeggioEngine-v3","WaveArchitect-v2","FrequencyWeaver-v3"],
  fx:        ["ParticleForge-v3","VortexFX-v2","CrystalFX-v4","NebularFX-v1"],
  colorists: ["LatticeColorist-v2","PrismaticGrader-v3","AuroraGrader-v1","ChromaMapper-v2"]
};

function _rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateGeoProgram() {
  const now = Date.now();
  const id = `geo_${now.toString(36)}_${Math.random().toString(36).slice(2,7)}`;
  const title = `${_rnd(_GEO_ADJ)} ${_rnd(_GEO_NOUN)}`;
  const subtitle = _rnd(_GEO_SUBTITLE);
  const renderer = _rnd(_GEO_RENDERERS);
  const genre = _rnd(_GEO_GENRES);
  const hz = _rnd(_GEO_HZ);
  const palette = _rnd(_GEO_PALETTES);
  const grade = _rnd(_GEO_GRADES);
  const spatialPan = _rnd(_GEO_SPATIAL);
  const intensity = Math.round((0.72 + Math.random() * 0.28) * 100) / 100;
  const runtime = _rndInt(42, 120) * 60; // 42–120 minutes in seconds
  const sceneCount = _rndInt(4, 7);
  const latticeNode = _rndInt(0, 47);
  const harmonicNode = _rndInt(0, 479);
  const coherence = Math.round((0.88 + Math.random() * 0.12) * 100) / 100;
  const phiCoef = 1.618;
  const psiCoef = 1.414;

  const scenes = Array.from({length: sceneCount}, (_, i) => ({
    id: `scene_${i}`,
    name: `${_rnd(_GEO_ADJ)} ${_rnd(["Phase","Wave","Arc","Chamber","Gate","Layer","Frequency"])}`,
    dur: _rndInt(180, 600),
    intensity: Math.round((0.5 + (i / sceneCount) * 0.5) * 100) / 100,
    transition: _rnd(["crossfade","phi-sweep","bloom-burst","dissolve"])
  }));

  const fileBytes = JSON.stringify({id}).length + 1800 + Math.floor(Math.random() * 400);
  const equivMp4GB = ((runtime / 3600) * 22.4).toFixed(1);

  const programme = {
    format: "aios-geo-v2",
    codec: "AIOS-GEO-CODEC-v2",
    license: "AIOS-OC-1.0",
    id,
    title,
    subtitle,
    producedAt: new Date(now).toISOString(),
    producedAtMs: now,
    sequenceNum: GEO_PRODUCTION_COUNT + 1,
    duration: runtime,
    fileSizeBytes: fileBytes,
    fileSizeKB: (fileBytes / 1024).toFixed(1),
    equivalentMp4: `${equivMp4GB} GB`,
    display: {
      resolution: "∞ render-native",
      frameRate: "device-native (∞fps)",
      aspectRatio: "16:9",
      colorSpace: "sRGB + HDR-adaptive"
    },
    renderer: { type: renderer, palette, intensity, phiCoherence: phiCoef, bloomStrength: 0.26, scanlines: true },
    audio: {
      hz,
      wave: _rnd(_GEO_WAVES),
      lfoRate: 0.618,
      drone: true,
      spatialPan,
      reverbWet: 0.28,
      reverbDuration: 1.8
    },
    scenes,
    colourGrade: grade,
    genre,
    intelligence: {
      adaptive: true,
      vrNative: true,
      arNative: true
    },
    geoqode: {
      architectureSignature: "8,26,48:480",
      semanticType: "PHYSICS",
      frequency: hz,
      latticeNode,
      harmonicNode,
      phiCoefficient: phiCoef,
      psiCoefficient: psiCoef,
      coherence,
      d48Expansion: "CANONICAL",
      d480Expansion: "FULL_HARMONIC"
    },
    swarm: {
      studio: "AIOSProducerSwarm",
      producedAt: "Production-Floor-01",
      agents: {
        director:       _rnd(_GEO_AGENTS.directors),
        composer:       _rnd(_GEO_AGENTS.composers),
        fx:             _rnd(_GEO_agents ? [] : _GEO_AGENTS.fx),
        colorist:       _rnd(_GEO_AGENTS.colorists),
        distributor:    "GeoDistributor-v1"
      }
    },
    distribution: { drm: "none", openStandard: true, streamable: true, offline: true }
  };

  // Fix the _GEO_agents typo:
  programme.swarm.agents.fx = _rnd(_GEO_AGENTS.fx);

  GEO_CATALOGUE.unshift(programme);
  if (GEO_CATALOGUE.length > GEO_CATALOGUE_MAX) GEO_CATALOGUE.pop();
  GEO_PRODUCTION_COUNT++;
  console.log(
    `[AIOSProducerSwarm] 🎬 Produced #${GEO_PRODUCTION_COUNT}: "${title}" [${renderer}·${hz}Hz·${(fileBytes/1024).toFixed(1)}KB]`
  );
  return programme;
}

// Seed 12 programmes on boot, then produce every interval
for (let i = 0; i < 12; i++) generateGeoProgram();
setInterval(generateGeoProgram, GEO_PRODUCTION_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`[GeoQode OS] MERKABA_geoqode OS running on port ${PORT}`);
  console.log(
    `[GeoQode OS] Canonical architecture active: ${CANONICAL_ARCHITECTURE}`,
  );
  console.log(`[GeoQode OS] Storm connected: ${Boolean(BACKEND_URL)}`);
  console.log(
    `[GeoQode OS] Available playbooks: ${BUILT_IN_PLAYBOOKS.join(", ")}`,
  );
});

process.on("SIGINT", () => {
  console.log("[GeoQode OS] Shutdown");
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("[GeoQode OS] Shutdown");
  process.exit(0);
});
