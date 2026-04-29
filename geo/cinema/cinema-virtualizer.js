/**
 * geo/cinema/cinema-virtualizer.js
 * CinemaVirtualizer — Main Cinema Virtualization Pipeline (Node.js / ES Module)
 *
 * This is the canonical JavaScript implementation of the Cinema Virtualizer
 * described in the MerkabaTheatre Hollywood update (April 29, 2026).
 *
 * The email referenced python classes (ScriptParser, NarrativeEmbedder, etc.)
 * as a spec blueprint — this is the production JS implementation wired into
 * the merkaba-geoqode-lattice runtime.
 *
 * Pipeline: Script/Playbook → Parse → Embed → Validate → Project
 *
 * Usage:
 *   import { CinemaVirtualizer } from './geo/cinema/cinema-virtualizer.js';
 *   const cv = new CinemaVirtualizer();
 *   const result = await cv.virtualize(scriptText, { genre: 'sci-fi' });
 */

import { ScriptParser } from "./script-parser.js";
import { NarrativeEmbedder } from "./narrative-embedder.js";
import { CinemaProjector, PROJECTION_MODES } from "./cinema-projector.js";
import { MerkabAware } from "../intelligence/merkaba-aware.js";
import { MerkabaLLM } from "../intelligence/merkaba-llm.js";
import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
} from "../lattice/transform-420.js";

// Validate canonical 8→26→48:480 on module load
assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── CinemaVirtualizer ────────────────────────────────────────────────────────

/**
 * CinemaVirtualizer
 * The complete MERKABA48OS Cinema Virtualization engine.
 *
 * Integrates all four pipeline stages:
 *   1. ScriptParser  — parses raw script/narrative/.geo playbook
 *   2. NarrativeEmbedder — maps scenes → resonance embeddings
 *   3. MerkabAware (GovernanceValidator) — coherence check + drift healing
 *   4. CinemaProjector — renders holographic environment
 *
 * Additionally integrates:
 *   - MerkabaLLM — for semantic enrichment (optional real LLM adapter)
 */
export class CinemaVirtualizer {
  #parser;
  #embedder;
  #aware;
  #projector;
  #merkabaLLM;
  #history;

