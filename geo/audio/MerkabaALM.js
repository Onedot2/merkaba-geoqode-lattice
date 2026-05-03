/**
 * geo/audio/MerkabaALM.js
 * MerkabaALM — AIOS Audio Learning Model
 *
 * The audio intelligence layer of the Merkaba lattice.
 * Maps narrative, decision, and semantic content to Solfeggio frequency sequences.
 * Acts as the audio dimension of Cinema, Theatre, and Awareness systems.
 *
 * Architecture: 8→26→48:480
 * Golden Root:  φ = 1.618
 * Silver Bridge: ψ = 1.414
 *
 * Solfeggio integration:
 *   396 Hz (UT)  — ENTITY      — Liberation from fear
 *   417 Hz (RE)  — LOCATION    — Spatial anchoring
 *   528 Hz (MI)  — ACTION      — Transformation & miracles
 *   639 Hz (FA)  — DIALOGUE    — Connecting relationships
 *   741 Hz (SOL) — EMOTION     — Expression & resonance
 *   852 Hz (LA)  — PHYSICS     — Structural order
 *   963 Hz (SI)  — NARRATIVE   — Awakening perfect state
 *    72 Hz       — HOLOGRAPHIC — Base lattice frequency
 *   432 Hz       — UNIVERSAL   — Universal harmony anchor
 *
 * @module MerkabaALM
 */

import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  SEMANTIC_FREQUENCY_MAP,
} from "../lattice/transform-420.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── Solfeggio frequency constants ───────────────────────────────────────────

export const SOLFEGGIO = Object.freeze({
  UT: 396, // Liberation — root liberation
  RE: 417, // Undoing — spatial reset
  MI: 528, // Transformation — DNA repair frequency
  FA: 639, // Connection — heart field
  SOL: 741, // Expression — intuition
  LA: 852, // Order — spiritual alignment
  SI: 963, // Awakening — crown activation
});

export const UNIVERSAL_ANCHOR_HZ = 432;
export const BASE_HZ = BASE_FREQUENCY_HZ; // 72

// Additional harmonic intervals derived from PHI
export const PHI_HARMONIC_HZ = Math.round(UNIVERSAL_ANCHOR_HZ * PHI); // 699 Hz ≈ Phi-tuned
export const PSI_HARMONIC_HZ = Math.round(UNIVERSAL_ANCHOR_HZ * PSI); // 611 Hz ≈ Psi-tuned

// Semantic type → primary Solfeggio frequency (mirrors SEMANTIC_FREQUENCY_MAP)
export const AUDIO_FREQUENCY_MAP = Object.freeze({
  ENTITY: SOLFEGGIO.UT, // 396 Hz
  LOCATION: SOLFEGGIO.RE, // 417 Hz
  ACTION: SOLFEGGIO.MI, // 528 Hz
  DIALOGUE: SOLFEGGIO.FA, // 639 Hz
  EMOTION: SOLFEGGIO.SOL, // 741 Hz
  PHYSICS: SOLFEGGIO.LA, // 852 Hz
  NARRATIVE: SOLFEGGIO.SI, // 963 Hz
  HOLOGRAPHIC: BASE_HZ, //  72 Hz
});

// Harmonic intervals that are consonant within the Solfeggio scale
// Two frequencies are "harmonically aligned" if their ratio is close to PHI, 2, 3/2, or 4/3
const HARMONIC_RATIOS = [PHI, 2, 1.5, 4 / 3, PSI];

export const ALM_VERSION = "1.0.0";

// ─── Semantic pattern keywords (mirrors MerkabaLLM pattern parser) ────────────

