// tests/parser.test.js
// Parser tests

import { describe, it, expect } from "vitest";
import { Parser } from "../geo/grammar/parser.js";

describe("Parser", () => {
  it("should parse a simple program", () => {
    const source = `
      Program HelloGeoQode {
        Node.emit(Δ[green], Φ[1]);
        Log("Hello");
      }
    `;

    const parser = new Parser(source);
    const ast = parser.parse();

    expect(ast).toBeDefined();
    expect(ast.statements).toHaveLength(1);
    expect(ast.statements[0].type).toBe("PROGRAM");
    expect(ast.statements[0].value).toBe("HelloGeoQode");
  });

  it("should parse a playbook", () => {
    const source = `
      Playbook Migration {
        Step1: Node.emit(Δ[amber], Φ[1]);
        Step2: Log("Migration started");
      }
    `;

    const parser = new Parser(source);
    const ast = parser.parse();

    expect(ast.statements[0].type).toBe("PLAYBOOK");
    expect(ast.statements[0].value).toBe("Migration");
  });

  it("should handle operators", () => {
    const source = `Program Test {
      Node.emit(Δ[green], Φ[2]);
    }`;

    const parser = new Parser(source);
    const ast = parser.parse();

    expect(ast).toBeDefined();
  });
});
