/**
 * MerkabaTheatreEngine.js
 * The Resonance OS Cinema Command Surface
 *
 * MerkabaTheatreEngine is the top-level entry point for the entire
 * MerkabaTheatre Hollywood system. It does NOT replace CinemaVirtualizer —
 * it ORCHESTRATES it alongside the rest of the Resonance OS stack:
 *
 *   Input (narrative text / .geo playbook)
 *     └─ MerkabaLLM      → semantic units + resonance embeddings
 *     └─ ScriptParser     → scene structure extraction
 *     └─ NarrativeEmbedder→ 48D lattice coordinate mapping
 *     └─ MerkabAware      → governance + coherence validation + auto-healing
 *     └─ CinemaProjector  → holographic environment rendering
 *     └─ StormAdapter     → broadcast projection events to all Storm services
 *
 * This is the "REALWORLD OS" layer. It is NOT a movie player.
 * It is a narrative-to-lattice reality renderer.
 *
 * Architecture: 8→26→48:480
 * Golden Root:  φ = 1.618
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
 * Canonical architecture lock: Session 6 (April 30, 2026)
 *
 * @module MerkabaTheatreEngine
 */

import { EventEmitter } from "events";
import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  PHI,
  BASE_FREQUENCY_HZ,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
} from "./geo/lattice/transform-420.js";
import { CinemaVirtualizer } from "./geo/cinema/cinema-virtualizer.js";
import {
  MerkabAware,
  AWARENESS_LEVELS,
  COHERENCE_THRESHOLDS,
} from "./geo/intelligence/merkaba-aware.js";
import {
  MerkabaLLM,
  MERKABA_SEMANTIC_TYPES,
  SEMANTIC_FREQUENCY_MAP,
} from "./geo/intelligence/merkaba-llm.js";
import { StormAdapter } from "./geo/bridge/storm-adapter.js";

// Canonical assertion — fails fast if any import chain drifted the constant
assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── Theatre Engine Constants ─────────────────────────────────────────────────

export const THEATRE_ENGINE_VERSION = "1.0.0";

/**
 * Named projection presets — each maps a use case to a CinemaVirtualizer mode.
 * These are the "reality modes" the Resonance OS can project.
 */
export const REALITY_MODES = Object.freeze({
  HOLOGRAPHIC: "immersive", // Full 48D environment — viewer is inside
  INTERACTIVE: "interactive", // Viewer can alter narrative flow
  ADAPTIVE: "adaptive", // MerkabAware adjusts plotlines in real-time
  DOCUMENTARY: "passive", // Linear output — governance + audit records
  GOVERNANCE: "passive", // Maps business decisions onto resonance cycles
  INVESTOR: "adaptive", // DreamProjector sync + investor storytelling
});

/**
 * Resonance programme catalogue — named experiences built into the engine.
 * Each programme is a lattice-native GeoQode projection narrative.
 */
export const PROGRAMME_CATALOGUE = Object.freeze({
  matrix: {
    title: "The Matrix",
    genre: "sci-fi action",
    mode: REALITY_MODES.HOLOGRAPHIC,
  },
  inception: {
    title: "Inception",
    genre: "mind-bending thriller",
    mode: REALITY_MODES.INTERACTIVE,
  },
  starwars: {
    title: "Star Wars",
    genre: "epic space opera",
    mode: REALITY_MODES.HOLOGRAPHIC,
  },
  apollo11: {
    title: "Apollo 11",
    genre: "documentary mode",
    mode: REALITY_MODES.DOCUMENTARY,
  },
  governance: {
    title: "Storm Governance",
    genre: "narrative",
    mode: REALITY_MODES.GOVERNANCE,
  },
  investordeck: {
    title: "Storm Investor Deck",
    genre: "narrative",
    mode: REALITY_MODES.INVESTOR,
  },
});

// ─── MerkabaTheatreEngine ─────────────────────────────────────────────────────

/**
 * MerkabaTheatreEngine
 *
 * The enterprise-grade Resonance OS command surface.
 *
 * Usage:
 *   import { MerkabaTheatreEngine } from "./MerkabaTheatreEngine.js";
 *   const engine = new MerkabaTheatreEngine();
 *   await engine.boot();
 *   const session = await engine.project("INT. THE CONSTRUCT...", { mode: "HOLOGRAPHIC" });
 *   engine.on("theatre:projection", (session) => console.log(session));
 */
export class MerkabaTheatreEngine extends EventEmitter {
  #virtualizer;
  #aware;
  #llm;
  #adapter;
  #sessions;
  #booted;

