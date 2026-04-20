// geo/runtime/execution-engine.js
// GeoQode Execution Engine — orchestrates parser, runtime, and compliance

import { Parser } from "../grammar/parser.js";
import { InnerOctahedron } from "./octahedron.js";
import { NodePool } from "./node.js";
import { WaterPool } from "./water.js";
import { ComplianceValidator } from "./compliance.js";

export class ExecutionEngine {
  constructor() {
    this.octahedron = new InnerOctahedron();
    this.nodePool = new NodePool(10);
    this.waterPool = new WaterPool(1000);
    this.compliance = new ComplianceValidator();
    this.executionResult = null;
    this.statusReport = null;
  }

  /**
   * Execute a GeoQode program
   */
  async execute(source) {
    try {
      // 1. Parse
      const parser = new Parser(source);
      const ast = parser.parse();

      // 2. Validate syntax
      if (!this.compliance.validateSyntax(ast)) {
        throw new Error("Syntax validation failed");
      }

      // 3. Activate octahedron field
      this.octahedron.activate();

      // 4. Execute program
      const result = await this.executeAST(ast);

      // 4b. Log execution (required for executionLogging compliance flag)
      this.compliance.logExecution({
        programName: ast.statements?.[0]?.value ?? "unknown",
        emissions: result.emissions,
        detections: result.detections,
        qbits: result.qbits,
        playbooks: result.playbooks,
        logCount: result.logs.length,
      });

      // 5. Validate compliance
      const auditHash = this.compliance.generateAuditHash(result);
      const dimensions = this.compliance.mapToMerkabaDimensions({
        hasEmission: result.emissions > 0,
        hasDetection: result.detections > 0,
        hasPlaybook: result.playbooks > 0,
        hasQBIT: result.qbits > 0,
      });

      // 6. Certify program
      const certification = this.compliance.certifyProgram(
        ast,
        auditHash,
        dimensions,
      );

      // 7. Generate status report
      this.generateStatusReport(result, certification);

      // 8. Deactivate octahedron
      this.octahedron.deactivate();

      this.executionResult = result;
      return {
        success: true,
        result,
        certification,
        statusReport: this.statusReport,
      };
    } catch (error) {
      console.error(`Execution error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Execute AST nodes
   */
  async executeAST(ast) {
    const result = {
      timestamp: Date.now(),
      emissions: 0,
      detections: 0,
      qbits: 0,
      playbooks: 0,
      logs: [],
    };

    for (const statement of ast.statements || []) {
      if (statement.type === "PROGRAM") {
        result.logs.push(`Executing program: ${statement.value}`);

        for (const stmt of statement.statements) {
          await this.executeStatement(stmt, result);
        }
      } else if (statement.type === "PLAYBOOK") {
        result.playbooks++;
        result.logs.push(`Executing playbook: ${statement.value}`);

        for (const step of statement.steps) {
          await this.executeStatement(step, result);
        }
      }
    }

    return result;
  }

  /**
   * Execute individual statement
   */
  async executeStatement(stmt, result) {
    if (!stmt) return;

    if (stmt.type === "EMIT_STMT") {
      const node = this.nodePool.getActiveNode();
      const color = stmt.chromodynamic?.value || "unknown";
      const harmonic = parseFloat(stmt.harmonic?.value || "1");

      node.emit(color, harmonic);
      this.octahedron.emit(color, harmonic);
      result.emissions++;
      result.logs.push(`Emitted ${color} spectrum at Φ[${harmonic}]`);
    } else if (stmt.type === "DETECT_STMT") {
      const node = this.nodePool.getActiveNode();
      const hasDuality = stmt.duality !== null;
      const hasOctahedron = stmt.octahedron !== null;

      node.detect(hasDuality, hasOctahedron);
      this.octahedron.detect(hasDuality, hasOctahedron);
      result.detections++;
      result.logs.push(
        `Detected duality=${hasDuality}, octahedron=${hasOctahedron}`,
      );
    } else if (stmt.type === "QBIT_STMT") {
      const frequency = stmt.frequency?.value || "528Hz";
      const harmonic = parseFloat(stmt.harmonic?.value || "1");

      const water = this.waterPool.materializeQBIT(frequency, harmonic);
      water.crystallize();
      result.qbits++;
      result.logs.push(`Materialized QBITS at ${frequency}, Φ[${harmonic}]`);
    } else if (stmt.type === "LOG_STMT") {
      result.logs.push(stmt.message);
      console.log(stmt.message);
    }
  }

  /**
   * Generate STATUS_REPORT
   */
  generateStatusReport(result, certification) {
    const complianceReport = this.compliance.getComplianceReport();
    const octahedronState = this.octahedron.getState();
    const waterStats = this.waterPool.getStats();

    this.statusReport = {
      timestamp: Date.now(),
      date: new Date().toISOString().split("T")[0],
      cycleId: `CYCLE-${Date.now()}`,
      generatedBy: "MERKABA System",
      programExecution: {
        success: true,
        emissions: result.emissions,
        detections: result.detections,
        qbits: result.qbits,
        playbooks: result.playbooks,
      },
      compliance: complianceReport,
      certification,
      octahedronState,
      waterStats,
      logs: result.logs,
    };

    return this.statusReport;
  }

  /**
   * Get execution result
   */
  getResult() {
    return this.executionResult;
  }

  /**
   * Get status report
   */
  getStatusReport() {
    return this.statusReport;
  }

  /**
   * Reset engine
   */
  reset() {
    this.octahedron.reset();
    this.nodePool.resetAll();
    this.waterPool.reset();
    this.compliance = new ComplianceValidator();
    this.executionResult = null;
    this.statusReport = null;
  }
}
