// geo/grammar/ast-builder.js
// AST Node definitions for GeoQode

export class ASTNode {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
    return this;
  }
}

export class Program extends ASTNode {
  constructor(name, line, column) {
    super("PROGRAM", name, line, column);
    this.statements = [];
  }

  addStatement(stmt) {
    this.statements.push(stmt);
    return this;
  }
}

export class Playbook extends ASTNode {
  constructor(name, line, column) {
    super("PLAYBOOK", name, line, column);
    this.steps = [];
  }

  addStep(step) {
    this.steps.push(step);
    return this;
  }
}

export class Statement extends ASTNode {
  constructor(type, line, column) {
    super(type, null, line, column);
  }
}

export class EmitStatement extends Statement {
  constructor(chromodynamic, harmonic, line, column) {
    super("EMIT_STMT", line, column);
    this.chromodynamic = chromodynamic; // Δ[color]
    this.harmonic = harmonic; // Φ[n]
  }
}

export class DetectStatement extends Statement {
  constructor(duality, octahedron, line, column) {
    super("DETECT_STMT", line, column);
    this.duality = duality; // ⊗
    this.octahedron = octahedron; // ⧉
  }
}

export class QBITStatement extends Statement {
  constructor(medium, frequency, harmonic, line, column) {
    super("QBIT_STMT", line, column);
    this.medium = medium; // Water, etc.
    this.frequency = frequency; // ~wave(f)
    this.harmonic = harmonic; // Φ[n]
  }
}

export class LogStatement extends Statement {
  constructor(message, line, column) {
    super("LOG_STMT", line, column);
    this.message = message;
  }
}

export class TriggerStatement extends Statement {
  constructor(condition, line, column) {
    super("TRIGGER_STMT", line, column);
    this.condition = condition;
    this.actions = [];
  }

  addAction(action) {
    this.actions.push(action);
    return this;
  }
}

export class ActionStatement extends Statement {
  constructor(action, line, column) {
    super("ACTION_STMT", line, column);
    this.action = action;
  }
}

export class Literal {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class Identifier {
  constructor(name) {
    this.type = "IDENTIFIER";
    this.name = name;
  }
}

export class Operator {
  constructor(symbol, value) {
    this.type = "OPERATOR";
    this.symbol = symbol; // Φ, ⊗, Δ, ~wave, ⧉
    this.value = value;
  }
}
