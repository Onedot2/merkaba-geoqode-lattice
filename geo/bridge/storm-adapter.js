// geo/bridge/storm-adapter.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// Phase 4: Storm Brain adapter — wraps MerkabaBridge for direct s4ai-core integration.
//
// From pwai-ai-worker or pwai-api-service:
//   import { StormAdapter } from '@s4ai/merkaba-geoqode-lattice/bridge';
//   const adapter = new StormAdapter({ adminJwt: process.env.ADMIN_JWT });
//   await adapter.runPlaybook('migration');

import { MerkabaBridge } from "./merkaba-bridge.js";

// Built-in playbook registry — keyed by short name
const BUILT_IN_PLAYBOOKS = {
  migration: null, // lazy-loaded
  adoption: null,
  resonance: null,
  incident: null,
};

export class StormAdapter {
  constructor(options = {}) {
    this.bridge = new MerkabaBridge({
      stormBrainUrl: options.stormBrainUrl || process.env?.BACKEND_URL,
      apiKey: options.adminJwt || process.env?.ADMIN_JWT,
      emitToStorm: Boolean(options.stormBrainUrl || process.env?.BACKEND_URL),
    });

    // Propagate events upward for Storm logging
    this.bridge.on("execution:complete", (r) =>
      this._log("COMPLETE", r.runId, r.elapsed),
    );
    this.bridge.on("execution:failed", (r) =>
      this._log("FAILED", r.runId, r.error),
    );
    this.bridge.on("execution:error", (r) =>
      this._log("ERROR", r.runId, r.error),
    );
  }

  /**
   * Run one of the built-in GeoQode playbooks by name.
   * @param {'migration'|'adoption'|'resonance'|'incident'} name
   */
  async runPlaybook(name) {
    const source = await this._loadPlaybook(name);
    return this.bridge.executeGeo(source, { playbookName: name });
  }

  /**
   * Run arbitrary GeoQode source directly.
   * @param {string} source
   */
  async run(source, meta = {}) {
    return this.bridge.executeGeo(source, meta);
  }

  /**
   * Get full execution stats across this adapter session.
   */
  getStats() {
    return this.bridge.getStats();
  }

  /**
   * Get MERKABA dimensions activated across all runs.
   */
  getActiveDimensions() {
    const allDims = new Set();
    for (const record of this.bridge.getHistory()) {
      const dims =
        record.report?.compliance?.merkabaDimensions ||
        record.report?.certification?.dimensions ||
        [];
      dims.forEach((d) => allDims.add(d));
    }
    return Array.from(allDims).sort((a, b) => a - b);
  }

  /**
   * Register Storm-specific event hooks.
   */
  onSuccess(fn) {
    this.bridge.registerHook("onSuccess", fn);
  }
  onFailure(fn) {
    this.bridge.registerHook("onFailure", fn);
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  async _loadPlaybook(name) {
    if (!BUILT_IN_PLAYBOOKS.hasOwnProperty(name)) {
      throw new Error(
        `Unknown playbook: "${name}". Valid: ${Object.keys(BUILT_IN_PLAYBOOKS).join(", ")}`,
      );
    }

    if (BUILT_IN_PLAYBOOKS[name]) return BUILT_IN_PLAYBOOKS[name];

    // Resolve path relative to this file
    const { readFileSync } = await import("fs");
    const { fileURLToPath } = await import("url");
    const { dirname, join } = await import("path");

    const __dir = dirname(fileURLToPath(import.meta.url));
    const playbookPath = join(__dir, "..", "playbooks", `${name}.geo`);
    const source = readFileSync(playbookPath, "utf8");
    BUILT_IN_PLAYBOOKS[name] = source;
    return source;
  }

  _log(level, runId, detail) {
    const prefix =
      level === "COMPLETE" ? "✅" : level === "FAILED" ? "❌" : "💥";
    console.log(
      `[StormAdapter] ${prefix} ${level} runId=${runId} ${detail ?? ""}`,
    );
  }
}

export default StormAdapter;
