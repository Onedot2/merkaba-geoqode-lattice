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

// ─── Minimal HTTP server — no external framework dependency needed ────────
function json(res, status, data) {
  const canonicalArchitecture = assertCanonicalArchitectureSignature(
    CANONICAL_ARCHITECTURE,
    {
      source: "server.json",
    },
  );

  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "X-Service": "geoqode-os",
    "X-MERKABA-Dimensions": "48",
    "X-MERKABA-Architecture": canonicalArchitecture,
    "X-MERKABA-Spectrum-Nodes": String(HARMONIC_SPECTRUM_NODES),
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
        url: "https://67aios.com",
      });
    }

    // ── GET /api — GeoQode OS API info (JSON) ──────────────────────────────
    if (req.method === "GET" && pathname === "/api") {
      return json(res, 200, {
        ok: true,
        service: "geoqode-os",
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
      const { name, email, message } = body;

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
          interests: `Products: AIOS\nNotes: ${String(message || "")
            .trim()
            .slice(0, 500)}\nSource: 67aios.com`,
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

    // ── GET /health ──────────────────────────────────────────────────────
    if (req.method === "GET" && pathname === "/health") {
      const aware = getAware();
      const awState = aware.getStatus();
      return json(res, 200, {
        ok: true,
        service: "geoqode-os",
        os: "MerkabaDimensionalOS",
        version: "1.0.0",
        lattice: "48-dimension canonical MERKABA",
        architecture: CANONICAL_ARCHITECTURE,
        architectureDisplay: "8→26→48:480",
        phi: 1.618,
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
        service: "geoqode-os",
        version: os.version,
        lattice: {
          strictCanonicalArchitecture: assertCanonicalArchitectureSignature(
            CANONICAL_ARCHITECTURE,
            {
              source: "GET /status",
            },
          ),
          dimensions: CANONICAL_LATTICE_NODES,
          architecture: CANONICAL_ARCHITECTURE,
          anchors: {
            foundation: FOUNDATION_NODES,
            bosonic: BOSONIC_ANCHOR_NODES,
            harmonicSpectrum: HARMONIC_SPECTRUM_NODES,
          },
          tiers: 4,
          tierLabels: [
            "Core Foundations",
            "Operational Systems",
            "Knowledge Dimensions",
            "Emergent Dimensions",
          ],
        },
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
        architecture: CANONICAL_ARCHITECTURE,
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
          system: "MERKABA48OS Cinema Virtualization",
          architecture: "8→26→48:480",
          pipeline: [
            "ScriptParser",
            "NarrativeEmbedder",
            "MerkabAware",
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
      return json(res, 200, {
        ok: true,
        theatre: theatre.getOSHealth(),
        programmes: Object.keys(PROGRAMME_CATALOGUE),
        realityModes: Object.keys(REALITY_MODES),
      });
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
        return json(res, 200, { ok: true, session });
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
        return json(res, 200, { ok: true, session });
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
          architectureSignature: "8,26,48:480",
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

    // ── 404 ───────────────────────────────────────────────────────────────
    return json(res, 404, {
      ok: false,
      error: "Not Found",
      endpoints: [
        "GET  /health",
        "GET  /",
        "GET  /status",
        "GET  /dimensions",
        "GET  /playbooks",
        "GET  /codex/status",
        "POST /codex/execute",
        "GET  /merkaba/activation-update",
        "GET  /merkaba/ai-verification-page",
        "GET  /merkaba/install-manifest",
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