const PATTERN_MAP = [
  {
    types: ["ENTITY"],
    patterns: [
      /characters?:/i,
      /entity:/i,
      /agent:/i,
      /neo|morpheus|trinity|apollo|einstein|hawking/i,
    ],
  },
  {
    types: ["LOCATION"],
    patterns: [/location:/i, /scene:|int\.|ext\.|environment:/i],
  },
  {
    types: ["ACTION"],
    patterns: [/action:/i, /step:|execute:|transform:|emit:/i],
  },
  { types: ["DIALOGUE"], patterns: [/dialogue:/i, /says?:|speaks?:|narrat/i] },
  { types: ["EMOTION"], patterns: [/emotion:|feeling:|resonan/i] },
  { types: ["PHYSICS"], patterns: [/physics:|rule:|law:|frequency:|hz/i] },
  {
    types: ["NARRATIVE"],
    patterns: [/scene\s+\d|narrative:|arc:|projection:/i],
  },
  { types: ["HOLOGRAPHIC"], patterns: [/holograph|lattice:|merkaba|geoqode/i] },
];

// ─── MerkabaALM ──────────────────────────────────────────────────────────────

/**
 * MerkabaALM — AIOS Audio Learning Model
 *
 * Usage:
 *   const alm = new MerkabaALM();
 *   const profile = alm.score("INT. THE CONSTRUCT. Neo awakens...");
 *   const seq = alm.sequence("INT. THE CONSTRUCT. Neo awakens...");
 *   alm.attachToTheatre(theatreEngine);
 */
export class MerkabaALM {
  #latticeNodes;
  #harmonicSpectrum;
  #sessionHistory;
  #active;

  constructor(options = {}) {
    this.version = ALM_VERSION;
    this.architectureSignature = CANONICAL_ARCHITECTURE;
    this.architectureDisplay = "8→26→48:480";
    this.phi = PHI;
    this.psi = PSI;
    this.baseFrequencyHz = BASE_HZ;
    this.universalAnchorHz = UNIVERSAL_ANCHOR_HZ;
    this.mode = options.mode || "unified"; // unified | cinema | theatre | standalone

    this.#latticeNodes = CANONICAL_LATTICE_NODES; // 48
    this.#harmonicSpectrum = HARMONIC_SPECTRUM_NODES; // 480
    this.#sessionHistory = [];
    this.#active = false;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  activate() {
    assertCanonicalArchitectureSignature(this.architectureSignature);
    this.#active = true;
    console.log(
      `[MerkabaALM] ✅ Audio Learning Model activated — ${this.architectureDisplay}, φ=${this.phi}`,
    );
    return this;
  }

  isActive() {
    return this.#active;
  }

  // ─── Core: Score ────────────────────────────────────────────────────────────

  /**
   * Score content for audio frequency signature.
   * Returns a full audio profile: detected semantic types, primary frequencies,
   * harmonic coherence, and PHI-weighted audio resonance score.
   *
   * @param {string} text - narrative, script, decision, or any text
   * @param {object} [opts]
   * @param {string} [opts.genre]
   * @returns {ALMAudioProfile}
   */
  score(text, opts = {}) {
    if (!text || typeof text !== "string") {
      throw new Error("MerkabaALM.score: text must be a non-empty string");
    }

    const detectedTypes = this._detectSemanticTypes(text);
    const frequencies = detectedTypes.map(
      (t) => AUDIO_FREQUENCY_MAP[t] || BASE_HZ,
    );
    const primaryFrequency =
      frequencies.length > 0
        ? Math.round(
            frequencies.reduce((a, b) => a + b, 0) / frequencies.length,
          )
        : UNIVERSAL_ANCHOR_HZ;

    const harmonicCoherence = this._computeHarmonicCoherence(frequencies);
    const phiScore = this._computePhiScore(frequencies, harmonicCoherence);
    const audioLayer = this._buildAudioLayer(detectedTypes, frequencies);

    const profile = {
      almVersion: this.version,
      architectureSignature: this.architectureSignature,
      mode: this.mode,
      genre: opts.genre || "narrative",
      detectedTypes,
      frequencies,
      primaryFrequency,
      universalAnchorHz: this.universalAnchorHz,
      baseFrequencyHz: this.baseFrequencyHz,
      harmonicCoherence, // 0–1: how harmonically aligned the frequency set is
      phiScore, // 0–1: PHI-weighted resonance score
      audioLayer,
      timestamp: Date.now(),
    };

    this.#sessionHistory.push({ type: "score", profile });
    return profile;
  }

