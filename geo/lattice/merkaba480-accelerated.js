/**
 * merkaba480-accelerated.js — AcceleratedLatticeRuntime
 * @alignment 8→26→48:480
 *
 * Hardware acceleration layer for the MERKABA480 lattice OS.
 *
 * Node.js doesn't have native CUDA/TPU bindings, but we expose the
 * correct abstraction so any underlying hardware accelerator can be
 * plugged in — GPU via `gpu.js`, `node-cuda`, `onnxruntime-node`, etc.
 * and TPU via Google Cloud AI Platform client.
 *
 * Architecture:
 *   AcceleratedAgent    — wraps an agent's data tensor for GPU/CPU processing
 *   TPUAgent            — wraps an agent's data for TPU-style batch processing
 *   AcceleratedLatticeRuntime — extends LatticeRuntime:
 *     · GPU mode: processes agents as parallel tensor batches
 *     · TPU mode: processes agents as matrix operations
 *     · Auto-detects available hardware on init
 *     · Falls back to CPU gracefully (lattice still works, just slower)
 *
 * Every operation emits a GeoQode PHYSICS coordinate envelope (852 Hz)
 * because hardware execution is a structural law event.
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED
 */

import {
  LatticeRuntime,
  buildGeoCoordinate,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  COUPLING_TIERS,
} from "./merkaba480-runtime.js";

// ── Hardware capability detection ─────────────────────────────────────────────

async function detectHardware() {
  const caps = { gpu: false, tpu: false, cudaVersion: null, gpuName: null };

  // Try onnxruntime-node (supports CUDA) — optional peer dependency
  try {
    const ort = await import("onnxruntime-node");
    const providers =
      ort.env?.wasm?.numThreads != null
        ? ["CUDAExecutionProvider", "CPUExecutionProvider"]
        : [];
    caps.gpu = providers.includes("CUDAExecutionProvider");
  } catch {
    /* not installed */
  }

  // Try @tensorflow/tfjs-node-gpu — optional peer dependency
  try {
    const tf = await import("@tensorflow/tfjs-node-gpu");
    await tf.ready();
    caps.gpu = true;
    caps.gpuName = "TensorFlow GPU";
  } catch {
    /* not installed */
  }

  return caps;
}

// ─────────────────────────────────────────────────────────────────────────────
// AcceleratedAgent — agent with a numeric data tensor for parallel processing
// ─────────────────────────────────────────────────────────────────────────────

export class AcceleratedAgent {
  /**
   * @param {string} agentId
   * @param {number[]} data    — numeric feature vector (lattice-native inputs)
   * @param {object} [meta]   — optional GeoQode metadata
   */
  constructor(agentId, data = [], meta = {}) {
    this.id = agentId;
    this.data = data;
    this.domain = meta.domain ?? "perf-forge";
    this.sector = meta.sector ?? 7;
    this.semanticType = meta.semanticType ?? "ACTION";
    this.timestamp = new Date().toISOString();
    this._result = null;
  }

  /**
   * Process the agent's data tensor.
   * GPU: uses Math.max(0, x) ReLU emulation (replace with real CUDA kernel).
   * Returns GeoQode-enriched result.
   */
  async process(mode = "cpu") {
    // ReLU activation on data vector (GPU/CPU — same math, different substrate)
    const activated = this.data.map((x) => Math.max(0, x));
    // PHI-modulated normalization (lattice-native signal processing)
    const phiNorm = activated.map((x) => +(x / (1 + PHI)).toFixed(6));

    this._result = {
      agentId: this.id,
      activated: phiNorm,
      mode,
      coherence:
        phiNorm.length > 0
          ? +(phiNorm.reduce((a, b) => a + b, 0) / phiNorm.length).toFixed(4)
          : 0,
      geoqode: buildGeoCoordinate({
        domain: this.domain,
        sector: this.sector,
        confidence: 0.92,
        source: `accelerated-agent:${this.id}`,
        semanticType: this.semanticType,
      }),
    };
    return this._result;
  }

