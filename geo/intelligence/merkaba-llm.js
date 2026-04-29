/**
 * geo/intelligence/merkaba-llm.js
 * MERKABA-LLM — Next-Generation Custom Language Model Layer
 *
 * Unlike traditional LLMs (GPT, Claude, Gemini), the Merkaba-LLM is not a
 * replacement for a real LLM — it is a REQUIRED COMPANION layer.
 * The Merkaba48OS depends on BOTH simultaneously:
 *   1. A real LLM  → provides language understanding + generation
 *   2. Merkaba-LLM → provides resonance embedding + lattice alignment
 *
 * Purpose:
 *   Translate natural language (from the real LLM) into resonance-native
 *   semantic units that the 8→26→48:480 lattice runtime can execute.
 *
 * Architecture:
 *   Real LLM output → Merkaba-LLM → MLM Embeddings → Lattice Runtime
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
 * Part of: Resonance OS unified Merkaba-mlm-theatre-geoqode-scrypt singularity
 */

import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  PHI,
  BASE_FREQUENCY_HZ,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
} from "../lattice/transform-420.js";

// Validate canonical signature on module load
assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

/**
 * Semantic unit types that Merkaba-LLM understands natively.
 * These map natural language concepts to lattice geometry.
 */
export const MERKABA_SEMANTIC_TYPES = Object.freeze({
  ENTITY: "entity", // Characters, objects, actors
  LOCATION: "location", // Environments, scenes, spaces
  ACTION: "action", // Events, movements, transformations
  DIALOGUE: "dialogue", // Speech, narration, voice
  EMOTION: "emotion", // Feeling tone, resonance quality
  PHYSICS: "physics", // Rules of the simulated world
  NARRATIVE: "narrative", // Story arc, flow, progression
  HOLOGRAPHIC: "holographic", // Projection geometry instructions
});

/**
 * Resonance frequency bands for each semantic type.
 * Aligns narrative elements with the 480-node harmonic spectrum.
 */
export const SEMANTIC_FREQUENCY_MAP = Object.freeze({
  [MERKABA_SEMANTIC_TYPES.ENTITY]: 396, // Liberation / grounding
  [MERKABA_SEMANTIC_TYPES.LOCATION]: 417, // Transformation
  [MERKABA_SEMANTIC_TYPES.ACTION]: 528, // DNA repair / activation
  [MERKABA_SEMANTIC_TYPES.DIALOGUE]: 639, // Connecting relationships
  [MERKABA_SEMANTIC_TYPES.EMOTION]: 741, // Awakening intuition
  [MERKABA_SEMANTIC_TYPES.PHYSICS]: 852, // Returning to order
  [MERKABA_SEMANTIC_TYPES.NARRATIVE]: 963, // Oneness / completion
  [MERKABA_SEMANTIC_TYPES.HOLOGRAPHIC]: BASE_FREQUENCY_HZ, // 432 Hz canonical
});

/**
 * MerkabaLLM
 * The resonance-native language model layer.
 * Wraps any real LLM output into lattice-executable semantic units.
 */
export class MerkabaLLM {
  #latticeNodes;
  #harmonicSpectrum;

  constructor(options = {}) {
    this.version = "1.0.0";
    this.architectureSignature = "8→26→48:480";
    this.mode = options.mode || "singularity"; // singularity | theatre | scrypt | geoqode
    this.#latticeNodes = CANONICAL_LATTICE_NODES; // 48
    this.#harmonicSpectrum = HARMONIC_SPECTRUM_NODES; // 480

    // Real LLM adapter (injected at runtime)
    this._realLLM = options.realLLM || null;
  }

  /**
   * Attach a real LLM provider (OpenAI, Claude, etc.)
   * Both layers MUST be present for full Merkaba48OS function.
   * @param {object} llm - adapter with .complete(prompt) → string
   */
  attachRealLLM(llm) {
    if (typeof llm?.complete !== "function") {
      throw new Error(
        "MerkabaLLM: realLLM adapter must implement .complete(prompt) → string",
      );
    }
    this._realLLM = llm;
  }

  /**
   * Check that both LLM layers are ready.
   * Merkaba48OS REQUIRES both to be operational.
   */
  isReady() {
    return this._realLLM !== null;
  }

  /**
   * Parse natural language input into Merkaba semantic units.
   * If a real LLM is attached, uses it for enriched parsing.
   * Falls back to pattern-based parsing when no LLM is present.
   *
   * @param {string} text - raw natural language (script, narrative, command)
   * @returns {MerkabaSemUnit[]}
   */
  async parse(text) {
    if (!text || typeof text !== "string") {
      throw new Error("MerkabaLLM.parse: text must be a non-empty string");
    }

    let enriched = text;

    // If real LLM is attached, enrich parsing with language understanding
    if (this._realLLM) {
      const prompt = `Extract from the following text all: characters (entities),
locations, actions, dialogue, emotions, physics rules, and narrative arcs.
Format as JSON with arrays for each category.

Text: ${text}`;
      try {
        enriched = await this._realLLM.complete(prompt);
      } catch (_err) {
        // Fall through to pattern-based parsing
        enriched = text;
      }
    }

    return this._patternParse(enriched, text);
  }

