// geo/runtime/execution-engine.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// GeoQode Execution Engine — orchestrates parser, runtime, and compliance

import { Parser } from "../grammar/parser.js";
import { InnerOctahedron } from "./octahedron.js";
import { NodePool } from "./node.js";
import { WaterPool } from "./water.js";
import { ComplianceValidator } from "./compliance.js";
import { LatticeScheduler } from "./lattice-scheduler.js";
import {
  createUnifiedIntegrationAdapters,
  resolveAdapterMode,
} from "./integration-adapters.js";

export class ExecutionEngine {
  constructor(options = {}) {
    const schedulerMode = String(
      options.schedulerMode || process.env.MERKABA_SCHEDULER_MODE || "legacy",
    ).toLowerCase();
    const integrationMode = resolveAdapterMode(
      options.integrationMode || process.env.MERKABA_INTEGRATION_MODE || "off",
    );
    const lowOverheadBaseMode = resolveAdapterMode(
      options.lowOverheadBaseMode ||
        process.env.MERKABA_LOW_OVERHEAD_BASE_MODE ||
        "real",
    );
    const adapterProviderMode = this.resolveAdapterProviderMode(
      integrationMode,
      lowOverheadBaseMode,
    );

    this.octahedron = new InnerOctahedron();
    this.nodePool = new NodePool(10);
    this.waterPool = new WaterPool(1000);
    this.compliance = new ComplianceValidator();
    this.schedulerMode = schedulerMode;
    this.integrationMode = integrationMode;
    this.lowOverheadBaseMode = lowOverheadBaseMode;
    this.adapterProviderMode = adapterProviderMode;
    this.integrationAdapters = options.integrationAdapters || null;
    this.scheduler = new LatticeScheduler({
      mode: this.schedulerMode,
      integrationMode: this.integrationMode,
      adapters: this.integrationAdapters,
      enableAdaptiveLowOverhead:
        options.enableAdaptiveLowOverhead !== undefined
          ? options.enableAdaptiveLowOverhead
          : String(
              process.env.MERKABA_ADAPTER_ADAPTIVE_LOW_OVERHEAD || "true",
            ).toLowerCase() !== "false",
      adapterTargetSampleLatencyMs:
        options.adapterTargetSampleLatencyMs ||
        process.env.MERKABA_ADAPTER_TARGET_SAMPLE_LATENCY_MS ||
        "0.2",
      adapterShadowMaxBusyRate:
        options.adapterShadowMaxBusyRate ||
        process.env.MERKABA_ADAPTER_SHADOW_MAX_BUSY_RATE ||
        "0.2",
      adapterCacheDecisionTTL:
        options.adapterCacheDecisionTTL ||
        process.env.MERKABA_ADAPTER_CACHE_DECISION_TTL ||
        "96",
      adapterSampleEveryN:
        options.adapterSampleEveryN ||
        process.env.MERKABA_ADAPTER_SAMPLE_EVERY_N ||
        "16",
      adapterShadowEveryN:
        options.adapterShadowEveryN ||
        process.env.MERKABA_ADAPTER_SHADOW_EVERY_N ||
        "32",
    });
    this.silent = options.silent === true;
    this.executionResult = null;
    this.statusReport = null;
  }

  resolveAdapterProviderMode(integrationMode, lowOverheadBaseMode) {
    if (integrationMode === "low-overhead") {
      return lowOverheadBaseMode;
    }

    if (integrationMode === "low-overhead-real") {
      return "real";
    }

    if (integrationMode === "low-overhead-simulated") {
      return "simulated";
    }

    return integrationMode;
  }

  async initializeIntegrations(force = false) {
    if (this.integrationAdapters && !force) {
      return this.integrationAdapters;
    }

    this.integrationAdapters = await createUnifiedIntegrationAdapters({
      mode: this.adapterProviderMode,
    });
    this.scheduler.adapters = this.integrationAdapters;
    this.scheduler.setIntegrationMode(this.integrationMode);
    return this.integrationAdapters;
  }

  setSchedulerMode(mode) {
    this.schedulerMode = String(mode || "legacy").toLowerCase();
    this.scheduler.setMode(this.schedulerMode);
  }

  setIntegrationMode(mode) {
    this.integrationMode = resolveAdapterMode(mode);
    this.adapterProviderMode = this.resolveAdapterProviderMode(
      this.integrationMode,
      this.lowOverheadBaseMode,
    );
    this.scheduler.setIntegrationMode(this.integrationMode);
  }

