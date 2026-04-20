// geo/grammar/parser.js
// GeoQode Parser — Converts token stream to AST

import { Lexer, Token } from "./lexer.js";
import {
  Program,
  Playbook,
  EmitStatement,
  DetectStatement,
  QBITStatement,
  LogStatement,
  TriggerStatement,
  ActionStatement,
  Literal,
  Identifier,
  Operator,
} from "./ast-builder.js";

export class Parser {
  constructor(source) {
    this.source = source;
    this.lexer = new Lexer(source);
    this.tokens = [];
    this.position = 0;
  }

  parse() {
    this.tokens = this.lexer.tokenize();
    return this.parseDocument();
  }

  parseDocument() {
    const statements = [];

    while (!this.isAtEnd()) {
      if (this.check("PROGRAM")) {
        statements.push(this.parseProgram());
      } else if (this.check("PLAYBOOK")) {
        statements.push(this.parsePlaybook());
      } else {
        this.advance(); // Skip unknown tokens
      }
    }

    return { type: "DOCUMENT", statements };
  }

  parseProgram() {
    const startToken = this.advance(); // PROGRAM
    const name = this.advance().value; // Program name
    this.expect("LBRACE");

    const program = new Program(name, startToken.line, startToken.column);

    while (!this.check("RBRACE") && !this.isAtEnd()) {
      program.addStatement(this.parseStatement());
    }

    this.expect("RBRACE");
    return program;
  }

  parsePlaybook() {
    const startToken = this.advance(); // PLAYBOOK
    const name = this.advance().value; // Playbook name
    this.expect("LBRACE");

    const playbook = new Playbook(name, startToken.line, startToken.column);

    while (!this.check("RBRACE") && !this.isAtEnd()) {
      playbook.addStep(this.parseStatement());
    }

    this.expect("RBRACE");
    return playbook;
  }

  parseStatement() {
    if (this.check("NODE")) {
      return this.parseNodeStatement();
    } else if (this.check("WATER")) {
      return this.parseWaterStatement();
    } else if (this.check("LOG")) {
      return this.parseLogStatement();
    } else if (this.check("TRIGGER")) {
      return this.parseTriggerStatement();
    } else if (this.check("ACTION")) {
      return this.parseActionStatement();
    } else if (this.check("STEP")) {
      return this.parseStepStatement();
    }

    // Skip unknown tokens
    this.advance();
    return null;
  }

  parseNodeStatement() {
    this.advance(); // NODE
    this.expect("DOT");
    const method = this.advance().value; // emit, detect

    if (method === "emit") {
      return this.parseEmit();
    } else if (method === "detect") {
      return this.parseDetect();
    }

    throw new Error(`Unknown Node method: ${method}`);
  }

  parseEmit() {
    this.expect("LPAREN");

    const chromodynamic = this.parseOperator(); // Δ[color]
    this.expect("COMMA");
    const harmonic = this.parseOperator(); // Φ[n]

    this.expect("RPAREN");
    this.expect("SEMICOLON");

    return new EmitStatement(
      chromodynamic,
      harmonic,
      this.peek().line,
      this.peek().column,
    );
  }

  parseDetect() {
    this.expect("LPAREN");

    const duality = this.parseOperator(); // ⊗
    this.expect("COMMA");
    const octahedron = this.parseOperator(); // ⧉

    this.expect("RPAREN");
    this.expect("SEMICOLON");

    return new DetectStatement(
      duality,
      octahedron,
      this.peek().line,
      this.peek().column,
    );
  }

  parseWaterStatement() {
    this.advance(); // WATER
    this.expect("DOT");
    const method = this.advance().value; // qbit

    if (method === "qbit") {
      this.expect("LPAREN");
      const frequency = this.parseOperator(); // ~wave(f)
      this.expect("COMMA");
      const harmonic = this.parseOperator(); // Φ[n]
      this.expect("RPAREN");
      this.expect("SEMICOLON");

      return new QBITStatement(
        "Water",
        frequency,
        harmonic,
        this.peek().line,
        this.peek().column,
      );
    }

    throw new Error(`Unknown Water method: ${method}`);
  }

  parseLogStatement() {
    this.advance(); // LOG
    this.expect("LPAREN");
    const message = this.advance().value; // String
    this.expect("RPAREN");
    this.expect("SEMICOLON");

    return new LogStatement(message, this.peek().line, this.peek().column);
  }

  parseTriggerStatement() {
    const token = this.advance(); // TRIGGER
    this.expect("COLON");
    const condition = this.advance().value;

    const trigger = new TriggerStatement(condition, token.line, token.column);

    while (this.check("ACTION")) {
      trigger.addAction(this.parseActionStatement());
    }

    return trigger;
  }

  parseActionStatement() {
    const token = this.advance(); // ACTION
    this.expect("COLON");
    const action = this.advance().value;
    this.expect("SEMICOLON");

    return new ActionStatement(action, token.line, token.column);
  }

  parseStepStatement() {
    const token = this.advance(); // STEP (Step1, Step2, etc.)
    this.expect("COLON");
    const statement = this.parseStatement();
    return statement;
  }

  parseOperator() {
    const token = this.peek();

    if (token.type === "CHROMODYNAMIC") {
      this.advance();
      this.expect("LBRACKET");
      const color = this.advance().value;
      this.expect("RBRACKET");
      return new Operator("Δ", color);
    } else if (token.type === "HARMONIC") {
      this.advance();
      this.expect("LBRACKET");
      const harmonic = this.advance().value;
      this.expect("RBRACKET");
      return new Operator("Φ", harmonic);
    } else if (token.type === "DUALITY") {
      this.advance();
      return new Operator("⊗", null);
    } else if (token.type === "OCTAHEDRON") {
      this.advance();
      return new Operator("⧉", null);
    } else if (token.type === "SONIC") {
      const sonic = this.advance().value;
      return new Operator("~wave", sonic);
    }

    throw new Error(`Expected operator, got ${token.type}`);
  }

  expect(type) {
    if (!this.check(type)) {
      throw new Error(
        `Expected ${type}, got ${this.peek().type} at line ${this.peek().line}`,
      );
    }
    return this.advance();
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === "EOF";
  }

  peek() {
    return this.tokens[this.position];
  }

  previous() {
    return this.tokens[this.position - 1];
  }
}
