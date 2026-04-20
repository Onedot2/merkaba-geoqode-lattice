// geo/distributed/cluster.js
// Phase 5: Distributed Execution Cluster
// Manages a pool of ExecutionEngines running GeoQode programs in parallel.

import { EventEmitter } from "events";
import { ExecutionEngine } from "../runtime/execution-engine.js";

/**
 * ExecutionNode — a single worker slot in the cluster.
 */
class ExecutionNode {
  constructor(id) {
    this.id = id;
    this.engine = new ExecutionEngine();
    this.status = "idle"; // idle | running | error
    this.completedRuns = 0;
    this.lastRunAt = null;
  }

  async execute(source, meta = {}) {
    this.status = "running";
    this.lastRunAt = Date.now();
    try {
      const result = await this.engine.execute(source);
      this.completedRuns++;
      this.status = "idle";
      return { nodeId: this.id, meta, ...result };
    } catch (err) {
      this.status = "error";
      return { nodeId: this.id, meta, success: false, error: err.message };
    }
  }

  reset() {
    this.engine.reset();
    this.status = "idle";
  }

  getState() {
    return {
      id: this.id,
      status: this.status,
      completedRuns: this.completedRuns,
      lastRunAt: this.lastRunAt,
    };
  }
}

/**
 * ExecutionCluster — pool of N ExecutionNodes with load balancing.
 *
 * Usage:
 *   const cluster = new ExecutionCluster({ size: 4 });
 *   // Run same program on all nodes simultaneously
 *   const results = await cluster.broadcast(source);
 *   // Run different programs across nodes
 *   const results = await cluster.scatter([src1, src2, src3]);
 */
export class ExecutionCluster extends EventEmitter {
  constructor(options = {}) {
    super();
    this.size = options.size || 4;
    this.nodes = Array.from(
      { length: this.size },
      (_, i) => new ExecutionNode(`node-${i}`),
    );
    this.completedJobs = 0;
    this.failedJobs = 0;
  }

  /**
   * Broadcast: run the same GeoQode program on ALL nodes in parallel.
   * Used for dimension consensus — all 44 dimensions must agree.
   * @param {string} source
   */
  async broadcast(source, meta = {}) {
    this.emit("cluster:broadcast:start", {
      nodeCount: this.size,
      timestamp: Date.now(),
    });

    const results = await Promise.all(
      this.nodes.map((node) =>
        node.execute(source, { ...meta, mode: "broadcast" }),
      ),
    );

    const consensus = this._computeConsensus(results);
    this.completedJobs += results.filter((r) => r.success).length;
    this.failedJobs += results.filter((r) => !r.success).length;

    const job = {
      type: "broadcast",
      results,
      consensus,
      timestamp: Date.now(),
    };

    this.emit("cluster:broadcast:complete", job);
    return job;
  }

  /**
   * Scatter: run different programs on different nodes (one per node).
   * @param {string[]} sources — array of GeoQode source strings
   */
  async scatter(sources, metas = []) {
    if (sources.length > this.size) {
      throw new Error(
        `Scatter requires ≤${this.size} programs (cluster size). Got ${sources.length}.`,
      );
    }

    this.emit("cluster:scatter:start", {
      jobCount: sources.length,
      timestamp: Date.now(),
    });

    const results = await Promise.all(
      sources.map((src, i) =>
        this.nodes[i].execute(src, metas[i] || { jobIndex: i }),
      ),
    );

    this.completedJobs += results.filter((r) => r.success).length;
    this.failedJobs += results.filter((r) => !r.success).length;

    const job = {
      type: "scatter",
      results,
      timestamp: Date.now(),
    };

    this.emit("cluster:scatter:complete", job);
    return job;
  }

  /**
   * Run on a single idle node (round-robin load balancing).
   * @param {string} source
   */
  async runOnIdle(source, meta = {}) {
    const idleNode = this.nodes.find((n) => n.status === "idle");
    if (!idleNode) {
      throw new Error("No idle nodes available. All nodes are busy.");
    }

    const result = await idleNode.execute(source, meta);
    if (result.success) this.completedJobs++;
    else this.failedJobs++;

    return result;
  }

  /**
   * Get cluster state summary.
   */
  getState() {
    return {
      size: this.size,
      completedJobs: this.completedJobs,
      failedJobs: this.failedJobs,
      nodes: this.nodes.map((n) => n.getState()),
      idleNodes: this.nodes.filter((n) => n.status === "idle").length,
      runningNodes: this.nodes.filter((n) => n.status === "running").length,
    };
  }

  /**
   * Reset all nodes (clear state between test suites etc.)
   */
  resetAll() {
    this.nodes.forEach((n) => n.reset());
    this.completedJobs = 0;
    this.failedJobs = 0;
    this.emit("cluster:reset", { timestamp: Date.now() });
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  /**
   * Compute consensus across broadcast results.
   * Agreement = all successful nodes produced same dimension set.
   */
  _computeConsensus(results) {
    const successful = results.filter((r) => r.success);
    if (successful.length === 0) {
      return { agreed: false, reason: "All nodes failed" };
    }

    const dimSets = successful.map((r) => {
      const dims =
        r.statusReport?.compliance?.merkabaDimensions ||
        r.certification?.dimensions ||
        [];
      return JSON.stringify(dims.slice().sort());
    });

    const allSame = dimSets.every((d) => d === dimSets[0]);

    return {
      agreed: allSame,
      nodeCount: successful.length,
      totalNodes: results.length,
      dimensions: allSame
        ? JSON.parse(dimSets[0] || "[]")
        : dimSets.map((d) => JSON.parse(d)),
      quorumReached: successful.length > results.length / 2,
    };
  }
}

export default ExecutionCluster;
