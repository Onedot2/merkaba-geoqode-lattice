# 🌌 GeoQode Language Specification

**Version**: 1.0.0
**Status**: Canonical Language Reference
**Last Updated**: April 20, 2026

---

## Overview

**GeoQode** is the kernel language of MERKABA_geoqode OS. It is a resonance-based programming language designed for AI agents to execute geometrically-informed programs within the Inner Octahedron field of light.

GeoQode programs:

- Execute in a resonant medium (the Inner Octahedron)
- Use dimensional operators (Φ, ⊗, Δ, ~wave, ⧉) as system calls
- Map to MERKABA's 44-dimension governance lattice
- Produce auditable, reproducible, certifiable outputs

---

## Syntax

### Program Structure

```geo
Program ProgramName {
  Statement1;
  Statement2;
  // ...
}
```

### Playbook Structure

```geo
Playbook PlaybookName {
  Step1: Statement;
  Step2: Statement;
  // ...
}
```

### Comments

```geo
// Single-line comment
/* Multi-line comment */
```

---

## Data Types

| Type          | Example                  | Purpose                      |
| ------------- | ------------------------ | ---------------------------- |
| **String**    | `"hello"`                | Text literals                |
| **Number**    | `528`, `3.14`            | Frequencies, harmonic values |
| **Color**     | `green`, `blue`, `amber` | Chromodynamic spectrum       |
| **Frequency** | `~wave(528Hz)`           | Cymatic sonic driver         |
| **Harmonic**  | `Φ[1]`, `Φ[2.5]`         | Golden ratio frequency ratio |

---

## Reserved Keywords

```
Program, Playbook
Node, Water
Log, Emit, Detect, QBIT
Step1, Step2, Step3, Step4
Trigger, Action, Metric
```

---

## Complete Grammar

```
Document        → Statement*
Statement       → Program | Playbook
Program         → "Program" IDENTIFIER "{" Statement* "}"
Playbook        → "Playbook" IDENTIFIER "{" (Step)* "}"

Step            → "Step1" | "Step2" | "Step3" | "Step4"
                  ":" Statement

NodeStatement   → "Node.emit" "(" Operator "," Operator ")" ";"
                | "Node.detect" "(" Operator "," Operator ")" ";"

WaterStatement  → "Water.qbit" "(" Operator "," Operator ")" ";"

LogStatement    → "Log" "(" STRING ")" ";"

TriggerClause   → "Trigger" ":" CONDITION
ActionClause    → "Action" ":" ACTION ";"

Operator        → HarmonicOp
                | DualityOp
                | ChromodynamicOp
                | SonicOp
                | OctahedronOp

HarmonicOp      → "Φ" "[" NUMBER "]"
DualityOp       → "⊗"
ChromodynamicOp → "Δ" "[" COLOR "]"
SonicOp         → "~wave" "(" FREQUENCY ")"
OctahedronOp    → "⧉"
```

---

## Example Programs

### Hello GeoQode

```geo
Program HelloGeoQode {
  Node.emit(Δ[green], Φ[1]);
  Node.detect(⊗, ⧉);
  Log("Program executed in Inner Octahedron field");
}
```

### Water Animation

```geo
Program AnimateWater {
  Node.emit(Δ[green], Φ[2]);
  Node.detect(⊗, ⧉);
  Water.qbit(~wave(528Hz), Φ[1]);
  Log("QBITS materialized");
}
```

---

## Execution Model

Every GeoQode program executes through a 6-step lifecycle:

1. **Parse** → Lexer tokenizes, Parser builds AST
2. **Validate** → Compliance checks syntax
3. **Activate** → Inner Octahedron field engaged
4. **Execute** → Nodes emit/detect, water materializes QBITS
5. **Log** → Execution states captured, audit hashes generated
6. **Report** → STATUS_REPORT generated, program certified

---

## Best Practices

- Use meaningful program names
- Add Log statements for traceability
- Ensure Node.emit() precedes Node.detect()
- Harmonics should fall in range Φ[0.5] to Φ[4]
- Frequencies for water: 432Hz, 528Hz, 741Hz (Solfeggio scale)

---

## Integration

GeoQode programs are executable by MERKABA_geoqode OS:

```javascript
import MerkabageoqodeOS from "@s4ai/merkaba-geoqode-os";

const os = new MerkabageoqodeOS();
const result = await os.run(geoQodeProgram);
console.log(result.statusReport);
```

---

**GeoQode Specification** — Complete canonical reference for AI agents
