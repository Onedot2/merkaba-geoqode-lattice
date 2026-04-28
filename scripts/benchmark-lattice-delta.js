// scripts/benchmark-lattice-delta.js
// Compares two benchmark reports and writes a machine-readable delta summary.

import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function caseKey(entry) {
  return `${entry.schedulerMode}/${entry.integrationMode}`;
}

function pctDelta(before, after) {
  if (!Number.isFinite(before) || before === 0) return 0;
  return ((after - before) / before) * 100;
}

function compareCase(beforeCase, afterCase) {
  const beforeAvg = beforeCase.latencyMs?.avgRunMs || 0;
  const afterAvg = afterCase.latencyMs?.avgRunMs || 0;
  const beforeThroughput = beforeCase.totals?.throughputStatementsPerSec || 0;
  const afterThroughput = afterCase.totals?.throughputStatementsPerSec || 0;

  const beforeAdapter = beforeCase.totals?.adapterCalls || {};
  const afterAdapter = afterCase.totals?.adapterCalls || {};

  return {
    key: caseKey(afterCase),
    avgRunMs: {
      before: beforeAvg,
      after: afterAvg,
      delta: Number((afterAvg - beforeAvg).toFixed(3)),
      deltaPct: Number(pctDelta(beforeAvg, afterAvg).toFixed(3)),
    },
    throughputStatementsPerSec: {
      before: beforeThroughput,
      after: afterThroughput,
      delta: Number((afterThroughput - beforeThroughput).toFixed(3)),
      deltaPct: Number(pctDelta(beforeThroughput, afterThroughput).toFixed(3)),
    },
    adapterCalls: {
      qddDelta: (afterAdapter.qdd || 0) - (beforeAdapter.qdd || 0),
      governanceDelta:
        (afterAdapter.governance || 0) - (beforeAdapter.governance || 0),
      swarmDelta: (afterAdapter.swarm || 0) - (beforeAdapter.swarm || 0),
      sampledSyncDelta:
        (afterAdapter.sampledSyncCalls || 0) -
        (beforeAdapter.sampledSyncCalls || 0),
      cachedDecisionsDelta:
        (afterAdapter.cachedDecisions || 0) -
        (beforeAdapter.cachedDecisions || 0),
      shadowScheduledDelta:
        (afterAdapter.shadowScheduled || 0) -
        (beforeAdapter.shadowScheduled || 0),
      shadowSkippedBusyDelta:
        (afterAdapter.shadowSkippedBusy || 0) -
        (beforeAdapter.shadowSkippedBusy || 0),
      shadowSuppressedByAdaptiveDelta:
        (afterAdapter.shadowSuppressedByAdaptive || 0) -
        (beforeAdapter.shadowSuppressedByAdaptive || 0),
    },
  };
}

function findCase(report, key) {
  return (report.results || []).find((entry) => caseKey(entry) === key);
}

function summarizeFocus(beforeReport, afterReport) {
  const lowOverheadKey = "lattice/low-overhead";
  const realKey = "lattice/real";

  const beforeLow = findCase(beforeReport, lowOverheadKey);
  const afterLow = findCase(afterReport, lowOverheadKey);
  const beforeReal = findCase(beforeReport, realKey);
  const afterReal = findCase(afterReport, realKey);

  if (!beforeLow || !afterLow || !beforeReal || !afterReal) {
    return null;
  }

  const beforeGapMs =
    (beforeLow.latencyMs?.avgRunMs || 0) -
    (beforeReal.latencyMs?.avgRunMs || 0);
  const afterGapMs =
    (afterLow.latencyMs?.avgRunMs || 0) - (afterReal.latencyMs?.avgRunMs || 0);

  const beforeGapThroughput =
    (beforeLow.totals?.throughputStatementsPerSec || 0) -
    (beforeReal.totals?.throughputStatementsPerSec || 0);
  const afterGapThroughput =
    (afterLow.totals?.throughputStatementsPerSec || 0) -
    (afterReal.totals?.throughputStatementsPerSec || 0);

  return {
    lowOverheadVsRealGapMs: {
      before: Number(beforeGapMs.toFixed(3)),
      after: Number(afterGapMs.toFixed(3)),
      improvementMs: Number((beforeGapMs - afterGapMs).toFixed(3)),
    },
    lowOverheadVsRealThroughputGap: {
      before: Number(beforeGapThroughput.toFixed(3)),
      after: Number(afterGapThroughput.toFixed(3)),
      improvement: Number(
        (afterGapThroughput - beforeGapThroughput).toFixed(3),
      ),
    },
  };
}

function main() {
  const beforePath = process.argv[2];
  const afterPath = process.argv[3];

  if (!beforePath || !afterPath) {
    console.error(
      "Usage: node scripts/benchmark-lattice-delta.js <before-report.json> <after-report.json>",
    );
    process.exit(1);
  }

  const beforeReport = readJson(path.resolve(beforePath));
  const afterReport = readJson(path.resolve(afterPath));

  const beforeByKey = new Map(
    (beforeReport.results || []).map((entry) => [caseKey(entry), entry]),
  );
  const afterByKey = new Map(
    (afterReport.results || []).map((entry) => [caseKey(entry), entry]),
  );

  const keys = [...afterByKey.keys()].filter((key) => beforeByKey.has(key));
  const caseDeltas = keys.map((key) =>
    compareCase(beforeByKey.get(key), afterByKey.get(key)),
  );

  const deltaReport = {
    generatedAt: new Date().toISOString(),
    beforeReport: path.resolve(beforePath),
    afterReport: path.resolve(afterPath),
    host: afterReport.host || beforeReport.host || null,
    config: {
      before: beforeReport.config || null,
      after: afterReport.config || null,
    },
    caseDeltas,
    focusSummary: summarizeFocus(beforeReport, afterReport),
  };

  const outDir = path.join(process.cwd(), "STATUSREPORT", "benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(
    outDir,
    `lattice-benchmark-delta-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  fs.writeFileSync(
    outPath,
    `${JSON.stringify(deltaReport, null, 2)}\n`,
    "utf8",
  );

  console.log(JSON.stringify(deltaReport, null, 2));
  console.log(`\nDelta report saved: ${outPath}`);
}

main();
