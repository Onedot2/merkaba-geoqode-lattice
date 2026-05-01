/**
 * merkaba480-cluster.js — LatticeCluster: Horizontal Scaling
 * @alignment 8→26→48:480
 *
 * Wraps one or more LatticeRuntime (or AcceleratedLatticeRuntime) instances
 * into a distributed cluster, enabling virtually unlimited agent capacity
 * through horizontal expansion.
 *
 * Scaling model:
 *   Single lattice:   up to ~4,800 agents (480 nodes × 10 slots)
 *   10-cluster:       up to ~48,000 agents
 *   100-cluster:      up to ~480,000 agents (matches D480 × 1000 harmonic nodes)
 *
 * Distribution strategy: PHI-weighted round-robin.
 *   Rather than simple modulo, each cluster receives a load proportional to
 *   its current coherence, weighted by the golden ratio to prefer healthier
 *   clusters without starving others.
 *
 * All cluster events emit GeoQode NARRATIVE coordinates (963 Hz — continuity
 * & purpose) because cluster topology is the living architecture of the system.
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED
 */

import { EventEmitter } from "node:events";
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
import { AcceleratedLatticeRuntime } from "./merkaba480-accelerated.js";
import { GovernanceBoard } from "./merkaba480-governance.js";

// ─────────────────────────────────────────────────────────────────────────────
// LatticeCluster
// ─────────────────────────────────────────────────────────────────────────────

