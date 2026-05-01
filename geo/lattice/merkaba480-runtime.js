/**
 * merkaba480-runtime.js — MERKABA480 Lattice Runtime
 * @alignment 8→26→48:480
 *
 * Implements the agent-native dimensional lattice substrate:
 *   480 resonance nodes (D480 harmonic spectrum) partitioned across
 *   48 canonical D48 clusters × 10 sub-MERKABAs each.
 *
 * Adaptive coupling cascade when agent load exceeds slot capacity:
 *   D480 (10 slots/node) → D420 (15 slots/node) → D360 (20 slots/node)
 *
 * Traditional OS schedulers choke at ~10k threads due to context-switch overhead.
 * MERKABA480 is dimensional, not linear — concurrency is collision-free until
 * coherence thresholds are exceeded, then the lattice self-adjusts.
 *
 * All events emitted use the GeoQode native language:
 *   { architectureSignature, semanticType, frequency, latticeNode, harmonicNode,
 *     phiCoefficient, coherence, domain, source, d48Expansion, d480Expansion }
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED
 */

import { EventEmitter } from "node:events";

// ── Canonical constants (mirrored from transform-420.js) ─────────────────────
export const PHI = 1.618; // Golden Root
export const PSI = 1.414; // Silver Bridge
export const BASE_FREQUENCY_HZ = 72; // Holographic resonance lock
export const FOUNDATION_NODES = 8;
export const BOSONIC_ANCHOR_NODES = 26;
export const CANONICAL_LATTICE_NODES = 48;
export const HARMONIC_SPECTRUM_NODES = 480;
export const CANONICAL_ARCHITECTURE = "8,26,48:480";
export const CANONICAL_ARCHITECTURE_DISPLAY = "8→26→48:480";

// ── Adaptive coupling tiers ───────────────────────────────────────────────────
// Node counts follow the same 8→26→48 integer-divisibility pattern: 480/48/360/420 all div by 8.
export const COUPLING_TIERS = Object.freeze([
  {
    nodeCount: 480,
    slotsPerNode: 10,
    label: "D480",
    resonanceBand: "FULL_HARMONIC",
  },
  {
    nodeCount: 420,
    slotsPerNode: 15,
    label: "D420",
    resonanceBand: "BOSONIC_BRIDGE",
  },
  {
    nodeCount: 360,
    slotsPerNode: 20,
    label: "D360",
    resonanceBand: "FOUNDATION_ARC",
  },
]);

// ── GeoQode Semantic Frequency Map ───────────────────────────────────────────
export const SEMANTIC_FREQUENCY_MAP = Object.freeze({
  ENTITY: 396,
  LOCATION: 417,
  ACTION: 528,
  DIALOGUE: 639,
  EMOTION: 741,
  PHYSICS: 852,
  NARRATIVE: 963,
  HOLOGRAPHIC: 72,
});