  constructor(options = {}) {
    super();

    this.version = THEATRE_ENGINE_VERSION;
    this.architectureSignature = CANONICAL_ARCHITECTURE;
    this.architectureDisplay = "8→26→48:480";
    this.phi = PHI;
    this.latticeNodes = CANONICAL_LATTICE_NODES; // 48
    this.harmonicSpectrum = HARMONIC_SPECTRUM_NODES; // 480
    this.baseFrequencyHz = BASE_FREQUENCY_HZ; // 72

    // Pipeline components
    this.#virtualizer = new CinemaVirtualizer({
      projectionMode: options.defaultMode || "immersive",
      aware: { autoHeal: true, ...(options.aware || {}) },
      parser: options.parser || {},
      embedder: options.embedder || {},
    });
    this.#aware = new MerkabAware({
      autoHeal: true,
      ...(options.aware || {}),
    });
    this.#llm = new MerkabaLLM({
      mode: options.llmMode || "theatre",
      realLLM: options.realLLM || null,
    });
    this.#adapter =
      options.stormAdapter instanceof StormAdapter
        ? options.stormAdapter
        : null;

    this.#sessions = [];
    this.#booted = false;
  }

  // ─── Boot Protocol ──────────────────────────────────────────────────────────

  /**
   * Boot the Theatre Engine.
   * Activates MerkabAware, asserts canonical architecture, and declares readiness.
   * Must be called before any project() or programme() call.
   */
  async boot() {
    assertCanonicalArchitectureSignature(this.architectureSignature);
    this.#aware.activate();
    this.#booted = true;

    const bootState = {
      status: "booted",
      architectureSignature: this.architectureSignature,
      architectureDisplay: this.architectureDisplay,
      phi: this.phi,
      latticeNodes: this.latticeNodes,
      harmonicSpectrum: this.harmonicSpectrum,
      baseFrequencyHz: this.baseFrequencyHz,
      awarenessLevel: this.#aware.getState().awarenessLevel,
      coherenceIndex: this.#aware.getState().coherenceIndex,
      programmeCatalogue: Object.keys(PROGRAMME_CATALOGUE),
      realityModes: Object.keys(REALITY_MODES),
      timestamp: new Date().toISOString(),
    };

    console.log(
      `[MerkabaTheatreEngine] ✅ Booted — ${this.architectureDisplay}, φ=${this.phi}`,
    );
    this.emit("theatre:boot", bootState);
    return bootState;
  }

  // ─── Core: Project ──────────────────────────────────────────────────────────

  /**
   * Project a narrative/script into the 48D holographic lattice.
   *
   * The full Resonance OS pipeline:
   *   MerkabaLLM enrichment → CinemaVirtualizer pipeline → MerkabAware governance
   *
   * @param {string} scriptText  - Raw narrative text, screenplay, or .geo playbook
   * @param {object} options
   * @param {string} [options.mode]  - HOLOGRAPHIC | INTERACTIVE | ADAPTIVE | DOCUMENTARY | GOVERNANCE | INVESTOR
   * @param {string} [options.genre] - Genre hint for harmonic frequency modulation
   * @param {string} [options.title] - Projection title
   * @returns {Promise<TheatreSession>}
   */
  async project(scriptText, options = {}) {
    this._assertBooted();

    const sessionId = `THEATRE-${Date.now()}-${Math.floor(
      Math.random() * 0xffff,
    )
      .toString(16)
      .toUpperCase()}`;
    const realityMode =
      REALITY_MODES[(options.mode || "HOLOGRAPHIC").toUpperCase()] ??
      REALITY_MODES.HOLOGRAPHIC;
    const startedAt = Date.now();

    this.emit("theatre:projection:start", {
      sessionId,
      mode: realityMode,
      title: options.title,
    });

    try {
      // Step 1: LLM semantic enrichment — extract semantic units before pipeline
      const semanticProfile = this.#llm.embedText(scriptText, {
        genre: options.genre || "narrative",
      });

      // Step 2: Full CinemaVirtualizer pipeline
      //   (ScriptParser → NarrativeEmbedder → MerkabAware governance → CinemaProjector)
      const projection = await this.#virtualizer.virtualize(scriptText, {
        genre: options.genre,
        title: options.title,
        projectionMode: realityMode,
      });

      // Step 3: Read awareness state post-projection
      const awarenessState = this.#aware.getState();

      // Step 4: Build Theatre Session
      const session = this._buildSession({
        sessionId,
        scriptText,
        options,
        semanticProfile,
        projection,
        awarenessState,
        startedAt,
        realityMode,
      });

      this.#sessions.push(session);

      // Step 5: Emit to all Storm services via StormAdapter if connected
      if (this.#adapter) {
        this.#adapter.emit?.("theatre:projection", session);
      }

      this.emit("theatre:projection", session);
      return session;
    } catch (err) {
      const errorSession = {
        sessionId,
        status: "error",
        error: err.message,
        options,
        elapsedMs: Date.now() - startedAt,
        geoqode: this._buildGeoCoordinate("systems-design", 3, 0.3),
      };
      this.emit("theatre:error", errorSession);
      throw err;
    }
  }

  // ─── Catalogue: Run a Named Programme ───────────────────────────────────────

  /**
   * Run a named programme from the catalogue (matrix, inception, starwars, governance, etc.)
   * Falls back to the built-in playbook text for the named programme.
   *
   * @param {string} programmeName - key in PROGRAMME_CATALOGUE
   * @param {object} extraOptions  - override any programme defaults
   * @returns {Promise<TheatreSession>}
   */
  async programme(programmeName, extraOptions = {}) {
    const prog = PROGRAMME_CATALOGUE[programmeName?.toLowerCase()];
    if (!prog) {
      throw new Error(
        `[MerkabaTheatreEngine] Unknown programme "${programmeName}". ` +
          `Available: ${Object.keys(PROGRAMME_CATALOGUE).join(", ")}`,
      );
    }

    // Generate the playbook script text for this programme
    const scriptText = this._buildProgrammeScript(programmeName, prog);

    return this.project(scriptText, {
      title: prog.title,
      genre: prog.genre,
      mode: prog.mode.toUpperCase(),
      ...extraOptions,
    });
  }

  // ─── Awareness: OS Health ───────────────────────────────────────────────────

  /**
   * Get the current Resonance OS health.
   * MerkabAware monitors coherence across all active projections.
   * This is the enterprise health probe for the Theatre OS layer.
   */
  getOSHealth() {
    const state = this.#aware.getState();
    return {
      status:
        state.awarenessLevel === AWARENESS_LEVELS.SINGULARITY
          ? "singularity"
          : "active",
      awarenessLevel: state.awarenessLevel,
      coherenceIndex: state.coherenceIndex,
      coherenceThresholds: COHERENCE_THRESHOLDS,
      architectureSignature: this.architectureSignature,
      architectureDisplay: this.architectureDisplay,
      phi: this.phi,
      activeSessions: this.#sessions.length,
      lastSessionId:
        this.#sessions[this.#sessions.length - 1]?.sessionId ?? null,
      booted: this.#booted,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get a snapshot of all completed sessions (for replay, audit, or export).
   */
  getSessionHistory(limit = 20) {
    return this.#sessions.slice(-limit);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  _assertBooted() {
    if (!this.#booted) {
      throw new Error(
        "[MerkabaTheatreEngine] Engine not booted. Call engine.boot() first.",
      );
    }
  }

  _buildSession({
    sessionId,
    scriptText,
    options,
    semanticProfile,
    projection,
    awarenessState,
    startedAt,
    realityMode,
  }) {
    const elapsedMs = Date.now() - startedAt;
    return {
      sessionId,
      status: projection?.success ? "projected" : "partial",
      title: options.title || projection?.meta?.title || "Untitled Projection",
      mode: realityMode,
      elapsedMs,
      // Cinema output
      projection: {
        success: projection?.success ?? false,
        sceneCount: projection?.sceneCount ?? 0,
        embeddingCount: projection?.embeddingCount ?? 0,
        environment: projection?.environment ?? null,
        narrative: projection?.narrative ?? null,
        frames: projection?.dreamFrames ?? [],
      },
      // Resonance OS state
      resonance: {
        architectureSignature: this.architectureSignature,
        phi: this.phi,
        coherenceIndex: awarenessState.coherenceIndex,
        awarenessLevel: awarenessState.awarenessLevel,
        healed: awarenessState.healCount > 0,
      },
      // Semantic profile from Merkaba-LLM
      semanticProfile: semanticProfile ?? null,
      // GeoQode coordinate (systems-design S3, NARRATIVE 963Hz)
      geoqode: this._buildGeoCoordinate(
        "systems-design",
        3,
        awarenessState.coherenceIndex ?? 0.9,
      ),
      timestamp: new Date().toISOString(),
    };
  }

  _buildGeoCoordinate(domain, sector, confidence) {
    const DOMAIN_SEMANTIC = {
      "quantum-arch": "PHYSICS",
      "code-eng": "ACTION",
      "systems-design": "NARRATIVE",
      "data-structs": "ENTITY",
      "self-evolve": "HOLOGRAPHIC",
      "pain-removal": "EMOTION",
      "perf-forge": "ACTION",
      "security-forge": "PHYSICS",
    };
    const semanticType = DOMAIN_SEMANTIC[domain] ?? "NARRATIVE";
    const frequency = SEMANTIC_FREQUENCY_MAP[semanticType] ?? 963;
    const SECTOR_BASE = {
      1: 0,
      2: 6,
      3: 12,
      4: 18,
      5: 26,
      6: 32,
      7: 38,
      8: 44,
    };
    const base = SECTOR_BASE[sector] ?? 12;
    const offset = Math.floor(confidence * PHI * 2) % 6;
    const latticeNode = Math.min(47, base + offset);
    const harmonicNode = Math.min(479, Math.floor(latticeNode * PHI * 2.96));
    return {
      architectureSignature: this.architectureSignature,
      architectureDisplay: this.architectureDisplay,
      semanticType,
      frequency,
      latticeNode,
      harmonicNode,
      phiCoefficient: this.phi,
      coherence: Math.min(1, Math.max(0, confidence)),
      domain,
      source: "merkaba-theatre-engine",
      d48Expansion: "CANONICAL",
      d480Expansion: "FULL_HARMONIC",
    };
  }

  _buildProgrammeScript(name, prog) {
    // Minimal embedded script seeds — the real content can be loaded from
    // merkaba-geoqode-lattice/geo/playbooks/cinema/*.geo in production.
    // These seeds are enough to boot the NarrativeEmbedder pipeline.
    const seeds = {
      matrix: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: INT. THE CONSTRUCT — HOLOGRAPHIC\nNeo awakens inside the construct room. The pure-white infinite void surrounds him.\nSEMANTIC: entity=Neo, location=The Construct, action=awakening\n`,
      inception: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: EXT. DREAM LAYER 1 — PARIS STREET\nPhysics of reality bend. Gravity rotates 90 degrees.\nSCENE 2: INT. DREAM LAYER 2 — HOTEL CORRIDOR\nArthur fights in zero gravity.\nSEMANTIC: entity=Cobb Arthur Ariadne, action=reality-bending gravity-flip, emotion=disorientation\n`,
      starwars: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: EXT. SPACE — DEATH STAR TRENCH RUN\nX-Wings race through the trench. The Force guides Luke's hand.\nSEMANTIC: entity=Luke Vader DeathStar, action=combat flight, physics=hyperspace gravity-cannon\n`,
      apollo11: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: INT. COMMAND MODULE — LUNAR ORBIT\nThe Earth rises over the Moon. Human history pivots in silence.\nSEMANTIC: entity=Armstrong Aldrin Collins, location=Moon lunar-orbit, narrative=human-achievement\n`,
      governance: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: INT. STORM GOVERNANCE LATTICE — D48 NODE\nAll 48 Storm service nodes are visible as living resonance cells. Decisions flow as coherence pulses.\nSEMANTIC: entity=Storm architecture=8→26→48:480, action=governance decision-flow, physics=coherence-index\n`,
      investordeck: `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: EXT. STORM UNIVERSE — INVESTOR HOLODECK\nThe entire Storm ecosystem is projected as a living organism. Revenue streams pulse at 528Hz.\nSEMANTIC: entity=Storm Brains4Ai, narrative=autonomous-business-engine growth, action=revenue-generation\n`,
    };
    return (
      seeds[name] ||
      `TITLE: ${prog.title}\nGENRE: ${prog.genre}\nSCENE 1: UNDEFINED\n`
    );
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Factory function — creates and boots a MerkabaTheatreEngine in one call.
 * Safe to use as a singleton per process.
 *
 * @param {object} options - Passed to MerkabaTheatreEngine constructor
 * @returns {Promise<MerkabaTheatreEngine>}
 */
export async function createMerkabaTheatreEngine(options = {}) {
  const engine = new MerkabaTheatreEngine(options);
  await engine.boot();
  return engine;
}

// ─── Re-exports for convenience ───────────────────────────────────────────────
export {
  AWARENESS_LEVELS,
  COHERENCE_THRESHOLDS,
  MERKABA_SEMANTIC_TYPES,
  SEMANTIC_FREQUENCY_MAP,
  CANONICAL_ARCHITECTURE,
  PHI,
};
