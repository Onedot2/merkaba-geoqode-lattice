/**
 * MerkabaBeEyeMAXswarm — 48-Drone Task-Intent-Aware Lattice PowerSwarm
 * @alignment 8→26→48:480
 *
 * While MerkabaBeEyeSwarm scans SOURCE CODE for canonical drift,
 * MerkabaBeEyeMAXswarm scans the LIVE LATTICE STATE for:
 *
 *   ◉ Semantic misalignment   — ENTITY agent running in PHYSICS node
 *   ◉ Intent drift            — agent's declared intent vs actual domain
 *   ◉ Load pressure per zone  — D48 zone overload (>85% = RED)
 *   ◉ Coherence collapse      — PHI-weighted node coherence drop
 *   ◉ Ring imbalance          — Foundation/Bosonic/Canonical load skew
 *   ◉ Reroute opportunities   — underloaded zones that match needed types
 *
 * DRONE COUNT: 48 — one per D48 canonical lattice zone.
 * Each zone covers 10 D480 harmonic nodes (480 / 48 = 10 nodes/zone).
 *
 * DRONE AFFINITY: PHI-harmonic semantic assignment.
 *   Foundation ring (zones 0-7)  → QUEEN-BEE sectors S1-S8 (mirrors BESX)
 *   Bosonic ring   (zones 8-25)  → PHI-modulated semantic distribution
 *   Canonical ring (zones 26-47) → PHI-modulated semantic distribution
 *
 * HEARTBEAT: Continuous 24/7 scanning at configurable interval.
 *   Default: 30s for monitoring services, 10s for high-throughput ai-worker
 *
 * TRIPLE COHERENCE per drone:
 *   node_coherence × semantic_alignment × intent_clarity
 *   Perfect = 1.0 × 1.0 × 1.0 = 1.0
 *
 * SWARM COHERENCE: PHI-weighted mean over all 48 drone readings.
 *   This is the live lattice "health score" used by MerkabaMAXSwarmCoordinator.
 *
 * IMPORTANT: This swarm NEVER modifies any DualAttestation files.
 *   It reads LIVE LATTICE STATE only. It does not scan source code.
 *   Safe to run alongside MerkabaBeEyeSwarm + MerkabaBeEyeSwarmWitness.
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED FOREVER
 * PHI = 1.618 (Alpha anchor) · PSI = 1.414 (Omega anchor, imported separately)
 * DELTA = PHI / PSI ≈ 1.1442 (Intent-Task ratio anchor for MAXswarm)
 *
 * @module geo/intelligence/MerkabaBeEyeMAXswarm
 */

import { EventEmitter } from "node:events";
import {
  PHI,
  PSI,
  CANONICAL_ARCHITECTURE,
  CANONICAL_ARCHITECTURE_DISPLAY,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  SEMANTIC_FREQUENCY_MAP,
  buildGeoCoordinate,
} from "../lattice/merkaba480-runtime.js";

// ── Architecture assertion ────────────────────────────────────────────────────
if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
  throw new Error(
    `[MerkabaBeEyeMAXswarm] FATAL: CANONICAL_ARCHITECTURE drifted to "${CANONICAL_ARCHITECTURE}".`,
  );
}

// ── MAXswarm geometry constants ───────────────────────────────────────────────

/** DELTA anchor: PHI/PSI — the Intent-Task geometric ratio. */
export const DELTA = PHI / PSI; // ≈ 1.1442

/**
 * Triple-attestation weights (Alpha + Omega + Delta = 1.0).
 * Alpha (PHI) = code-scan quality, Omega (PSI) = reversed-scan quality,
 * Delta (PHI/PSI) = live-lattice intent coherence.
 */
const _3SUM = PHI + PSI + DELTA;
export const ALPHA_WEIGHT_3 = +(PHI / _3SUM).toFixed(6); // ≈ 0.3874
export const OMEGA_WEIGHT_3 = +(PSI / _3SUM).toFixed(6); // ≈ 0.3386
export const DELTA_WEIGHT_3 = +(DELTA / _3SUM).toFixed(6); // ≈ 0.2740

