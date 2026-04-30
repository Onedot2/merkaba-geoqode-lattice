// geo/certification/enterprise-certifier.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// Phase 7: Enterprise Certification Framework
// Full 48-dimension canonical MERKABA lattice certification with audit trail and compliance reports.

import crypto from "crypto";
import { QBITSValidator } from "../validation/qbits-validator.js";

// Complete 48-dimension canonical MERKABA lattice definition
export const MERKABA_LATTICE = Object.freeze({
  // Tier 1: Core Foundations (1-12)
  1: { tier: 1, name: "Syntax Compliance", required: true },
  2: { tier: 1, name: "Token Integrity", required: true },
  3: { tier: 1, name: "AST Validity", required: true },
  4: { tier: 1, name: "Operator Binding", required: true },
  5: { tier: 1, name: "Scope Resolution", required: true },
  6: { tier: 1, name: "Type Coherence", required: false },
  7: { tier: 1, name: "Literal Integrity", required: false },
  8: { tier: 1, name: "Foundation Anchor", required: true },
  9: { tier: 1, name: "Encoding Compliance", required: false },
  10: { tier: 1, name: "Comment Preservation", required: false },
  11: { tier: 1, name: "EOF Handling", required: false },
  12: { tier: 1, name: "Foundation Redundancy", required: false },

  // Tier 2: Operational Systems (13-24)
  13: { tier: 2, name: "Node Emission", required: true },
  14: { tier: 2, name: "Spectral Binding", required: false },
  15: { tier: 2, name: "Detection Field", required: true },
  16: { tier: 2, name: "Duality Resolution", required: false },
  17: { tier: 2, name: "Octahedron Field", required: true },
  18: { tier: 2, name: "Harmonic Coupling", required: false },
  19: { tier: 2, name: "Execution Logging", required: true },
  20: { tier: 2, name: "Error Propagation", required: false },
  21: { tier: 2, name: "Resource Cleanup", required: true },
  22: { tier: 2, name: "State Persistence", required: false },
  23: { tier: 2, name: "Event Emission", required: false },
  24: { tier: 2, name: "Bridge Telemetry", required: false },

  // Tier 3: Knowledge Dimensions (25-36)
  25: { tier: 3, name: "Playbook Execution", required: true },
  26: { tier: 3, name: "Bosonic Anchor", required: true },
  27: { tier: 3, name: "Trigger Binding", required: true },
  28: { tier: 3, name: "Action Dispatch", required: false },
  29: { tier: 3, name: "Metric Recording", required: true },
  30: { tier: 3, name: "Pattern Matching", required: false },
  31: { tier: 3, name: "Condition Evaluation", required: true },
  32: { tier: 3, name: "Loop Integrity", required: false },
  33: { tier: 3, name: "Playbook Chaining", required: true },
  34: { tier: 3, name: "Context Propagation", required: false },
  35: { tier: 3, name: "Knowledge Persistence", required: false },
  36: { tier: 3, name: "Subsystem Collapse Ledger", required: false },

  // Tier 4: Emergent Dimensions (37-48)
  37: { tier: 4, name: "QBITS Materialization", required: true },
  38: { tier: 4, name: "Frequency Validation", required: true },
  39: { tier: 4, name: "Harmonic Series", required: false },
  40: { tier: 4, name: "Crystallization", required: true },
  41: { tier: 4, name: "Cymatic Pattern", required: false },
  42: { tier: 4, name: "Water Memory", required: false },
  43: { tier: 4, name: "Sonic Driver", required: true },
  44: { tier: 4, name: "Quantum Resonance", required: true },
  45: { tier: 4, name: "Golden Bridge Layer", required: true },
  46: { tier: 4, name: "Interference Mitigation", required: true },
  47: { tier: 4, name: "Business Overlay Integration", required: false },
  48: { tier: 4, name: "Resonance Certificate v3", required: true },
});

const REQUIRED_DIMENSIONS = Object.entries(MERKABA_LATTICE)
  .filter(([, v]) => v.required)
  .map(([k]) => Number(k));

/**
 * EnterpriseCertifier — certifies GeoQode programs against the full 48-dimension canonical lattice.
 *
 * Usage:
 *   const certifier = new EnterpriseCertifier();
 *   const cert = certifier.certify(executionResult, complianceReport);
 *   certifier.getCertificate(cert.certId);
 */
export class EnterpriseCertifier {
  constructor() {
    this.registry = new Map(); // certId → certificate
    this.qbitsValidator = new QBITSValidator();
    this.issuedCount = 0;
    this.revokedCount = 0;
  }

  /**
   * Certify a program execution against the 48-dimension canonical MERKABA lattice.
   * @param {object} executionResult - Result from ExecutionEngine.execute()
   * @param {object} complianceReport - Result from ComplianceValidator.getComplianceReport()
   * @param {object} meta - Optional program metadata
   */
  certify(executionResult, complianceReport, meta = {}) {
    const certId = this._generateCertId();
    const timestamp = Date.now();

    // Map achieved dimensions
    const achievedDimensions = new Set(
      complianceReport?.merkabaDimensions || [],
    );

    // Evaluate each dimension
    const dimensionReport = this._evaluateDimensions(
      executionResult,
      complianceReport,
      achievedDimensions,
    );

    // Check required dimensions
    const missingRequired = REQUIRED_DIMENSIONS.filter(
      (d) => !achievedDimensions.has(d),
    );
    const requiredSatisfied = missingRequired.length === 0;

    // Score: weighted by tier
    const score = this._computeScore(dimensionReport);

    // Determine certification level
    const level = this._certificationLevel(
      score,
      requiredSatisfied,
      achievedDimensions.size,
    );

    // Fingerprint
    const fingerprint = this._fingerprint(
      executionResult,
      complianceReport,
      timestamp,
    );

    const certificate = {
      certId,
      level,
      score,
      certified: level !== "FAILED",
      timestamp,
      issuedAt: new Date(timestamp).toISOString(),
      expiresAt: new Date(timestamp + 365 * 24 * 60 * 60 * 1000).toISOString(),
      programMeta: meta,
      dimensionSummary: {
        achieved: achievedDimensions.size,
        total: 48,
        coverage: `${((achievedDimensions.size / 48) * 100).toFixed(1)}%`,
        missingRequired,
        tiers: this._tierSummary(achievedDimensions),
      },
      dimensionReport,
      fingerprint,
      auditTrailHash: crypto
        .createHash("sha256")
        .update(JSON.stringify({ certId, fingerprint, score, level }))
        .digest("hex"),
    };

    this.registry.set(certId, certificate);
    this.issuedCount++;

    return certificate;
  }

