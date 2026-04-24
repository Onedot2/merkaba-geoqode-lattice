// geo/validation/qbits-validator.js
// Phase 6: QBITS Materialization Validation
// Full state-machine validation of QBITS lifecycle with sacred frequency verification.

import crypto from "crypto";

// Sacred frequency bands (Hz) with allowed tolerance ±0.5Hz
const SACRED_FREQUENCIES = {
  174: { name: "Foundation", color: "red", dimension: 1 },
  285: { name: "Quantum Cognition", color: "orange", dimension: 5 },
  396: { name: "Liberation", color: "amber", dimension: 12 },
  417: { name: "Facilitation", color: "yellow", dimension: 14 },
  420: { name: "Golden Stability / GeoQode Substrate", color: "chartreuse", dimension: 15 },
  432: { name: "Universal Harmony", color: "green", dimension: 16 },
  528: { name: "DNA Repair / Transformation", color: "blue", dimension: 20 },
  639: { name: "Connection", color: "indigo", dimension: 27 },
  741: { name: "Awakening", color: "violet", dimension: 34 },
  852: { name: "Intuition", color: "white", dimension: 40 },
  963: { name: "Crown / Pineal", color: "gold", dimension: 44 },
};

// Golden ratio / Fibonacci harmonic series (Φ^n approximations)
const VALID_HARMONICS = new Set([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);

// QBITS state machine transitions
const VALID_TRANSITIONS = {
  DORMANT: ["MATERIALIZED"],
  MATERIALIZED: ["RESONATING", "CRYSTALLIZED"],
  RESONATING: ["CRYSTALLIZED"],
  CRYSTALLIZED: ["STABLE"],
  STABLE: [], // terminal
};

/**
 * QBITSValidator — validates the full QBITS lifecycle.
 *
 * Usage:
 *   const v = new QBITSValidator();
 *   v.validateFrequency('~wave(528Hz)');   // → { valid: true, info: {...} }
 *   v.validateTransition('DORMANT', 'MATERIALIZED'); // → { valid: true }
 *   v.validateSequence(molecule);          // → { valid, violations, score }
 */
export class QBITSValidator {
  constructor() {
    this.violations = [];
    this.validatedCount = 0;
    this.sacredFrequencies = SACRED_FREQUENCIES;
  }

  /**
   * Validate a frequency token (e.g. "~wave(528Hz)" or "528Hz" or 528).
   * @param {string|number} frequency
   */
  validateFrequency(frequency) {
    const hz = this._parseHz(frequency);

    if (hz === null) {
      return {
        valid: false,
        reason: `Cannot parse frequency: "${frequency}"`,
        hz: null,
      };
    }

    // Exact or near-match to sacred frequency
    for (const [sacredHz, info] of Object.entries(SACRED_FREQUENCIES)) {
      if (Math.abs(hz - Number(sacredHz)) <= 0.5) {
        this.validatedCount++;
        return {
          valid: true,
          hz,
          sacred: Number(sacredHz),
          info,
          deviation: hz - Number(sacredHz),
        };
      }
    }

    // Not a sacred frequency but still a valid number
    this.violations.push(`Non-sacred frequency: ${hz}Hz`);
    return {
      valid: false,
      hz,
      reason: `${hz}Hz is not a recognized sacred frequency`,
      nearestSacred: this._nearestSacred(hz),
    };
  }

  /**
   * Validate a harmonic value (must be a Fibonacci/golden-ratio number).
   * @param {number} harmonic
   */
  validateHarmonic(harmonic) {
    const n = Number(harmonic);
    if (!Number.isFinite(n) || n <= 0) {
      return { valid: false, reason: `Invalid harmonic: ${harmonic}` };
    }

    if (VALID_HARMONICS.has(n)) {
      return { valid: true, harmonic: n, series: "Fibonacci" };
    }

    // Check golden angle multiples (n * 137.5)
    if (Number.isInteger(n) && n > 0 && n <= 144) {
      return {
        valid: true,
        harmonic: n,
        series: "integer",
        note: "Non-Fibonacci but integer — accepted",
      };
    }

    this.violations.push(`Non-Fibonacci harmonic: ${n}`);
    return {
      valid: false,
      harmonic: n,
      reason: `${n} is not in the Fibonacci harmonic series`,
      nearestFibonacci: this._nearestFibonacci(n),
    };
  }

  /**
   * Validate a QBITS state transition.
   * @param {string} fromState
   * @param {string} toState
   */
  validateTransition(fromState, toState) {
    const allowed = VALID_TRANSITIONS[fromState];
    if (!allowed) {
      return {
        valid: false,
        reason: `Unknown state: "${fromState}"`,
      };
    }

    if (!allowed.includes(toState)) {
      this.violations.push(
        `Illegal QBITS transition: ${fromState} → ${toState}`,
      );
      return {
        valid: false,
        reason: `Cannot transition from ${fromState} to ${toState}`,
        allowedTransitions: allowed,
      };
    }

    return { valid: true, from: fromState, to: toState };
  }

  /**
   * Validate a full WaterMolecule object's lifecycle.
   * @param {object} molecule - WaterMolecule instance or plain state
   */
  validateSequence(molecule) {
    const state = molecule.getState?.() || molecule;
    const logs = molecule.getLogs?.() || molecule.crystallizationLogs || [];
    const issues = [];
    let score = 100;

    // 1. Frequency validation
    if (state.frequency) {
      const freqResult = this.validateFrequency(state.frequency);
      if (!freqResult.valid) {
        issues.push(`Frequency: ${freqResult.reason}`);
        score -= 25;
      }
    } else {
      issues.push("No frequency recorded");
      score -= 10;
    }

    // 2. Harmonic validation
    if (state.harmonic !== undefined) {
      const harmResult = this.validateHarmonic(state.harmonic);
      if (!harmResult.valid) {
        issues.push(`Harmonic: ${harmResult.reason}`);
        score -= 15;
      }
    } else {
      issues.push("No harmonic recorded");
      score -= 10;
    }

    // 3. State machine integrity
    if (state.qbitState === "DORMANT") {
      issues.push("QBITS never materialized");
      score -= 30;
    } else if (!VALID_TRANSITIONS.hasOwnProperty(state.qbitState)) {
      issues.push(`Invalid QBITS state: ${state.qbitState}`);
      score -= 40;
    }

    // 4. Crystallization log integrity
    if (logs.length < 2) {
      issues.push(
        `Insufficient crystallization log entries: ${logs.length} (need ≥2)`,
      );
      score -= 10;
    }

    // 5. Audit hash of final state
    const auditHash = this._hashState(state);

    const valid = issues.length === 0 && score >= 70;
    this.validatedCount++;

    return {
      valid,
      score: Math.max(0, score),
      qbitState: state.qbitState,
      issues,
      auditHash,
      certification: valid ? "QBITS_CERTIFIED" : "QBITS_FAILED",
    };
  }

  /**
   * Validate a batch of molecules and return aggregate report.
   */
  validateBatch(molecules) {
    const results = molecules.map((m) => this.validateSequence(m));
    const certified = results.filter((r) => r.valid).length;
    const avgScore =
      results.reduce((s, r) => s + r.score, 0) / (results.length || 1);

    return {
      total: results.length,
      certified,
      failed: results.length - certified,
      avgScore: Math.round(avgScore),
      certificationRate: `${((certified / results.length) * 100).toFixed(1)}%`,
      results,
    };
  }

  /**
   * Get all violations recorded during this session.
   */
  getViolations() {
    return this.violations.slice();
  }

  /**
   * Reset validator state.
   */
  reset() {
    this.violations = [];
    this.validatedCount = 0;
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _parseHz(input) {
    if (typeof input === "number") return input;
    const str = String(input);
    // Match patterns: "528Hz", "~wave(528Hz)", "528.0Hz", "528"
    const match = str.match(/(\d+(?:\.\d+)?)\s*(?:Hz)?/i);
    return match ? parseFloat(match[1]) : null;
  }

  _nearestSacred(hz) {
    const keys = Object.keys(SACRED_FREQUENCIES).map(Number);
    return keys.reduce((prev, curr) =>
      Math.abs(curr - hz) < Math.abs(prev - hz) ? curr : prev,
    );
  }

  _nearestFibonacci(n) {
    const fibs = Array.from(VALID_HARMONICS).sort((a, b) => a - b);
    return fibs.reduce((prev, curr) =>
      Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev,
    );
  }

  _hashState(state) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(state))
      .digest("hex");
  }
}

export { SACRED_FREQUENCIES, VALID_HARMONICS, VALID_TRANSITIONS };
export default QBITSValidator;
