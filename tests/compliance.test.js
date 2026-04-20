// tests/compliance.test.js
// Compliance tests

import { describe, it, expect } from "vitest";
import { ComplianceValidator } from "../geo/runtime/compliance.js";

describe("Compliance", () => {
  describe("ComplianceValidator", () => {
    it("should validate syntax", () => {
      const validator = new ComplianceValidator();
      const ast = { type: "PROGRAM", value: "Test" };

      const result = validator.validateSyntax(ast);
      expect(result).toBe(true);
      expect(validator.complianceState.syntaxValidation).toBe(true);
    });

    it("should log execution", () => {
      const validator = new ComplianceValidator();
      const data = { program: "Test", emissions: 1 };

      const entry = validator.logExecution(data);
      expect(entry.program).toBe("Test");
      expect(validator.complianceState.executionLogging).toBe(true);
    });

    it("should generate audit hash", () => {
      const validator = new ComplianceValidator();
      const data = { test: "data" };

      const hash = validator.generateAuditHash(data);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(validator.complianceState.auditability).toBe(true);
    });

    it("should validate repeatability", () => {
      const validator = new ComplianceValidator();
      const run1 = { result: "success" };
      const run2 = { result: "success" };

      const result = validator.validateRepeatability([run1, run2]);
      expect(result.repeatable).toBe(true);
    });

    it("should map to MERKABA dimensions", () => {
      const validator = new ComplianceValidator();
      const program = {
        hasEmission: true,
        hasDetection: true,
        hasPlaybook: true,
        hasQBIT: true,
      };

      const dimensions = validator.mapToMerkabaDimensions(program);
      expect(dimensions.length).toBeGreaterThan(0);
    });

    it("should certify program", () => {
      const validator = new ComplianceValidator();
      validator.validateSyntax({ type: "PROGRAM" });
      validator.logExecution({});

      const hash = validator.generateAuditHash({});
      const dims = validator.mapToMerkabaDimensions({
        hasEmission: true,
        hasDetection: true,
        hasQBIT: true,
      });

      const cert = validator.certifyProgram({ value: "Test" }, hash, dims);
      expect(cert.certified).toBe(true);
    });
  });
});