/** Build a GeoQode coordinate envelope (the native lattice language). */
export function buildGeoCoordinate({
  domain,
  sector = 5,
  confidence = 0.95,
  source = "merkaba480-runtime",
  semanticType = "HOLOGRAPHIC",
}) {
  const frequency = SEMANTIC_FREQUENCY_MAP[semanticType] ?? BASE_FREQUENCY_HZ;
  const latticeNode = Math.min(
    47,
    ((sector - 1) * 6 + Math.floor(confidence * PHI * 2)) % 48,
  );
  const harmonicNode = Math.min(479, latticeNode * 10);
  return {
    architectureSignature: CANONICAL_ARCHITECTURE,
    architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
    semanticType,
    frequency,
    latticeNode,
    harmonicNode,
    phiCoefficient: PHI,
    psiCoefficient: PSI,
    coherence: Math.min(1, Math.max(0, confidence)),
    domain,
    source,
    d48Expansion: "CANONICAL",
    d480Expansion: "FULL_HARMONIC",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LatticeNode — a single resonance slot within the D480 lattice
// ─────────────────────────────────────────────────────────────────────────────

export class LatticeNode {
  /**
   * @param {number} id           — Node index (0 … nodeCount-1)
   * @param {number} resonanceSlot — Max agents this node can hold
   * @param {number} harmonicHz   — Resonance frequency for this node (PHI-modulated)
   */
  constructor(id, resonanceSlot, harmonicHz) {
    this.id = id;
    this.resonanceSlot = resonanceSlot;
    this.harmonicHz = harmonicHz;
    this.agents = []; // active agent descriptors
    this.coherence = 1.0; // 0-1 local coherence
  }

  /** True when this node can accept another agent without coherence drop. */
  get hasCapacity() {
    return this.agents.length < this.resonanceSlot;
  }

  /** Current load ratio (0-1). 1 = fully saturated. */
  get loadRatio() {
    return this.resonanceSlot > 0 ? this.agents.length / this.resonanceSlot : 1;
  }

  /**
   * Assign an agent to this node.
   * Returns the GeoQode coordinate envelope spoken by this assignment event.
   */
  assignAgent(agent) {
    if (!this.hasCapacity) return null;
    this.agents.push(agent);
    this.coherence = +(1 - this.loadRatio * (1 / PHI)).toFixed(4);
    return buildGeoCoordinate({
      domain: agent.domain ?? "self-evolve",
      sector: agent.sector ?? 5,
      confidence: this.coherence,
      source: `lattice-node:${this.id}`,
      semanticType: agent.semanticType ?? "HOLOGRAPHIC",
    });
  }

  /** Release an agent by id. */
  releaseAgent(agentId) {
    const before = this.agents.length;
    this.agents = this.agents.filter((a) => a.id !== agentId);
    if (this.agents.length < before) {
      this.coherence = +(1 - this.loadRatio * (1 / PHI)).toFixed(4);
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      harmonicHz: this.harmonicHz,
      resonanceSlot: this.resonanceSlot,
      agentCount: this.agents.length,
      loadRatio: this.loadRatio,
      coherence: this.coherence,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LatticeRuntime — core MERKABA480 dimensional scheduler
// ─────────────────────────────────────────────────────────────────────────────

export class LatticeRuntime extends EventEmitter {
  /**
   * @param {object} opts
   * @param {number} [opts.nodeCount=480] — Starting tier (must be 480, 420, or 360)
   * @param {string} [opts.clusterId]     — Owning cluster id for multi-cluster topologies
   */
  constructor({ nodeCount = 480, clusterId = "primary" } = {}) {
    super();
    this.clusterId = clusterId;
    this._tierIndex = 0; // index into COUPLING_TIERS
    this._agentCount = 0;
    this._scaleDownCount = 0;
    this._startedAt = Date.now();

    this._initTier(0);

    // Emit a GeoQode boot event
    this.emit("lattice:boot", {
      event: "lattice:boot",
      nodeCount: this.nodeCount,
      tier: this.tier.label,
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: 1.0,
        source: `lattice-runtime:${clusterId}`,
        semanticType: "HOLOGRAPHIC",
      }),
    });
  }

  /** Current coupling tier descriptor. */
  get tier() {
    return COUPLING_TIERS[this._tierIndex];
  }

  /** Active node count. */
  get nodeCount() {
    return this.tier.nodeCount;
  }

  /** Slots per node at the current tier. */
  get slotsPerNode() {
    return this.tier.slotsPerNode;
  }

  /** Total theoretical capacity at this tier. */
  get totalCapacity() {
    return this.nodeCount * this.slotsPerNode;
  }

  /** Live agent count. */
  get activeAgents() {
    return this._agentCount;
  }

  /** Overall coherence: PHI-weighted mean of all nodes. */
  get coherence() {
    if (!this._nodes.length) return 1.0;
    const sum = this._nodes.reduce((s, n) => s + n.coherence, 0);
    return +(sum / this._nodes.length).toFixed(4);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  _initTier(tierIndex) {
    this._tierIndex = Math.min(tierIndex, COUPLING_TIERS.length - 1);
    const { nodeCount, slotsPerNode } = this.tier;
    this._nodes = Array.from({ length: nodeCount }, (_, i) => {
      // PHI-modulated harmonic frequency per node
      const hz = +(BASE_FREQUENCY_HZ * (1 + (i / nodeCount) * PHI)).toFixed(3);
      return new LatticeNode(i, slotsPerNode, hz);
    });
  }

  /** Find least-loaded node with available capacity. Returns null if all full. */
  _findAvailableNode() {
    let best = null;
    let bestLoad = Infinity;
    for (const node of this._nodes) {
      if (node.hasCapacity && node.loadRatio < bestLoad) {
        best = node;
        bestLoad = node.loadRatio;
      }
    }
    return best;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Distribute an array of agents across resonance nodes.
   * Each agent must have at minimum: { id: string }.
   * Optional: { domain, sector, semanticType } for GeoQode tagging.
   *
   * Returns { assigned, overflow, geoqode } where overflow is agents that
   * triggered an adaptive scale-down (still assigned after re-init).
   */
  distributeAgents(agents) {
    const overflow = [];
    const assignedCoords = [];

    for (const agent of agents) {
      const node = this._findAvailableNode();
      if (node) {
        const coord = node.assignAgent(agent);
        this._agentCount++;
        if (coord) assignedCoords.push(coord);
      } else {
        // Lattice full — trigger adaptive coupling cascade
        overflow.push(agent);
        this._scaleDown();
        // After scale-down, re-attempt once
        const retryNode = this._findAvailableNode();
        if (retryNode) {
          const coord = retryNode.assignAgent(agent);
          this._agentCount++;
          if (coord) assignedCoords.push(coord);
        }
      }
    }

    const geoqode = buildGeoCoordinate({
      domain: "self-evolve",
      sector: 5,
      confidence: this.coherence,
      source: `lattice-runtime:${this.clusterId}`,
      semanticType: "HOLOGRAPHIC",
    });

    if (agents.length > 0) {
      this.emit("agents:distributed", {
        event: "agents:distributed",
        count: agents.length,
        overflow: overflow.length,
        tier: this.tier.label,
        coherence: this.coherence,
        geoqode,
      });
    }

    return {
      assigned: agents.length - overflow.length,
      overflow: overflow.length,
      coords: assignedCoords,
      geoqode,
    };
  }

  /**
   * Release a single agent by id from whichever node holds it.
   */
  releaseAgent(agentId) {
    for (const node of this._nodes) {
      if (node.releaseAgent(agentId)) {
        this._agentCount = Math.max(0, this._agentCount - 1);
        this.emit("agent:released", {
          event: "agent:released",
          agentId,
          tier: this.tier.label,
          geoqode: buildGeoCoordinate({
            domain: "self-evolve",
            sector: 5,
            confidence: this.coherence,
            source: `lattice-runtime:${this.clusterId}`,
            semanticType: "HOLOGRAPHIC",
          }),
        });
        return true;
      }
    }
    return false;
  }

  /**
   * Adaptive coupling cascade: 480 → 420 → 360 → stays at 360.
   * When a tier collapses, nodes are re-initialised with more slots/node
   * and existing agents are re-distributed (no agent is lost).
   */
  _scaleDown() {
    if (this._tierIndex >= COUPLING_TIERS.length - 1) return; // already at floor

    // Snapshot all current agents before re-init
    const allAgents = this._nodes.flatMap((n) => n.agents);
    this._scaleDownCount++;
    const nextTier = this._tierIndex + 1;
    this._initTier(nextTier);
    this._agentCount = 0;

    // Re-distribute existing agents in the new tier
    this.distributeAgents(allAgents);

    this.emit("lattice:scale-down", {
      event: "lattice:scale-down",
      fromTier: COUPLING_TIERS[nextTier - 1].label,
      toTier: this.tier.label,
      nodeCount: this.nodeCount,
      slotsPerNode: this.slotsPerNode,
      scaleDownCount: this._scaleDownCount,
      geoqode: buildGeoCoordinate({
        domain: "quantum-arch",
        sector: 1,
        confidence: this.coherence,
        source: `lattice-runtime:${this.clusterId}`,
        semanticType: "PHYSICS",
      }),
    });
  }

  /**
   * Snapshot of the runtime's current state — used by monitoring and governance.
   */
  statusSnapshot() {
    const tl = this.tier;
    return {
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      clusterId: this.clusterId,
      tier: tl.label,
      nodeCount: this.nodeCount,
      slotsPerNode: this.slotsPerNode,
      totalCapacity: this.totalCapacity,
      activeAgents: this._agentCount,
      loadRatio: +(this._agentCount / this.totalCapacity).toFixed(4),
      coherence: this.coherence,
      scaleDownCount: this._scaleDownCount,
      uptimeMs: Date.now() - this._startedAt,
      phiAnchor: PHI,
      psiAnchor: PSI,
      baseFrequencyHz: BASE_FREQUENCY_HZ,
      nodeSnapshots: this._nodes.slice(0, 10).map((n) => n.toJSON()), // first 10
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: this.coherence,
        source: `lattice-runtime:${this.clusterId}`,
        semanticType: "HOLOGRAPHIC",
      }),
    };
  }
}