export class LatticeCluster extends EventEmitter {
  /**
   * @param {object} opts
   * @param {number}  [opts.clusterCount=1]   — Initial number of lattice runtimes
   * @param {boolean} [opts.accelerated=false] — Use AcceleratedLatticeRuntime
   * @param {object}  [opts.accelerationOpts] — Passed to AcceleratedLatticeRuntime
   * @param {string}  [opts.clusterId="storm"] — Cluster group id
   * @param {boolean} [opts.withGovernance=true] — Attach a GovernanceBoard
   */
  constructor({
    clusterCount = 1,
    accelerated = false,
    accelerationOpts = {},
    clusterId = "storm",
    withGovernance = true,
  } = {}) {
    super();
    this.clusterId = clusterId;
    this.accelerated = accelerated;
    this._lattices = [];
    this._agentIndex = 0; // round-robin cursor
    this._startedAt = Date.now();
    this._expandCount = 0;

    for (let i = 0; i < clusterCount; i++) {
      this._lattices.push(
        this._makeLattice(`${clusterId}-${i}`, accelerationOpts),
      );
    }

    this.governance = withGovernance
      ? new GovernanceBoard({ boardId: `${clusterId}-board` })
      : null;

    this.emit("cluster:boot", {
      event: "cluster:boot",
      clusterId,
      latticeCount: this._lattices.length,
      accelerated,
      geoqode: buildGeoCoordinate({
        domain: "systems-design",
        sector: 3,
        confidence: 1.0,
        source: `lattice-cluster:${clusterId}`,
        semanticType: "NARRATIVE",
      }),
    });
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  _makeLattice(id, opts = {}) {
    if (this.accelerated) {
      return new AcceleratedLatticeRuntime({ clusterId: id, ...opts });
    }
    return new LatticeRuntime({ clusterId: id });
  }

  /**
   * PHI-weighted lattice selection.
   * Returns the lattice with best available capacity weighted by coherence.
   * Falls back to round-robin if all are equally loaded.
   */
  _selectLattice() {
    // Prefer highest coherence (healthiest)
    let best = null;
    let bestScore = -Infinity;

    for (const lat of this._lattices) {
      const freeRatio = 1 - lat.activeAgents / Math.max(1, lat.totalCapacity);
      const score = freeRatio * PHI + lat.coherence;
      if (score > bestScore) {
        best = lat;
        bestScore = score;
      }
    }

    if (!best) {
      // Pure round-robin fallback
      best = this._lattices[this._agentIndex % this._lattices.length];
      this._agentIndex++;
    }
    return best;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Distribute an array of agents across the cluster using PHI-weighted selection.
   * @param {object[]} agents
   * @returns {{ assigned, overflow, geoqode }}
   */
  distribute(agents) {
    let totalAssigned = 0;
    let totalOverflow = 0;

    // Group agents into per-lattice buckets using PHI-weighted selection
    const buckets = new Map(this._lattices.map((l) => [l, []]));
    for (const agent of agents) {
      const lat = this._selectLattice();
      buckets.get(lat).push(agent);
    }

    // Dispatch to each lattice
    for (const [lat, batch] of buckets) {
      if (!batch.length) continue;
      const r = lat.distributeAgents(batch);
      totalAssigned += r.assigned;
      totalOverflow += r.overflow;
    }

    const geoqode = buildGeoCoordinate({
      domain: "systems-design",
      sector: 3,
      confidence: this.coherence,
      source: `lattice-cluster:${this.clusterId}`,
      semanticType: "NARRATIVE",
    });

    this.emit("cluster:distributed", {
      event: "cluster:distributed",
      agentCount: agents.length,
      assigned: totalAssigned,
      overflow: totalOverflow,
      latticeCount: this._lattices.length,
      geoqode,
    });

    return { assigned: totalAssigned, overflow: totalOverflow, geoqode };
  }

  /**
   * Add new lattice runtimes to the cluster (horizontal scaling).
   * @param {number} count — Number of new lattices to add
   * @param {object} [opts] — Optional accelerationOpts override
   */
  expand(count = 1, opts = {}) {
    const added = [];
    const startIdx = this._lattices.length;
    for (let i = 0; i < count; i++) {
      const lat = this._makeLattice(`${this.clusterId}-${startIdx + i}`, opts);
      this._lattices.push(lat);
      added.push(lat.clusterId);
    }
    this._expandCount += count;

    const geoqode = buildGeoCoordinate({
      domain: "systems-design",
      sector: 3,
      confidence: 1.0,
      source: `lattice-cluster:${this.clusterId}`,
      semanticType: "NARRATIVE",
    });

    this.emit("cluster:expanded", {
      event: "cluster:expanded",
      addedCount: count,
      totalLattices: this._lattices.length,
      addedIds: added,
      expandCount: this._expandCount,
      geoqode,
    });

    return { addedIds: added, totalLattices: this._lattices.length, geoqode };
  }

  /**
   * Execute accelerated processing across all lattices that support it.
   * Non-accelerated lattices are silently skipped.
   */
  async executeAccelerated() {
    const results = [];
    for (const lat of this._lattices) {
      if (typeof lat.execute === "function") {
        const r = await lat.execute();
        results.push(...r);
      }
    }
    return results;
  }

  /**
   * Certify an agent output through the cluster's GovernanceBoard.
   */
  certify(agentOutput) {
    if (!this.governance)
      throw new Error("[LatticeCluster] Governance not enabled");
    return this.governance.certify(agentOutput);
  }

  /** Overall coherence: PHI-weighted mean across all lattices. */
  get coherence() {
    if (!this._lattices.length) return 1.0;
    const sum = this._lattices.reduce((s, l) => s + l.coherence, 0);
    return +(sum / this._lattices.length).toFixed(4);
  }

  /** Total agent count across all lattices. */
  get totalAgents() {
    return this._lattices.reduce((s, l) => s + l.activeAgents, 0);
  }

  /** Theoretical max capacity across all lattices. */
  get totalCapacity() {
    return this._lattices.reduce((s, l) => s + l.totalCapacity, 0);
  }

  /**
   * Full cluster status snapshot (GeoQode-native).
   */
  statusSnapshot() {
    return {
      reportType: "CLUSTER_STATUS",
      clusterId: this.clusterId,
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      latticeCount: this._lattices.length,
      totalAgents: this.totalAgents,
      totalCapacity: this.totalCapacity,
      loadRatio: +(this.totalAgents / Math.max(1, this.totalCapacity)).toFixed(
        4,
      ),
      coherence: this.coherence,
      expandCount: this._expandCount,
      accelerated: this.accelerated,
      uptimeMs: Date.now() - this._startedAt,
      phiAnchor: PHI,
      psiAnchor: PSI,
      baseFrequencyHz: BASE_FREQUENCY_HZ,
      lattices: this._lattices.map((l) => l.statusSnapshot()),
      governance: this.governance?.statusSnapshot() ?? null,
      geoqode: buildGeoCoordinate({
        domain: "systems-design",
        sector: 3,
        confidence: this.coherence,
        source: `lattice-cluster:${this.clusterId}`,
        semanticType: "NARRATIVE",
      }),
    };
  }
}
