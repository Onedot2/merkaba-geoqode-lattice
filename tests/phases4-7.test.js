// tests/phases4-7.test.js
// Integration tests for Phase 4 (Bridge), Phase 5 (Distributed),
// Phase 6 (QBITS Validation), Phase 7 (Enterprise Certification)

import { describe, it, expect, beforeEach } from "vitest";
import { MerkabaBridge } from "../geo/bridge/merkaba-bridge.js";
import { ExecutionCluster } from "../geo/distributed/cluster.js";
import { DistributedCoordinator } from "../geo/distributed/coordinator.js";
import {
  QBITSValidator,
  SACRED_FREQUENCIES,
  VALID_TRANSITIONS,
} from "../geo/validation/qbits-validator.js";
import {
  EnterpriseCertifier,
  MERKABA_LATTICE,
} from "../geo/certification/enterprise-certifier.js";
import { AuditTrail } from "../geo/certification/audit-trail.js";

const SIMPLE_SOURCE = `Program TestProgram {
  Node.emit(Δ[green], Φ[1]);
  Node.detect(⊗, ⧉);
  Log("Phase test");
}`;

const QBIT_SOURCE = `Program QBITTest {
  Node.emit(Δ[blue], Φ[2]);
  Water.qbit(~wave(528Hz), Φ[2]);
  Log("QBITS materialized");
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4: MERKABA Bridge
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 4: MerkabaBridge", () => {
  let bridge;
  beforeEach(() => {
    bridge = new MerkabaBridge();
  });

  it("should execute a GeoQode program via bridge", async () => {
    const record = await bridge.executeGeo(SIMPLE_SOURCE);
    expect(record.success).toBe(true);
    expect(record.runId).toMatch(/^RUN-/);
    expect(record.elapsed).toBeGreaterThan(0);
  });

  it("should emit execution:complete event", async () => {
    let emitted = null;
    bridge.on("execution:complete", (r) => {
      emitted = r;
    });
    await bridge.executeGeo(SIMPLE_SOURCE);
    expect(emitted).not.toBeNull();
    expect(emitted.success).toBe(true);
  });

  it("should track execution history", async () => {
    await bridge.executeGeo(SIMPLE_SOURCE);
    await bridge.executeGeo(SIMPLE_SOURCE);
    expect(bridge.getHistory().length).toBe(2);
  });

  it("should return stats", async () => {
    await bridge.executeGeo(SIMPLE_SOURCE);
    const stats = bridge.getStats();
    expect(stats.total).toBe(1);
    expect(stats.successes).toBe(1);
    expect(stats.successRate).toBe("100.0%");
  });

  it("should call registered hooks on success", async () => {
    let hookCalled = false;
    bridge.registerHook("onSuccess", () => {
      hookCalled = true;
    });
    await bridge.executeGeo(SIMPLE_SOURCE);
    expect(hookCalled).toBe(true);
  });

  it("should reset bridge state", async () => {
    await bridge.executeGeo(SIMPLE_SOURCE);
    bridge.reset();
    expect(bridge.getHistory().length).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5: Distributed Execution
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 5: ExecutionCluster", () => {
  it("should create a cluster with N nodes", () => {
    const cluster = new ExecutionCluster({ size: 3 });
    expect(cluster.size).toBe(3);
    expect(cluster.nodes.length).toBe(3);
  });

  it("should broadcast to all nodes in parallel", async () => {
    const cluster = new ExecutionCluster({ size: 2 });
    const job = await cluster.broadcast(SIMPLE_SOURCE);
    expect(job.type).toBe("broadcast");
    expect(job.results.length).toBe(2);
    expect(job.results.every((r) => r.success)).toBe(true);
  });

  it("should compute consensus from broadcast results", async () => {
    const cluster = new ExecutionCluster({ size: 2 });
    const job = await cluster.broadcast(SIMPLE_SOURCE);
    expect(job.consensus).toBeDefined();
    expect(typeof job.consensus.agreed).toBe("boolean");
    expect(job.consensus.quorumReached).toBe(true);
  });

  it("should scatter different programs to different nodes", async () => {
    const cluster = new ExecutionCluster({ size: 2 });
    const job = await cluster.scatter([SIMPLE_SOURCE, SIMPLE_SOURCE]);
    expect(job.type).toBe("scatter");
    expect(job.results.length).toBe(2);
  });

  it("should report cluster state", async () => {
    const cluster = new ExecutionCluster({ size: 2 });
    await cluster.broadcast(SIMPLE_SOURCE);
    const state = cluster.getState();
    expect(state.completedJobs).toBe(2);
    expect(state.nodes.length).toBe(2);
  });
});

describe("Phase 5: DistributedCoordinator", () => {
  it("should enqueue and drain jobs", async () => {
    const coord = new DistributedCoordinator({ clusterSize: 2 });
    coord.enqueue(SIMPLE_SOURCE, { label: "job1" });
    coord.enqueue(SIMPLE_SOURCE, { label: "job2" });
    const results = await coord.drainQueue();
    expect(results.length).toBe(2);
    expect(results.every((r) => r.success)).toBe(true);
  });

  it("should run consensus broadcast", async () => {
    const coord = new DistributedCoordinator({ clusterSize: 2 });
    const job = await coord.consensusBroadcast(SIMPLE_SOURCE);
    expect(job.consensus.quorumReached).toBe(true);
  });

  it("should return summary stats", async () => {
    const coord = new DistributedCoordinator({ clusterSize: 2 });
    coord.enqueue(SIMPLE_SOURCE);
    await coord.drainQueue();
    const summary = coord.getSummary();
    expect(summary.total).toBe(1);
    expect(summary.successes).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 6: QBITS Validation
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 6: QBITSValidator", () => {
  let v;
  beforeEach(() => {
    v = new QBITSValidator();
  });

  it("should validate sacred frequencies", () => {
    expect(v.validateFrequency("~wave(528Hz)").valid).toBe(true);
    expect(v.validateFrequency("~wave(432Hz)").valid).toBe(true);
    expect(v.validateFrequency(528).valid).toBe(true);
  });

  it("should reject non-sacred frequencies", () => {
    const result = v.validateFrequency("~wave(500Hz)");
    expect(result.valid).toBe(false);
    expect(result.nearestSacred).toBeDefined();
  });

  it("should validate Fibonacci harmonics", () => {
    expect(v.validateHarmonic(1).valid).toBe(true);
    expect(v.validateHarmonic(2).valid).toBe(true);
    expect(v.validateHarmonic(3).valid).toBe(true);
    expect(v.validateHarmonic(5).valid).toBe(true);
    expect(v.validateHarmonic(8).valid).toBe(true);
  });

  it("should validate QBITS state transitions", () => {
    expect(v.validateTransition("DORMANT", "MATERIALIZED").valid).toBe(true);
    expect(v.validateTransition("MATERIALIZED", "CRYSTALLIZED").valid).toBe(
      true,
    );
    expect(v.validateTransition("DORMANT", "CRYSTALLIZED").valid).toBe(false);
    expect(v.validateTransition("STABLE", "DORMANT").valid).toBe(false);
  });

  it("should know all sacred frequencies", () => {
    expect(Object.keys(SACRED_FREQUENCIES).length).toBe(10);
    expect(SACRED_FREQUENCIES[528]).toBeDefined();
    expect(SACRED_FREQUENCIES[432]).toBeDefined();
  });

  it("should validate molecule sequence", () => {
    const molecule = {
      getState: () => ({
        id: "water-test",
        qbitState: "CRYSTALLIZED",
        frequency: "~wave(528Hz)",
        harmonic: 2,
        crystallizationCount: 2,
      }),
      getLogs: () => [
        { timestamp: Date.now(), state: "MATERIALIZED" },
        { timestamp: Date.now(), state: "CRYSTALLIZED" },
      ],
    };
    const result = v.validateSequence(molecule);
    expect(result.score).toBeGreaterThan(60);
    expect(result.auditHash).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 7: Enterprise Certification + Audit Trail
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 7: EnterpriseCertifier", () => {
  let certifier;
  beforeEach(() => {
    certifier = new EnterpriseCertifier();
  });

  it("should issue a certificate with an ID", () => {
    const cert = certifier.certify(
      { result: { emissions: 1, detections: 1, qbits: 0 } },
      {
        complianceState: {
          syntaxValidation: true,
          executionLogging: true,
          auditability: true,
          certifiability: true,
        },
        merkabaDimensions: [1, 2, 3, 4, 5, 12, 14, 16, 18, 20],
        allCompliant: true,
      },
    );
    expect(cert.certId).toMatch(/^MERKABA-CERT-/);
    expect(cert.score).toBeGreaterThan(0);
    expect(cert.dimensionSummary).toBeDefined();
  });

  it("should verify a valid certificate", () => {
    const cert = certifier.certify(
      { result: { emissions: 1, detections: 1, qbits: 0 } },
      {
        complianceState: {
          syntaxValidation: true,
          executionLogging: true,
          auditability: true,
          certifiability: false,
        },
        merkabaDimensions: [1, 2, 3, 4, 5, 12, 14, 16, 18, 20],
        allCompliant: false,
      },
    );
    const verification = certifier.verifyCertificate(cert.certId);
    expect(verification.valid).toBe(true);
  });

  it("should revoke a certificate", () => {
    const cert = certifier.certify(
      { result: { emissions: 1, detections: 0, qbits: 0 } },
      { complianceState: { syntaxValidation: true }, merkabaDimensions: [1] },
    );
    certifier.revoke(cert.certId, "Test revocation");
    const verification = certifier.verifyCertificate(cert.certId);
    expect(verification.valid).toBe(false);
    expect(verification.reason).toBe("Certificate revoked");
  });

  it("should have a full 44-dimension lattice", () => {
    expect(Object.keys(MERKABA_LATTICE).length).toBe(44);
    expect(MERKABA_LATTICE[1].tier).toBe(1);
    expect(MERKABA_LATTICE[44].tier).toBe(4);
    expect(MERKABA_LATTICE[44].name).toBe("Crown Certification");
  });

  it("should generate a compliance report", () => {
    certifier.certify(
      { result: { emissions: 1, detections: 1, qbits: 0 } },
      {
        complianceState: { syntaxValidation: true },
        merkabaDimensions: [1, 2, 3],
      },
    );
    const report = certifier.generateReport();
    expect(report.registry.issued).toBe(1);
    expect(report.avgScore).toBeGreaterThan(0);
  });
});

describe("Phase 7: AuditTrail", () => {
  let trail;
  beforeEach(() => {
    trail = new AuditTrail("test-trail");
  });

  it("should append entries with chain linking", () => {
    trail.append("EXECUTION", { program: "TestProgram" });
    trail.append("CERTIFICATION", { level: "BASIC" });
    expect(trail.entries.length).toBe(2);
    expect(trail.entries[1].prevHash).toBe(trail.entries[0].hash);
  });

  it("should verify intact chain", () => {
    trail.append("EXECUTION", { a: 1 });
    trail.append("EXECUTION", { a: 2 });
    trail.append("CERTIFICATION", { level: "ENTERPRISE" });
    const result = trail.verify();
    expect(result.valid).toBe(true);
    expect(result.brokenAt).toBeNull();
  });

  it("should detect chain tampering", () => {
    trail.append("EXECUTION", { a: 1 });
    trail.append("EXECUTION", { a: 2 });

    // Tamper: replace entry 0 with different data but keep the original hash
    // → hash mismatch triggers on verify()
    const originalEntry = trail.entries[0];
    const tamperedEntry = Object.freeze({ ...originalEntry, data: { a: 999 } });
    trail.entries[0] = tamperedEntry;

    const result = trail.verify();
    expect(result.valid).toBe(false);
    expect(result.brokenAt).toBe(0);
  });

  it("should get entries by type", () => {
    trail.append("EXECUTION", {});
    trail.append("CERTIFICATION", {});
    trail.append("EXECUTION", {});
    const execEntries = trail.getByType("EXECUTION");
    expect(execEntries.length).toBe(2);
  });

  it("should export serializable trail", () => {
    trail.append("EXECUTION", { test: true });
    const exported = trail.export();
    expect(exported.trailId).toBe("test-trail");
    expect(exported.entryCount).toBe(1);
    expect(exported.entries.length).toBe(1);
  });

  it("should summarize the trail", () => {
    trail.append("EXECUTION", {});
    trail.append("VIOLATION", { msg: "test" });
    const summary = trail.getSummary();
    expect(summary.chainIntegrity).toBe("INTACT");
    expect(summary.eventTypes.EXECUTION).toBe(1);
    expect(summary.eventTypes.VIOLATION).toBe(1);
  });
});
