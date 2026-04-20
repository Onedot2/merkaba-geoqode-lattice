// tests/runtime.test.js
// Runtime tests

import { describe, it, expect } from "vitest";
import { InnerOctahedron } from "../geo/runtime/octahedron.js";
import { Node, NodePool } from "../geo/runtime/node.js";
import { WaterMolecule, WaterPool } from "../geo/runtime/water.js";

describe("Runtime", () => {
  describe("InnerOctahedron", () => {
    it("should activate and deactivate", () => {
      const octahedron = new InnerOctahedron();
      expect(octahedron.active).toBe(false);

      octahedron.activate();
      expect(octahedron.active).toBe(true);

      octahedron.deactivate();
      expect(octahedron.active).toBe(false);
    });

    it("should emit spectral light", () => {
      const octahedron = new InnerOctahedron();
      octahedron.activate();

      const emission = octahedron.emit("green", 2);
      expect(emission.color).toBe("green");
      expect(emission.harmonic).toBe(2);
    });

    it("should detect resonance", () => {
      const octahedron = new InnerOctahedron();
      octahedron.activate();

      const detection = octahedron.detect(true, true);
      expect(detection.duality).toBe(true);
      expect(detection.octahedronPattern).toBe(true);
    });
  });

  describe("Node", () => {
    it("should emit", () => {
      const node = new Node();
      const emission = node.emit("green", 2);

      expect(emission.color).toBe("green");
      expect(emission.harmonic).toBe(2);
    });

    it("should detect", () => {
      const node = new Node();
      node.emit("green", 2);

      const detection = node.detect(true, true);
      expect(detection.duality).toBe(true);
    });
  });

  describe("WaterMolecule", () => {
    it("should materialize QBITS", () => {
      const water = new WaterMolecule();
      const materialization = water.materializeQBIT("~wave(528Hz)", 1);

      expect(materialization.frequency).toBe("~wave(528Hz)");
      expect(water.qbitState).toBe("MATERIALIZED");
    });

    it("should crystallize", () => {
      const water = new WaterMolecule();
      water.materializeQBIT("~wave(528Hz)", 1);
      const crystallization = water.crystallize();

      expect(crystallization.state).toBe("CRYSTALLIZED");
    });
  });

  describe("WaterPool", () => {
    it("should manage multiple molecules", () => {
      const pool = new WaterPool(100);
      expect(pool.molecules).toHaveLength(100);
    });

    it("should crystallize all materialized molecules", () => {
      const pool = new WaterPool(10);
      pool.materializeQBIT("~wave(528Hz)", 1);
      pool.materializeQBIT("~wave(432Hz)", 2);

      const crystallized = pool.crystallizeAll();
      expect(crystallized).toBe(2);
    });
  });
});
