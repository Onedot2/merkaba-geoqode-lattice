/**
 * geo/cinema/narrative-embedder.js
 * NarrativeEmbedder — Phase 2 of Cinema Virtualization Pipeline
 *
 * Maps parsed script/scene units into resonance embeddings aligned with the
 * 8→26→48:480 lattice harmonics. Bridges the Merkaba-LLM semantic layer
 * to the lattice runtime execution layer.
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
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
import {
  SEMANTIC_FREQUENCY_MAP,
  MERKABA_SEMANTIC_TYPES,
} from "../intelligence/merkaba-llm.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

/**
 * Genre-specific frequency modifiers.
 * Different cinematic genres resonate at different harmonic bands.
 */
export const GENRE_FREQUENCY_MODIFIERS = Object.freeze({
  "sci-fi action": 1.0, // Base resonance
  "sci-fi": 1.0,
  "mind-bending thriller": 1.05, // Slightly elevated — reality warping
  thriller: 1.05,
  "epic space opera": 1.1, // Mythic scale — higher harmonics
  epic: 1.1,
  documentary: 0.95, // Grounded — historical accuracy
  "documentary mode": 0.95,
  narrative: 1.0,
  screenplay: 1.0,
  default: 1.0,
});

// ─── NarrativeEmbedder ────────────────────────────────────────────────────────

export class NarrativeEmbedder {
  constructor(options = {}) {
    this.version = "1.0.0";
    this.architectureSignature = "8→26→48:480";
    this.latticeNodes = CANONICAL_LATTICE_NODES; // 48
    this.harmonicSpectrum = HARMONIC_SPECTRUM_NODES; // 480
    this.phiBase = PHI;
  }

  /**
   * Embed a complete ParsedScript into resonance embeddings.
   *
   * @param {ParsedScript} parsedScript
   * @returns {ResonanceEmbedding[]}
   */
  embedScript(parsedScript) {
    if (!parsedScript || !Array.isArray(parsedScript.scenes)) {
      throw new Error(
        "NarrativeEmbedder.embedScript: parsedScript must have a scenes array",
      );
    }

    const genreKey = (parsedScript.genre || "default").toLowerCase();
    const freqMod = this._getFrequencyModifier(genreKey);
    const embeddings = [];

    for (let sceneIdx = 0; sceneIdx < parsedScript.scenes.length; sceneIdx++) {
      const scene = parsedScript.scenes[sceneIdx];
      const sceneEmbeddings = this.embedScene(
        scene,
        sceneIdx,
        freqMod,
        parsedScript,
      );
      embeddings.push(...sceneEmbeddings);
    }

    return embeddings;
  }

  /**
   * Embed a single scene into multiple resonance embeddings.
   * Each semantic element in the scene becomes its own embedding.
   *
   * @param {SceneUnit} scene
   * @param {number} sceneIndex
   * @param {number} freqMod
   * @param {ParsedScript} scriptContext
   * @returns {ResonanceEmbedding[]}
   */
  embedScene(scene, sceneIndex = 0, freqMod = 1.0, scriptContext = null) {
    const embeddings = [];
    const sceneOffset = sceneIndex * 8; // Each scene occupies a foundation-layer slice

    // Scene narrative embedding
    embeddings.push(
      this._makeEmbedding(
        `scene-${sceneIndex}-narrative`,
        MERKABA_SEMANTIC_TYPES.NARRATIVE,
        scene.title || `Scene ${sceneIndex + 1}`,
        sceneOffset,
        freqMod,
      ),
    );

    // Action embedding
    if (scene.action) {
      embeddings.push(
        this._makeEmbedding(
          `scene-${sceneIndex}-action`,
          MERKABA_SEMANTIC_TYPES.ACTION,
          scene.action,
          sceneOffset + 1,
          freqMod,
        ),
      );
    }

    // Location embedding
    if (scene.location) {
      embeddings.push(
        this._makeEmbedding(
          `scene-${sceneIndex}-location`,
          MERKABA_SEMANTIC_TYPES.LOCATION,
          scene.location,
          sceneOffset + 2,
          freqMod,
        ),
      );
    }

    // Character/entity embeddings
    for (let cIdx = 0; cIdx < scene.characters.length; cIdx++) {
      embeddings.push(
        this._makeEmbedding(
          `scene-${sceneIndex}-char-${cIdx}`,
          MERKABA_SEMANTIC_TYPES.ENTITY,
          scene.characters[cIdx],
          sceneOffset + 3 + cIdx,
          freqMod,
        ),
      );
    }

    // Dialogue embeddings
    for (let dIdx = 0; dIdx < scene.dialogue.length; dIdx++) {
      embeddings.push(
        this._makeEmbedding(
          `scene-${sceneIndex}-dialogue-${dIdx}`,
          MERKABA_SEMANTIC_TYPES.DIALOGUE,
          scene.dialogue[dIdx],
          sceneOffset + 5 + dIdx,
          freqMod,
        ),
      );
    }

    return embeddings;
  }

  /**
   * Embed a raw set of semantic units (from MerkabaLLM.embed output or manual).
   * @param {MerkabaSemUnit[]} units
   * @returns {ResonanceEmbedding[]}
   */
  embedUnits(units) {
    if (!Array.isArray(units)) return [];
    return units.map((unit, idx) =>
      this._makeEmbedding(
        unit.id || `unit-${idx}`,
        unit.type || MERKABA_SEMANTIC_TYPES.NARRATIVE,
        unit.content || "",
        idx,
        1.0,
      ),
    );
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  /**
   * Create a single resonance embedding.
   * Maps type + index into lattice node, harmonic node, and frequency.
   */
  _makeEmbedding(id, type, content, nodeIndex, freqMod) {
    const baseFreq = SEMANTIC_FREQUENCY_MAP[type] || BASE_FREQUENCY_HZ;
    const resonanceFrequency = Math.round(baseFreq * freqMod * 10) / 10;

    const latticeNode = nodeIndex % this.latticeNodes; // 0–47
    const harmonicNode = nodeIndex % this.harmonicSpectrum; // 0–479
    const phiCoefficient = this.phiBase;
    const architectureLayer = this._getLayer(latticeNode);

    return {
      unitId: id,
      type,
      content:
        typeof content === "string"
          ? content.substring(0, 512)
          : String(content),
      resonanceFrequency,
      latticeNode,
      harmonicNode,
      phiCoefficient,
      architectureLayer,
      timestamp: Date.now(),
    };
  }

  _getLayer(nodeIndex) {
    if (nodeIndex < FOUNDATION_NODES) return "foundation";
    if (nodeIndex < BOSONIC_ANCHOR_NODES) return "bosonic";
    return "canonical";
  }

  _getFrequencyModifier(genreKey) {
    if (GENRE_FREQUENCY_MODIFIERS[genreKey] !== undefined) {
      return GENRE_FREQUENCY_MODIFIERS[genreKey];
    }
    // Partial match
    for (const [key, val] of Object.entries(GENRE_FREQUENCY_MODIFIERS)) {
      if (genreKey.includes(key) || key.includes(genreKey)) return val;
    }
    return GENRE_FREQUENCY_MODIFIERS.default;
  }
}

export default NarrativeEmbedder;
