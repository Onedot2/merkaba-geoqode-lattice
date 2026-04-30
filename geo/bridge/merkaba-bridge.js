// geo/bridge/merkaba-bridge.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// Phase 4: MERKABA Integration Bridge
// Connects GeoQode runtime to s4ai-core Storm Brain and external consumers.

import { EventEmitter } from "events";
import { MerkabageoqodeOS } from "../index.js";

const MAX_EXECUTION_HISTORY = 1000;

/**
 * MerkabaBridge — event-driven adapter between GeoQode runtime and Storm AI.
 *
 * Usage:
 *   import { MerkabaBridge } from './geo/bridge/merkaba-bridge.js';
 *   const bridge = new MerkabaBridge();
 *   bridge.on('execution:complete', ({ result, report }) => { ... });
 *   await bridge.executeGeo(sourceCode);
 */
export class MerkabaBridge extends EventEmitter {
  constructor(options = {}) {
    super();
    this.os = new MerkabageoqodeOS();
    this.options = {
      stormBrainUrl: options.stormBrainUrl || null,
      apiKey: options.apiKey || null,
      emitToStorm: options.emitToStorm || false,
      timeout: options.timeout || 30_000,
    };
    this.executionHistory = [];
    this._pluginHooks = {};
  }

  /**
   * Execute a GeoQode program string and emit lifecycle events.
   * @param {string} source - GeoQode source code
   * @param {object} meta - Optional metadata attached to the run
   */
  async executeGeo(source, meta = {}) {
    const runId = `RUN-${Date.now()}`;
    const startTime = Date.now();

    this.emit("execution:start", { runId, meta, timestamp: startTime });

    try {
      const result = await this.os.run(source);
      const report = this.os.getStatusReport();
      const elapsed = Date.now() - startTime;

      const record = {
        runId,
        meta,
        success: result.success,
        elapsed,
        report,
        timestamp: startTime,
      };

      this.executionHistory.push(record);
      if (this.executionHistory.length > MAX_EXECUTION_HISTORY) {
        this.executionHistory = this.executionHistory.slice(
          -MAX_EXECUTION_HISTORY,
        );
      }

      if (result.success) {
        this.emit("execution:complete", record);
        await this._runHook("onSuccess", record);
      } else {
        this.emit("execution:failed", { ...record, error: result.error });
        await this._runHook("onFailure", { ...record, error: result.error });
      }

      if (this.options.emitToStorm && this.options.stormBrainUrl) {
        await this._forwardToStorm(record);
      }

      return record;
    } catch (err) {
      const errRecord = { runId, meta, success: false, error: err.message };
      this.emit("execution:error", errRecord);
      await this._runHook("onError", errRecord);
      return errRecord;
    }
  }

  /**
   * Execute a .geo file (given its resolved path string via Node import.meta)
   * @param {string} filePath - Absolute path to .geo file
   */
  async executeFile(filePath) {
    const { readFileSync } = await import("fs");
    const source = readFileSync(filePath, "utf8");
    return this.executeGeo(source, { filePath });
  }

  /**
   * Register a plugin hook.
   * @param {'onSuccess'|'onFailure'|'onError'} event
   * @param {Function} handler
   */
  registerHook(event, handler) {
    if (!this._pluginHooks[event]) this._pluginHooks[event] = [];
    this._pluginHooks[event].push(handler);
  }

  /**
   * Get execution history (all runs).
   */
  getHistory() {
    return this.executionHistory;
  }

  /**
   * Get summary stats across all runs.
   */
  getStats() {
    const total = this.executionHistory.length;
    const successes = this.executionHistory.filter((r) => r.success).length;
    const avgElapsed =
      total > 0
        ? this.executionHistory.reduce((s, r) => s + (r.elapsed || 0), 0) /
          total
        : 0;

    return {
      total,
      successes,
      failures: total - successes,
      successRate:
        total > 0 ? ((successes / total) * 100).toFixed(1) + "%" : "0%",
      avgElapsedMs: Math.round(avgElapsed),
    };
  }

  /**
   * Reset the bridge (clears OS state and history).
   */
  reset() {
    this.os = new MerkabageoqodeOS();
    this.executionHistory = [];
    this.emit("bridge:reset", { timestamp: Date.now() });
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  async _runHook(event, data) {
    const hooks = this._pluginHooks[event] || [];
    for (const fn of hooks) {
      try {
        await fn(data);
      } catch (e) {
        this.emit("hook:error", { event, error: e.message });
      }
    }
  }

  async _forwardToStorm(record) {
    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutMs = Number(this.options.timeout) || 30_000;
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

    try {
      const fetchImpl =
        globalThis.fetch ||
        (await import("node-fetch")
          .then((mod) => mod.default)
          .catch(() => null));
      const fetch = fetchImpl;
      if (!fetch) return;

      await fetch(`${this.options.stormBrainUrl}/api/geoqode/execution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.apiKey}`,
        },
        body: JSON.stringify(record),
        signal: controller?.signal,
      });
    } catch (error) {
      console.error("[MerkabaBridge] Storm forward failed:", error.message);
      // non-fatal: Storm forwarding is best-effort
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}

export default MerkabaBridge;
