import { describe, it, expect, vi } from "vitest";
import {
  GEOQODE_STDLIB,
  SACRED_COLOR_SPECTRUM,
  STDLIB_FREQUENCIES,
  getStdlibConstant,
} from "../geo/index.js";
import { Parser } from "../geo/grammar/parser.js";
import { ExecutionEngine } from "../geo/runtime/execution-engine.js";
import { Node } from "../geo/runtime/node.js";
import { WaterMolecule } from "../geo/runtime/water.js";
import { InnerOctahedron } from "../geo/runtime/octahedron.js";
import { ComplianceValidator } from "../geo/runtime/compliance.js";
import { MerkabaBridge } from "../geo/bridge/merkaba-bridge.js";

describe("Variant hardening", () => {
  describe("parser safety and labels", () => {
    it("skips unknown tokens instead of pushing null into program statements", () => {
      const ast = new Parser(
        "Program T { MysteryToken Node.emit(Δ[green], Φ[1]); }",
      ).parse();

      expect(ast.statements[0].statements).toHaveLength(1);
      expect(ast.statements[0].statements[0].type).toBe("EMIT_STMT");
    });

    it("skips unknown tokens instead of pushing null into playbook steps", () => {
      const ast = new Parser(
        "Playbook T { UnknownStep Step1: Node.emit(Δ[green], Φ[1]); }",
      ).parse();

      expect(ast.statements[0].steps).toHaveLength(1);
      expect(ast.statements[0].steps[0].type).toBe("EMIT_STMT");
    });

    it("preserves step labels on parsed playbook steps", () => {
      const ast = new Parser(
        "Playbook T { Step1: Node.emit(Δ[green], Φ[1]); }",
      ).parse();

      expect(ast.statements[0].steps[0].label).toBe("Step1");
      expect(ast.statements[0].steps[0].labelType).toBe("STEP");
    });

    it("preserves metric labels on parsed playbook steps", () => {
      const ast = new Parser("Playbook T { Metric: Node.detect(⊗); }").parse();

      expect(ast.statements[0].steps[0].label).toBe("Metric");
      expect(ast.statements[0].steps[0].labelType).toBe("METRIC");
    });
  });

  describe("execution engine coverage", () => {
    it("executes trigger blocks without dropping them", async () => {
      const source = `Playbook Incident {
        Trigger: Compliance.Fail(SyntaxValidation);
        Action: Alert("Error");
      }`;

      const result = await new ExecutionEngine().execute(source);
      expect(result.success).toBe(true);
      expect(
        result.result.logs.some((log) => log.includes("Trigger evaluated")),
      ).toBe(true);
    });

    it("executes action statements nested under triggers", async () => {
      const source = `Playbook Incident {
        Trigger: SomethingBad;
        Action: Alert("Error");
        Action: Escalate("Tier1");
      }`;

      const result = await new ExecutionEngine().execute(source);
      expect(result.success).toBe(true);
      expect(result.result.actions).toBe(2);
      expect(
        result.result.logs.filter((log) => log.includes("Action dispatched"))
          .length,
      ).toBe(2);
    });
  });

  describe("bounded runtime histories", () => {
    it("bounds node emission history", () => {
      const node = new Node("node-boundary");
      for (let i = 0; i < 10005; i++) {
        node.emit("green", 1);
      }
      expect(node.emissionHistory.length).toBe(10000);
    });

    it("bounds node detection history", () => {
      const node = new Node("node-boundary");
      for (let i = 0; i < 10005; i++) {
        node.detect(true, false);
      }
      expect(node.detectionHistory.length).toBe(10000);
    });

    it("bounds water crystallization logs during materialization", () => {
      const water = new WaterMolecule("water-boundary");
      for (let i = 0; i < 10005; i++) {
        water.materializeQBIT("528Hz", 1);
      }
      expect(water.crystallizationLogs.length).toBe(10000);
    });

    it("bounds water crystallization logs during crystallize", () => {
      const water = new WaterMolecule("water-boundary");
      for (let i = 0; i < 10005; i++) {
        water.materializeQBIT("528Hz", 1);
        water.crystallize();
      }
      expect(water.crystallizationLogs.length).toBe(10000);
    });

    it("bounds octahedron emission history and spectral spectrum", () => {
      const octahedron = new InnerOctahedron();
      octahedron.activate();
      for (let i = 0; i < 10005; i++) {
        octahedron.emit("green", 1);
      }
      expect(octahedron.emissionLogs.length).toBe(10000);
      expect(octahedron.spectralSpectrum.length).toBe(10000);
    });

    it("bounds octahedron detection history", () => {
      const octahedron = new InnerOctahedron();
      octahedron.activate();
      for (let i = 0; i < 10005; i++) {
        octahedron.detect(true, true);
      }
      expect(octahedron.detectionLogs.length).toBe(10000);
    });

    it("bounds compliance execution logs", () => {
      const compliance = new ComplianceValidator();
      for (let i = 0; i < 10005; i++) {
        compliance.logExecution({ index: i });
      }
      expect(compliance.executionLogs.length).toBe(10000);
    });

    it("bounds compliance audit hashes", () => {
      const compliance = new ComplianceValidator();
      for (let i = 0; i < 10005; i++) {
        compliance.generateAuditHash({ index: i });
      }
      expect(compliance.auditHashes.length).toBe(10000);
    });

    it("bounds bridge execution history", async () => {
      const bridge = new MerkabaBridge();
      bridge.os.run = vi.fn().mockResolvedValue({ success: true });
      bridge.os.getStatusReport = vi.fn().mockReturnValue({ ok: true });

      for (let i = 0; i < 1005; i++) {
        await bridge.executeGeo("Program T {}", { index: i });
      }

      expect(bridge.getHistory().length).toBe(1000);
    });
  });

  describe("bridge observability", () => {
    it("logs non-fatal storm forward errors", async () => {
      const bridge = new MerkabaBridge({
        emitToStorm: true,
        stormBrainUrl: "https://example.invalid",
      });
      bridge.os.run = vi.fn().mockResolvedValue({ success: true });
      bridge.os.getStatusReport = vi.fn().mockReturnValue({ ok: true });

      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

      try {
        await bridge.executeGeo("Program T {}", {});
        expect(errorSpy).toHaveBeenCalled();
      } finally {
        globalThis.fetch = originalFetch;
        errorSpy.mockRestore();
      }
    });
  });

  describe("stdlib scaffold", () => {
    it("exports the standard library object", () => {
      expect(GEOQODE_STDLIB).toBeDefined();
      expect(GEOQODE_STDLIB.frequencies.LOVE).toBe("528Hz");
    });

    it("exports sacred color spectrum", () => {
      expect(SACRED_COLOR_SPECTRUM).toContain("amber");
      expect(SACRED_COLOR_SPECTRUM).toContain("violet");
    });

    it("exports standard frequency constants", () => {
      expect(STDLIB_FREQUENCIES.RESONANCE).toBe("432Hz");
      expect(STDLIB_FREQUENCIES.CLARITY).toBe("741Hz");
    });

    it("returns stdlib constants by namespace and key", () => {
      expect(getStdlibConstant("frequencies", "LOVE")).toBe("528Hz");
      expect(getStdlibConstant("frequencies", "MISSING")).toBeNull();
    });
  });
});
