/**
 * geo/intelligence/resonance-diagnostics.js
 * Resonance Diagnostics — Lattice Spectral Governance Engine
 *
 * Implements the diagnostic hook operators from the original MERKABA LLM vision:
 *
 *   Drift Measurement   D_d(t) = f_d(t) / f_{d-1}(t) − φ
 *   Coherence Index     C(t)   = 1 − Σ|D_d(t)| / N
 *   Harmonic Energy     H(t)   = Σ f_d(t) · φ^d
 *   Governance Loop     f_d(t+1) = f_d(t) − α·D_d + β·C + γ·H
 *   Phase Drift         PD_n   = |φ_n − 0| per node (stability: ≤ 0.05 rad)
 *   Resonance Intensity I(t)   = Σ A_n · Re[e^(i·(2π·f_n·t + φ_n))] × (1−δ)
 *
 * The 8 semantic domains each carry a named Φ-operator (INITIATE_BOOT,
 * AMPLIFY_FLOW, …) that describes the domain's lattice role in the cascade.
 *
 * Reference architecture: 8→26→48:480  φ=1.618
 *
 * @module resonance-diagnostics
 * @alignment 8→26→48:480
 */

import {
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  PHI,
  SEMANTIC_FREQUENCY_MAP,
} from "../lattice/transform-420.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── Φ-Operator Map ─────────────────────────────────────────────────────────
// Each semantic type → its named lattice operator (cascade role).
// ENTITY/LOCATION/… → standard semantic labels map onto domain roles.
export const PHI_OPERATOR_MAP = Object.freeze({
  ENTITY: "INITIATE_BOOT", // foundation: calibration pulse
  LOCATION: "PROPAGATE_RESONANCE", // spatial anchoring: spread
  ACTION: "AMPLIFY_FLOW", // transformation: execution intensity
  DIALOGUE: "CERTIFY_COMPLIANCE", // exchange: law enforcement pulse
  EMOTION: "HEAL_PROTOCOL", // resonance state: resilience activation
  PHYSICS: "AUDIT_FLAG", // structural laws: anomaly detection
  NARRATIVE: "EVOLVE_FRAME", // continuity: foresight holography
  HOLOGRAPHIC: "EXPAND_PATHWAY", // base lattice: emergent synthesis
});

// ─── Frequency Band Array (ordered for cascade arithmetic) ──────────────────
// Canonical order: low-anchor → mid-regulate → high-extend
const DOMAIN_BANDS = Object.freeze([
  {
    name: "ENTITY",
    freq: SEMANTIC_FREQUENCY_MAP.ENTITY,
    operator: PHI_OPERATOR_MAP.ENTITY,
  },
  {
    name: "LOCATION",
    freq: SEMANTIC_FREQUENCY_MAP.LOCATION,
    operator: PHI_OPERATOR_MAP.LOCATION,
  },
  {
    name: "ACTION",
    freq: SEMANTIC_FREQUENCY_MAP.ACTION,
    operator: PHI_OPERATOR_MAP.ACTION,
  },
  {
    name: "DIALOGUE",
    freq: SEMANTIC_FREQUENCY_MAP.DIALOGUE,
    operator: PHI_OPERATOR_MAP.DIALOGUE,
  },
  {
    name: "EMOTION",
    freq: SEMANTIC_FREQUENCY_MAP.EMOTION,
    operator: PHI_OPERATOR_MAP.EMOTION,
  },
  {
    name: "PHYSICS",
    freq: SEMANTIC_FREQUENCY_MAP.PHYSICS,
    operator: PHI_OPERATOR_MAP.PHYSICS,
  },
  {
    name: "NARRATIVE",
    freq: SEMANTIC_FREQUENCY_MAP.NARRATIVE,
    operator: PHI_OPERATOR_MAP.NARRATIVE,
  },
  {
    name: "HOLOGRAPHIC",
    freq: SEMANTIC_FREQUENCY_MAP.HOLOGRAPHIC,
    operator: PHI_OPERATOR_MAP.HOLOGRAPHIC,
  },
]);

// ─── Diagnostic Operators ────────────────────────────────────────────────────