  /**
   * Embed semantic units into lattice resonance coordinates.
   * Maps each unit to a node position within the 8→26→48:480 architecture.
   *
   * @param {MerkabaSemUnit[]} units
   * @returns {ResonanceEmbedding[]}
   */
  embed(units) {
    if (!Array.isArray(units) || units.length === 0) {
      return [];
    }

    return units.map((unit, idx) => {
      const freq = SEMANTIC_FREQUENCY_MAP[unit.type] || BASE_FREQUENCY_HZ;
      const nodeIndex = idx % this.#latticeNodes; // 0–47
      const harmonicIndex = idx % this.#harmonicSpectrum; // 0–479
      const phi = PHI;

      return {
        unitId: unit.id || `unit-${idx}`,
        type: unit.type,
        content: unit.content,
        resonanceFrequency: freq,
        latticeNode: nodeIndex,
        harmonicNode: harmonicIndex,
        phiCoefficient: phi,
        architectureLayer: this._getArchitectureLayer(nodeIndex),
        timestamp: Date.now(),
      };
    });
  }

  /**
   * Full pipeline: text → semantic units → resonance embeddings.
   * This is the main entry point for cinema virtualization and narrative parsing.
   *
   * @param {string} text
   * @returns {{ units: MerkabaSemUnit[], embeddings: ResonanceEmbedding[] }}
   */
  async process(text) {
    const units = await this.parse(text);
    const embeddings = this.embed(units);
    return { units, embeddings };
  }

  /**
   * Status report for this Merkaba-LLM instance.
   */
  getStatus() {
    return {
      version: this.version,
      architectureSignature: this.architectureSignature,
      mode: this.mode,
      realLLMAttached: this._realLLM !== null,
      ready: this.isReady(),
      latticeNodes: this.#latticeNodes,
      harmonicSpectrum: this.#harmonicSpectrum,
      canonicalArchitecture: CANONICAL_ARCHITECTURE,
      semanticTypes: Object.values(MERKABA_SEMANTIC_TYPES),
    };
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  /**
   * Pattern-based semantic parser for when no real LLM is present.
   * Extracts structure from structured text (scripts, .geo playbooks).
   */
  _patternParse(enriched, original) {
    const units = [];

    // Try JSON parse first (from real LLM output)
    try {
      const parsed = JSON.parse(enriched);
      for (const [type, items] of Object.entries(parsed)) {
        const mappedType = this._mapTypeKey(type);
        if (!mappedType) continue;
        const arr = Array.isArray(items) ? items : [items];
        for (const item of arr) {
          units.push({
            id: `${mappedType}-${units.length}`,
            type: mappedType,
            content: typeof item === "string" ? item : JSON.stringify(item),
          });
        }
      }
      if (units.length > 0) return units;
    } catch (_) {
      // Not JSON, proceed with text pattern matching
    }

    // Pattern matching on the original text
    const text = original || enriched;
    const lines = text
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const lc = line.toLowerCase();
      if (lc.startsWith("action:") || lc.startsWith("- action:")) {
        units.push({
          id: `action-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.ACTION,
          content: line,
        });
      } else if (lc.startsWith("location:") || lc.startsWith("- location:")) {
        units.push({
          id: `location-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.LOCATION,
          content: line,
        });
      } else if (
        lc.startsWith("characters:") ||
        lc.startsWith("- characters:")
      ) {
        units.push({
          id: `entity-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.ENTITY,
          content: line,
        });
      } else if (lc.startsWith("scene")) {
        units.push({
          id: `narrative-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.NARRATIVE,
          content: line,
        });
      } else if (line.includes('"') && line.includes(":")) {
        units.push({
          id: `dialogue-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.DIALOGUE,
          content: line,
        });
      } else if (line.length > 8) {
        units.push({
          id: `narrative-${units.length}`,
          type: MERKABA_SEMANTIC_TYPES.NARRATIVE,
          content: line,
        });
      }
    }

    return units;
  }

  _mapTypeKey(key) {
    const k = key.toLowerCase();
    if (k.includes("character") || k.includes("entit"))
      return MERKABA_SEMANTIC_TYPES.ENTITY;
    if (k.includes("location") || k.includes("scene"))
      return MERKABA_SEMANTIC_TYPES.LOCATION;
    if (k.includes("action")) return MERKABA_SEMANTIC_TYPES.ACTION;
    if (k.includes("dialogue") || k.includes("dialog"))
      return MERKABA_SEMANTIC_TYPES.DIALOGUE;
    if (k.includes("emotion") || k.includes("tone"))
      return MERKABA_SEMANTIC_TYPES.EMOTION;
    if (k.includes("physic") || k.includes("rule"))
      return MERKABA_SEMANTIC_TYPES.PHYSICS;
    if (k.includes("narrat") || k.includes("arc"))
      return MERKABA_SEMANTIC_TYPES.NARRATIVE;
    return null;
  }

  _getArchitectureLayer(nodeIndex) {
    if (nodeIndex < FOUNDATION_NODES) return "foundation"; // 0–7
    if (nodeIndex < BOSONIC_ANCHOR_NODES) return "bosonic"; // 8–25
    return "canonical"; // 26–47
  }
}

export default MerkabaLLM;
