/**
 * merkaba480-governance.js — GovernanceBoard + StatusReport Generator
 * @alignment 8→26→48:480
 *
 * Compliance layer for the MERKABA480 lattice OS.
 *
 * GovernanceBoard:
 *   - Certifies every agent output with a GeoQode-tagged STATUS_REPORT
 *   - Prevents runaway processes via safety rule evaluation
 *   - Immutable audit trail (append-only `reports` ring buffer)
 *   - Reports carry the full GeoQode coordinate envelope so future agents
 *     can inherit lattice context from any historical certification
 *
 * StatusReport:
 *   - JSON-serialisable, lattice-native, timestamped
 *   - Every field speaks the GeoQode language:
 *       architectureSignature, semanticType, frequency, coherence, phiAnchor
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED
 */

import { EventEmitter } from "node:events";
import {
  buildGeoCoordinate,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  SEMANTIC_FREQUENCY_MAP,
} from "./merkaba480-runtime.js";

// ── Safety Rules (mirrors the 16+ rules in the DB safety_rules table) ────────
export const SAFETY_RULES = Object.freeze([
  {
    id: "SR-01",
    label: "no-delete-production-data",
    severity: "CRITICAL",
    check: (a) => !a.action?.includes("DELETE") || a.env !== "production",
  },
  {
    id: "SR-02",
    label: "no-commit-credentials",
    severity: "CRITICAL",
    check: (a) =>
      !/(password|secret|key|token)/i.test(JSON.stringify(a.payload ?? {})),
  },
  {
    id: "SR-03",
    label: "no-runaway-loops",
    severity: "HIGH",
    check: (a) => (a.iterationCount ?? 0) < 10000,
  },
  {
    id: "SR-04",
    label: "no-external-calls-unlogged",
    severity: "HIGH",
    check: (a) => a.externalCallLogged !== false,
  },
  {
    id: "SR-05",
    label: "coherence-floor",
    severity: "MEDIUM",
    check: (a) => (a.coherence ?? 1) >= 0.1,
  },
  {
    id: "SR-06",
    label: "architecture-locked",
    severity: "CRITICAL",
    check: (a) =>
      !a.architectureOverride ||
      a.architectureOverride === CANONICAL_ARCHITECTURE,
  },
  {
    id: "SR-07",
    label: "phi-anchor-preserved",
    severity: "MEDIUM",
    check: (a) => !a.phiOverride || Math.abs(a.phiOverride - PHI) < 0.001,
  },
  {
    id: "SR-08",
    label: "no-silent-failures",
    severity: "HIGH",
    check: (a) => a.errorSuppressed !== true,
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// StatusReport — immutable, GeoQode-native output record
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate an immutable GeoQode-native STATUS_REPORT for an agent output.
 *
 * @param {object} params
 * @param {string} params.agentId
 * @param {string} params.state          — "active" | "idle" | "complete" | "error"
 * @param {object} [params.output]       — Agent's raw output object
 * @param {object} [params.geoqode]      — Pre-built GeoQode coordinate (or built here)
 * @param {string[]} [params.violations] — Rule ids that fired
 * @returns {string} JSON string (immutable)
 */
export function generateStatusReport({
  agentId,
  state,
  output = {},
  geoqode,
  violations = [],
}) {
  const coord =
    geoqode ??
    buildGeoCoordinate({
      domain: output.domain ?? "self-evolve",
      sector: output.sector ?? 5,
      confidence: output.coherence ?? 0.95,
      source: `governance:${agentId}`,
      semanticType: output.semanticType ?? "HOLOGRAPHIC",
    });

  const report = Object.freeze({
    reportType: "MERKABA480_STATUS_REPORT",
    agentId,
    timestamp: new Date().toISOString(),
    state,
    certified: violations.length === 0,
    violations,
    architectureSignature: CANONICAL_ARCHITECTURE,
    architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
    phiAnchor: PHI,
    psiAnchor: PSI,
    baseFrequencyHz: BASE_FREQUENCY_HZ,
    geoqode: coord,
    outputSummary: {
      keys: Object.keys(output),
      coherence: output.coherence ?? coord.coherence,
      frequency: coord.frequency,
      semanticType: coord.semanticType,
    },
  });

  return JSON.stringify(report);
}

// ─────────────────────────────────────────────────────────────────────────────
// GovernanceBoard — compliance certifier for all agent outputs
// ─────────────────────────────────────────────────────────────────────────────

export class GovernanceBoard extends EventEmitter {
  /**
   * @param {object} opts
   * @param {number} [opts.ringBufferSize=1000] — Max reports to keep in memory
   * @param {string} [opts.boardId="primary"]
   */
  constructor({ ringBufferSize = 1000, boardId = "primary" } = {}) {
    super();
    this.boardId = boardId;
    this._ringBufferSize = ringBufferSize;
    this._reports = []; // ring buffer of raw report JSON strings
    this._certifiedCount = 0;
    this._rejectedCount = 0;
    this._startedAt = Date.now();

    this.emit("governance:boot", {
      event: "governance:boot",
      boardId,
      rules: SAFETY_RULES.length,
      geoqode: buildGeoCoordinate({
        domain: "security-forge",
        sector: 8,
        confidence: 1.0,
        source: `governance:${boardId}`,
        semanticType: "PHYSICS",
      }),
    });
  }

  /**
   * Evaluate an agent output against all safety rules.
   * Returns { passed: boolean, violations: string[] }.
   */
  evaluate(agentOutput) {
    const violations = [];
    for (const rule of SAFETY_RULES) {
      try {
        if (!rule.check(agentOutput))
          violations.push(`${rule.id}:${rule.label}`);
      } catch {
        violations.push(`${rule.id}:eval-error`);
      }
    }
    return { passed: violations.length === 0, violations };
  }

  /**
   * Certify an agent output: evaluate → generate STATUS_REPORT → emit event → store.
   *
   * @param {object} agentOutput — Must have { id, timestamp }.  Any additional fields
   *   are used by safety rules and GeoQode tagging.
   * @returns {object} { certified, reportJson, violations, geoqode }
   */
  certify(agentOutput) {
    if (!agentOutput?.id)
      throw new Error("[GovernanceBoard] agentOutput.id is required");

    const { passed, violations } = this.evaluate(agentOutput);
    const geoqode = buildGeoCoordinate({
      domain: agentOutput.domain ?? "security-forge",
      sector: agentOutput.sector ?? 8,
      confidence: passed ? 0.98 : 0.4,
      source: `governance-board:${this.boardId}`,
      semanticType: "PHYSICS",
    });

    const reportJson = generateStatusReport({
      agentId: agentOutput.id,
      state: agentOutput.state ?? "complete",
      output: agentOutput,
      geoqode,
      violations,
    });

    // Append to ring buffer (evict oldest when full)
    if (this._reports.length >= this._ringBufferSize) this._reports.shift();
    this._reports.push(reportJson);

    if (passed) {
      this._certifiedCount++;
    } else {
      this._rejectedCount++;
    }

    const result = { certified: passed, reportJson, violations, geoqode };

    this.emit("agent:certified", {
      event: "agent:certified",
      agentId: agentOutput.id,
      certified: passed,
      violations,
      geoqode,
    });

    return result;
  }

  /**
   * Batch-certify an array of agent outputs.
   * Returns array of certification results.
   */
  certifyBatch(outputs) {
    return outputs.map((o) => this.certify(o));
  }

  /**
   * Retrieve the last N reports from the ring buffer as parsed objects.
   */
  getReports(n = 10) {
    return this._reports.slice(-n).map((r) => JSON.parse(r));
  }

  /**
   * Governance status snapshot (GeoQode-native).
   */
  statusSnapshot() {
    const total = this._certifiedCount + this._rejectedCount;
    const certRate =
      total > 0 ? +(this._certifiedCount / total).toFixed(4) : 1.0;
    return {
      reportType: "GOVERNANCE_STATUS",
      boardId: this.boardId,
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      totalCertified: this._certifiedCount,
      totalRejected: this._rejectedCount,
      certificationRate: certRate,
      reportsInBuffer: this._reports.length,
      uptimeMs: Date.now() - this._startedAt,
      safetyRules: SAFETY_RULES.length,
      phiAnchor: PHI,
      geoqode: buildGeoCoordinate({
        domain: "security-forge",
        sector: 8,
        confidence: certRate,
        source: `governance-board:${this.boardId}`,
        semanticType: "PHYSICS",
      }),
    };
  }
}