/**
 * Drift Measurement — per-domain deviation from the golden overlap ratio (φ).
 *
 * D_d(t) = f_d / f_{d-1} − φ
 *
 * For the first domain (no predecessor), drift is measured against BASE (72 Hz).
 *
 * @param {number[]} freqs — current frequency for each of the 8 domains
 * @returns {number[]} drift values per domain
 */
export function measureDrift(freqs = DOMAIN_BANDS.map((b) => b.freq)) {
  return freqs.map((f, i) => {
    const prev = i === 0 ? freqs[freqs.length - 1] : freqs[i - 1]; // circular
    return +(f / prev - PHI).toFixed(6);
  });
}

/**
 * Coherence Index — lattice-wide harmony (0 → 1).
 *
 * C(t) = 1 − Σ|D_d| / N
 *
 * C = 1 → perfect coherence.
 * C < 0.8 → lattice instability warning.
 *
 * @param {number[]} drifts — output of measureDrift()
 * @returns {number} coherence index clamped to [0, 1]
 */
export function measureCoherence(drifts) {
  const avgAbsDrift =
    drifts.reduce((s, d) => s + Math.abs(d), 0) / drifts.length;
  return +Math.max(0, Math.min(1, 1 - avgAbsDrift)).toFixed(6);
}

/**
 * Harmonic Energy — total spectral energy of the lattice.
 *
 * H(t) = Σ f_d · φ^(d+1)    (d is 1-indexed for scaling)
 *
 * Higher values = stronger lattice pulse.
 *
 * @param {number[]} freqs — current domain frequencies
 * @returns {number} harmonic energy
 */
export function measureHarmonicEnergy(freqs = DOMAIN_BANDS.map((b) => b.freq)) {
  return +freqs.reduce((s, f, i) => s + f * Math.pow(PHI, i + 1), 0).toFixed(4);
}

/**
 * Governance Control Loop — frequency correction per cycle.
 *
 * f_d(t+1) = f_d(t) − α·D_d + β·C + γ·H_normalized
 *
 * @param {number[]} freqs     — current domain frequencies
 * @param {object}  params     — {alpha, beta, gamma, drifts, coherence, energy}
 * @returns {number[]} corrected frequencies (floored at 1)
 */
export function applyControlLoop(
  freqs,
  {
    alpha = 0.618, // drift correction coefficient (φ − 1)
    beta = 0.1, // coherence reinforcement
    gamma = 0.01, // vitality amplification (damped — energy is large)
    drifts,
    coherence,
    energy,
  } = {},
) {
  const d = drifts ?? measureDrift(freqs);
  const c = coherence ?? measureCoherence(d);
  const h = energy ?? measureHarmonicEnergy(freqs);
  const hNorm = h / 10000; // normalize large energy value

  return freqs.map(
    (f, i) =>
      +Math.max(1, f - alpha * d[i] + beta * c + gamma * hNorm).toFixed(4),
  );
}

// ─── Full Snapshot ───────────────────────────────────────────────────────────

/**
 * Run a full resonance diagnostic snapshot.
 * Returns drift, coherence, harmonic energy, domain band details, and
 * corrected frequencies from one governance loop iteration.
 *
 * @param {number[]} [freqs] — override domain frequencies (defaults to canonical SEMANTIC_FREQUENCY_MAP)
 * @returns {ResonanceDiagnosticSnapshot}
 */
export function runDiagnostics(freqs) {
  const domainFreqs = freqs ?? DOMAIN_BANDS.map((b) => b.freq);
  const drifts = measureDrift(domainFreqs);
  const coherence = measureCoherence(drifts);
  const energy = measureHarmonicEnergy(domainFreqs);
  const corrected = applyControlLoop(domainFreqs, {
    drifts,
    coherence,
    energy,
  });

  const bands = DOMAIN_BANDS.map((b, i) => ({
    domain: b.name,
    operator: b.operator,
    frequency: domainFreqs[i],
    drift: drifts[i],
    corrected: corrected[i],
    driftSign: drifts[i] > 0 ? "+" : drifts[i] < 0 ? "-" : "=",
  }));

  const status =
    coherence >= 0.95
      ? "SINGULARITY"
      : coherence >= 0.8
        ? "OPTIMAL"
        : coherence >= 0.65
          ? "NOMINAL"
          : coherence >= 0.4
            ? "WARNING"
            : "CRITICAL";

  return {
    architectureSignature: CANONICAL_ARCHITECTURE,
    phi: PHI,
    coherence,
    harmonicEnergy: energy,
    status,
    bands,
    // Phase drift snapshot (default: all-zero phases = perfect canonical alignment)
    phaseDrift: measurePhaseDrift(new Array(DOMAIN_BANDS.length).fill(0)),
    timestamp: new Date().toISOString(),
  };
}

