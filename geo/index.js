// geo/index.js
// MERKABA_geoqode OS — Main Entry Point

import { Parser } from "./grammar/parser.js";
import { ExecutionEngine } from "./runtime/execution-engine.js";

// Phase 4
export { MerkabaBridge } from "./bridge/merkaba-bridge.js";
export { StormAdapter } from "./bridge/storm-adapter.js";

// Phase 5
export { ExecutionCluster } from "./distributed/cluster.js";
export { DistributedCoordinator } from "./distributed/coordinator.js";

// Phase 6
export {
  QBITSValidator,
  SACRED_FREQUENCIES,
  VALID_HARMONICS,
  VALID_TRANSITIONS,
} from "./validation/qbits-validator.js";

// Phase 7
export {
  EnterpriseCertifier,
  MERKABA_LATTICE,
} from "./certification/enterprise-certifier.js";
export { AuditTrail } from "./certification/audit-trail.js";
export {
  GEOQODE_STDLIB,
  SACRED_COLOR_SPECTRUM,
  STDLIB_FREQUENCIES,
  getStdlibConstant,
} from "./stdlib/index.js";

/**
 * MERKABA_geoqode Operating System
 * Dedicated AI OS for GeoQode program execution
 */
export class MerkabageoqodeOS {
  constructor() {
    this.engine = new ExecutionEngine();
    this.version = "1.0.0";
    this.name = "MERKABA_geoqode OS";
  }

  /**
   * Parse GeoQode source
   */
  parse(source) {
    const parser = new Parser(source);
    return parser.parse();
  }

  /**
   * Execute GeoQode program
   */
  async run(source) {
    return await this.engine.execute(source);
  }

  /**
   * Get status report
   */
  getStatusReport() {
    return this.engine.getStatusReport();
  }

  /**
   * Get execution result
   */
  getResult() {
    return this.engine.getResult();
  }

  /**
   * Reset OS state
   */
  reset() {
    this.engine.reset();
  }

  /**
   * Get system info
   */
  getSystemInfo() {
    return {
      name: this.name,
      version: this.version,
      engineReady: !!this.engine,
      lastStatusReport: this.engine.getStatusReport(),
    };
  }
}

// Default export
export default MerkabageoqodeOS;