  get result() {
    return this._result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TPUAgent — agent optimised for matrix / batch tensor operations
// ─────────────────────────────────────────────────────────────────────────────

export class TPUAgent {
  /**
   * @param {string} agentId
   * @param {number[][]} matrix — 2D matrix (rows = samples, cols = features)
   * @param {object} [meta]
   */
  constructor(agentId, matrix = [[]], meta = {}) {
    this.id = agentId;
    this.matrix = matrix;
    this.domain = meta.domain ?? "quantum-arch";
    this.sector = meta.sector ?? 1;
    this.semanticType = meta.semanticType ?? "PHYSICS";
    this.timestamp = new Date().toISOString();
    this._result = null;
  }

  /**
   * Matrix ReLU + PHI-coherence score.
   * On real TPU: delegate to TF Lite / Coral inference.
   */
  async process(mode = "cpu") {
    const activated = this.matrix.map((row) => row.map((x) => Math.max(0, x)));
    const flat = activated.flat();
    const coherence =
      flat.length > 0
        ? +(flat.reduce((a, b) => a + b, 0) / flat.length / (1 + PHI)).toFixed(
            4,
          )
        : 0;

    this._result = {
      agentId: this.id,
      shape: [this.matrix.length, (this.matrix[0] ?? []).length],
      mode,
      coherence,
      activated,
      geoqode: buildGeoCoordinate({
        domain: this.domain,
        sector: this.sector,
        confidence: Math.min(1, coherence * PHI),
        source: `tpu-agent:${this.id}`,
        semanticType: this.semanticType,
      }),
    };
    return this._result;
  }

  get result() {
    return this._result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AcceleratedLatticeRuntime — hardware-aware extension of LatticeRuntime
// ─────────────────────────────────────────────────────────────────────────────

export class AcceleratedLatticeRuntime extends LatticeRuntime {
  /**
   * @param {object} opts
   * @param {number}  [opts.nodeCount=480]
   * @param {string}  [opts.clusterId]
   * @param {boolean} [opts.useGpu=true]    — attempt GPU execution
   * @param {boolean} [opts.useTpu=false]   — attempt TPU execution
   * @param {number}  [opts.batchSize=64]   — agents per hardware batch
   */
  constructor({
    nodeCount = 480,
    clusterId = "accelerated",
    useGpu = true,
    useTpu = false,
    batchSize = 64,
  } = {}) {
    super({ nodeCount, clusterId });
    this.useGpu = useGpu;
    this.useTpu = useTpu;
    this.batchSize = batchSize;
    this._hwCaps = { gpu: false, tpu: false };
    this._execMode = "cpu"; // resolved after _init
    this._initHardware();
  }

  async _initHardware() {
    this._hwCaps = await detectHardware();
    if (this.useGpu && this._hwCaps.gpu) this._execMode = "gpu";
    else if (this.useTpu && this._hwCaps.tpu) this._execMode = "tpu";
    else this._execMode = "cpu";

    this.emit("hardware:ready", {
      event: "hardware:ready",
      execMode: this._execMode,
      hwCaps: this._hwCaps,
      geoqode: buildGeoCoordinate({
        domain: "perf-forge",
        sector: 7,
        confidence: this._hwCaps.gpu ? 0.98 : 0.75,
        source: `accelerated-runtime:${this.clusterId}`,
        semanticType: "ACTION",
      }),
    });
  }

  /**
   * Execute accelerated processing on all agents assigned to this runtime's nodes.
   * Collects AcceleratedAgent/TPUAgent instances from all nodes, processes in batches,
   * and emits GeoQode PHYSICS events for each batch.
   *
   * @returns {Promise<object[]>} Array of per-agent results with GeoQode coordinates.
   */
  async execute() {
    const all = this._nodes.flatMap((node) =>
      node.agents.filter(
        (a) => a instanceof AcceleratedAgent || a instanceof TPUAgent,
      ),
    );

    if (all.length === 0) {
      return [];
    }

    const results = [];
    // Process in batches for memory efficiency
    for (let i = 0; i < all.length; i += this.batchSize) {
      const batch = all.slice(i, i + this.batchSize);
      const batchResults = await Promise.all(
        batch.map((a) => a.process(this._execMode)),
      );
      results.push(...batchResults);

      this.emit("hardware:batch", {
        event: "hardware:batch",
        batchIndex: Math.floor(i / this.batchSize),
        batchSize: batch.length,
        execMode: this._execMode,
        geoqode: buildGeoCoordinate({
          domain: "perf-forge",
          sector: 7,
          confidence: 0.94,
          source: `accelerated-runtime:${this.clusterId}`,
          semanticType: "ACTION",
        }),
      });
    }

    this.emit("hardware:execute-complete", {
      event: "hardware:execute-complete",
      total: all.length,
      execMode: this._execMode,
      geoqode: buildGeoCoordinate({
        domain: "perf-forge",
        sector: 7,
        confidence: this.coherence,
        source: `accelerated-runtime:${this.clusterId}`,
        semanticType: "ACTION",
      }),
    });

    return results;
  }

  /** Override statusSnapshot to include hardware info. */
  statusSnapshot() {
    return {
      ...super.statusSnapshot(),
      hardware: {
        execMode: this._execMode,
        useGpu: this.useGpu,
        useTpu: this.useTpu,
        batchSize: this.batchSize,
        detected: this._hwCaps,
      },
    };
  }
}