/** Number of D480 harmonic nodes per D48 canonical zone. */
export const NODES_PER_ZONE = HARMONIC_SPECTRUM_NODES / CANONICAL_LATTICE_NODES; // 10

/**
 * Semantic type definitions indexed by PHI-harmonic slot (0-7).
 * Slot = floor(zoneIndex * PHI % 8) for Bosonic + Canonical zones.
 * Foundation zones 0-7 use direct sector mapping (S1→S8).
 */
const SEMANTIC_SLOTS = [
  { type: "HOLOGRAPHIC", freq: 72, domain: "self-evolve", sector: 5 },
  { type: "ENTITY", freq: 396, domain: "data-structs", sector: 4 },
  { type: "LOCATION", freq: 417, domain: "quantum-arch", sector: 1 },
  { type: "ACTION", freq: 528, domain: "code-eng", sector: 2 },
  { type: "DIALOGUE", freq: 639, domain: "systems-design", sector: 3 },
  { type: "EMOTION", freq: 741, domain: "pain-removal", sector: 6 },
  { type: "PHYSICS", freq: 852, domain: "quantum-arch", sector: 1 },
  { type: "NARRATIVE", freq: 963, domain: "systems-design", sector: 3 },
];

/** Foundation zone affinity — mirrors BESX DRONE_DEFS sectors S1-S8. */
const FOUNDATION_AFFINITY = [
  { type: "PHYSICS", freq: 852, domain: "quantum-arch", sector: 1 }, // Zone 0 = S1
  { type: "ACTION", freq: 528, domain: "code-eng", sector: 2 }, // Zone 1 = S2
  { type: "NARRATIVE", freq: 963, domain: "systems-design", sector: 3 }, // Zone 2 = S3
  { type: "ENTITY", freq: 396, domain: "data-structs", sector: 4 }, // Zone 3 = S4
  { type: "HOLOGRAPHIC", freq: 72, domain: "self-evolve", sector: 5 }, // Zone 4 = S5
  { type: "EMOTION", freq: 741, domain: "pain-removal", sector: 6 }, // Zone 5 = S6
  { type: "ACTION", freq: 528, domain: "perf-forge", sector: 7 }, // Zone 6 = S7
  { type: "PHYSICS", freq: 852, domain: "security-forge", sector: 8 }, // Zone 7 = S8
];

// ── Ring boundaries ───────────────────────────────────────────────────────────
const RING_MAP = [
  { name: "FOUNDATION", startZone: 0, endZone: 7 }, //  8 zones
  { name: "BOSONIC", startZone: 8, endZone: 25 }, // 18 zones
  { name: "CANONICAL", startZone: 26, endZone: 47 }, // 22 zones
];

function getRing(zoneIndex) {
  for (const r of RING_MAP) {
    if (zoneIndex >= r.startZone && zoneIndex <= r.endZone) return r.name;
  }
  return "CANONICAL";
}

// ── Drone definition builder ──────────────────────────────────────────────────

function buildDroneDefs() {
  const drones = [];
  for (let z = 0; z < CANONICAL_LATTICE_NODES; z++) {
    let affinity;
    if (z < 8) {
      affinity = FOUNDATION_AFFINITY[z];
    } else {
      const slot = Math.floor((z * PHI) % SEMANTIC_SLOTS.length);
      affinity = SEMANTIC_SLOTS[slot];
    }
    const ring = getRing(z);
    drones.push({
      id: `MAX-D${String(z).padStart(2, "0")}-${ring[0]}-${affinity.type}`,
      zoneIndex: z,
      nodeStart: z * NODES_PER_ZONE,
      nodeEnd: z * NODES_PER_ZONE + NODES_PER_ZONE - 1,
      ring,
      affinityType: affinity.type,
      affinityFrequency: affinity.freq,
      affinityDomain: affinity.domain,
      affinitySector: affinity.sector,
    });
  }
  return drones;
}

