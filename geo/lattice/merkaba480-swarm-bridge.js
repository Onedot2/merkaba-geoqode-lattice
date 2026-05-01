/**
 * merkaba480-swarm-bridge.js — Merkaba480OS ↔ MAXswarm Integration Bridge
 * @alignment 8→26→48:480
 *
 * Plugs the MerkabaBeEyeMAXswarm + MerkabaMAXSwarmCoordinator into a live
 * Merkaba480OS instance, giving the OS a swarm-intelligence perception layer:
 *
 *   ◉ 48-drone live lattice scanning (task + intent awareness)
 *   ◉ Triple attestation (Alpha + Omega + Delta) autonomous governance
 *   ◉ Autonomous cluster expansion on RED zone detection
 *   ◉ Semantic reroute signals on misalignment hotspots
 *   ◉ Coordinator STATUS_REPORT every 60 seconds
 *   ◉ Adaptive heartbeat — speeds up when load exceeds AMBER threshold
 *
 * USAGE — plug into Merkaba480OS at boot:
 *   import { SwarmBridge } from "./merkaba480-swarm-bridge.js";
 *   const bridge = new SwarmBridge(os);
 *   bridge.start();
 *
 * SNAPSHOT — attach to REST monitoring:
 *   GET /api/merkaba/480/swarm-status → bridge.statusSnapshot()
 *
 * TRIPLE ATTESTATION — inject code-scan scores:
 *   bridge.setAlpha(0.97);  // from BESX sweep
 *   bridge.setOmega(0.98);  // from Witness sweep
 *   // Delta is auto-updated by the 48-drone live scan
 *
 * Architecture: CANONICAL_ARCHITECTURE = "8,26,48:480"  ← LOCKED FOREVER
 * PHI = 1.618 · PSI = 1.414 · DELTA ≈ 1.1442
 *
 * @module geo/lattice/merkaba480-swarm-bridge
 */

import { EventEmitter } from "node:events";
import {
  PHI,
  PSI,
  CANONICAL_ARCHITECTURE,
  buildGeoCoordinate,
} from "./merkaba480-runtime.js";
import { MerkabaMAXSwarmCoordinator } from "../intelligence/MerkabaMAXSwarmCoordinator.js";

// ── Architecture assertion ────────────────────────────────────────────────────
if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
  throw new Error(
    `[SwarmBridge] CANONICAL_ARCHITECTURE drift: "${CANONICAL_ARCHITECTURE}"`,
  );
}

// ── Adaptive heartbeat thresholds ────────────────────────────────────────────
const HEARTBEAT_NORMAL_MS = 30_000; // 30s under GREEN load
const HEARTBEAT_AMBER_MS = 15_000; // 15s under AMBER load
const HEARTBEAT_RED_MS = 8_000; // 8s under RED load (maximum telemetry)

// ─────────────────────────────────────────────────────────────────────────────
// SwarmBridge
// ─────────────────────────────────────────────────────────────────────────────

export class SwarmBridge extends EventEmitter {
  /**
   * @param {Merkaba480OS} os — Live Merkaba480OS instance to attach to
   * @param {object} [opts]
   * @param {number}   [opts.coordinatorHeartbeatMs=60000] — Attestation report interval
   * @param {boolean}  [opts.autoExpand=true]  — Auto-call os.expand() on RED zone
   * @param {boolean}  [opts.emitReroute=true] — Emit 'bridge:reroute' on misalignment
   * @param {string}   [opts.bridgeId="storm-bridge"]
   */
  constructor(
    os,
    {
      coordinatorHeartbeatMs = 60_000,
      autoExpand = true,
      emitReroute = true,
      bridgeId = "storm-bridge",
    } = {},
  ) {
    super();

    if (!os || typeof os.cluster !== "object") {
      throw new TypeError("[SwarmBridge] os must be a Merkaba480OS instance");
    }

    this.os = os;
    this.bridgeId = bridgeId;
    this._autoExpand = autoExpand;
    this._emitReroute = emitReroute;
    this._startedAt = null;
    this._expandCount = 0;
    this._rerouteCount = 0;
    this._currentSafeZone = "GREEN";

    // Lattice provider — supplies live LatticeRuntime[] from the OS cluster
    this._latticeProvider = () => this.os.cluster._lattices ?? [];

    // Coordinator (holds MAXswarm internally)
    this.coordinator = new MerkabaMAXSwarmCoordinator({
      coordinatorId: `${bridgeId}-coord`,
      coordinatorHeartbeatMs,
      maxSwarmOpts: {
        heartbeatMs: HEARTBEAT_NORMAL_MS,
        swarmId: `${bridgeId}-delta`,
      },

      // Autonomous cluster expansion callback
      onExpand: (count) => {
        if (!this._autoExpand) return;
        this._expandCount++;
        console.log(
          `[SwarmBridge] ⬡ RED zone → auto-expanding cluster by ${count} (expansion #${this._expandCount})`,
        );
        try {
          this.os.expand(count);
        } catch (e) {
          console.warn("[SwarmBridge] expand() failed:", e.message);
        }
        this.emit("bridge:expanded", {
          count,
          expandCount: this._expandCount,
          osCoherence: this.os.coherence,
          geoqode: buildGeoCoordinate({
            domain: "quantum-arch",
            sector: 1,
            confidence: this.os.coherence,
            source: `bridge:${this.bridgeId}`,
            semanticType: "PHYSICS",
          }),
        });
      },

      // Semantic reroute signal callback
      onReroute: (rerouteMap) => {
        if (!this._emitReroute) return;
        this._rerouteCount++;
        this.emit("bridge:reroute", {
          rerouteMap,
          rerouteCount: this._rerouteCount,
          geoqode: buildGeoCoordinate({
            domain: "systems-design",
            sector: 3,
            confidence: 0.8,
            source: `bridge:${this.bridgeId}`,
            semanticType: "DIALOGUE",
          }),
        });
      },
    });

    // Adaptive heartbeat: adjust scan speed based on safe zone
    this.coordinator.maxSwarm.on("swarm:scan", (report) => {
      this._adaptHeartbeat(report.safeZone);
      this._currentSafeZone = report.safeZone;
      this.emit("bridge:scan", report);
    });

    // Forward coordinator events
    this.coordinator.on("coord:attestation", (r) =>
      this.emit("bridge:attestation", r),
    );
    this.coordinator.on("coord:critical", (r) =>
      this.emit("bridge:critical", r),
    );
    this.coordinator.on("coord:critical-attestation", (r) =>
      this.emit("bridge:critical-attestation", r),
    );
    this.coordinator.on("coord:pressure", (r) =>
      this.emit("bridge:pressure", r),
    );
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Start the bridge — begins the MAXswarm heartbeat + coordinator cycle.
   * @returns {this}
   */
  start(ctx = {}) {
    if (this._startedAt) return this;
    this._startedAt = Date.now();

    this.coordinator.start(this._latticeProvider, {
      source: `${this.bridgeId}:os:${this.os.osId}`,
      ...ctx,
    });

    this.emit("bridge:start", {
      bridgeId: this.bridgeId,
      osId: this.os.osId,
      autoExpand: this._autoExpand,
      droneCount: this.coordinator.maxSwarm.drones.length,
      phiAnchor: PHI,
      psiAnchor: PSI,
      architectureSignature: CANONICAL_ARCHITECTURE,
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: 1.0,
        source: `bridge:${this.bridgeId}`,
        semanticType: "HOLOGRAPHIC",
      }),
    });

