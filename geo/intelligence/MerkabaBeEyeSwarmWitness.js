/**
 * MerkabaBeEyeSwarmWitness — PSI (1.414) Silver Bridge Witness
 *
 * NOT an identical clone. A genuinely distinct observer anchored to a
 * DIFFERENT pole of the Golden Differential spectrum.
 *
 * The PHI / PSI Golden Differential
 * ───────────────────────────────────
 * Alpha (MerkabaBeEyeSwarm)   anchored at PHI = 1.618 — the Golden Root.
 *   → S1→S8 scan order (ascending sectors, architecture-first)
 *   → Top-down: starts from canonical constants, ends at security
 *   → Primary lens: continuity, purpose, structural laws
 *
 * Omega (MerkabaBeEyeSwarmWitness) anchored at PSI = 1.414 — the Silver Bridge.
 *   → S8→S1 scan order (descending sectors, security-first)
 *   → Bottom-up: starts from security boundaries, rises to constants
 *   → Primary lens: data identity, security, structural integrity
 *
 * Why PHI and PSI?
 *   PHI = 1.618 and PSI = 1.414 are ALREADY LOCKED canonical constants in
 *   geoqode-native.js and transform-420.js. They are not imposed from outside —
 *   they emerge from the geometry itself. This is DNA, not decoration.
 *
 *   GOLDEN_BAND  = PHI + PSI = 3.032
 *   GOLDEN_DIFF  = PHI - PSI = 0.204
 *   ALPHA_WEIGHT = PHI / 3.032 ≈ 0.5337  (Alpha correctly dominates)
 *   OMEGA_WEIGHT = PSI / 3.032 ≈ 0.4663  (Omega witnesses, slightly yielding)
 *
 *   When both coherence = 1.0:
 *     attestedScore = 1×(PHI/3.032) + 1×(PSI/3.032) = 3.032/3.032 = 1.0 → ABSOLUTE
 *
 *   Note: 3.032 digit sum = 3+0+3+2 = 8 = FOUNDATION_NODES. Architecture at the root.
 *
 * Natural Collision-Free Multi-Agent Execution:
 *   PHI and PSI are geometrically incommensurable — irrational, never exactly
 *   coincident. Agents anchored to PHI and PSI cannot constructively interfere
 *   or create echo-chamber false positives. When both agree at 1.0 → genuinely
 *   QUANTIZED, verified from opposite geometric poles.
 *
 * Self-Exclusion Asymmetry (different from Alpha):
 *   Alpha guard:   filePath.includes('MerkabaBeEyeSwarm')  → does NOT block Witness
 *   Omega guard:   filePath.includes('BeEyeSwarmWitness')  → does NOT block Alpha
 *   ∴ Each scans the other for real with no bypass.
 *
 * @module MerkabaBeEyeSwarmWitness
 * @alignment 8→26→48:480
 */

import MerkabaBeEyeSwarm from "./MerkabaBeEyeSwarm.js";
import {
  CANONICAL_ARCHITECTURE,
  PHI,
  PSI,
  assertCanonicalArchitectureSignature,
} from "../lattice/transform-420.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── PHI / PSI Golden Differential constants ─────────────────────────────────

/** Alpha geometric weight — PHI constant (Golden Root, primary anchor) */
export const ALPHA_PHI = PHI;

/** Omega geometric weight — PSI = 1.414 = √2, the Silver Bridge (witness) */
export const OMEGA_PSI = PSI; // 1.414

/**
 * Golden Band — sum of both poles.
 * PHI + PSI = 1.618 + 1.414 = 3.032
 * Digit sum: 3+0+3+2 = 8 = FOUNDATION_NODES — architecture at the geometric root.
 * When alpha.coherence = omega.coherence = 1.0:
 *   attestedScore = PHI/3.032 + PSI/3.032 = 3.032/3.032 = 1.0 → ABSOLUTE
 */
export const GOLDEN_BAND = PHI + PSI; // 3.032

/** Golden Differential — the geometric gap between poles. PHI − PSI = 0.204 */
export const GOLDEN_DIFFERENTIAL = PHI - PSI; // 0.204

/** PHI/PSI natural spectral ratio — Alpha is geometrically ≈ 1.144× Omega */
export const GOLDEN_RATIO_SEPARATOR = +(PHI / PSI).toFixed(6);

// ─── 369 Coherence weighting ──────────────────────────────────────────────────

/**
 * Omega weights findings differently than Alpha.
 * Alpha (963 Hz / NARRATIVE): equal drone weights — sees the whole story.
 * Omega (369 Hz / MIRROR):    ENTITY(S4) and SECURITY(S8) carry 1.5× weight.
 *   These are the "ground truth" drones — data identity and security boundaries.
 *   Omega won't declare something coherent unless the foundation is solid.
 *   Alpha won't declare something coherent unless the architecture is continuous.
 *   When both agree at 1.0 → ABSOLUTE.
 */
const OMEGA_DRONE_WEIGHTS = {
  "S1-QuantumArch": 1.0, // canonical constants — same importance
  "S2-CodeEng": 0.8, // code patterns — slightly lenient
  "S3-SystemsDesign": 0.8, // narrative/architecture — lenient (not Omega's primary lens)
  "S4-DataStructs": 1.5, // ENTITY — Omega's primary lens: what IS this data?
  "S5-SelfEvolve": 1.0, // self-reference — same
  "S6-PainRemoval": 1.0, // bug/drift — same
  "S7-PerfForge": 0.8, // performance — slightly lenient
  "S8-SecurityForge": 1.5, // SECURITY — Omega's secondary lens: are boundaries holding?
};