// ─── ResonanceDiagnostics class ──────────────────────────────────────────────

export class ResonanceDiagnostics {
  constructor() {
    assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);
    this._history = [];
  }

  /**
   * Run diagnostics and optionally store in history.
   * @param {object} opts — { freqs?, remember? }
   */
  diagnose({ freqs, remember = false } = {}) {
    const snapshot = runDiagnostics(freqs);
    if (remember) {
      this._history.push(snapshot);
      if (this._history.length > 100) this._history.shift();
    }
    return snapshot;
  }

  /** Last N snapshots. */
  history(n = 10) {
    return this._history.slice(-n);
  }

  /** Coherence trend — positive = improving, negative = drifting. */
  coherenceTrend() {
    const h = this._history;
    if (h.length < 2) return 0;
    return +(
      (h[h.length - 1].coherence - h[0].coherence) /
      (h.length - 1)
    ).toFixed(6);
  }
}

export default ResonanceDiagnostics;

// ─── Phase Drift + Time-Domain Propagation ───────────────────────────────────

/**
 * Measure Phase Drift
 *
 * For each domain node, phase drift = |φ_n − 0| (deviation from zero phase).
 * Stability threshold: ≤ 0.05 radians.
 * Any node exceeding the threshold is flagged as unstable.
 *
 * Phase values represent how far each domain's resonance has rotated from
 * its canonical alignment within the current cycle.
 *
 * @param {number[]} phases — phase offset per domain (radians, default: all zero = perfect alignment)
 * @param {number}   [threshold=0.05] — max acceptable drift in radians
 * @returns {{ phases: number[], drifts: number[], stable: boolean[], overallStable: boolean, maxDrift: number }}
 */
export function measurePhaseDrift(
  phases = new Array(8).fill(0),
  threshold = 0.05,
) {
  const drifts = phases.map((p) => +Math.abs(p).toFixed(8));
  const stable = drifts.map((d) => d <= threshold);
  const maxDrift = +Math.max(...drifts).toFixed(8);
  return {
    phases,
    drifts,
    stable,
    overallStable: stable.every(Boolean),
    maxDrift,
    threshold,
  };
}

/**
 * Propagate Resonance (Time-Domain)
 *
 * Computes lattice resonance intensity at time t:
 *
 *   I(t) = Σ_{n=0}^{N-1} A_n · cos(2π·f_n·t + φ_n) × (1 − δ)
 *
 * Uses real part of complex exponential (cosine wave per domain).
 * Damping factor δ = 0.001 prevents runaway resonance over time.
 *
 * Canonical base: uses SEMANTIC_FREQUENCY_MAP (8 bands) unless overridden.
 *
 * @param {number}   t          — simulation time in seconds
 * @param {number[]} [phases]   — phase offsets per domain (radians, default: 0)
 * @param {number[]} [amplitudes] — amplitude per domain (default: 1 each)
 * @param {number[]} [freqs]    — domain frequencies (default: canonical 8 bands)
 * @param {number}   [damping=0.001] — damping coefficient δ
 * @returns {{ intensity: number, perDomain: number[], t: number, stable: boolean }}
 */
export function propagateResonance(
  t,
  phases = new Array(8).fill(0),
  amplitudes = new Array(8).fill(1),
  freqs = DOMAIN_BANDS.map((b) => b.freq),
  damping = 0.001,
) {
  const perDomain = freqs.map((f, i) => {
    const a = amplitudes[i] ?? 1;
    const p = phases[i] ?? 0;
    return +(a * Math.cos(2 * Math.PI * f * t + p) * (1 - damping)).toFixed(8);
  });
  const intensity = +perDomain.reduce((s, v) => s + v, 0).toFixed(6);
  const phaseDrift = measurePhaseDrift(phases);
  return {
    t,
    intensity,
    perDomain,
    damping,
    stable: phaseDrift.overallStable,
    phaseDrift,
  };
}
