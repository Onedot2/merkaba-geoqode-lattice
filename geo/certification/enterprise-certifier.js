// geo/certification/enterprise-certifier.js
// Phase 7: Enterprise Certification Framework
// Full 44-dimension MERKABA lattice certification with audit trail and compliance reports.

import crypto from "crypto";
import { QBITSValidator } from "../validation/qbits-validator.js";

// Complete 44-dimension MERKABA lattice definition
export const MERKABA_LATTICE = {
  // Tier 1: Core Foundations (1-11)
  1: { tier: 1, name: "Syntax Compliance", required: true },
  2: { tier: 1, name: "Token Integrity", required: true },
  3: { tier: 1, name: "AST Validity", required: true },
  4: { tier: 1, name: "Operator Binding", required: true },
  5: { tier: 1, name: "Scope Resolution", required: true },
  6: { tier: 1, name: "Type Coherence", required: false },
  7: { tier: 1, name: "Literal Integrity", required: false },
  8: { tier: 1, name: "Null Safety", required: false },
  9: { tier: 1, name: "Encoding Compliance", required: false },
  10: { tier: 1, name: "Comment Preservation", required: false },
  11: { tier: 1, name: "EOF Handling", required: false },

  // Tier 2: Operational Systems (12-22)
  12: { tier: 2, name: "Node Emission", required: true },
  13: { tier: 2, name: "Spectral Binding", required: false },
  14: { tier: 2, name: "Detection Field", required: true },
  15: { tier: 2, name: "Duality Resolution", required: false },
  16: { tier: 2, name: "Octahedron Field", required: true },
  17: { tier: 2, name: "Harmonic Coupling", required: false },
  18: { tier: 2, name: "Execution Logging", required: true },
  19: { tier: 2, name: "Error Propagation", required: false },
  20: { tier: 2, name: "Resource Cleanup", required: true },
  21: { tier: 2, name: "State Persistence", required: false },
  22: { tier: 2, name: "Event Emission", required: false },

  // Tier 3: Knowledge Dimensions (23-33)
  23: { tier: 3, name: "Playbook Execution", required: true },
  24: { tier: 3, name: "Step Sequencing", required: false },
  25: { tier: 3, name: "Trigger Binding", required: true },
  26: { tier: 3, name: "Action Dispatch", required: false },
  27: { tier: 3, name: "Metric Recording", required: true },
  28: { tier: 3, name: "Pattern Matching", required: false },
  29: { tier: 3, name: "Condition Evaluation", required: true },
  30: { tier: 3, name: "Loop Integrity", required: false },
  31: { tier: 3, name: "Playbook Chaining", required: true },
  32: { tier: 3, name: "Context Propagation", required: false },
  33: { tier: 3, name: "Knowledge Persistence", required: false },

  // Tier 4: Emergent Dimensions (34-44)
  34: { tier: 4, name: "QBITS Materialization", required: true },
  35: { tier: 4, name: "Frequency Validation", required: true },
  36: { tier: 4, name: "Harmonic Series", required: false },
  37: { tier: 4, name: "Crystallization", required: true },
  38: { tier: 4, name: "Cymatic Pattern", required: false },
  39: { tier: 4, name: "Water Memory", required: false },
  40: { tier: 4, name: "Sonic Driver", required: true },
  41: { tier: 4, name: "Quantum Resonance", required: true },
  42: { tier: 4, name: "Field Coherence", required: false },
  43: { tier: 4, name: "Emergence Detection", required: false },
  44: { tier: 4, name: "Crown Certification", required: true },
};

const REQUIRED_DIMENSIONS = Object.entries(MERKABA_LATTICE)
  .filter(([, v]) => v.required)
  .map(([k]) => Number(k));

/**
 * EnterpriseCertifier — certifies GeoQode programs against the full 44-dimension lattice.
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
   * Certify a program execution against the 44-dimension MERKABA lattice.
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
        total: 44,
        coverage: `${((achievedDimensions.size / 44) * 100).toFixed(1)}%`,
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
      latticeSize: 44,
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
      if (dim === 18) pass = Boolean(state.executionLogging);
      if (dim === 1) pass = Boolean(state.syntaxValidation);
      if (dim === 12) pass = (exec.result?.emissions || 0) > 0;
      if (dim === 14) pass = (exec.result?.detections || 0) > 0;
      if (dim === 34 || dim === 37 || dim === 40) {
        pass = (exec.result?.qbits || 0) > 0;
      }
      if (dim === 44) {
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
    if (score >= 95 && achievedCount >= 40) return "CROWN"; // All 4 tiers activated
    if (score >= 80 && achievedCount >= 33) return "ENTERPRISE";
    if (score >= 60 && achievedCount >= 22) return "PROFESSIONAL";
    if (score >= 40) return "BASIC";
    return "FAILED";
  }

  _tierSummary(achieved) {
    const tiers = {
      1: { achieved: 0, total: 11 },
      2: { achieved: 0, total: 11 },
      3: { achieved: 0, total: 11 },
      4: { achieved: 0, total: 11 },
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