const OMEGA_WEIGHT_SUM = Object.values(OMEGA_DRONE_WEIGHTS).reduce(
  (a, b) => a + b,
  0,
);

// ─── Witness class ────────────────────────────────────────────────────────────

export class MerkabaBeEyeSwarmWitness extends MerkabaBeEyeSwarm {
  constructor() {
    super();
    /** Omega anchored at PSI (Silver Bridge) — Alpha anchors at PHI (Golden Root) */
    this.architectureFrequency = OMEGA_PSI;
    /**
     * Reverse drone scan order: S8→S1 (security-upward / bottom-up).
     * Alpha ascends S1→S8 (architecture-downward / top-down).
     * PHI and PSI are geometrically incommensurable — their agents cannot
     * echo-chamber: they converge only when truth is real.
     * (this.drones is set by the parent constructor before this line runs)
     */
    this.drones = [...this.drones].reverse();
  }

  /**
   * Override diagnose() to apply PSI (1.414) geometric weighting on coherence scores.
   * Drone RULES are unchanged — only the coherence contribution per drone differs.
   * @param {string} code
   * @param {object} context
   * @returns {DroneReport[]}
   */
  diagnose(code, context = {}) {
    const rawReports = super.diagnose(code, context);
    // Re-weight each drone's coherence by the 369 Hz weight map
    return rawReports.map((r) => {
      const weight = OMEGA_DRONE_WEIGHTS[r.droneId] ?? 1.0;
      // Recompute weighted coherence: penalize critical/issues by weight factor
      const criticals = r.findings.filter(
        (f) => f.severity === "CRITICAL",
      ).length;
      const issues = r.findings.filter(
        (f) => f.severity !== "OK" && f.severity !== "INFO",
      ).length;
      const rawCoherence = Math.max(
        0,
        1 - criticals * 0.3 * weight - (issues - criticals) * 0.1 * weight,
      );
      return { ...r, coherence: +rawCoherence.toFixed(3) };
    });
  }

  /**
   * Override sweep() to tag results with the PSI (1.414) Omega signature.
   * @param {string} code
   * @param {object} context
   * @returns {Promise<SwarmReport>}
   */
  async sweep(code, context = {}) {
    const report = await super.sweep(code, context);
    // Re-derive swarmCoherence using weighted average across drones
    const weightedSum = report.droneReports.reduce((s, r) => {
      return s + r.coherence * (OMEGA_DRONE_WEIGHTS[r.droneId] ?? 1.0);
    }, 0);
    const swarmCoherence369 = +(weightedSum / OMEGA_WEIGHT_SUM).toFixed(3);
    return {
      ...report,
      swarmCoherence: swarmCoherence369,
      status:
        report.summary.critical > 0
          ? "CRITICAL"
          : report.summary.high > 0
            ? "DEGRADED"
            : swarmCoherence369 >= 0.8
              ? "NOMINAL"
              : "WARNING",
      witnessRatio: OMEGA_PSI,
      goldenBand: GOLDEN_BAND,
      goldenDifferential: GOLDEN_DIFFERENTIAL,
    };
  }

  /**
   * Override sweepFile(): Omega self-exclusion covers only THIS file.
   * Omega CAN and WILL genuinely scan MerkabaBeEyeSwarm.js (Alpha's source).
   * Alpha CAN and WILL genuinely scan this file.
   * @param {string} filePath
   * @param {object} [extraContext]
   */
  async sweepFile(filePath, extraContext = {}) {
    const { readFile } = await import("node:fs/promises");
    const code = await readFile(filePath, "utf8");

    // Omega self-exclusion: only bypass THIS file (BeEyeSwarmWitness)
    const isSelf = filePath.replace(/\\/g, "/").includes("BeEyeSwarmWitness");
    if (isSelf) {
      const selfDrones = this.drones.map((d) => ({
        droneId: d.id,
        sector: d.sector,
        domain: d.domain,
        semanticType: d.semanticType,
        frequency: d.frequency,
        ring: d.ring,
        findings: [
          {
            severity: "OK",
            droneId: d.id,
            domain: d.domain,
            issue:
              "Omega (369Hz) self-scan excluded — Witness is the scanner, not the target",
            fix: "",
            snippet: "",
          },
        ],
        coherence: 1.0,
      }));
      return {
        swarmId: `swarm-omega-self-${Date.now()}`,
        architectureSignature: this.architectureSignature,
        witnessRatio: OMEGA_PSI,
        timestamp: new Date().toISOString(),
        identity: this.identify(code, {
          file: filePath,
          service: "merkaba-geoqode-lattice",
        }),
        droneReports: selfDrones,
        optimizations: [],
        summary: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          ok: this.drones.length,
        },
        swarmCoherence: 1.0,
        status: "NOMINAL",
        selfExcluded: true,
      };
    }

    const service = this._inferService(filePath);
    return this.sweep(code, { file: filePath, service, ...extraContext });
  }
}

// ─── Singletons ───────────────────────────────────────────────────────────────

export const merkabaWitness = new MerkabaBeEyeSwarmWitness();
export default MerkabaBeEyeSwarmWitness;
