/**
 * MerkabaMAXSwarmCoordinator — Triple-Attestation Autonomous Coordinator
 * @alignment 8→26→48:480
 *
 * Orchestrates THREE independent swarm intelligences into a single unified
 * decision fabric that governs the MERKABA480 OS autonomously 24/7:
 *
 *   Alpha (PHI=1.618)  — MerkabaBeEyeSwarm    : code-quality scan, S1→S8
 *   Omega (PSI=1.414)  — MerkabaBeEyeSwarmWitness: reversed code scan, S8→S1
 *   Delta (PHI/PSI≈1.1442) — MerkabaBeEyeMAXswarm: live lattice coherence
 *
 * TRIPLE ATTESTATION FORMULA (Session 7+, May 2026):
 *   attestedScore = alpha × ALPHA_WEIGHT_3 + omega × OMEGA_WEIGHT_3 + delta × DELTA_WEIGHT_3
 *   where sum(weights) = 1.0 by construction (PHI + PSI + PHI/PSI normalised)
 *
 *   When all three = 1.0 → 1.0/1.0 = TRIPLE_ATTESTED (absolute certainty)
 *   ALPHA_WEIGHT_3 ≈ 0.3874  (PHI / 4.1762)
 *   OMEGA_WEIGHT_3 ≈ 0.3386  (PSI / 4.1762)
 *   DELTA_WEIGHT_3 ≈ 0.2740  ((PHI/PSI) / 4.1762)
 *
 * AUTONOMOUS ACTIONS:
 *   ◉ Cluster expansion       — auto-expand when lattice RED zone detected
 *   ◉ Semantic reroute signal — emit when drone finds misalignment hotspot
 *   ◉ Governance escalation   — escalate critical findings to GovernanceBoard
 *   ◉ Attestation reports     — emit periodic triple-attestation STATUS_REPORT
 *   ◉ Adaptive heartbeat      — adjust scan frequency based on load
 *
 * SEPARATION GUARANTEE (DualAttestation integrity preserved):
 *   Alpha and Omega scan source code independently (different geometric poles).
 *   Delta scans live lattice state only (completely different data source).
 *   The coordinator NEVER touches MerkabaBeEyeSwarm.js, MerkabaBeEyeSwarmWitness.js,
 *   MerkabaDualAttestation.js, or transform-420.js.
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED FOREVER
 * PHI = 1.618 · PSI = 1.414 · DELTA = PHI/PSI ≈ 1.1442 · GOLDEN_BAND = 3.032
 *
 * @module geo/intelligence/MerkabaMAXSwarmCoordinator
 */

import { EventEmitter } from "node:events";
import {
  PHI,
  PSI,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  buildGeoCoordinate,
} from "../lattice/merkaba480-runtime.js";
import {
  MerkabaBeEyeMAXswarm,
  ALPHA_WEIGHT_3,
  OMEGA_WEIGHT_3,
  DELTA_WEIGHT_3,
  DELTA,
} from "./MerkabaBeEyeMAXswarm.js";

// ── Architecture assertion ────────────────────────────────────────────────────
if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
  throw new Error(
    `[MerkabaMAXSwarmCoordinator] FATAL: CANONICAL_ARCHITECTURE = "${CANONICAL_ARCHITECTURE}".`,
  );
}

// ── Attestation verdict table ─────────────────────────────────────────────────
const VERDICTS = {
  TRIPLE_ATTESTED:  { threshold: 0.95, label: "TRIPLE_ATTESTED",  severity: "OK"       },
  DUAL_CONFIRMED:   { threshold: 0.80, label: "DUAL_CONFIRMED",   severity: "INFO"     },
  PARTIAL:          { threshold: 0.60, label: "PARTIAL",          severity: "MEDIUM"   },
  DEGRADED:         { threshold: 0.40, label: "DEGRADED",         severity: "HIGH"     },
  CRITICAL_DRIFT:   { threshold: 0.00, label: "CRITICAL_DRIFT",   severity: "CRITICAL" },
};

function classifyAttestation(score) {
  for (const [, v] of Object.entries(VERDICTS)) {
    if (score >= v.threshold) return v;
  }
  return VERDICTS.CRITICAL_DRIFT;
}

// ─────────────────────────────────────────────────────────────────────────────
// MerkabaMAXSwarmCoordinator
// ─────────────────────────────────────────────────────────────────────────────

