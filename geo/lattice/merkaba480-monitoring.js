/**
 * merkaba480-monitoring.js — Real-time Monitoring State for MERKABA480
 * @alignment 8→26→48:480
 *
 * Provides a live monitoring layer over any LatticeCluster or LatticeRuntime.
 * Collects, aggregates, and streams metrics using the GeoQode native language.
 *
 * Metrics tracked per poll cycle:
 *   - Node load distribution (per lattice, per coupling tier)
 *   - Agent concurrency (total, per cluster)
 *   - Coherence timeline (rolling window)
 *   - Governance certification rate
 *   - Scale-down cascade events
 *   - Hardware execution mode
 *
 * Emits "monitor:snapshot" events for UI consumption (Server-Sent Events, WebSocket).
 * The snapshot shape is designed to map directly onto the Theatre admin dashboard.
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED
 */

import { EventEmitter } from "node:events";
import {
  buildGeoCoordinate,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  COUPLING_TIERS,
  SEMANTIC_FREQUENCY_MAP,
} from "./merkaba480-runtime.js";

// ── Monitoring constants ──────────────────────────────────────────────────────
const DEFAULT_POLL_INTERVAL_MS = 5_000; // 5 s
const COHERENCE_HISTORY_SIZE = 60; // keep last 60 samples
const SCALE_HISTORY_SIZE = 20; // keep last 20 scale-down events

// ─────────────────────────────────────────────────────────────────────────────
// Merkaba480Monitor
// ─────────────────────────────────────────────────────────────────────────────

