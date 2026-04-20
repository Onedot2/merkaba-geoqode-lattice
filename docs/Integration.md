# 📊 Integration Guide

**Version**: 1.0.0
**Canonical Reference**: Integration with s4ai-core and external systems
**Last Updated**: April 20, 2026

---

## Integration with s4ai-core

GeoQode programs are executable by MERKABA_geoqode OS and designed to integrate seamlessly with s4ai-core.

### Basic Integration

```javascript
import MerkabageoqodeOS from "@s4ai/merkaba-geoqode-os";

const os = new MerkabageoqodeOS();
const result = await os.run(geoQodeProgram);
console.log(result.statusReport);
```

### With Storm Brain

```javascript
import MerkabageoqodeOS from "@s4ai/merkaba-geoqode-os";
import { Brain } from "@s4ai/s4ai-core";

const os = new MerkabageoqodeOS();
const brain = new Brain();

// Execute GeoQode program
const program = `
  Program BreakdownDetector {
    Node.emit(Δ[red], Φ[1]);
    Node.detect(⊗, ⧉);
    Log("System health monitored");
  }
`;

const result = await os.run(program);
brain.recordExecution(result);
```

### With MERKABA Monitoring

GeoQode execution logs feed directly into MERKABA's observability:

```bash
curl https://api.getbrains4ai.com/api/merkaba/status \
  -H "Authorization: Bearer ADMIN_JWT"
```

---

## External System Integration

GeoQode can trigger external systems via action statements:

```geo
Program TriggerWebhook {
  Node.emit(Δ[blue], Φ[2]);
  Action: Webhook("https://example.com/event");
  Log("External system notified");
}
```

---

## Database Persistence

STATUS_REPORT outputs are persisted:

```
STATUSREPORT/reports/[YYYY-MM-DD]-cycle-[N].md
```

Can be queried from s4ai-core database:

```sql
SELECT * FROM geo_status_reports
WHERE date = '2026-04-20'
ORDER BY cycle_id DESC;
```

---

## Custom Extensions

Create custom operators by extending GeoQodeOS:

```javascript
class ExtendedGeoQodeOS extends MerkabageoqodeOS {
  customOperator(param) {
    // Custom implementation
  }
}
```

---

**Integration Guide** — Connect GeoQode with s4ai-core ecosystem ⧉