  constructor(options = {}) {
    this.version = "1.0.0";
    this.architectureSignature = "8→26→48:480";
    this.name = "MERKABA Cinema Virtualizer";

    // Pipeline stages
    this.#parser = new ScriptParser(options.parser || {});
    this.#embedder = new NarrativeEmbedder(options.embedder || {});
    this.#aware = new MerkabAware({ autoHeal: true, ...options.aware });
    this.#projector = new CinemaProjector({
      mode: options.projectionMode || PROJECTION_MODES.IMMERSIVE,
      ...(options.projector || {}),
    });
    this.#merkabaLLM = new MerkabaLLM({
      mode: options.llmMode || "theatre",
      realLLM: options.realLLM || null,
    });

    this.#history = [];
    this.#aware.activate();
  }

  /**
   * Full virtualization pipeline.
   * Transforms a script/narrative/.geo playbook into a holographic projection.
   *
   * @param {string} scriptText - raw script, .geo playbook, or narrative
   * @param {object} options
   * @param {string} [options.genre]        - genre hint for frequency modulation
   * @param {string} [options.title]        - override title
   * @param {string} [options.projectionMode] - immersive|interactive|adaptive|passive
   * @returns {VirtualizationResult}
   */
  async virtualize(scriptText, options = {}) {
    if (!scriptText || typeof scriptText !== "string") {
      throw new Error(
        "CinemaVirtualizer.virtualize: scriptText must be a non-empty string",
      );
    }

    // Override projection mode if specified
    if (options.projectionMode) {
      const mode =
        PROJECTION_MODES[(options.projectionMode || "").toUpperCase()];
      if (mode) this.#projector = new CinemaProjector({ mode });
    }

    // ── Stage 1: Parse ─────────────────────────────────────────────────────
    const parsed = this.#parser.parse(scriptText);
    if (options.title) parsed.title = options.title;
    if (options.genre) parsed.genre = options.genre;

    // ── Stage 1b: Merkaba-LLM enrichment (if real LLM attached) ───────────
    let llmEnrichment = null;
    if (this.#merkabaLLM.isReady()) {
      try {
        llmEnrichment = await this.#merkabaLLM.process(scriptText);
      } catch (_err) {
        // Non-fatal, continue without enrichment
      }
    }

    // ── Stage 2: Embed ─────────────────────────────────────────────────────
    const scriptEmbeddings = this.#embedder.embedScript(parsed);

    // Merge LLM embeddings if available
    const embeddings = llmEnrichment
      ? [
          ...scriptEmbeddings,
          ...this.#embedder.embedUnits(llmEnrichment.units || []),
        ]
      : scriptEmbeddings;

    // ── Stage 3: Governance Validation (MerkabAware) ───────────────────────
    const governanceDecision = this.#aware.evaluate(embeddings);

    if (governanceDecision.verdict === "abort") {
      const result = this._makeAbortResult(parsed, governanceDecision);
      this.#history.push(result);
      return result;
    }

    // ── Stage 4: Project ───────────────────────────────────────────────────
    const projection = this.#projector.project(embeddings, {
      title: parsed.title,
      genre: parsed.genre,
      authorship: parsed.authorship,
    });

    const result = {
      virtualizationId: `virt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "projected",
      title: parsed.title,
      genre: parsed.genre,
      authorship: parsed.authorship,
      architectureSignature: this.architectureSignature,
      parsedScript: {
        sceneCount: parsed.scenes.length,
        characters: parsed.characters,
        locations: parsed.locations,
        projection: parsed.projection,
      },
      embeddingCount: embeddings.length,
      governance: governanceDecision,
      projection,
      merkabaLLMUsed: llmEnrichment !== null,
      timestamp: Date.now(),
    };

    this.#history.push(result);
    return result;
  }

  /**
   * Attach a real LLM for enriched parsing.
   * @param {object} llm - adapter with .complete(prompt) → string
   */
  attachRealLLM(llm) {
    this.#merkabaLLM.attachRealLLM(llm);
  }

  /**
   * Get the list of available cinema playbooks by name.
   * Reads from the registered playbook names (no FS access — pure registry).
   */
  getPlaybookRegistry() {
    return CINEMA_PLAYBOOK_REGISTRY;
  }

  /**
   * Get the virtualization history (last N results).
   */
  getHistory(limit = 10) {
    return this.#history.slice(-Math.max(1, limit));
  }

  /**
   * Full status report for all pipeline stages.
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      architectureSignature: this.architectureSignature,
      canonicalArchitecture: CANONICAL_ARCHITECTURE,
      stages: {
        parser: { version: this.#parser.version },
        embedder: { version: this.#embedder.version },
        governance: this.#aware.getStatus(),
        projector: this.#projector.getStatus(),
        merkabaLLM: this.#merkabaLLM.getStatus(),
      },
      totalVirtualizations: this.#history.length,
      playbooks: CINEMA_PLAYBOOK_REGISTRY.map((p) => p.name),
    };
  }

  _makeAbortResult(parsed, governance) {
    return {
      virtualizationId: `virt-abort-${Date.now()}`,
      status: "aborted",
      title: parsed.title,
      genre: parsed.genre,
      architectureSignature: this.architectureSignature,
      governance,
      reason: governance.reason,
      timestamp: Date.now(),
    };
  }
}

// ─── Cinema Playbook Registry ─────────────────────────────────────────────────

/**
 * Canonical registry of built-in cinema playbooks.
 * Each entry represents a .geo file in /playbooks/cinema/.
 */
export const CINEMA_PLAYBOOK_REGISTRY = Object.freeze([
  {
    name: "matrix",
    title: "The Matrix",
    genre: "sci-fi action",
    file: "matrix.geo",
    description:
      "Neo meets Morpheus, red pill choice, awakening in machine fields.",
    signatureProjection: "Construct room holography + machine pod immersion",
    authorship: "Founder — Bradley",
  },
  {
    name: "inception",
    title: "Inception",
    genre: "mind-bending thriller",
    file: "inception.geo",
    description: "Dream layers, folding city, snow fortress assault.",
    signatureProjection: "Surreal physics shifts + layered dream immersion",
    authorship: "Founder — Bradley",
  },
  {
    name: "starwars",
    title: "Star Wars — Death Star Battle",
    genre: "epic space opera",
    file: "starwars.geo",
    description: "Death Star trench run, Millennium Falcon chase.",
    signatureProjection: "Starships, planets, mythic battles in holography",
    authorship: "Founder — Bradley",
  },
  {
    name: "apollo11",
    title: "Apollo 11",
    genre: "documentary",
    file: "apollo11.geo",
    description: "Saturn V launch, lunar landing, astronaut EVA.",
    signatureProjection: "Historical holography + immersive education",
    authorship: "Founder — Bradley",
  },
]);

export { PROJECTION_MODES };
export default CinemaVirtualizer;