  // ─── Core: Sequence ─────────────────────────────────────────────────────────

  /**
   * Generate an ordered frequency sequence from a narrative.
   * The sequence maps the story arc onto the Solfeggio scale in time order.
   * Suitable for driving audio synthesis or visual frequency displays.
   *
   * @param {string} text
   * @param {object} [opts]
   * @param {number} [opts.maxSteps=16]
   * @returns {ALMSequence}
   */
  sequence(text, opts = {}) {
    if (!text || typeof text !== "string") {
      throw new Error("MerkabaALM.sequence: text must be a non-empty string");
    }

    const maxSteps = opts.maxSteps || 16;
    const lines = text
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const steps = [];

    for (let i = 0; i < Math.min(lines.length, maxSteps); i++) {
      const line = lines[i];
      const types = this._detectSemanticTypes(line);
      const type = types[0] || "NARRATIVE";
      const freq = AUDIO_FREQUENCY_MAP[type] || SOLFEGGIO.SI;
      const solfeggioName = this._freqToSolfeggioName(freq);
      const latticeNode = i % this.#latticeNodes;
      const harmonicNode = i % this.#harmonicSpectrum;

      steps.push({
        step: i + 1,
        line: line.slice(0, 80),
        semanticType: type,
        frequencyHz: freq,
        solfeggioName,
        latticeNode,
        harmonicNode,
        phiWeight: Number((PHI ** (i / maxSteps)).toFixed(4)),
      });
    }

    // Fill remaining steps with the base frequency if text is short
    const harmonicFlow = this._analyzeFlow(steps);

    const seq = {
      almVersion: this.version,
      architectureSignature: this.architectureSignature,
      totalSteps: steps.length,
      maxSteps,
      universalAnchorHz: this.universalAnchorHz,
      steps,
      harmonicFlow,
      timestamp: Date.now(),
    };

    this.#sessionHistory.push({ type: "sequence", seq });
    return seq;
  }

  // ─── Core: Harmonize ────────────────────────────────────────────────────────

  /**
   * Check whether two frequencies are harmonically aligned.
   * Uses PHI, PSI, octave, fifth, and fourth ratios.
   *
   * @param {number} freq1
   * @param {number} freq2
   * @returns {{ aligned: boolean, ratio: number, closestHarmonic: number, coherence: number }}
   */
  harmonize(freq1, freq2) {
    if (freq1 <= 0 || freq2 <= 0)
      throw new Error("MerkabaALM.harmonize: frequencies must be positive");
    const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
    let minDist = Infinity;
    let closestHarmonic = 1;
    for (const hr of HARMONIC_RATIOS) {
      const dist = Math.abs(ratio - hr);
      if (dist < minDist) {
        minDist = dist;
        closestHarmonic = hr;
      }
    }
    const coherence = Math.max(0, 1 - minDist / closestHarmonic);
    return {
      freq1,
      freq2,
      ratio: Number(ratio.toFixed(4)),
      aligned: minDist < 0.12,
      closestHarmonic,
      coherence: Number(coherence.toFixed(4)),
    };
  }

  // ─── Core: getAudioCoherence ─────────────────────────────────────────────────

  /**
   * Compute a 0–1 audio coherence score for a piece of text.
   * Measures how harmonically the detected frequencies flow against the Solfeggio lattice.
   *
   * @param {string} text
   * @returns {number} 0–1
   */
  getAudioCoherence(text) {
    const profile = this.score(text);
    return profile.phiScore;
  }

  // ─── Status ─────────────────────────────────────────────────────────────────

  getStatus() {
    return {
      version: this.version,
      architectureSignature: this.architectureSignature,
      architectureDisplay: this.architectureDisplay,
      mode: this.mode,
      active: this.#active,
      phi: this.phi,
      psi: this.psi,
      baseFrequencyHz: this.baseFrequencyHz,
      universalAnchorHz: this.universalAnchorHz,
      phiHarmonicHz: PHI_HARMONIC_HZ,
      psiHarmonicHz: PSI_HARMONIC_HZ,
      latticeNodes: this.#latticeNodes,
      harmonicSpectrum: this.#harmonicSpectrum,
      solfeggioScale: SOLFEGGIO,
      audioFrequencyMap: AUDIO_FREQUENCY_MAP,
      sessionsProcessed: this.#sessionHistory.length,
      timestamp: new Date().toISOString(),
    };
  }