  /**
   * Look up a certificate by ID.
   */
  getCertificate(certId) {
    return this.registry.get(certId) || null;
  }

  /**
   * Verify a certificate is still valid (not expired, not revoked).
   */
  verifyCertificate(certId) {
    const cert = this.registry.get(certId);
    if (!cert) return { valid: false, reason: "Certificate not found" };
    if (cert.revoked) return { valid: false, reason: "Certificate revoked" };
    if (Date.now() > new Date(cert.expiresAt).getTime()) {
      return { valid: false, reason: "Certificate expired" };
    }
    return { valid: true, cert };
  }

  /**
   * Revoke a certificate.
   */
  revoke(certId, reason = "Manual revocation") {
    const cert = this.registry.get(certId);
    if (!cert) throw new Error(`Certificate ${certId} not found`);
    cert.revoked = true;
    cert.revokedAt = new Date().toISOString();
    cert.revokeReason = reason;
    this.revokedCount++;
    return cert;
  }

  /**
   * Get registry stats.
   */
  getRegistryStats() {
    return {
      issued: this.issuedCount,
      revoked: this.revokedCount,
      active: this.issuedCount - this.revokedCount,
      latticeSize: 48,
      requiredDimensions: REQUIRED_DIMENSIONS.length,
    };
  }

  /**
   * Generate a full compliance report for the certifier session.
   */
  generateReport() {
    const certs = Array.from(this.registry.values());
    const byLevel = {};
    for (const c of certs) {
      byLevel[c.level] = (byLevel[c.level] || 0) + 1;
    }

    return {
      generatedAt: new Date().toISOString(),
      registry: this.getRegistryStats(),
      certificationLevels: byLevel,
      avgScore:
        certs.length > 0
          ? Math.round(certs.reduce((s, c) => s + c.score, 0) / certs.length)
          : 0,
    };
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _generateCertId() {
    return `MERKABA-CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }

  _evaluateDimensions(execResult, complianceReport, achieved) {
    const report = {};
    const state = complianceReport?.complianceState || {};
    const exec = execResult || {};

    for (const [dimStr, dimInfo] of Object.entries(MERKABA_LATTICE)) {
      const dim = Number(dimStr);
      let pass = achieved.has(dim);

      // Fine-grained checks for key dimensions
      if (dim === 19) pass = Boolean(state.executionLogging);
      if (dim === 1) pass = Boolean(state.syntaxValidation);
      if (dim === 13) pass = (exec.result?.emissions || 0) > 0;
      if (dim === 15) pass = (exec.result?.detections || 0) > 0;
      if (dim === 26) pass = achieved.has(26) || Boolean(state.auditability);
      if (dim === 37 || dim === 40 || dim === 43) {
        pass = (exec.result?.qbits || 0) > 0;
      }
      if (dim === 45) pass = Boolean(state.auditability);
      if (dim === 46) pass = state.incidentResponse !== undefined;
      if (dim === 48) {
        pass =
          Boolean(state.certifiability) ||
          complianceReport?.allCompliant === true;
      }

      report[dim] = {
        ...dimInfo,
        dimension: dim,
        pass,
        status: pass ? "✅" : dimInfo.required ? "❌" : "⬜",
      };
    }

    return report;
  }

  _computeScore(dimReport) {
    const tierWeights = { 1: 1.0, 2: 1.5, 3: 2.0, 4: 2.5 };
    let earned = 0;
    let max = 0;

    for (const [, d] of Object.entries(dimReport)) {
      const w = tierWeights[d.tier] || 1;
      max += w;
      if (d.pass) earned += w;
    }

    return Math.round((earned / max) * 100);
  }

  _certificationLevel(score, requiredSatisfied, achievedCount) {
    if (!requiredSatisfied || score < 40) return "FAILED";
    if (score >= 95 && achievedCount >= 44) return "CROWN";
    if (score >= 85 && achievedCount >= 36) return "ENTERPRISE";
    if (score >= 65 && achievedCount >= 24) return "PROFESSIONAL";
    if (score >= 40) return "BASIC";
    return "FAILED";
  }

  _tierSummary(achieved) {
    const tiers = {
      1: { achieved: 0, total: 12 },
      2: { achieved: 0, total: 12 },
      3: { achieved: 0, total: 12 },
      4: { achieved: 0, total: 12 },
    };
    for (const dim of achieved) {
      const info = MERKABA_LATTICE[dim];
      if (info) tiers[info.tier].achieved++;
    }
    return tiers;
  }

  _fingerprint(execResult, complianceReport, timestamp) {
    const data = {
      emissions: execResult?.result?.emissions ?? 0,
      detections: execResult?.result?.detections ?? 0,
      qbits: execResult?.result?.qbits ?? 0,
      dimensions: complianceReport?.merkabaDimensions ?? [],
      timestamp,
    };
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }
}

export default EnterpriseCertifier;
