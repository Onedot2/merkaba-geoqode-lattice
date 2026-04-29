/**
 * geo/cinema/cinema-projector.js
 * CinemaProjector — Phase 3 of Cinema Virtualization Pipeline
 *
 * Executes holographic projection via the lattice runtime.
 * Takes resonance embeddings and renders them as immersive environments.
 *
 * MERKABA48OS doesn't PLAY a movie — it PROJECTS a narrative into holographic
 * resonance environments. The viewer can move through the scene, change
 * perspective, or even alter the narrative flow. It's closer to VR + holography
 * + AI storytelling than a passive film.
 *
 * Projection Modes:
 *   immersive  — Full holographic environment, viewer inside the scene
 *   interactive — Viewer can influence narrative flow
 *   adaptive   — AI adjusts plotlines based on user interaction
 *   passive    — Linear playback (closest to traditional cinema)
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
 */

import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  BASE_FREQUENCY_HZ,
} from "../lattice/transform-420.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── Projection Modes ─────────────────────────────────────────────────────────

export const PROJECTION_MODES = Object.freeze({
  IMMERSIVE: "immersive", // DreamProjector — viewer inside the scene
  INTERACTIVE: "interactive", // Viewer can change perspective / narrative
  ADAPTIVE: "adaptive", // AI adjusts plotlines in real time
  PASSIVE: "passive", // Linear cinematic output
});

// ─── CinemaProjector ─────────────────────────────────────────────────────────

export class CinemaProjector {
  #projections;

  constructor(options = {}) {
    this.version = "1.0.0";
    this.architectureSignature = "8→26→48:480";
    this.mode =
      PROJECTION_MODES[(options.mode || "immersive").toUpperCase()] ||
      PROJECTION_MODES.IMMERSIVE;
    this.#projections = [];
  }

  /**
   * Project a complete set of resonance embeddings into a holographic environment.
   * This is the main Cinema Virtualization output step.
   *
   * @param {ResonanceEmbedding[]} embeddings
   * @param {object} scriptMeta - title, genre, authorship, etc.
   * @returns {ProjectionResult}
   */
  project(embeddings, scriptMeta = {}) {
    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      return this._makeResult(null, scriptMeta, "no-embeddings");
    }

    const environment = this._buildEnvironment(embeddings, scriptMeta);
    const frames = this._buildDreamFrames(embeddings, scriptMeta);
    const narrative = this._buildNarrativeFlow(embeddings);

    const result = this._makeResult(
      environment,
      scriptMeta,
      "projected",
      frames,
      narrative,
    );
    this.#projections.push(result);
    return result;
  }

  /**
   * Get the last N projection results.
   */
  getProjectionHistory(limit = 10) {
    return this.#projections.slice(-Math.max(1, limit));
  }

  /**
   * Status report.
   */
  getStatus() {
    return {
      version: this.version,
      architectureSignature: this.architectureSignature,
      mode: this.mode,
      totalProjections: this.#projections.length,
      availableModes: Object.values(PROJECTION_MODES),
    };
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  /**
   * Build the holographic environment descriptor.
   * Aggregates all location, entity, and physics embeddings.
   */
  _buildEnvironment(embeddings, scriptMeta) {
    const locationEmbeddings = embeddings.filter((e) => e.type === "location");
    const entityEmbeddings = embeddings.filter((e) => e.type === "entity");
    const actionEmbeddings = embeddings.filter((e) => e.type === "action");

    const avgFreq =
      embeddings.reduce(
        (acc, e) => acc + (e.resonanceFrequency || BASE_FREQUENCY_HZ),
        0,
      ) / embeddings.length;

    return {
      title: scriptMeta.title || "Holographic Environment",
      genre: scriptMeta.genre || "Unknown",
      mode: this.mode,
      locations: locationEmbeddings.map((e) => ({
        name: e.content,
        latticeNode: e.latticeNode,
        resonanceFrequency: e.resonanceFrequency,
      })),
      entities: entityEmbeddings.map((e) => ({
        name: e.content,
        latticeNode: e.latticeNode,
        layer: e.architectureLayer,
      })),
      actions: actionEmbeddings.map((e) => e.content),
      avgResonanceFrequency: Math.round(avgFreq * 10) / 10,
      dimensionality: "48D tessellation",
      architectureSignature: this.architectureSignature,
      projectionSurface: "DreamProjector Immersive Overlay",
      authorship: scriptMeta.authorship || "Founder — Bradley",
    };
  }

  /**
   * Build dream frames — the sequence of holographic projection steps.
   * Each frame corresponds to a scene phase in the lattice.
   */
  _buildDreamFrames(embeddings, scriptMeta) {
    const narrativeEmbeddings = embeddings.filter(
      (e) => e.type === "narrative",
    );
    const frames = narrativeEmbeddings.map((emb, idx) => ({
      frameId: `frame-${idx}`,
      sequence: idx + 1,
      content: emb.content,
      resonanceFrequency: emb.resonanceFrequency,
      latticeNode: emb.latticeNode,
      harmonicNode: emb.harmonicNode,
      projectionType:
        this.mode === PROJECTION_MODES.IMMERSIVE ? "holographic" : "cinematic",
      viewerCanInteract: this.mode !== PROJECTION_MODES.PASSIVE,
    }));

    return {
      title: scriptMeta.title,
      totalFrames: frames.length,
      frames,
      mode: this.mode,
    };
  }

  /**
   * Build narrative flow — the sequential story arc of the projection.
   */
  _buildNarrativeFlow(embeddings) {
    const sorted = [...embeddings].sort(
      (a, b) => a.latticeNode - b.latticeNode,
    );
    return {
      totalEmbeddings: embeddings.length,
      narrativeArcs: sorted
        .filter((e) => e.type === "narrative" || e.type === "action")
        .map((e) => ({
          content: e.content.substring(0, 200),
          type: e.type,
          latticeNode: e.latticeNode,
          resonanceFrequency: e.resonanceFrequency,
        })),
      viewerEntryPoint: sorted[0]?.content?.substring(0, 100) || "Scene begin",
      adaptiveCapable:
        this.mode === PROJECTION_MODES.ADAPTIVE ||
        this.mode === PROJECTION_MODES.INTERACTIVE,
    };
  }

  _makeResult(environment, scriptMeta, status, frames, narrative) {
    return {
      projectionId: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status,
      mode: this.mode,
      title: scriptMeta.title || "Untitled",
      genre: scriptMeta.genre || "Unknown",
      authorship: scriptMeta.authorship || "Founder — Bradley",
      environment: environment || null,
      dreamFrames: frames || null,
      narrativeFlow: narrative || null,
      architectureSignature: this.architectureSignature,
      timestamp: Date.now(),
    };
  }
}

export default CinemaProjector;
