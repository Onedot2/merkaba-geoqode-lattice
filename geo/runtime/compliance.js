// geo/runtime/compliance.js
// Compliance and governance engine for GeoQode

import crypto from "crypto";

const MAX_COMPLIANCE_HISTORY = 10000;

export class ComplianceValidator {
  constructor() {
    this.executionLogs = [];
    this.complianceState = {
      syntaxValidation: false,
      executionLogging: false,
      auditability: false,
      certifiability: false,
      incidentResponse: false,
    };
    this.auditHashes = [];
    this.merkabaDimensions = [];
  }

  /**
   * Validate syntax compliance
   */
  validateSyntax(ast) {
    try {
      if (!ast || !ast.type) {
        throw new Error("Invalid AST structure");
      }

      this.complianceState.syntaxValidation = true;
      this.log("Syntax validation: PASS");
      return true;
    } catch (error) {
      this.complianceState.syntaxValidation = false;
      this.log(`Syntax validation: FAIL - ${error.message}`);
      return false;
    }
  }

  /**
   * Log execution state
   */
  logExecution(executionData) {
    const entry = {
      timestamp: Date.now(),
      ...executionData,
    };

    this.executionLogs.push(entry);
    if (this.executionLogs.length > MAX_COMPLIANCE_HISTORY) {
      this.executionLogs = this.executionLogs.slice(-MAX_COMPLIANCE_HISTORY);
    }
    this.complianceState.executionLogging = true;
    this.log(`Execution logged: ${JSON.stringify(entry)}`);

    return entry;
  }

  /**
   * Generate immutable audit hash
   */
  generateAuditHash(data) {
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");

    this.auditHashes.push({
      timestamp: Date.now(),
      hash,
      dataSize: JSON.stringify(data).length,
    });
    if (this.auditHashes.length > MAX_COMPLIANCE_HISTORY) {
      this.auditHashes = this.auditHashes.slice(-MAX_COMPLIANCE_HISTORY);
    }

    this.complianceState.auditability = true;
    this.log(`Audit hash generated: SHA256:${hash.substring(0, 16)}...`);

    return hash;
  }

  /**
   * Validate reproducibility
   * @param {Array} executionRuns - Multiple execution results to compare
   */
  validateRepeatability(executionRuns) {
    if (executionRuns.length < 2) {
      return {
        repeatable: false,
        reason: "Requires at least 2 execution runs",
      };
    }

    const firstRun = JSON.stringify(executionRuns[0]);
    const allSame = executionRuns.every(
      (run) => JSON.stringify(run) === firstRun,
    );

    return {
      repeatable: allSame,
      runCount: executionRuns.length,
      consistent: allSame
        ? `${executionRuns.length}/${executionRuns.length}`
        : "0/" + executionRuns.length,
    };
  }

  /**
   * Map execution to MERKABA dimensions
   */
  mapToMerkabaDimensions(program) {
    const dimensions = [];

    // Tier 1: Core Foundations (dimensions 1-11)
    if (this.complianceState.syntaxValidation) {
      dimensions.push(1, 2, 3, 4, 5);
    }

    // Tier 2: Operational Systems (dimensions 12-22)
    if (program.hasEmission || program.hasDetection) {
      dimensions.push(12, 14, 16, 18, 20);
    }

    // Tier 3: Knowledge Dimensions (dimensions 23-33)
    if (program.hasPlaybook) {
      dimensions.push(23, 25, 27, 29, 31);
    }

    // Tier 4: Emergent Dimensions (dimensions 34-44)
    if (program.hasQBIT) {
      dimensions.push(34, 37, 40, 41, 44);
    }

    this.merkabaDimensions = dimensions;
    this.log(`Mapped to MERKABA dimensions: [${dimensions.join(", ")}]`);

    return dimensions;
  }

  /**
   * Certify program
   */
  certifyProgram(program, auditHash, merkabaDimensions) {
    const isCertified =
      this.complianceState.syntaxValidation &&
      this.complianceState.executionLogging &&
      this.complianceState.auditability &&
      merkabaDimensions.length > 0;

    if (isCertified) {
      this.complianceState.certifiability = true;
      this.log("Program certified against MERKABA lattice");
    } else {
      this.log("Program certification failed");
    }

    return {
      certified: isCertified,
      programName: program.value,
      auditHash,
      dimensions: merkabaDimensions,
      timestamp: Date.now(),
    };
  }

  /**
   * Detect anomalies and trigger incident response
   */
  detectAnomalies(executionData) {
    const anomalies = [];

    // Check for null/undefined states
    if (!executionData || !executionData.program) {
      anomalies.push("Invalid execution data structure");
    }

    // Check for unexpected values
    if (executionData.resonanceLevel > 2.0) {
      anomalies.push("Resonance level exceeded maximum threshold");
    }

    if (anomalies.length > 0) {
      this.complianceState.incidentResponse = true;
      this.log(`Anomalies detected: ${anomalies.join(", ")}`);
      return {
        anomaliesDetected: true,
        anomalies,
        escalationLevel: anomalies.length >= 3 ? "CRITICAL" : "HIGH",
      };
    }

    return { anomaliesDetected: false, anomalies: [] };
  }

  /**
   * Get full compliance report
   */
  getComplianceReport() {
    return {
      timestamp: Date.now(),
      complianceState: this.complianceState,
      executionLogCount: this.executionLogs.length,
      auditHashCount: this.auditHashes.length,
      merkabaDimensions: this.merkabaDimensions,
      allCompliant:
        this.complianceState.syntaxValidation &&
        this.complianceState.executionLogging &&
        this.complianceState.auditability &&
        this.complianceState.certifiability,
    };
  }

  /**
   * Get all logs
   */
  getLogs() {
    return {
      executionLogs: this.executionLogs,
      auditHashes: this.auditHashes,
    };
  }

  log(message) {
    console.log(`[Compliance] ${message}`);
  }
}
