# Contributing to MERKABA_geoqode OS

Thank you for your interest in contributing to MERKABA_geoqode OS!

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`

## Code Style

- Use ES modules (import/export)
- Follow existing patterns in grammar/ and runtime/
- Document all public methods
- Include error handling

## Testing

All changes should include tests:

```bash
npm test
```

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Add tests
4. Run full test suite
5. Submit a pull request

## GeoQode Language Changes

Language changes require updates to:

1. `geo/grammar/lexer.js`
2. `geo/grammar/parser.js`
3. `geo/grammar/ast-builder.js`
4. `docs/GeoQodeSpec.md`
5. Tests for new syntax

## Compliance

All code must:

- Pass syntax validation
- Be fully logged
- Support auditability
- Map to MERKABA dimensions

## Questions?

Open an issue or contact the MERKABA_geoqode team.

---

**Contributing Guidelines** — Help build the GeoQode language
