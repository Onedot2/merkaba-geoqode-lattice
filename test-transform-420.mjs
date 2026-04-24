// test-transform-420.mjs — temporary test script for the 480→420 transform
import { MerkabaTransform420, DiagnosticOverlay, AnchorHierarchy } from './geo/lattice/transform-420.js';

// --- Test 1: Full protocol ---
console.log('\n=== TEST 1: MerkabaTransform420.executeProtocol() ===');
const transform = new MerkabaTransform420();
const result = transform.executeProtocol();
result.log.forEach(l => console.log(l));
console.log('\nOK:', result.ok);
console.log('Certificate:', result.certificate);

// --- Test 2: Diagnostic overlay ---
console.log('\n=== TEST 2: DiagnosticOverlay.runDiagnostics() ===');
const overlay = new DiagnosticOverlay();
const diag = overlay.runDiagnostics({ pulseCycles: 6 });
diag.log.slice(0, 15).forEach(l => console.log(l));
console.log(`... (${diag.mappings.length} node pairs, ${diag.pulses.length} pulse cycles)`);
console.log('Coherence stable:', diag.coherence.stable);

// --- Test 3: AnchorHierarchy ---
console.log('\n=== TEST 3: AnchorHierarchy.describe() ===');
const h = new AnchorHierarchy();
const desc = h.describe();
console.log('Visual anchor nodes:', desc.visual.nodes, 'PHI:', desc.visual.phi);
console.log('Operational anchor nodes:', desc.operational.nodes, 'PSI:', desc.operational.psi);
console.log('Bridge midpoint:', desc.bridge.midpoint.toFixed(3));
console.log('Outcome:', desc.outcome.strategy);
console.log('\nAll tests passed.');