  getSessions() {
    return [...this.#sessionHistory];
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _detectSemanticTypes(text) {
    const found = [];
    for (const { types, patterns } of PATTERN_MAP) {
      if (patterns.some((p) => p.test(text))) {
        for (const t of types) {
          if (!found.includes(t)) found.push(t);
        }
      }
    }
    if (found.length === 0) found.push("NARRATIVE");
    return found;
  }

  _computeHarmonicCoherence(frequencies) {
    if (frequencies.length < 2) return 1.0;
    let totalCoherence = 0;
    let pairs = 0;
    for (let i = 0; i < frequencies.length - 1; i++) {
      for (let j = i + 1; j < frequencies.length; j++) {
        const h = this.harmonize(frequencies[i], frequencies[j]);
        totalCoherence += h.coherence;
        pairs++;
      }
    }
    return pairs > 0 ? Number((totalCoherence / pairs).toFixed(4)) : 1.0;
  }

  _computePhiScore(frequencies, harmonicCoherence) {
    if (frequencies.length === 0) return 0;
    // PHI weight: how close the primary freq is to a PHI multiple of 432 Hz
    const primary = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const phiTarget = UNIVERSAL_ANCHOR_HZ * PHI; // 698.9 Hz
    const dist = Math.abs(primary - phiTarget) / phiTarget;
    const phiProximity = Math.max(0, 1 - dist);
    // Weighted blend: 60% harmonic coherence, 40% PHI proximity
    return Number((0.6 * harmonicCoherence + 0.4 * phiProximity).toFixed(4));
  }

  _buildAudioLayer(types, frequencies) {
    return types.map((type, i) => ({
      semanticType: type,
      frequencyHz: frequencies[i] || BASE_HZ,
      solfeggioName: this._freqToSolfeggioName(frequencies[i] || BASE_HZ),
      latticeNode: i % this.#latticeNodes,
    }));
  }

  _freqToSolfeggioName(hz) {
    const names = {
      [SOLFEGGIO.UT]: "UT (396 Hz) — Liberation",
      [SOLFEGGIO.RE]: "RE (417 Hz) — Spatial Anchor",
      [SOLFEGGIO.MI]: "MI (528 Hz) — Transformation",
      [SOLFEGGIO.FA]: "FA (639 Hz) — Connection",
      [SOLFEGGIO.SOL]: "SOL (741 Hz) — Expression",
      [SOLFEGGIO.LA]: "LA (852 Hz) — Order",
      [SOLFEGGIO.SI]: "SI (963 Hz) — Awakening",
      [BASE_HZ]: "BASE (72 Hz) — Holographic Root",
    };
    return names[hz] || `${hz} Hz`;
  }

  _analyzeFlow(steps) {
    if (steps.length < 2) return { pattern: "single", coherence: 1.0 };
    const freqs = steps.map((s) => s.frequencyHz);
    // Detect if flow ascends, descends, oscillates, or is uniform
    let ascending = 0,
      descending = 0;
    for (let i = 1; i < freqs.length; i++) {
      if (freqs[i] > freqs[i - 1]) ascending++;
      else if (freqs[i] < freqs[i - 1]) descending++;
    }
    const total = freqs.length - 1;
    const coherence = this._computeHarmonicCoherence(freqs);
    let pattern = "oscillating";
    if (ascending / total > 0.65) pattern = "ascending";
    else if (descending / total > 0.65) pattern = "descending";
    else if (ascending + descending < total * 0.3) pattern = "uniform";
    return { pattern, ascending, descending, coherence };
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create and activate a MerkabaALM instance.
 * @param {object} [options]
 * @returns {MerkabaALM}
 */
export function createMerkabaALM(options = {}) {
  const alm = new MerkabaALM(options);
  alm.activate();
  return alm;
}

export default MerkabaALM;