export class Merkaba480Monitor extends EventEmitter {
  /**
   * @param {object} opts
   * @param {import('./merkaba480-cluster.js').LatticeCluster} opts.cluster
   * @param {number}  [opts.pollIntervalMs]  — How often to poll (ms)
   * @param {string}  [opts.monitorId]
   */
  constructor({
    cluster,
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    monitorId = "primary",
  } = {}) {
    super();
    if (!cluster) throw new Error("[Merkaba480Monitor] cluster is required");

    this.cluster = cluster;
    this.monitorId = monitorId;
    this.pollIntervalMs = pollIntervalMs;
    this._startedAt = Date.now();
    this._coherenceHistory = []; // { ts, coherence }[]
    this._scaleHistory = []; // { ts, fromTier, toTier }[]
    this._snapshotCount = 0;
    this._timer = null;

    // Listen for lattice scale-down events from all cluster lattices
    this._attachListeners();
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  _attachListeners() {
    // Forward scale-down events from all lattice runtimes
    const forward = (event, data) => {
      if (event === "lattice:scale-down") {
        const entry = {
          ts: Date.now(),
          fromTier: data.fromTier,
          toTier: data.toTier,
        };
        if (this._scaleHistory.length >= SCALE_HISTORY_SIZE)
          this._scaleHistory.shift();
        this._scaleHistory.push(entry);
        this.emit("monitor:scale-down", { ...data, monitorId: this.monitorId });
      }
    };

    for (const lat of this.cluster._lattices ?? []) {
      lat.on("lattice:scale-down", (data) =>
        forward("lattice:scale-down", data),
      );
    }

    this.cluster.on("cluster:expanded", (data) => {
      this.emit("monitor:cluster-expanded", data);
    });
  }

  _collectCoherenceSample() {
    const sample = { ts: Date.now(), coherence: this.cluster.coherence };
    if (this._coherenceHistory.length >= COHERENCE_HISTORY_SIZE)
      this._coherenceHistory.shift();
    this._coherenceHistory.push(sample);
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Start polling. Returns `this` for chaining. */
  start() {
    if (this._timer) return this;
    this._timer = setInterval(() => this._poll(), this.pollIntervalMs);
    this._poll(); // immediate first poll
    return this;
  }

  /** Stop polling. */
  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    return this;
  }

  /** Force an immediate poll + snapshot. */
  _poll() {
    this._collectCoherenceSample();
    const snapshot = this.snapshot();
    this._snapshotCount++;
    this.emit("monitor:snapshot", snapshot);
  }

  /**
   * Build a complete monitoring snapshot.
   * The shape is designed for direct rendering in the Theatre admin dashboard.
   */
  snapshot() {
    const cs = this.cluster.statusSnapshot();
    const now = Date.now();

    // Per-tier agent distribution
    const tierBreakdown = COUPLING_TIERS.map((tier) => {
      const matchingLattices = (this.cluster._lattices ?? []).filter(
        (l) => l.nodeCount === tier.nodeCount,
      );
      const agentsInTier = matchingLattices.reduce(
        (s, l) => s + l.activeAgents,
        0,
      );
      const capInTier = matchingLattices.reduce(
        (s, l) => s + l.totalCapacity,
        0,
      );
      return {
        tier: tier.label,
        nodeCount: tier.nodeCount,
        slotsPerNode: tier.slotsPerNode,
        lattices: matchingLattices.length,
        agents: agentsInTier,
        capacity: capInTier,
        loadRatio: capInTier > 0 ? +(agentsInTier / capInTier).toFixed(4) : 0,
        resonanceBand: tier.resonanceBand,
      };
    });

    // Safe operating zones
    const loadRatio =
      cs.totalCapacity > 0 ? cs.totalAgents / cs.totalCapacity : 0;
    let safeZone = "GREEN";
    if (loadRatio > 0.85) safeZone = "RED";
    else if (loadRatio > 0.65) safeZone = "AMBER";

    const geoqode = buildGeoCoordinate({
      domain: "systems-design",
      sector: 3,
      confidence: cs.coherence,
      source: `monitor:${this.monitorId}`,
      semanticType: "NARRATIVE",
    });

    return {
      reportType: "MERKABA480_MONITOR_SNAPSHOT",
      monitorId: this.monitorId,
      snapshotIndex: this._snapshotCount,
      timestamp: new Date().toISOString(),
      uptimeMs: now - this._startedAt,
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      phiAnchor: PHI,
      psiAnchor: PSI,
      baseFrequencyHz: BASE_FREQUENCY_HZ,

      // Live metrics
      cluster: {
        id: cs.clusterId,
        latticeCount: cs.latticeCount,
        totalAgents: cs.totalAgents,
        totalCapacity: cs.totalCapacity,
        loadRatio: cs.loadRatio,
        coherence: cs.coherence,
        expandCount: cs.expandCount,
        accelerated: cs.accelerated,
      },

      // Adaptive coupling tiers
      tierBreakdown,

      // Safe zone classification
      safeZone,
      safeZoneThresholds: {
        GREEN: "< 65% load",
        AMBER: "65-85% load",
        RED: "> 85% load",
      },

      // Coherence timeline
      coherenceHistory: this._coherenceHistory.slice(-20),
      coherenceTrend: this._coherenceTrend(),

      // Scale-down cascade history
      scaleHistory: this._scaleHistory.slice(-10),

      // Governance metrics
      governance: cs.governance
        ? {
            certifiedCount: cs.governance.totalCertified,
            rejectedCount: cs.governance.totalRejected,
            certificationRate: cs.governance.certificationRate,
            reportsInBuffer: cs.governance.reportsInBuffer,
            safetyRules: cs.governance.safetyRules,
          }
        : null,

      // Scaling comparison (Analgesic AI vs MERKABA480)
      scalingComparison: {
        analgesicAI: {
          label: "Analgesic AI System",
          principle: "Pain-neutralization feedback loops",
          maxAgents: 3000,
          concurrencyModel: "Single-ring feedback stabilization",
          coherenceFocus: true,
          throughputFocus: false,
        },
        merkaba480: {
          label: "MERKABA480 Upgrade Build",
          principle: "Dimensional lattice execution with adaptive coupling",
          safeZoneAgents: cs.totalCapacity,
          maxTheoretical: "unlimited (cluster expansion)",
          concurrencyModel:
            "480→420→360 adaptive coupling + horizontal clusters",
          coherenceFocus: true,
          throughputFocus: true,
          governanceLayer: true,
        },
      },

      // GeoQode language envelope
      geoqode,
    };
  }

  /** Compute coherence trend: "rising" | "falling" | "stable". */
  _coherenceTrend() {
    const h = this._coherenceHistory;
    if (h.length < 3) return "stable";
    const recent = h.slice(-5).map((s) => s.coherence);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const first = h[0].coherence;
    if (avg > first + 0.02) return "rising";
    if (avg < first - 0.02) return "falling";
    return "stable";
  }
}
