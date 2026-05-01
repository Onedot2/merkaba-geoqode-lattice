/**
 * merkaba480-os.js — MERKABA480 Upgrade Build: Unified OS Entry Point
 * @alignment 8→26→48:480
 *
 * Single-file orchestrator for the complete MERKABA480 agent-native lattice OS:
 *   LatticeRuntime       — dimensional scheduler (480→420→360 adaptive coupling)
 *   GovernanceBoard      — compliance + STATUS_REPORT certification
 *   AcceleratedLattice   — GPU/TPU hardware acceleration hooks
 *   LatticeCluster       — horizontal scaling (virtually unlimited agents)
 *   Merkaba480Monitor    — real-time coherence + load monitoring
 *
 * How it scales vs traditional OS:
 *   Traditional:  chokes at ~10k threads (context-switch overhead)
 *   MERKABA480:   dimensional execution — collision-free until coherence threshold
 *                 Safe zone: 5,000-10,000 agents per lattice
 *                 Enterprise: 50,000+ with 10-cluster expansion
 *                 Unlimited: distributed lattice clusters (horizontal expansion)
 *
 * All inter-agent communication uses the GeoQode native language —
 * every event, finding, and output carries a coordinate envelope:
 *   { architectureSignature, semanticType, frequency, latticeNode,
 *     harmonicNode, phiCoefficient, coherence, domain, source }
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED FOREVER
 * PHI = 1.618 (Golden Root) · PSI = 1.414 (Silver Bridge)
 * GOLDEN_BAND = PHI + PSI = 3.032 · digit-sum 8 = FOUNDATION_NODES
 * ALPHA_WEIGHT = PHI/3.032 ≈ 0.5337 · OMEGA_WEIGHT = PSI/3.032 ≈ 0.4663
 *
 * @module geo/lattice/merkaba480-os
 */

// ── Re-export all sub-modules for convenient single-import access ─────────────
export {
  // Runtime
  LatticeNode,
  LatticeRuntime,
  buildGeoCoordinate,
  COUPLING_TIERS,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  SEMANTIC_FREQUENCY_MAP,
} from "./merkaba480-runtime.js";

export {
  // Governance
  GovernanceBoard,
  generateStatusReport,
  SAFETY_RULES,
} from "./merkaba480-governance.js";

export {
  // Accelerated
  AcceleratedAgent,
  TPUAgent,
  AcceleratedLatticeRuntime,
} from "./merkaba480-accelerated.js";

export {
  // Cluster
  LatticeCluster,
} from "./merkaba480-cluster.js";

export {
  // Monitor
  Merkaba480Monitor,
} from "./merkaba480-monitoring.js";

export {
  // Swarm
  SwarmBridge,
} from "./merkaba480-swarm-bridge.js";

export {
  // MAXswarm intelligence
  MerkabaBeEyeMAXswarm,
  MAX_DRONE_DEFS,
  ALPHA_WEIGHT_3,
  OMEGA_WEIGHT_3,
  DELTA_WEIGHT_3,
  DELTA,
} from "../intelligence/MerkabaBeEyeMAXswarm.js";

export {
  MerkabaMAXSwarmCoordinator,
} from "../intelligence/MerkabaMAXSwarmCoordinator.js";

// ── Merkaba480OS — unified facade ─────────────────────────────────────────────

import {
  LatticeRuntime,
  buildGeoCoordinate,
  PHI,
  PSI,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  BASE_FREQUENCY_HZ,
  HARMONIC_SPECTRUM_NODES,
} from "./merkaba480-runtime.js";
import { GovernanceBoard } from "./merkaba480-governance.js";
import { AcceleratedLatticeRuntime } from "./merkaba480-accelerated.js";
import { LatticeCluster } from "./merkaba480-cluster.js";
import { Merkaba480Monitor } from "./merkaba480-monitoring.js";
import { SwarmBridge } from "./merkaba480-swarm-bridge.js"; // optional — lazy attach

// Startup assertion — fails fast if constants drift
if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
  throw new Error(
    `[Merkaba480OS] FATAL: CANONICAL_ARCHITECTURE drifted to "${CANONICAL_ARCHITECTURE}". Must be "8,26,48:480".`,
  );
}

/**
 * Merkaba480OS — the main system facade.
 *
 * Create once at application boot, then use `os.distribute()`, `os.certify()`,
 * and `os.snapshot()` everywhere.
 *
 * @example
 * import Merkaba480OS from "./geo/lattice/merkaba480-os.js";
 *
 * const os = new Merkaba480OS({ clusterCount: 2, accelerated: false });
 * os.monitor.start();
 *
 * const agents = Array.from({ length: 6000 }, (_, i) => ({
 *   id: `agent-${i}`,
 *   domain: "self-evolve",
 *   sector: 5,
 *   semanticType: "HOLOGRAPHIC",
 * }));
 *
 * os.distribute(agents);
 * os.certify({ id: "agent-0", state: "complete" });
 * console.log(os.snapshot());
 */
