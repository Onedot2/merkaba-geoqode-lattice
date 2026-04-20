// geo/grammar/lexer.js
// GeoQode Lexer — Tokenizes GeoQode source into meaningful units

export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

export class Lexer {
  constructor(source) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  // Token types
  static KEYWORDS = {
    Program: "PROGRAM",
    Playbook: "PLAYBOOK",
    Node: "NODE",
    Water: "WATER",
    Log: "LOG",
    Step1: "STEP",
    Step2: "STEP",
    Step3: "STEP",
    Step4: "STEP",
    Emit: "EMIT",
    Detect: "DETECT",
    QBIT: "QBIT",
    Metric: "METRIC",
    Trigger: "TRIGGER",
    Action: "ACTION",
  };

  static OPERATORS = {
    Φ: "HARMONIC",
    "⊗": "DUALITY",
    Δ: "CHROMODYNAMIC",
    "~wave": "SONIC",
    "⧉": "OCTAHEDRON",
  };

  tokenize() {
    while (this.position < this.source.length) {
      this.skipWhitespace();
      if (this.position >= this.source.length) break;

      const char = this.source[this.position];

      // Comments
      if (char === "/" && this.source[this.position + 1] === "/") {
        this.skipLineComment();
        continue;
      }

      // String literals
      if (char === '"' || char === "'") {
        this.tokens.push(this.readString());
        continue;
      }

      // Numbers
      if (/\d/.test(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // Special operators
      if (char === "Φ" || char === "⊗" || char === "Δ" || char === "⧉") {
        this.tokens.push(this.readOperator());
        continue;
      }

      if (char === "~") {
        this.tokens.push(this.readSonic());
        continue;
      }

      // Punctuation
      switch (char) {
        case "{":
          this.tokens.push(new Token("LBRACE", "{", this.line, this.column));
          this.advance();
          break;
        case "}":
          this.tokens.push(new Token("RBRACE", "}", this.line, this.column));
          this.advance();
          break;
        case "(":
          this.tokens.push(new Token("LPAREN", "(", this.line, this.column));
          this.advance();
          break;
        case ")":
          this.tokens.push(new Token("RPAREN", ")", this.line, this.column));
          this.advance();
          break;
        case "[":
          this.tokens.push(new Token("LBRACKET", "[", this.line, this.column));
          this.advance();
          break;
        case "]":
          this.tokens.push(new Token("RBRACKET", "]", this.line, this.column));
          this.advance();
          break;
        case ",":
          this.tokens.push(new Token("COMMA", ",", this.line, this.column));
          this.advance();
          break;
        case ";":
          this.tokens.push(new Token("SEMICOLON", ";", this.line, this.column));
          this.advance();
          break;
        case ".":
          this.tokens.push(new Token("DOT", ".", this.line, this.column));
          this.advance();
          break;
        case ":":
          this.tokens.push(new Token("COLON", ":", this.line, this.column));
          this.advance();
          break;
        case "=":
          this.tokens.push(new Token("ASSIGN", "=", this.line, this.column));
          this.advance();
          break;
        default:
          throw new Error(
            `Unexpected character: ${char} at line ${this.line}, col ${this.column}`,
          );
      }
    }

    this.tokens.push(new Token("EOF", null, this.line, this.column));
    return this.tokens;
  }

  readIdentifier() {
    const start = this.position;
    const startLine = this.line;
    const startCol = this.column;

    while (
      this.position < this.source.length &&
      /[a-zA-Z0-9_]/.test(this.source[this.position])
    ) {
      this.advance();
    }

    const value = this.source.substring(start, this.position);
    const type = Lexer.KEYWORDS[value] || "IDENTIFIER";
    return new Token(type, value, startLine, startCol);
  }

  readNumber() {
    const start = this.position;
    const startLine = this.line;
    const startCol = this.column;

    while (
      this.position < this.source.length &&
      /[\d.]/.test(this.source[this.position])
    ) {
      this.advance();
    }

    const value = this.source.substring(start, this.position);
    return new Token("NUMBER", parseFloat(value), startLine, startCol);
  }

  readString() {
    const quote = this.source[this.position];
    const startLine = this.line;
    const startCol = this.column;
    this.advance(); // Skip opening quote

    let value = "";
    while (
      this.position < this.source.length &&
      this.source[this.position] !== quote
    ) {
      if (this.source[this.position] === "\\") {
        this.advance();
        const escaped = this.source[this.position];
        value += escaped === "n" ? "\n" : escaped === "t" ? "\t" : escaped;
      } else {
        value += this.source[this.position];
      }
      this.advance();
    }

    if (this.position >= this.source.length) {
      throw new Error(
        `Unterminated string at line ${startLine}, col ${startCol}`,
      );
    }

    this.advance(); // Skip closing quote
    return new Token("STRING", value, startLine, startCol);
  }

  readOperator() {
    const startLine = this.line;
    const startCol = this.column;
    const char = this.source[this.position];
    this.advance();

    const type = Lexer.OPERATORS[char];
    return new Token(type, char, startLine, startCol);
  }

  readSonic() {
    const startLine = this.line;
    const startCol = this.column;
    const start = this.position;

    this.advance(); // consume leading `~`

    // Read the rest: wave(432Hz) etc.
    while (
      this.position < this.source.length &&
      /[a-zA-Z0-9()Hz.]/.test(this.source[this.position])
    ) {
      this.advance();
    }

    const value = this.source.substring(start, this.position);
    return new Token("SONIC", value, startLine, startCol);
  }

  skipWhitespace() {
    while (
      this.position < this.source.length &&
      /\s/.test(this.source[this.position])
    ) {
      if (this.source[this.position] === "\n") {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  skipLineComment() {
    while (
      this.position < this.source.length &&
      this.source[this.position] !== "\n"
    ) {
      this.position++;
    }
  }

  advance() {
    if (this.source[this.position] === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }
}
