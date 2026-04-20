# 🔗 Integration with s4ai-core

**Version**: 1.0.0
**Purpose**: Bridge GeoQode OS with s4ai-core systems
**Status**: Ready for deployment

---

## Overview

MERKABA_geoqode-os is designed as a **standalone canonical OS** that s4ai-core references, not contains.

This document defines the integration contract.

---

## References in s4ai-core

### package.json Dependency

```json
{
  "dependencies": {
    "@s4ai/merkaba-geoqode-os": "^1.0.0"
  }
}
```

### In Brain.js

```javascript
import MerkabageoqodeOS from "@s4ai/merkaba-geoqode-os";

class Brain {
  constructor() {
    this.geoqodeOS = new MerkabageoqodeOS();
  }

  async executeGeoQodeProgram(program) {
    return await this.geoqodeOS.run(program);
  }
}
```

### In Agent Execution

```javascript
const result = await brain.executeGeoQodeProgram(`
  Program MonitorHealth {
    Node.emit(Δ[green], Φ[1]);
    Node.detect(⊗, ⧉);
    Log("System healthy");
  }
`);

console.log(result.statusReport);
```

---

## Data Flow

1. **s4ai-core Brain** → Requests GeoQode execution
2. **MERKABA_geoqode-os** → Parses, validates, executes
3. **STATUS_REPORT** → Generated, logged, persisted
4. **MERKABA Monitoring** → Observes dimensional compliance
5. **s4ai-core Knowledge** → Incorporates learnings

---

## Directory Structure

**In s4ai-core repo**:

- No GeoQode code
- Only imports: `import MerkabageoqodeOS from '@s4ai/merkaba-geoqode-os'`
- Stores GeoQode programs in database

**In merkaba-geoqode-os repo**:

- Complete OS implementation
- All grammar, runtime, playbooks, docs
- Independent versioning and releases

---

## Deployment

```bash
# In s4ai-core
npm install @s4ai/merkaba-geoqode-os@latest

# In Railway shared variables
GEOQODE_ENABLED=true
MERKABA_OS_VERSION=1.0.0
```

---

## Troubleshooting

If GeoQode programs fail to execute:

1. Check `STATUS_REPORT` compliance state
2. Verify parser accepted GeoQode syntax
3. Review execution logs in STATUSREPORT/reports/
4. Trigger incident response playbooks if anomalies detected

---

**Integration Bridge** — MERKABA_geoqode-os ↔ s4ai-core ⧉
