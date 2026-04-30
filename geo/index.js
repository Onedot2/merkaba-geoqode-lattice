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

// Phase 8 — Canonical 8→26→48:480 resonance architecture
export {
  StormMerkabaTransformCodex,
  MerkabaTransform420,
  DiagnosticOverlay,
  AnchorHierarchy,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  CANONICAL_ARCHITECTURE,
  assertCanonicalArchitectureSignature,
  VISUAL_LATTICE_NODES,
  OPERATIONAL_LATTICE_NODES,
  MAPPING_RATIO,
  COHERENCE_TOLERANCE,
} from "./lattice/transform-420.js";
export { AuditTrail } from "./certification/audit-trail.js";
export {
  GEOQODE_STDLIB,
  SACRED_COLOR_SPECTRUM,
  STDLIB_FREQUENCIES,
  getStdlibConstant,
} from "./stdlib/index.js";

// Phase 9 — Cinema Virtualization (MerkabaTheatre Hollywood update, April 29 2026)
export {
  CinemaVirtualizer,
  CINEMA_PLAYBOOK_REGISTRY,
  PROJECTION_MODES,
} from "./cinema/cinema-virtualizer.js";
export { ScriptParser } from "./cinema/script-parser.js";
export {
  NarrativeEmbedder,
  GENRE_FREQUENCY_MODIFIERS,
} from "./cinema/narrative-embedder.js";
export { CinemaProjector } from "./cinema/cinema-projector.js";

// Phase 9 — Intelligence Layer (Merkaba-LLM + MerkabAware + Diagnostics + Activation Codex)
export {
  MerkabaLLM,
  MERKABA_SEMANTIC_TYPES,
  SEMANTIC_FREQUENCY_MAP,
} from "./intelligence/merkaba-llm.js";
export {
  MerkabAware,
  AWARENESS_LEVELS,
  COHERENCE_THRESHOLDS,
} from "./intelligence/merkaba-aware.js";
export {
  ResonanceDiagnostics,
  runDiagnostics,
  measureDrift,
  measureCoherence,
  measureHarmonicEnergy,
  applyControlLoop,
  measurePhaseDrift,
  propagateResonance,
  PHI_OPERATOR_MAP,
} from "./intelligence/resonance-diagnostics.js";
export {
  ActivationCodex,
  AXIOMS,
  TEMPORAL_CYCLE,
  applyPhi,
  applyEntanglement,
  applyDelta,
  applyCycle,
  universalSpectrum,
  innerOctahedronSurfaceArea,
  amplificationFactor,
  fractalInferenceLines,
  buildFractalSubLattice,
  CLUSTER_DISTRIBUTION,
  dimensionClusterFrequency,
  buildClusteredSubLattice,
  _codexInstance,
} from "./intelligence/merkaba-activation-codex.js";

/**
 * MERKABA_geoqode Operating System
 * Dedicated AI OS for GeoQode program execution
 */
export class MerkabageoqodeOS {
  constructor(options = {}) {
    this.engine = new ExecutionEngine(options.engine || {});
    this.version = "1.0.0";
    this.name = "MERKABA_geoqode Lattice480";
    this.identity = {
      canonicalEngineRepo: "merkaba-geoqode-lattice",
      legacyEngineRepoAlias: "merkaba-geoqode-os",
      launcherUiRepo: "Merkaba48OS",
      architectureSignature: "8→26→48:480",
    };
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
  async run(source, options = {}) {
    return await this.engine.execute(source, options);
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
      identity: this.identity,
      engineReady: !!this.engine,
      schedulerMode: this.engine.schedulerMode,
      integrationMode: this.engine.integrationMode,
      lastStatusReport: this.engine.getStatusReport(),
    };
  }
}

// Default export
export default MerkabageoqodeOS;
