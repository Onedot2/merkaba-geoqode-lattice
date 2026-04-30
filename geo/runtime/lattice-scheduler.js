// geo/runtime/lattice-scheduler.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// Lattice-driven scheduler for GeoQode runtime decisions.

import { performance } from "node:perf_hooks";
import { CANONICAL_LATTICE_NODES, PHI } from "../lattice/transform-420.js";

const DEFAULT_TYPE_TO_DIMENSION = Object.freeze({
  EMIT_STMT: 8,
  DETECT_STMT: 26,
  QBIT_STMT: 48,
  LOG_STMT: 12,
  TRIGGER_STMT: 34,
  ACTION_STMT: 40,
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeMode(mode) {
  const normalized = String(mode || "legacy")
    .trim()
    .toLowerCase();
  return normalized === "lattice" ? "lattice" : "legacy";
}

function safeAverage(total, count) {
  return count > 0 ? total / count : 0;
}

function normalizeIntegrationMode(mode) {
  return String(mode || "off")
    .trim()
    .toLowerCase();
}

function isLowOverheadMode(mode) {
  return normalizeIntegrationMode(mode).startsWith("low-overhead");
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function parsePositiveFloat(value, fallback) {
  const parsed = Number.parseFloat(String(value));
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

export class LatticeScheduler {
  constructor(options = {}) {
    this.mode = normalizeMode(options.mode);
    this.integrationMode = normalizeIntegrationMode(
      options.integrationMode || "off",
    );
    this.adapters = options.adapters || null;
    this.sampleEveryN = parsePositiveInt(
      options.adapterSampleEveryN ||
        process.env.MERKABA_ADAPTER_SAMPLE_EVERY_N ||
        "16",
      16,
    );
    this.shadowEveryN = parsePositiveInt(
      options.adapterShadowEveryN ||
        process.env.MERKABA_ADAPTER_SHADOW_EVERY_N ||
        "32",
      32,
    );
    this.enableAdaptiveLowOverhead =
      options.enableAdaptiveLowOverhead !== undefined
        ? options.enableAdaptiveLowOverhead === true
        : String(
            process.env.MERKABA_ADAPTER_ADAPTIVE_LOW_OVERHEAD || "true",
          ).toLowerCase() !== "false";
    this.sampleMinN = parsePositiveInt(
      options.adapterSampleMinN ||
        process.env.MERKABA_ADAPTER_SAMPLE_MIN_N ||
        "4",
      4,
    );
    this.sampleMaxN = parsePositiveInt(
      options.adapterSampleMaxN ||
        process.env.MERKABA_ADAPTER_SAMPLE_MAX_N ||
        "64",
      64,
    );
    this.shadowMinN = parsePositiveInt(
      options.adapterShadowMinN ||
        process.env.MERKABA_ADAPTER_SHADOW_MIN_N ||
        "8",
      8,
    );
    this.shadowMaxN = parsePositiveInt(
      options.adapterShadowMaxN ||
        process.env.MERKABA_ADAPTER_SHADOW_MAX_N ||
        "128",
      128,
    );
    this.maxCachedDecisionAge = parsePositiveInt(
      options.adapterCacheDecisionTTL ||
        process.env.MERKABA_ADAPTER_CACHE_DECISION_TTL ||
        "96",
      96,
    );
    this.targetSampleLatencyMs = parsePositiveFloat(
      options.adapterTargetSampleLatencyMs ||
        process.env.MERKABA_ADAPTER_TARGET_SAMPLE_LATENCY_MS ||
        "0.2",
      0.2,
    );
    this.shadowMaxBusyRate = clamp(
      parsePositiveFloat(
        options.adapterShadowMaxBusyRate ||
          process.env.MERKABA_ADAPTER_SHADOW_MAX_BUSY_RATE ||
          "0.2",
        0.2,
      ),
      0.01,
      0.95,
    );
    this.adaptiveState = {
      effectiveSampleEveryN: this.sampleEveryN,
      effectiveShadowEveryN: this.shadowEveryN,
      lastAdjustmentAtDecision: 0,
    };
    this.shadowInFlight = false;
    this.lastAdapterSnapshot = null;
    this.adapterSnapshotCache = new Map();
    this.typeToDimension = {
      ...DEFAULT_TYPE_TO_DIMENSION,
      ...(options.typeToDimension || {}),
    };
    this.resetMetrics();
  }

  setMode(mode) {
    this.mode = normalizeMode(mode);
  }

  setIntegrationMode(mode) {
    this.integrationMode = normalizeIntegrationMode(mode);
    this.metrics.integrationMode = this.integrationMode;
    this.lastAdapterSnapshot = null;
    this.adapterSnapshotCache.clear();
  }

  setSamplingConfig({ sampleEveryN, shadowEveryN } = {}) {
    if (sampleEveryN !== undefined) {
      this.sampleEveryN = parsePositiveInt(sampleEveryN, this.sampleEveryN);
    }

    if (shadowEveryN !== undefined) {
      this.shadowEveryN = parsePositiveInt(shadowEveryN, this.shadowEveryN);
    }

    this.adaptiveState.effectiveSampleEveryN = this.sampleEveryN;
    this.adaptiveState.effectiveShadowEveryN = this.shadowEveryN;
    this.metrics.sampling.sampleEveryN = this.sampleEveryN;
    this.metrics.sampling.shadowEveryN = this.shadowEveryN;
  }

  resetMetrics() {
    this.metrics = {
      mode: this.mode,
      integrationMode: this.integrationMode,
      sampling: {
        sampleEveryN: this.sampleEveryN,
        shadowEveryN: this.shadowEveryN,
        effectiveSampleEveryN: this.adaptiveState.effectiveSampleEveryN,
        effectiveShadowEveryN: this.adaptiveState.effectiveShadowEveryN,
        adaptiveEnabled: this.enableAdaptiveLowOverhead,
      },
      decisions: 0,
      decisionsByType: {},
      decisionLatencyMsTotal: 0,
      averageDecisionLatencyMs: 0,
      lanes: {
        FOUNDATION: 0,
        BOSONIC: 0,
        CANONICAL: 0,
      },
      adapter: {
        qddCalls: 0,
        qddLatencyMsTotal: 0,
        governanceCalls: 0,
        governanceLatencyMsTotal: 0,
        swarmCalls: 0,
        swarmLatencyMsTotal: 0,
        sampledSyncCalls: 0,
        cachedDecisions: 0,
        shadowScheduled: 0,
        shadowCompleted: 0,
        shadowFailed: 0,
        shadowSkippedBusy: 0,
        shadowSuppressedByAdaptive: 0,
        shadowLatencyMsTotal: 0,
        sampledSyncLatencyMsTotal: 0,
        adaptiveAdjustments: 0,
      },
    };
  }

  getMetrics() {
    const snapshot = structuredClone(this.metrics);
    snapshot.mode = this.mode;
    snapshot.averageDecisionLatencyMs = safeAverage(
      this.metrics.decisionLatencyMsTotal,
      this.metrics.decisions,
    );
    snapshot.sampling.effectiveSampleEveryN =
      this.adaptiveState.effectiveSampleEveryN;
    snapshot.sampling.effectiveShadowEveryN =
      this.adaptiveState.effectiveShadowEveryN;
    snapshot.adapterCacheSize = this.adapterSnapshotCache.size;
    snapshot.shadowInFlight = this.shadowInFlight;
    snapshot.lastAdapterSnapshotAvailable = Boolean(this.lastAdapterSnapshot);
    snapshot.adapter.qddAvgLatencyMs = safeAverage(
      this.metrics.adapter.qddLatencyMsTotal,
      this.metrics.adapter.qddCalls,
    );
    snapshot.adapter.governanceAvgLatencyMs = safeAverage(
      this.metrics.adapter.governanceLatencyMsTotal,
      this.metrics.adapter.governanceCalls,
    );
    snapshot.adapter.swarmAvgLatencyMs = safeAverage(
      this.metrics.adapter.swarmLatencyMsTotal,
      this.metrics.adapter.swarmCalls,
    );
    snapshot.adapter.shadowAvgLatencyMs = safeAverage(
      this.metrics.adapter.shadowLatencyMsTotal,
      this.metrics.adapter.shadowCompleted,
    );
    snapshot.adapter.sampledSyncAvgLatencyMs = safeAverage(
      this.metrics.adapter.sampledSyncLatencyMsTotal,
      this.metrics.adapter.sampledSyncCalls,
    );
    return snapshot;
  }

  buildCacheKey(statementType, dimension) {
    return `${statementType}:${dimension}`;
  }

  getCachedSnapshot(cacheKey, decisionOrdinal) {
    const cached = this.adapterSnapshotCache.get(cacheKey);
    if (!cached) {
      return null;
    }

    if (decisionOrdinal > cached.expiresAtDecision) {
      this.adapterSnapshotCache.delete(cacheKey);
      return null;
    }

    return cached.snapshot;
  }

  cacheSnapshot(cacheKey, snapshot, decisionOrdinal) {
    this.adapterSnapshotCache.set(cacheKey, {
      snapshot,
      expiresAtDecision: decisionOrdinal + this.maxCachedDecisionAge,
    });
  }

  getShadowBusyRate() {
    const busyEvents =
      this.metrics.adapter.shadowSkippedBusy +
      this.metrics.adapter.shadowCompleted;
    if (busyEvents <= 0) {
      return 0;
    }

    return this.metrics.adapter.shadowSkippedBusy / busyEvents;
  }

  maybeAdjustAdaptiveCadence(decisionOrdinal) {
    if (
      !this.enableAdaptiveLowOverhead ||
      !isLowOverheadMode(this.integrationMode)
    ) {
      return;
    }

    if (decisionOrdinal - this.adaptiveState.lastAdjustmentAtDecision < 64) {
      return;
    }

    const sampledAvgLatencyMs = safeAverage(
      this.metrics.adapter.sampledSyncLatencyMsTotal,
      this.metrics.adapter.sampledSyncCalls,
    );
    const busyRate = this.getShadowBusyRate();

    let nextSampleEveryN = this.adaptiveState.effectiveSampleEveryN;
    let nextShadowEveryN = this.adaptiveState.effectiveShadowEveryN;

    if (
      sampledAvgLatencyMs > this.targetSampleLatencyMs ||
      busyRate > this.shadowMaxBusyRate
    ) {
      nextSampleEveryN = clamp(
        nextSampleEveryN * 2,
        this.sampleMinN,
        this.sampleMaxN,
      );
      nextShadowEveryN = clamp(
        nextShadowEveryN * 2,
        this.shadowMinN,
        this.shadowMaxN,
      );
    } else if (
      sampledAvgLatencyMs < this.targetSampleLatencyMs * 0.5 &&
      busyRate < this.shadowMaxBusyRate * 0.5
    ) {
      nextSampleEveryN = clamp(
        Math.max(this.sampleMinN, Math.floor(nextSampleEveryN / 2)),
        this.sampleMinN,
        this.sampleMaxN,
      );
      nextShadowEveryN = clamp(
        Math.max(this.shadowMinN, Math.floor(nextShadowEveryN / 2)),
        this.shadowMinN,
        this.shadowMaxN,
      );
    }

    if (
      nextSampleEveryN !== this.adaptiveState.effectiveSampleEveryN ||
      nextShadowEveryN !== this.adaptiveState.effectiveShadowEveryN
    ) {
      this.adaptiveState.effectiveSampleEveryN = nextSampleEveryN;
      this.adaptiveState.effectiveShadowEveryN = nextShadowEveryN;
      this.metrics.adapter.adaptiveAdjustments += 1;
      this.metrics.sampling.effectiveSampleEveryN = nextSampleEveryN;
      this.metrics.sampling.effectiveShadowEveryN = nextShadowEveryN;
    }

    this.adaptiveState.lastAdjustmentAtDecision = decisionOrdinal;
  }

  shouldRunShadow() {
    if (!this.enableAdaptiveLowOverhead) {
      return true;
    }

    const sampledAvgLatencyMs = safeAverage(
      this.metrics.adapter.sampledSyncLatencyMsTotal,
      this.metrics.adapter.sampledSyncCalls,
    );

    if (sampledAvgLatencyMs > this.targetSampleLatencyMs * 1.5) {
      return false;
    }

    return this.getShadowBusyRate() <= this.shadowMaxBusyRate;
  }

  getLaneForDimension(dimension) {
    if (dimension <= 8) return "FOUNDATION";
    if (dimension <= 26) return "BOSONIC";
    return "CANONICAL";
  }

  computeDimension(statement, context) {
    const base = this.typeToDimension[statement?.type] || 1;
    const harmonic = Number.parseFloat(statement?.harmonic?.value || "1") || 1;
    const seed =
      base +
      context.stepIndex * 7 +
      context.programSize * 3 +
      Math.round(harmonic * 5);
    return ((seed - 1) % CANONICAL_LATTICE_NODES) + 1;
  }

  async maybeRunUnifiedAdapters(decision, context, options = {}) {
    const callPath = options.callPath || "sync";
    const output = {
      qdd: null,
      governance: null,
      swarm: null,
    };

    if (!this.adapters || this.integrationMode === "off") {
      return output;
    }

    const adapterContext = {
      ...context,
      decision,
    };

    if (this.adapters.qdd?.decide) {
      const qddStart = performance.now();
      output.qdd = await this.adapters.qdd.decide(adapterContext);
      this.metrics.adapter.qddCalls += 1;
      this.metrics.adapter.qddLatencyMsTotal += performance.now() - qddStart;
    }

    if (this.adapters.governance?.evaluate) {
      const governanceStart = performance.now();
      output.governance =
        await this.adapters.governance.evaluate(adapterContext);
      this.metrics.adapter.governanceCalls += 1;
      this.metrics.adapter.governanceLatencyMsTotal +=
        performance.now() - governanceStart;
    }

    if (this.adapters.swarm?.allocate) {
      const swarmStart = performance.now();
      output.swarm = await this.adapters.swarm.allocate(adapterContext);
      this.metrics.adapter.swarmCalls += 1;
      this.metrics.adapter.swarmLatencyMsTotal +=
        performance.now() - swarmStart;
    }

    if (callPath === "sampled-sync") {
      this.metrics.adapter.sampledSyncCalls += 1;
    }

    return output;
  }

  maybeScheduleShadowAdapters(decision, context) {
    if (!this.adapters || this.integrationMode === "off") {
      return;
    }

    if (this.shadowInFlight) {
      this.metrics.adapter.shadowSkippedBusy += 1;
      return;
    }

    this.shadowInFlight = true;
    this.metrics.adapter.shadowScheduled += 1;

    const shadowStart = performance.now();
    this.maybeRunUnifiedAdapters(decision, context, {
      callPath: "shadow",
    })
      .then((snapshot) => {
        this.lastAdapterSnapshot = snapshot;
        this.metrics.adapter.shadowCompleted += 1;
        this.metrics.adapter.shadowLatencyMsTotal +=
          performance.now() - shadowStart;
      })
      .catch(() => {
        this.metrics.adapter.shadowFailed += 1;
      })
      .finally(() => {
        this.shadowInFlight = false;
      });
  }

  async decide(statement, context) {
    const decisionStart = performance.now();
    const statementType = statement?.type || "UNKNOWN";
    const safeContext = {
      stepIndex: context?.stepIndex || 0,
      cycle: context?.cycle || 0,
      nodePoolSize: context?.nodePoolSize || 1,
      waterPoolSize: context?.waterPoolSize || 1,
      programSize: context?.programSize || 1,
    };

    const dimension = this.computeDimension(statement, safeContext);
    const lane = this.getLaneForDimension(dimension);
    const laneBias =
      lane === "FOUNDATION" ? 0.85 : lane === "BOSONIC" ? 1.0 : 1.15;

    let decision = {
      mode: this.mode,
      statementType,
      dimension,
      lane,
      priority: 1,
      nodeIndex: safeContext.stepIndex % safeContext.nodePoolSize,
      waterIndex: safeContext.stepIndex % safeContext.waterPoolSize,
      context: {
        ...safeContext,
      },
    };

    if (this.mode === "lattice") {
      decision = {
        ...decision,
        priority: Number(
          clamp(
            (dimension / CANONICAL_LATTICE_NODES) * PHI * laneBias,
            0.25,
            2.0,
          ).toFixed(4),
        ),
        nodeIndex: (dimension + safeContext.cycle) % safeContext.nodePoolSize,
        waterIndex:
          (dimension * 2 + safeContext.stepIndex) % safeContext.waterPoolSize,
      };

      const nextDecisionOrdinal = this.metrics.decisions + 1;
      this.maybeAdjustAdaptiveCadence(nextDecisionOrdinal);

      const effectiveSampleEveryN = this.enableAdaptiveLowOverhead
        ? this.adaptiveState.effectiveSampleEveryN
        : this.sampleEveryN;
      const effectiveShadowEveryN = this.enableAdaptiveLowOverhead
        ? this.adaptiveState.effectiveShadowEveryN
        : this.shadowEveryN;
      let adapterResults = {
        qdd: null,
        governance: null,
        swarm: null,
      };

      if (isLowOverheadMode(this.integrationMode)) {
        const shouldSample = nextDecisionOrdinal % effectiveSampleEveryN === 0;
        const shouldShadow = nextDecisionOrdinal % effectiveShadowEveryN === 0;
        const cacheKey = this.buildCacheKey(statementType, dimension);

        if (shouldSample) {
          const sampleStart = performance.now();
          adapterResults = await this.maybeRunUnifiedAdapters(
            decision,
            safeContext,
            { callPath: "sampled-sync" },
          );
          this.metrics.adapter.sampledSyncLatencyMsTotal +=
            performance.now() - sampleStart;
          this.lastAdapterSnapshot = adapterResults;
          this.cacheSnapshot(cacheKey, adapterResults, nextDecisionOrdinal);
        } else {
          const cachedSnapshot = this.getCachedSnapshot(
            cacheKey,
            nextDecisionOrdinal,
          );

          if (cachedSnapshot) {
            adapterResults = cachedSnapshot;
            this.metrics.adapter.cachedDecisions += 1;
          } else if (this.lastAdapterSnapshot) {
            adapterResults = this.lastAdapterSnapshot;
            this.metrics.adapter.cachedDecisions += 1;
          }

          if (shouldShadow) {
            if (this.shouldRunShadow()) {
              this.maybeScheduleShadowAdapters(decision, safeContext);
            } else {
              this.metrics.adapter.shadowSuppressedByAdaptive += 1;
            }
          }
        }
      } else {
        adapterResults = await this.maybeRunUnifiedAdapters(
          decision,
          safeContext,
          { callPath: "sync" },
        );
      }

      decision.adapter = adapterResults;

      // Optional adapter influence over routing.
      if (adapterResults.swarm?.parallelLane !== undefined) {
        const laneShift = Number(adapterResults.swarm.parallelLane) || 0;
        decision.nodeIndex =
          (decision.nodeIndex + laneShift) % safeContext.nodePoolSize;
      }

      if (
        adapterResults.governance?.throttle &&
        adapterResults.governance.throttle < 1
      ) {
        decision.priority = Number(
          (decision.priority * adapterResults.governance.throttle).toFixed(4),
        );
      }
    }

    this.metrics.decisions += 1;
    this.metrics.decisionsByType[statementType] =
      (this.metrics.decisionsByType[statementType] || 0) + 1;
    this.metrics.lanes[lane] += 1;

    const decisionLatency = performance.now() - decisionStart;
    this.metrics.decisionLatencyMsTotal += decisionLatency;
    this.metrics.averageDecisionLatencyMs = safeAverage(
      this.metrics.decisionLatencyMsTotal,
      this.metrics.decisions,
    );

    return decision;
  }
}

export default LatticeScheduler;
