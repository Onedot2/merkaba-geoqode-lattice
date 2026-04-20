// geo/distributed/coordinator.js
// Phase 5: Distributed Coordinator
// Orchestrates job queuing, node selection, and result aggregation across a cluster.

import { EventEmitter } from "events";
import { ExecutionCluster } from "./cluster.js";

/**
 * DistributedCoordinator — job queue + cluster orchestration.
 *
 * Usage:
 *   const coord = new DistributedCoordinator({ clusterSize: 8 });
 *   coord.on('job:complete', console.log);
 *   coord.enqueue(source1);
 *   coord.enqueue(source2);
 *   await coord.drainQueue();
 */
export class DistributedCoordinator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.cluster = new ExecutionCluster({
      size: options.clusterSize || 4,
    });
    this.queue = [];
    this.results = [];
    this.processing = false;

    // Bubble cluster events
    this.cluster.on("cluster:broadcast:complete", (e) =>
      this.emit("broadcast:complete", e),
    );
    this.cluster.on("cluster:scatter:complete", (e) =>
      this.emit("scatter:complete", e),
    );
  }

  /**
   * Enqueue a GeoQode program for execution.
   * @param {string} source
   * @param {object} meta
   * @returns {string} jobId
   */
  enqueue(source, meta = {}) {
    const jobId = `JOB-${Date.now()}-${this.queue.length}`;
    this.queue.push({ jobId, source, meta, enqueuedAt: Date.now() });
    this.emit("job:queued", { jobId, queueLength: this.queue.length });
    return jobId;
  }

  /**
   * Process all queued jobs across idle nodes.
   * Uses batch dispatch: fills idle nodes concurrently per tick.
   */
  async drainQueue() {
    if (this.processing) return;
    this.processing = true;
    this.emit("queue:drain:start", { queueLength: this.queue.length });

    while (this.queue.length > 0) {
      const idleCount = this.cluster.nodes.filter(
        (n) => n.status === "idle",
      ).length;
      const batch = this.queue.splice(0, idleCount || 1);

      const batchResults = await Promise.all(
        batch.map((job) =>
          this.cluster.runOnIdle(job.source, job.meta).then((result) => {
            const record = {
              ...result,
              jobId: job.jobId,
              enqueuedAt: job.enqueuedAt,
              completedAt: Date.now(),
            };
            this.results.push(record);
            this.emit("job:complete", record);
            return record;
          }),
        ),
      );

      this._checkBatch(batchResults);
    }

    this.processing = false;
    this.emit("queue:drain:complete", {
      totalProcessed: this.results.length,
      timestamp: Date.now(),
    });

    return this.results;
  }

  /**
   * Run a consensus broadcast: all cluster nodes execute same program.
   * Useful for validating 44-dimension agreement across distributed nodes.
   */
  async consensusBroadcast(source, meta = {}) {
    return this.cluster.broadcast(source, meta);
  }

  /**
   * Get coordinator + cluster state.
   */
  getState() {
    return {
      queueLength: this.queue.length,
      resultsCount: this.results.length,
      processing: this.processing,
      cluster: this.cluster.getState(),
    };
  }

  /**
   * Get aggregated results with MERKABA dimension summary.
   */
  getSummary() {
    const total = this.results.length;
    const successes = this.results.filter((r) => r.success).length;
    const allDims = new Set();

    this.results.forEach((r) => {
      const dims =
        r.statusReport?.compliance?.merkabaDimensions ||
        r.certification?.dimensions ||
        [];
      dims.forEach((d) => allDims.add(d));
    });

    return {
      total,
      successes,
      failures: total - successes,
      activeDimensions: Array.from(allDims).sort((a, b) => a - b),
      dimensionCoverage: `${allDims.size}/44`,
    };
  }

  reset() {
    this.queue = [];
    this.results = [];
    this.processing = false;
    this.cluster.resetAll();
  }

  _checkBatch(batchResults) {
    const failed = batchResults.filter((r) => !r.success);
    if (failed.length > 0) {
      this.emit("batch:partial-failure", {
        failed: failed.length,
        total: batchResults.length,
      });
    }
  }
}

export default DistributedCoordinator;
