// geo/certification/audit-trail.js
// @alignment 8→26→48:480  |  PHI=1.618  |  BASE_FREQUENCY_HZ=72
const CANONICAL_ARCHITECTURE = "8,26,48:480"; // LOCKED � never change
// Phase 7: Immutable Append-Only Audit Trail
// Each entry is chained to the previous via SHA256 hash — tamper-evident log.

import crypto from "crypto";

/**
 * AuditTrail — append-only hash-chained audit log.
 *
 * Every entry contains: data, timestamp, previous hash, and its own hash.
 * Tampering any entry breaks the chain — detectable via verify().
 */
export class AuditTrail {
  constructor(trailId = null) {
    this.trailId = trailId || `TRAIL-${Date.now()}`;
    this.entries = [];
    this.genesisHash =
      "0000000000000000000000000000000000000000000000000000000000000000";
  }

  /**
   * Append an entry to the trail.
   * @param {string} eventType - e.g. "EXECUTION", "CERTIFICATION", "VIOLATION"
   * @param {object} data - Payload data
   */
  append(eventType, data = {}) {
    const prevHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : this.genesisHash;

    const entry = {
      index: this.entries.length,
      trailId: this.trailId,
      eventType,
      timestamp: Date.now(),
      data,
      prevHash,
      hash: "", // computed below
    };

    entry.hash = this._hashEntry(entry);
    this.entries.push(Object.freeze(entry)); // immutable entry
    return entry;
  }

  /**
   * Verify the entire chain integrity.
   * Returns { valid, brokenAt } — brokenAt is null if chain is intact.
   */
  verify() {
    if (this.entries.length === 0) {
      return { valid: true, entryCount: 0, brokenAt: null };
    }

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];

      // Re-compute hash and compare
      const expectedHash = this._hashEntry(entry);
      if (entry.hash !== expectedHash) {
        return {
          valid: false,
          brokenAt: i,
          reason: `Entry ${i} hash mismatch`,
        };
      }

      // Check chain linkage
      const expectedPrev =
        i === 0 ? this.genesisHash : this.entries[i - 1].hash;
      if (entry.prevHash !== expectedPrev) {
        return {
          valid: false,
          brokenAt: i,
          reason: `Entry ${i} broken chain link`,
        };
      }
    }

    return {
      valid: true,
      entryCount: this.entries.length,
      brokenAt: null,
      headHash: this.entries[this.entries.length - 1].hash,
    };
  }

  /**
   * Get all entries of a specific event type.
   */
  getByType(eventType) {
    return this.entries.filter((e) => e.eventType === eventType);
  }

  /**
   * Get a single entry by index.
   */
  getEntry(index) {
    return this.entries[index] || null;
  }

  /**
   * Get current head (latest) entry.
   */
  getHead() {
    return this.entries.length > 0
      ? this.entries[this.entries.length - 1]
      : null;
  }

  /**
   * Export the full trail as a JSON-serializable object.
   */
  export() {
    return {
      trailId: this.trailId,
      entryCount: this.entries.length,
      genesisHash: this.genesisHash,
      headHash: this.getHead()?.hash || this.genesisHash,
      entries: this.entries.map((e) => ({ ...e })),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Summary of the trail.
   */
  getSummary() {
    const byType = {};
    for (const e of this.entries) {
      byType[e.eventType] = (byType[e.eventType] || 0) + 1;
    }
    const integrity = this.verify();

    return {
      trailId: this.trailId,
      entryCount: this.entries.length,
      eventTypes: byType,
      chainIntegrity: integrity.valid ? "INTACT" : "COMPROMISED",
      headHash: this.getHead()?.hash || null,
    };
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _hashEntry(entry) {
    // Exclude the hash field itself from the hash input
    const { hash: _ignored, ...rest } = entry;
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(rest))
      .digest("hex");
  }
}

export default AuditTrail;