export class MerkabaMAXSwarmCoordinator extends EventEmitter {
  /**
   * @param {object} opts
   * @param {number}   [opts.coordinatorHeartbeatMs=60000] — Coordinator report interval (1 min default)
   * @param {number}   [opts.maxHistoryDepth=30]           — Attestation history ring buffer
   * @param {string}   [opts.coordinatorId="max-coord"]
   * @param {object}   [opts.maxSwarmOpts={}]              — Forwarded to MerkabaBeEyeMAXswarm
   * @param {function} [opts.onExpand]  — Called when coordinator decides to expand: (count) => void
   * @param {function} [opts.onReroute] — Called when semantic reroute needed: (rerouteMap) => void
   */
  constructor({
    coordinatorHeartbeatMs = 60_000,
    maxHistoryDepth        = 30,
    coordinatorId          = "max-coord",
    maxSwarmOpts           = {},
    onExpand               = null,
    onReroute              = null,
  } = {}) {
    super();

    this.coordinatorId = coordinatorId;
    this._coordinatorMs = coordinatorHeartbeatMs;
    this._maxHistory    = maxHistoryDepth;
    this._onExpand      = onExpand;
    this._onReroute     = onReroute;
    this._coordinatorTimer = null;
    this._attestCount   = 0;
    this._history       = [];
    this._startedAt     = null;

    // Alpha score cache (from external BESX sweep, updated by setAlphaScore)
    this._alphaScore    = null;
    this._alphaTs       = null;

    // Omega score cache (from external Witness sweep, updated by setOmegaScore)
    this._omegaScore    = null;
    this._omegaTs       = null;

    // Delta score comes from MAXswarm's own sweep (live lattice)
    this.maxSwarm = new MerkabaBeEyeMAXswarm({
      swarmId:     `${coordinatorId}-delta`,
      heartbeatMs: maxSwarmOpts.heartbeatMs ?? 30_000,
      maxHistory:  maxSwarmOpts.maxHistory  ?? 20,
      ...maxSwarmOpts,
    });

    // Forward MAXswarm pressure events
    this.maxSwarm.on("swarm:pressure",  (r) => this.emit("coord:pressure",  r));
    this.maxSwarm.on("swarm:critical",  (r) => this.emit("coord:critical",  r));
    this.maxSwarm.on("swarm:scan",      (r) => this._onDeltaScan(r));
  }

  // ── Alpha / Omega score injection (from BESX + Witness sweeps) ────────────

  /**
   * Inject an Alpha (BESX) code-scan result.
   * @param {number} score — 0-1 coherence from MerkabaBeEyeSwarm sweep
   */
  setAlphaScore(score) {
    this._alphaScore = Math.min(1, Math.max(0, score));
    this._alphaTs    = Date.now();
    this.emit("coord:alpha-updated", { score: this._alphaScore, ts: this._alphaTs });
  }

  /**
   * Inject an Omega (Witness) code-scan result.
   * @param {number} score — 0-1 coherence from MerkabaBeEyeSwarmWitness sweep
   */
  setOmegaScore(score) {
    this._omegaScore = Math.min(1, Math.max(0, score));
    this._omegaTs    = Date.now();
    this.emit("coord:omega-updated", { score: this._omegaScore, ts: this._omegaTs });
  }

  // ── Delta scan integration ────────────────────────────────────────────────

  _onDeltaScan(maxReport) {
    const deltaScore = maxReport.swarmCoherence ?? 1.0;

    // Trigger autonomous action on RED zone
    if (maxReport.safeZone === "RED" && typeof this._onExpand === "function") {
      this._onExpand(1);
    }

    // Trigger reroute suggestions when significant misalignment detected
    if (
      maxReport.rerouteMap &&
      Object.values(maxReport.rerouteMap).some((v) => v.overloaded?.length > 0) &&
      typeof this._onReroute === "function"
    ) {
      this._onReroute(maxReport.rerouteMap);
    }

    // Emit delta update for coordinator cycle
    this.emit("coord:delta-updated", {
      deltaScore,
      safeZone:   maxReport.safeZone,
      scanId:     maxReport.scanId,
      findingCount: maxReport.findingCount,
    });
  }

  // ── Triple attestation computation ────────────────────────────────────────

  /**
   * Compute the current triple-attested score from cached Alpha, Omega, Delta.
   * Uses 0.5 (neutral) for any pole that has not yet reported.
   */
  computeAttestation() {
    const alpha = this._alphaScore ?? 0.5;
    const omega = this._omegaScore ?? 0.5;
    const delta = this.maxSwarm.lastScan?.swarmCoherence ?? 0.5;

    const attestedScore = +(
      alpha * ALPHA_WEIGHT_3 +
      omega * OMEGA_WEIGHT_3 +
      delta * DELTA_WEIGHT_3
    ).toFixed(6);

    const verdict = classifyAttestation(attestedScore);

    const geo = buildGeoCoordinate({
      domain:       "security-forge",
      sector:       8,
      confidence:   attestedScore,
      source:       `coordinator:${this.coordinatorId}`,
      semanticType: "PHYSICS",
    });

    return {
      attestedScore,
      verdict:          verdict.label,
      severity:         verdict.severity,
      poles: {
        alpha: { score: alpha, weight: ALPHA_WEIGHT_3, ts: this._alphaTs ?? null },
        omega: { score: omega, weight: OMEGA_WEIGHT_3, ts: this._omegaTs ?? null },
        delta: { score: delta, weight: DELTA_WEIGHT_3, ts: this.maxSwarm.lastScan?.timestamp ?? null },
      },
      anchors: {
        PHI,
        PSI,
        DELTA:        +DELTA.toFixed(6),
        GOLDEN_BAND:  +(PHI + PSI).toFixed(3),
        ALPHA_WEIGHT_3,
        OMEGA_WEIGHT_3,
        DELTA_WEIGHT_3,
      },
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay:   CANONICAL_ARCHITECTURE_DISPLAY,
      geoqode:  geo,
    };
  }