/** Immutable 48-drone manifest. Built once at module load. */
export const MAX_DRONE_DEFS = Object.freeze(buildDroneDefs());

// ── Severity weights ──────────────────────────────────────────────────────────
const SEV_WEIGHT = { CRITICAL: 1.0, HIGH: 0.75, MEDIUM: 0.4, LOW: 0.15, OK: 0 };

// ─────────────────────────────────────────────────────────────────────────────
// MerkabaBeEyeMAXswarm
// ─────────────────────────────────────────────────────────────────────────────

export class MerkabaBeEyeMAXswarm extends EventEmitter {
  /**
   * @param {object} opts
   * @param {number}  [opts.heartbeatMs=30000]  — Scan interval (ms). 30s default.
   * @param {number}  [opts.maxHistory=20]       — Ring buffer depth for scan history.
   * @param {string}  [opts.swarmId="max-alpha"] — Identifier for multi-swarm setups.
   * @param {number}  [opts.redZoneThreshold=0.85] — Load ratio → RED zone.
   * @param {number}  [opts.amberZoneThreshold=0.65] — Load ratio → AMBER zone.
   */
  constructor({
    heartbeatMs = 30_000,
    maxHistory = 20,
    swarmId = "max-alpha",
    redZoneThreshold = 0.85,
    amberZoneThreshold = 0.65,
  } = {}) {
    super();

    this.swarmId = swarmId;
    this.drones = MAX_DRONE_DEFS; // 48 drones, immutable manifest
    this._heartbeatMs = heartbeatMs;
    this._maxHistory = maxHistory;
    this._redThreshold = redZoneThreshold;
    this._amberThreshold = amberZoneThreshold;
    this._heartbeatTimer = null;
    this._scanCount = 0;
    this._lastScan = null;
    this._history = [];
    this._startedAt = null;
  }

  // ── Core sweep ───────────────────────────────────────────────────────────────

