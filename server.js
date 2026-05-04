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

// ─── Static assets ───────────────────────────────────────────────────────────
const __dirname_static = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname_static, "public");
const AIOS_HTML_PATH = join(PUBLIC_DIR, "index.html");
const AIOS_HTML = existsSync(AIOS_HTML_PATH)
  ? readFileSync(AIOS_HTML_PATH, "utf-8")
  : null;

const LAB_HTML_PATH = join(PUBLIC_DIR, "lab.html");
const LAB_HTML = existsSync(LAB_HTML_PATH)
  ? readFileSync(LAB_HTML_PATH, "utf-8")
  : null;
const VIEWER_HTML_PATH = join(PUBLIC_DIR, "viewer.html");
const VIEWER_HTML = existsSync(VIEWER_HTML_PATH)
  ? readFileSync(VIEWER_HTML_PATH, "utf-8")
  : null;
const ATTEST_HTML_PATH = join(PUBLIC_DIR, "attest.html");
const ATTEST_HTML = existsSync(ATTEST_HTML_PATH)
  ? readFileSync(ATTEST_HTML_PATH, "utf-8")
  : null;
const DASHBOARD_HTML_PATH = join(PUBLIC_DIR, "dashboard.html");
const DASHBOARD_HTML = existsSync(DASHBOARD_HTML_PATH)
  ? readFileSync(DASHBOARD_HTML_PATH, "utf-8")
  : null;

const PLAISTORE_HTML_PATH = join(PUBLIC_DIR, "plaistore.html");
const PLAISTORE_HTML = existsSync(PLAISTORE_HTML_PATH)
  ? readFileSync(PLAISTORE_HTML_PATH, "utf-8")
  : null;

const AIOSDREAM_HTML_PATH = join(PUBLIC_DIR, "aiosdream.html");
const AIOSDREAM_HTML = existsSync(AIOSDREAM_HTML_PATH)
  ? readFileSync(AIOSDREAM_HTML_PATH, "utf-8")
  : null;

const AI_HTML_PATH = join(PUBLIC_DIR, "ai.html");
const AI_HTML = existsSync(AI_HTML_PATH)
  ? readFileSync(AI_HTML_PATH, "utf-8")
  : null;

const START_HTML_PATH = join(PUBLIC_DIR, "start.html");
const START_HTML = existsSync(START_HTML_PATH)
  ? readFileSync(START_HTML_PATH, "utf-8")
  : null;

const VR_HTML_PATH = join(PUBLIC_DIR, "vr.html");
const VR_HTML = existsSync(VR_HTML_PATH)
  ? readFileSync(VR_HTML_PATH, "utf-8")
  : null;

const VR_HUB_HTML_PATH = join(PUBLIC_DIR, "vr-hub.html");
const VR_HUB_HTML = existsSync(VR_HUB_HTML_PATH)
  ? readFileSync(VR_HUB_HTML_PATH, "utf-8")
  : null;

const VR_DEV_HTML_PATH = join(PUBLIC_DIR, "vr-developer.html");
const VR_DEV_HTML = existsSync(VR_DEV_HTML_PATH)
  ? readFileSync(VR_DEV_HTML_PATH, "utf-8")
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

// ─── Singleton adapter (long-lived per process) ───────────────────────────
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
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIOS Products — AI-Native Tools Built on Merkaba OS</title><meta name="description" content="Six AI-native products built on the AIOS Merkaba OS. App factory, AI attestation, uptime intelligence, hallucination detection, signal marketplace, and semantic matching."><meta property="og:title" content="AIOS Products"><meta property="og:description" content="AI-native tools built on autonomous OS geometry."><meta property="og:image" content="https://realaios.com/public/og-image.svg"><meta property="og:url" content="https://realaios.com/products"><meta property="og:type" content="website"><link rel="canonical" href="https://realaios.com/products"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://realaios.com/public/og-image.svg"><script type="application/ld+json">${productListLD}</script><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0f;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh}a{text-decoration:none}nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:rgba(10,10,15,0.92);backdrop-filter:blur(12px);z-index:100}.logo{font-size:1.25rem;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,#00f5d4,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.nav-links{display:flex;gap:1.5rem;align-items:center}.nav-links a{color:rgba(255,255,255,0.55);font-size:0.875rem;font-weight:500;transition:color 0.2s}.nav-links a:hover{color:#fff}main{max-width:1000px;margin:0 auto;padding:5rem 2rem}.hero-label{font-size:0.78rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#00f5d4;margin-bottom:1rem}h1{font-size:clamp(2rem,5vw,3rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:1rem}h1 span{background:linear-gradient(135deg,#00f5d4,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.hero-sub{font-size:1.05rem;color:#888;line-height:1.7;max-width:560px;margin-bottom:3rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}footer{text-align:center;padding:4rem 2rem;color:#444;font-size:0.85rem;border-top:1px solid rgba(255,255,255,0.06);margin-top:4rem}@media(max-width:640px){nav{padding:1rem 1.25rem}main{padding:3rem 1.25rem}}</style></head><body><nav><a href="/" class="logo">⬡ AIOS</a><div class="nav-links"><a href="/vr-hub">🥽 VR Hub</a><a href="/experiences">All XPs</a><a href="/plaistore">PLAIstore</a><a href="/start">Start Here</a><a href="/ai">For AIs</a></div></nav><main><div class="hero-label">AIOS Product Suite</div><h1>Built for the <span>AI-Native Era</span></h1><p class="hero-sub">Six intelligent products running on AIOS Merkaba OS. Self-healing, semantically grounded, and geometrically sound.</p><div class="grid">${cardsHTML}</div></main><footer>© 2026 AIOS — realaios.com</footer></body></html>`;
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
        res.writeHead(200, { "Content-Type": mime });
        res.end(readFileSync(filePath));
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
</head>
<body>
<nav class="xp-nav">
  <a href="/" class="nav-brand">&#x2B21; AIOS</a>
  <div class="nav-links">
    <a href="/vr-hub">&#x1F97D; VR Hub</a>
    <a href="/experiences">All ${liveCount} XPs</a>
    <a href="/start">Start Here</a>
    <a href="/products">⚡ Products</a>
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
</head>
<body>
<nav class="top-nav">
  <a href="/" class="top-nav-brand">&#x2B21; AIOS</a>
  <div class="top-nav-links">
    <a href="/vr-hub">&#x1F97D; VR Hub</a>
    <a href="/experiences" class="active">All XPs</a>
    <a href="/start">Start Here</a>
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
<a class="back" href="/vr-hub">← Full VR Hub</a> &nbsp;&middot;&nbsp; <a class="back" href="/">realaios.com</a> &nbsp;&middot;&nbsp; <a class="back" href="/products">⚡ Products</a>
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