  setLowOverheadBaseMode(mode) {
    this.lowOverheadBaseMode = resolveAdapterMode(mode || "real");
    this.adapterProviderMode = this.resolveAdapterProviderMode(
      this.integrationMode,
      this.lowOverheadBaseMode,
    );
  }

  log(...args) {
    if (!this.silent) {
      console.log(...args);
    }
  }

  /**
   * Execute a GeoQode program
   */
  async execute(source, options = {}) {
    try {
      let modeChanged = false;

      if (options.schedulerMode) {
        this.setSchedulerMode(options.schedulerMode);
      }

      if (options.integrationMode) {
        modeChanged = options.integrationMode !== this.integrationMode;
        this.setIntegrationMode(options.integrationMode);
      }

      if (options.lowOverheadBaseMode) {
        this.setLowOverheadBaseMode(options.lowOverheadBaseMode);
        modeChanged = true;
      }

      this.scheduler.setSamplingConfig({
        sampleEveryN: options.adapterSampleEveryN,
        shadowEveryN: options.adapterShadowEveryN,
      });

      if (options.silent !== undefined) {
        this.silent = options.silent === true;
      }

      await this.initializeIntegrations(modeChanged);
      this.scheduler.resetMetrics();

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

      result.scheduler = this.scheduler.getMetrics();
      result.integration = this.integrationAdapters?.diagnostics?.() || {
        mode: this.integrationMode,
      };

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
    const statements = ast.statements || [];
    const result = {
      timestamp: Date.now(),
      emissions: 0,
      detections: 0,
      qbits: 0,
      playbooks: 0,
      logs: [],
    };

    let stepIndex = 0;
    for (const statement of statements) {
      if (statement.type === "PROGRAM") {
        result.logs.push(`Executing program: ${statement.value}`);

        for (const stmt of statement.statements) {
          const decision = await this.scheduler.decide(stmt, {
            stepIndex,
            cycle: result.timestamp,
            nodePoolSize: this.nodePool.nodes.length,
            waterPoolSize: this.waterPool.molecules.length,
            programSize: statement.statements.length,
          });
          await this.executeStatement(stmt, result, decision);
          stepIndex += 1;
        }
      } else if (statement.type === "PLAYBOOK") {
        result.playbooks++;
        result.logs.push(`Executing playbook: ${statement.value}`);

        for (const step of statement.steps) {
          const decision = await this.scheduler.decide(step, {
            stepIndex,
            cycle: result.timestamp,
            nodePoolSize: this.nodePool.nodes.length,
            waterPoolSize: this.waterPool.molecules.length,
            programSize: statement.steps.length,
          });
          await this.executeStatement(step, result, decision);
          stepIndex += 1;
        }
      }
    }

    return result;
  }

  /**
   * Execute individual statement
   */
  async executeStatement(stmt, result, decision = null) {
    if (!stmt) return;

    if (stmt.type === "EMIT_STMT") {
      if (decision?.nodeIndex !== undefined) {
        this.nodePool.switchNode(decision.nodeIndex);
      }

      const node = this.nodePool.getActiveNode();
      const color = stmt.chromodynamic?.value || "unknown";
      const harmonic = parseFloat(stmt.harmonic?.value || "1");

      node.emit(color, harmonic);
      this.octahedron.emit(color, harmonic);
      result.emissions++;
      result.logs.push(`Emitted ${color} spectrum at Φ[${harmonic}]`);
    } else if (stmt.type === "DETECT_STMT") {
      if (decision?.nodeIndex !== undefined) {
        this.nodePool.switchNode(decision.nodeIndex);
      }

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

      const water = this.waterPool.materializeQBITAt(
        decision?.waterIndex,
        frequency,
        harmonic,
      );
      water.crystallize();
      result.qbits++;
      result.logs.push(`Materialized QBITS at ${frequency}, Φ[${harmonic}]`);
    } else if (stmt.type === "LOG_STMT") {
      result.logs.push(stmt.message);
      this.log(stmt.message);
    } else if (stmt.type === "TRIGGER_STMT") {
      // Execute trigger: evaluate condition and run associated actions
      result.logs.push(`Trigger evaluated: ${stmt.condition || "(compound)"}`);
      for (const action of stmt.actions || []) {
        await this.executeStatement(action, result);
      }
    } else if (stmt.type === "ACTION_STMT") {
      // Execute action: record dispatched action name
      result.logs.push(`Action dispatched: ${stmt.action || "unknown"}`);
      result.actions = (result.actions || 0) + 1;
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
      scheduler: result.scheduler,
      integration: result.integration,
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
    this.scheduler.resetMetrics();
    this.executionResult = null;
    this.statusReport = null;
  }
}