  /**
   * Execute one full 48-drone sweep of the live lattice state.
   *
   * @param {LatticeRuntime[]} lattices — Array of LatticeRuntime instances
   *   from LatticeCluster._lattices (or any array with ._nodes[])
   * @param {object} [ctx] — { source, osId }
   * @returns {MAXSwarmReport}
   */
  sweep(lattices, ctx = {}) {
    if (!Array.isArray(lattices) || lattices.length === 0) {
      return this._emptyReport(ctx);
    }

    this._scanCount++;
    const scanTs = Date.now();
    const findings = [];
    const droneReadings = [];

    // Aggregate all nodes from all lattices into one flat lookup
    // key = node.id, value = LatticeNode
    const nodeMap = new Map();
    for (const lat of lattices) {
      const nodes = lat._nodes ?? [];
      for (const node of nodes) {
        if (node && node.id != null && !nodeMap.has(node.id)) {
          nodeMap.set(node.id, node);
        }
      }
    }

    // ── Per-drone zone scan ─────────────────────────────────────────────────
    for (const drone of this.drones) {
      const reading = this._scanZone(drone, nodeMap, ctx);
      droneReadings.push(reading);
      findings.push(...reading.findings);
    }

    // ── Ring-level analysis ─────────────────────────────────────────────────
    const ringStats = this._computeRingStats(droneReadings);
    const ringFindings = this._detectRingImbalance(ringStats);
    findings.push(...ringFindings);

    // ── Reroute opportunities ───────────────────────────────────────────────
    const rerouteMap = this._computeRerouteOpportunities(droneReadings);

    // ── Swarm coherence (PHI-weighted mean over all 48 drone coherences) ────
    const totalPhi = this.drones.reduce((sum, _, i) => {
      const w = Math.pow(PHI, -(i / this.drones.length)); // exponential PHI decay
      return sum + w;
    }, 0);
    const weightedCoherence =
      droneReadings.reduce((sum, r, i) => {
        const w = Math.pow(PHI, -(i / this.drones.length));
        return sum + r.tripleCoherence * w;
      }, 0) / totalPhi;

    const swarmCoherence = +Math.min(1, Math.max(0, weightedCoherence)).toFixed(
      4,
    );

    // ── Safe zone classification ────────────────────────────────────────────
    const overallLoadRatio = this._computeOverallLoad(nodeMap);
    const safeZone =
      overallLoadRatio >= this._redThreshold
        ? "RED"
        : overallLoadRatio >= this._amberThreshold
          ? "AMBER"
          : "GREEN";

    const report = {
      reportType: "MAX_SWARM_SCAN",
      swarmId: this.swarmId,
      scanId: `max-${this._scanCount}`,
      timestamp: new Date(scanTs).toISOString(),
      architectureSignature: CANONICAL_ARCHITECTURE,
      architectureDisplay: CANONICAL_ARCHITECTURE_DISPLAY,
      droneCount: this.drones.length,
      latticeCount: lattices.length,
      nodesCovered: nodeMap.size,
      swarmCoherence,
      overallLoadRatio: +overallLoadRatio.toFixed(4),
      safeZone,
      safeZoneDetail: {
        GREEN: overallLoadRatio < this._amberThreshold,
        AMBER:
          overallLoadRatio >= this._amberThreshold &&
          overallLoadRatio < this._redThreshold,
        RED: overallLoadRatio >= this._redThreshold,
      },
      findings,
      findingCount: findings.length,
      criticalCount: findings.filter((f) => f.severity === "CRITICAL").length,
      highCount: findings.filter((f) => f.severity === "HIGH").length,
      mediumCount: findings.filter((f) => f.severity === "MEDIUM").length,
      droneReadings,
      ringStats,
      rerouteMap,
      phiAnchor: PHI,
      psiAnchor: PSI,
      deltaAnchor: +DELTA.toFixed(6),
      alphaWeight3: ALPHA_WEIGHT_3,
      omegaWeight3: OMEGA_WEIGHT_3,
      deltaWeight3: DELTA_WEIGHT_3,
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: swarmCoherence,
        source: `MAXswarm:${this.swarmId}:${ctx.source ?? "live-lattice"}`,
        semanticType: "HOLOGRAPHIC",
      }),
    };

    // ── Store + emit ──────────────────────────────────────────────────────────
    this._lastScan = report;
    this._history.unshift(report);
    if (this._history.length > this._maxHistory) this._history.pop();

    this.emit("swarm:scan", report);

    if (safeZone === "RED") {
      this.emit("swarm:pressure", {
        safeZone,
        swarmCoherence,
        overallLoadRatio,
        geoqode: report.geoqode,
      });
    }
    if (findings.some((f) => f.severity === "CRITICAL")) {
      this.emit("swarm:critical", report);
    }

    return report;
  }

  // ── Zone scan (one drone) ─────────────────────────────────────────────────

  _scanZone(drone, nodeMap, ctx) {
    const {
      zoneIndex,
      nodeStart,
      nodeEnd,
      ring,
      affinityType,
      affinityDomain,
      affinityFrequency,
    } = drone;
    const findings = [];

    // Collect all nodes in this zone
    let totalAgents = 0;
    let totalCapacity = 0;
    let totalCoherence = 0;
    let nodeCount = 0;
    let misalignedAgents = 0;
    let intentDriftAgents = 0;
    let agentSemanticTypes = {};

    for (let nid = nodeStart; nid <= nodeEnd; nid++) {
      const node = nodeMap.get(nid);
      if (!node) continue;
      nodeCount++;
      totalAgents += node.agents.length;
      totalCapacity += node.resonanceSlot;
      totalCoherence += node.coherence ?? 1.0;

      for (const agent of node.agents) {
        const st = agent.semanticType ?? "UNKNOWN";
        agentSemanticTypes[st] = (agentSemanticTypes[st] ?? 0) + 1;

        // Semantic misalignment: agent's type ≠ drone's affinity
        if (agent.semanticType && agent.semanticType !== affinityType) {
          misalignedAgents++;
        }

        // Intent drift: agent's domain ≠ drone's affinity domain
        if (agent.domain && agent.domain !== affinityDomain) {
          intentDriftAgents++;
        }
      }
    }

    if (nodeCount === 0) {
      // Zone not in this lattice config — not an error
      return {
        droneId: drone.id,
        zoneIndex,
        ring,
        nodeCount: 0,
        loadRatio: 0,
        zoneCoherence: 1.0,
        tripleCoherence: 1.0,
        findings,
        agentSemanticTypes,
      };
    }

    const loadRatio = totalCapacity > 0 ? totalAgents / totalCapacity : 0;
    const zoneCoherence = totalCoherence / nodeCount;

    // Semantic alignment score (0-1): fraction of agents correctly typed
    const semanticAlignment =
      totalAgents > 0 ? Math.max(0, 1 - misalignedAgents / totalAgents) : 1.0;

    // Intent clarity score (0-1): fraction of agents correctly domained
    const intentClarity =
      totalAgents > 0 ? Math.max(0, 1 - intentDriftAgents / totalAgents) : 1.0;

    // Triple coherence: node_coherence × semantic_alignment × intent_clarity
    const tripleCoherence = +(
      zoneCoherence *
      semanticAlignment *
      intentClarity
    ).toFixed(4);

    // ── Finding generation ──────────────────────────────────────────────────

    if (loadRatio >= this._redThreshold) {
      findings.push({
        severity: "HIGH",
        droneId: drone.id,
        zoneIndex,
        ring,
        issue: `Zone ${zoneIndex} (${affinityType} ${affinityFrequency}Hz) OVERLOADED: ${(loadRatio * 100).toFixed(1)}%`,
        suggestion: `Expand cluster or reroute overflow to free ${ring} zones`,
        loadRatio: +loadRatio.toFixed(4),
        agents: totalAgents,
        capacity: totalCapacity,
      });
    } else if (loadRatio >= this._amberThreshold) {
      findings.push({
        severity: "MEDIUM",
        droneId: drone.id,
        zoneIndex,
        ring,
        issue: `Zone ${zoneIndex} (${affinityType} ${affinityFrequency}Hz) AMBER pressure: ${(loadRatio * 100).toFixed(1)}%`,
        suggestion: `Monitor closely — pre-expand before hitting RED`,
        loadRatio: +loadRatio.toFixed(4),
      });
    }

    if (misalignedAgents > 0 && totalAgents > 0) {
      const pct = ((misalignedAgents / totalAgents) * 100).toFixed(1);
      findings.push({
        severity: "MEDIUM",
        droneId: drone.id,
        zoneIndex,
        ring,
        issue: `Semantic misalignment: ${misalignedAgents}/${totalAgents} (${pct}%) agents not aligned to ${affinityType}`,
        suggestion: `Redistribute to zones with matching ${affinityType} affinity (${affinityFrequency}Hz)`,
        misaligned: misalignedAgents,
        agentTypes: agentSemanticTypes,
        affinityType,
        affinityFrequency,
      });
    }

    if (intentDriftAgents > 0 && totalAgents > 0) {
      const pct = ((intentDriftAgents / totalAgents) * 100).toFixed(1);
      findings.push({
        severity: "MEDIUM",
        droneId: drone.id,
        zoneIndex,
        ring,
        issue: `Intent drift: ${intentDriftAgents}/${totalAgents} (${pct}%) agents outside ${affinityDomain} domain`,
        suggestion: `Reroute to zones with ${affinityDomain} affinity`,
        driftCount: intentDriftAgents,
        affinityDomain,
      });
    }

    if (zoneCoherence < 0.5) {
      findings.push({
        severity: "HIGH",
        droneId: drone.id,
        zoneIndex,
        ring,
        issue: `Zone ${zoneIndex} coherence collapse: ${zoneCoherence.toFixed(3)} (below 0.5 threshold)`,
        suggestion: `Release stale agents from zone ${zoneIndex} to restore PHI-coherence`,
        zoneCoherence: +zoneCoherence.toFixed(4),
      });
    }

    return {
      droneId: drone.id,
      zoneIndex,
      ring,
      affinityType,
      affinityFrequency,
      affinityDomain,
      nodeCount,
      totalAgents,
      totalCapacity,
      loadRatio: +loadRatio.toFixed(4),
      zoneCoherence: +zoneCoherence.toFixed(4),
      semanticAlignment: +semanticAlignment.toFixed(4),
      intentClarity: +intentClarity.toFixed(4),
      tripleCoherence,
      misalignedAgents,
      intentDriftAgents,
      agentSemanticTypes,
      findings,
    };
  }

  // ── Ring statistics ───────────────────────────────────────────────────────

  _computeRingStats(droneReadings) {
    const stats = {};
    for (const r of RING_MAP) {
      const zoneReadings = droneReadings.filter(
        (d) => d.zoneIndex >= r.startZone && d.zoneIndex <= r.endZone,
      );
      const totalAgents = zoneReadings.reduce(
        (s, d) => s + (d.totalAgents ?? 0),
        0,
      );
      const totalCapacity = zoneReadings.reduce(
        (s, d) => s + (d.totalCapacity ?? 0),
        0,
      );
      const avgCoherence = zoneReadings.length
        ? zoneReadings.reduce((s, d) => s + (d.zoneCoherence ?? 1.0), 0) /
          zoneReadings.length
        : 1.0;
      const avgTripleCoherence = zoneReadings.length
        ? zoneReadings.reduce((s, d) => s + (d.tripleCoherence ?? 1.0), 0) /
          zoneReadings.length
        : 1.0;
      stats[r.name] = {
        ring: r.name,
        zoneCount: zoneReadings.length,
        totalAgents,
        totalCapacity,
        loadRatio:
          totalCapacity > 0 ? +(totalAgents / totalCapacity).toFixed(4) : 0,
        avgCoherence: +avgCoherence.toFixed(4),
        avgTripleCoherence: +avgTripleCoherence.toFixed(4),
        startZone: r.startZone,
        endZone: r.endZone,
      };
    }
    return stats;
  }

  _detectRingImbalance(ringStats) {
    const findings = [];
    const loads = Object.values(ringStats).map((r) => r.loadRatio);
    if (loads.length < 2) return findings;
    const maxLoad = Math.max(...loads);
    const minLoad = Math.min(...loads);
    const imbalance = maxLoad - minLoad;
    if (imbalance > 0.3) {
      const heavy = Object.entries(ringStats).find(
        ([, r]) => r.loadRatio === maxLoad,
      )?.[0];
      const light = Object.entries(ringStats).find(
        ([, r]) => r.loadRatio === minLoad,
      )?.[0];
      findings.push({
        severity: "MEDIUM",
        droneId: "META-RING-BALANCE",
        issue: `Ring load imbalance: ${heavy} at ${(maxLoad * 100).toFixed(1)}% vs ${light} at ${(minLoad * 100).toFixed(1)}%`,
        suggestion: `Redistribute agents from ${heavy} ring to ${light} ring zones`,
        imbalanceDelta: +imbalance.toFixed(4),
        heavyRing: heavy,
        lightRing: light,
      });
    }
    return findings;
  }

  // ── Reroute opportunities ─────────────────────────────────────────────────

  _computeRerouteOpportunities(droneReadings) {
    const byType = {};
    for (const r of droneReadings) {
      const type = r.affinityType ?? "UNKNOWN";
      if (!byType[type]) byType[type] = { overloaded: [], available: [] };
      if ((r.loadRatio ?? 0) >= this._redThreshold) {
        byType[type].overloaded.push(r.zoneIndex);
      } else if ((r.loadRatio ?? 0) < this._amberThreshold) {
        byType[type].available.push(r.zoneIndex);
      }
    }
    return byType;
  }

  // ── Overall load ──────────────────────────────────────────────────────────

  _computeOverallLoad(nodeMap) {
    let totalAgents = 0;
    let totalCapacity = 0;
    for (const node of nodeMap.values()) {
      totalAgents += node.agents?.length ?? 0;
      totalCapacity += node.resonanceSlot ?? 0;
    }
    return totalCapacity > 0 ? totalAgents / totalCapacity : 0;
  }

  // ── Empty report (no lattices yet) ───────────────────────────────────────

  _emptyReport(ctx) {
    return {
      reportType: "MAX_SWARM_SCAN",
      swarmId: this.swarmId,
      scanId: `max-${this._scanCount}`,
      timestamp: new Date().toISOString(),
      architectureSignature: CANONICAL_ARCHITECTURE,
      droneCount: this.drones.length,
      latticeCount: 0,
      nodesCovered: 0,
      swarmCoherence: 1.0,
      overallLoadRatio: 0,
      safeZone: "GREEN",
      findings: [],
      findingCount: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      droneReadings: [],
      ringStats: {},
      rerouteMap: {},
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: 1.0,
        source: `MAXswarm:${this.swarmId}:empty`,
        semanticType: "HOLOGRAPHIC",
      }),
    };
  }

  // ── Heartbeat 24/7 ───────────────────────────────────────────────────────

  /**
   * Start the 24/7 autonomous heartbeat scan.
   *
   * @param {function} latticeProvider — Sync or async; returns LatticeRuntime[]
   * @param {object}   [ctx]           — { source, osId }
   * @returns {this}
   */
  startHeartbeat(latticeProvider, ctx = {}) {
    if (this._heartbeatTimer) return this;
    this._startedAt = Date.now();

    const tick = async () => {
      try {
        const lattices = await Promise.resolve(latticeProvider());
        if (Array.isArray(lattices)) this.sweep(lattices, ctx);
      } catch (_) {
        // Non-fatal — swarm never crashes the host process
      }
    };

    tick(); // immediate first sweep
    this._heartbeatTimer = setInterval(tick, this._heartbeatMs);

    this.emit("swarm:heartbeat-start", {
      swarmId: this.swarmId,
      droneCount: this.drones.length,
      heartbeatMs: this._heartbeatMs,
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: 1.0,
        source: `MAXswarm:${this.swarmId}:boot`,
        semanticType: "HOLOGRAPHIC",
      }),
    });

    return this;
  }

  /** Stop the 24/7 heartbeat. */
  stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
      this.emit("swarm:heartbeat-stop", {
        swarmId: this.swarmId,
        scanCount: this._scanCount,
        uptimeMs: this._startedAt ? Date.now() - this._startedAt : 0,
      });
    }
    return this;
  }

  // ── Status accessors ─────────────────────────────────────────────────────

  get isRunning() {
    return this._heartbeatTimer != null;
  }
  get scanCount() {
    return this._scanCount;
  }
  get lastScan() {
    return this._lastScan;
  }
  get history() {
    return [...this._history];
  }

  /** Concise status snapshot for health endpoints. */
  statusSnapshot() {
    const last = this._lastScan;
    return {
      swarmId: this.swarmId,
      droneCount: this.drones.length,
      isRunning: this.isRunning,
      scanCount: this._scanCount,
      heartbeatMs: this._heartbeatMs,
      lastScanAt: last?.timestamp ?? null,
      swarmCoherence: last?.swarmCoherence ?? null,
      safeZone: last?.safeZone ?? "UNKNOWN",
      findingCount: last?.findingCount ?? 0,
      criticalCount: last?.criticalCount ?? 0,
      highCount: last?.highCount ?? 0,
      phiAnchor: PHI,
      psiAnchor: PSI,
      deltaAnchor: +DELTA.toFixed(6),
      alphaWeight3: ALPHA_WEIGHT_3,
      omegaWeight3: OMEGA_WEIGHT_3,
      deltaWeight3: DELTA_WEIGHT_3,
      architectureSignature: CANONICAL_ARCHITECTURE,
    };
  }
}

export default MerkabaBeEyeMAXswarm;