export class Merkaba480OS {
  /**
   * @param {object} opts
   * @param {number}  [opts.clusterCount=1]    — Initial lattice count
   * @param {boolean} [opts.accelerated=false] — Use GPU/TPU acceleration
   * @param {object}  [opts.accelerationOpts]  — Passed to AcceleratedLatticeRuntime
   * @param {string}  [opts.osId="storm"]      — System identifier
   * @param {number}  [opts.monitorIntervalMs=5000]
   * @param {boolean} [opts.autoMonitor=false] — Auto-start monitor on init
   * @param {boolean} [opts.autoSwarm=false]   — Auto-attach + start SwarmBridge on init
   * @param {object}  [opts.swarmOpts={}]       — Options forwarded to SwarmBridge
   */
  constructor({
    clusterCount = 1,
    accelerated = false,
    accelerationOpts = {},
    osId = "storm",
    monitorIntervalMs = 5_000,
    autoMonitor = false,
    autoSwarm   = false,
    swarmOpts   = {},
  } = {}) {
    // Boot assertion
    if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
      throw new Error("[Merkaba480OS] Architecture drift detected at boot.");
    }

    this.osId = osId;
    this._bootedAt = Date.now();

    // Core cluster
    this.cluster = new LatticeCluster({
      clusterCount,
      accelerated,
      accelerationOpts,
      clusterId: osId,
      withGovernance: true,
    });

    // Monitor (lazy-start unless autoMonitor)
    this.monitor = new Merkaba480Monitor({
      cluster: this.cluster,
      pollIntervalMs: monitorIntervalMs,
      monitorId: `${osId}-monitor`,
    });

    if (autoMonitor) this.monitor.start();

    // SwarmBridge (optional — lazy attach, never throws if not requested)
    this.swarm = null;
    if (autoSwarm) {
      try {
        this.swarm = new SwarmBridge(this, { bridgeId: `${osId}-swarm`, ...swarmOpts });
        this.swarm.start({ source: `merkaba480-os:${osId}` });
      } catch (e) {
        console.warn("[Merkaba480OS] SwarmBridge init failed (non-fatal):", e.message);
      }
    }

    // GeoQode boot coordinate
    this._bootCoord = buildGeoCoordinate({
      domain: "self-evolve",
      sector: 5,
      confidence: 1.0,
      source: `merkaba480-os:${osId}`,
      semanticType: "HOLOGRAPHIC",
    });

    console.log(
      `[Merkaba480OS] ⬡ Boot complete — ${CANONICAL_ARCHITECTURE_DISPLAY} | ` +
        `${this.cluster.totalCapacity} slots | ` +
        `PHI=${PHI} PSI=${PSI} GOLDEN_BAND=${+(PHI + PSI).toFixed(3)}`,
    );
  }

  // ── Delegation API ───────────────────────────────────────────────────────────

  /**
   * Distribute agents across the lattice cluster.
   * @param {object[]} agents — Each must have { id: string }
   */
  distribute(agents) {
    return this.cluster.distribute(agents);
  }

  /**
   * Certify an agent output through the GovernanceBoard.
   * @param {object} agentOutput — Must have { id: string }
   */
  certify(agentOutput) {
    return this.cluster.certify(agentOutput);
  }

  /**
   * Expand the cluster by adding more lattice runtimes.
   * @param {number} count — Number of new lattices to add
   */
  expand(count = 1) {
    return this.cluster.expand(count);
  }

  /**
   * Execute hardware-accelerated processing on AcceleratedAgents.
   */
  async execute() {
    return this.cluster.executeAccelerated();
  }

  /** Current overall coherence (0-1). */
  get coherence() {
    return this.cluster.coherence;
  }

  /** Total active agent count. */
  get activeAgents() {
    return this.cluster.totalAgents;
  }

  /** Total capacity across all lattices. */
  get totalCapacity() {
    return this.cluster.totalCapacity;
  }

  /**
   * Full OS status snapshot — GeoQode native.
   * This is what `GET /api/merkaba/os480/status` returns.
   */
  snapshot() {
    return {
      reportType: "MERKABA480_OS_STATUS",
      osId: this.osId,
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      phiAnchor: PHI,
      psiAnchor: PSI,
      goldenBand: +(PHI + PSI).toFixed(3),
      goldenDifferential: +(PHI - PSI).toFixed(3),
      alphaWeight: +(PHI / (PHI + PSI)).toFixed(4),
      omegaWeight: +(PSI / (PHI + PSI)).toFixed(4),
      baseFrequencyHz: BASE_FREQUENCY_HZ,
      harmonicSpectrumNodes: HARMONIC_SPECTRUM_NODES,
      bootedAt: new Date(this._bootedAt).toISOString(),
      uptimeMs: Date.now() - this._bootedAt,
      monitorActive: this.monitor._timer != null,
      swarmActive: this.swarm?.isRunning ?? false,
      cluster: this.cluster.statusSnapshot(),
      liveMonitor: this.monitor.snapshot(),
      swarm: this.swarm?.statusSnapshot() ?? null,
      bootGeoqode: this._bootCoord,
    };
  }

  /**
   * Attach a SwarmBridge to this OS after construction.
   * Idempotent — does nothing if a bridge is already running.
   * @param {object} [opts] — SwarmBridge options
   * @returns {SwarmBridge}
   */
  attachSwarm(opts = {}) {
    if (this.swarm?.isRunning) return this.swarm;
    this.swarm = new SwarmBridge(this, { bridgeId: `${this.osId}-swarm`, ...opts });
    this.swarm.start({ source: `merkaba480-os:${this.osId}` });
    return this.swarm;
  }
}

// ── Default export — ready to use ────────────────────────────────────────────
export default Merkaba480OS;