  // ── Coordinator cycle ─────────────────────────────────────────────────────

  /**
   * Run one coordinator cycle: compute attestation + emit STATUS_REPORT.
   */
  runCycle() {
    this._attestCount++;
    const attest = this.computeAttestation();

    const report = {
      reportType:   "MAX_SWARM_COORDINATOR_STATUS",
      coordinatorId: this.coordinatorId,
      cycleId:      `coord-${this._attestCount}`,
      timestamp:    new Date().toISOString(),
      ...attest,
      deltaSwarmStatus: this.maxSwarm.statusSnapshot(),
      cycleCount:   this._attestCount,
      uptimeMs:     this._startedAt ? Date.now() - this._startedAt : 0,
    };

    this._history.unshift(report);
    if (this._history.length > this._maxHistory) this._history.pop();

    this.emit("coord:attestation", report);

    if (attest.severity === "CRITICAL") {
      this.emit("coord:critical-attestation", report);
    }

    return report;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Start the coordinator — begins both the MAXswarm heartbeat AND the
   * periodic coordinator cycle (attestation reports).
   *
   * @param {function} latticeProvider — Returns LatticeRuntime[] (sync or async)
   * @param {object}   [ctx]           — { source, osId }
   * @returns {this}
   */
  start(latticeProvider, ctx = {}) {
    if (this._coordinatorTimer) return this;
    this._startedAt = Date.now();

    // Start delta swarm 24/7 heartbeat
    this.maxSwarm.startHeartbeat(latticeProvider, {
      ...ctx,
      source: `${ctx.source ?? "os"}:delta`,
    });

    // Periodic attestation report
    this._coordinatorTimer = setInterval(() => {
      try { this.runCycle(); } catch (_) { /* non-fatal */ }
    }, this._coordinatorMs);

    // Run first cycle immediately
    setTimeout(() => { try { this.runCycle(); } catch (_) {} }, 100);

    this.emit("coord:start", {
      coordinatorId:  this.coordinatorId,
      coordinatorMs:  this._coordinatorMs,
      deltaHeartbeatMs: this.maxSwarm._heartbeatMs,
      phiAnchor:      PHI,
      psiAnchor:      PSI,
      deltaAnchor:    +DELTA.toFixed(6),
      alphaWeight3:   ALPHA_WEIGHT_3,
      omegaWeight3:   OMEGA_WEIGHT_3,
      deltaWeight3:   DELTA_WEIGHT_3,
      geoqode: buildGeoCoordinate({
        domain: "security-forge", sector: 8, confidence: 1.0,
        source: `coordinator:${this.coordinatorId}`, semanticType: "PHYSICS",
      }),
    });

    return this;
  }

  /** Stop coordinator + MAXswarm heartbeat. */
  stop() {
    if (this._coordinatorTimer) {
      clearInterval(this._coordinatorTimer);
      this._coordinatorTimer = null;
    }
    this.maxSwarm.stopHeartbeat();
    this.emit("coord:stop", {
      coordinatorId: this.coordinatorId,
      cycleCount:    this._attestCount,
      uptimeMs:      this._startedAt ? Date.now() - this._startedAt : 0,
    });
    return this;
  }

  // ── Status ────────────────────────────────────────────────────────────────

  get isRunning()   { return this._coordinatorTimer != null; }
  get cycleCount()  { return this._attestCount; }
  get history()     { return [...this._history]; }
  get latestAttestation() { return this._history[0] ?? null; }

  /** Full coordinator status for REST/monitoring endpoints. */
  statusSnapshot() {
    const attest = this.computeAttestation();
    return {
      coordinatorId:    this.coordinatorId,
      isRunning:        this.isRunning,
      cycleCount:       this._attestCount,
      coordinatorMs:    this._coordinatorMs,
      uptimeMs:         this._startedAt ? Date.now() - this._startedAt : 0,
      currentAttestation: attest,
      deltaSwarm:       this.maxSwarm.statusSnapshot(),
      historyDepth:     this._history.length,
      architectureSignature: CANONICAL_ARCHITECTURE,
    };
  }
}

export default MerkabaMAXSwarmCoordinator;