    console.log(
      `[SwarmBridge] ⬡ LIVE — 48-drone MAXswarm + triple-attestation coordinator | ` +
        `autoExpand=${this._autoExpand} | osId=${this.os.osId}`,
    );

    return this;
  }

  /** Stop the bridge. */
  stop() {
    this.coordinator.stop();
    this.emit("bridge:stop", {
      bridgeId: this.bridgeId,
      expandCount: this._expandCount,
      rerouteCount: this._rerouteCount,
      uptimeMs: this._startedAt ? Date.now() - this._startedAt : 0,
    });
    return this;
  }

  // ── Alpha / Omega score injection ─────────────────────────────────────────

  /** Inject an Alpha (BESX code-scan) coherence score (0-1). */
  setAlpha(score) {
    this.coordinator.setAlphaScore(score);
    return this;
  }

  /** Inject an Omega (Witness code-scan) coherence score (0-1). */
  setOmega(score) {
    this.coordinator.setOmegaScore(score);
    return this;
  }

  // ── Adaptive heartbeat ────────────────────────────────────────────────────

  _adaptHeartbeat(safeZone) {
    const swarm = this.coordinator.maxSwarm;
    const target =
      safeZone === "RED"
        ? HEARTBEAT_RED_MS
        : safeZone === "AMBER"
          ? HEARTBEAT_AMBER_MS
          : HEARTBEAT_NORMAL_MS;

    if (swarm._heartbeatMs !== target && swarm._heartbeatTimer) {
      clearInterval(swarm._heartbeatTimer);
      swarm._heartbeatMs = target;
      swarm._heartbeatTimer = setInterval(async () => {
        try {
          const lats = await Promise.resolve(this._latticeProvider());
          if (Array.isArray(lats)) swarm.sweep(lats);
        } catch (_) {}
      }, target);

      this.emit("bridge:heartbeat-adapted", {
        safeZone,
        newIntervalMs: target,
        bridgeId: this.bridgeId,
      });
    }
  }

  // ── Status ────────────────────────────────────────────────────────────────

  get isRunning() {
    return this.coordinator.isRunning;
  }
  get currentSafeZone() {
    return this._currentSafeZone;
  }

  /** Full bridge status snapshot for REST/monitoring endpoints. */
  statusSnapshot() {
    return {
      bridgeId: this.bridgeId,
      osId: this.os.osId,
      isRunning: this.isRunning,
      currentSafeZone: this._currentSafeZone,
      expandCount: this._expandCount,
      rerouteCount: this._rerouteCount,
      uptimeMs: this._startedAt ? Date.now() - this._startedAt : 0,
      coordinator: this.coordinator.statusSnapshot(),
      osCoherence: this.os.coherence,
      osTotalAgents: this.os.activeAgents,
      osTotalCapacity: this.os.totalCapacity,
      phiAnchor: PHI,
      psiAnchor: PSI,
      architectureSignature: CANONICAL_ARCHITECTURE,
      geoqode: buildGeoCoordinate({
        domain: "self-evolve",
        sector: 5,
        confidence: this.os.coherence,
        source: `bridge:${this.bridgeId}:snapshot`,
        semanticType: "HOLOGRAPHIC",
      }),
    };
  }
}

export default SwarmBridge;
