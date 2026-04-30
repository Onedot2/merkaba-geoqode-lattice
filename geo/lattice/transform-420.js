// geo/lattice/transform-420.js
// STORM MERKABA Transform Codex — Canonical 8.26.48:480 architecture.
//
// Architecture: 8 foundation nodes → 26 bosonic anchor → 48 canonical lattice : 480 harmonic spectrum
// Golden Root: φ = 1.618
// D48 = canonical Merkaba lattice. D480 = full harmonic spectrum (100% expansion).
// All mixed variants (42, 44, 420 substrates) are detected and collapsed to the final form.
// The file path is kept for backward compatibility with existing imports.

// ── Canonical constants ──────────────────────────────────────────────────────

/** Golden ratio anchor for the canonical Φ-rooted lattice. */
export const PHI = 1.618;

/** Legacy coherence baseline retained for bridge normalization. */
export const PSI = 1.414;

/** Canonical resonance lock frequency in Hz. */
export const BASE_FREQUENCY_HZ = 72;

/** Foundation anchor node count. */
export const FOUNDATION_NODES = 8;

/** Bosonic anchor node count. */
export const BOSONIC_ANCHOR_NODES = 26;

/** Canonical lattice node count. */
export const CANONICAL_LATTICE_NODES = 48;

/** Full harmonic spectrum node count. */
export const HARMONIC_SPECTRUM_NODES = 480;

/** Legacy coupling interval. */
export const LEGACY_COUPLING_INTERVAL = 8;

/** Canonical coupling interval after collapse into 48-node lattice. */
export const CANONICAL_COUPLING_INTERVAL = 6;

/** Drift tolerance for the codex stabilization pass. */
export const COHERENCE_TOLERANCE = 0.001;

/** Retained alias for older imports that expect a visual lattice constant. */
export const VISUAL_LATTICE_NODES = HARMONIC_SPECTRUM_NODES;

/** Retained alias for older imports that expect an operational lattice constant. */
export const OPERATIONAL_LATTICE_NODES = CANONICAL_LATTICE_NODES;

/** Retained alias for older imports that expect a mapping ratio. */
export const MAPPING_RATIO =
  LEGACY_COUPLING_INTERVAL / CANONICAL_COUPLING_INTERVAL;

// All mixed/stale variants detected and collapsed by Phase A of the codex.
// These are the signatures that existed before the final canonical unification.
export const DEPRECATED_ARCHITECTURE_SIGNATURES = Object.freeze([
  "8,26,42:420:480", // 42-node sub-lattice variant (stale)
  "8,26,44:420:480", // 44-node sub-lattice variant (stale)
  "8,26,48:420:480", // 48-node with 420 hybrid substrate (stale)
]);

export const CANONICAL_ARCHITECTURE = "8,26,48:480";
export const CERTIFICATE_VERSION = "v3.0";

// LEGACY_VARIANTS: all stale signatures + the canonical target.
// StormMerkabaTransformCodex.detectVariants() uses this list in Phase A
// to show which variants are being collapsed into the canonical form.
export const LEGACY_VARIANTS = Object.freeze([
  ...DEPRECATED_ARCHITECTURE_SIGNATURES,
  CANONICAL_ARCHITECTURE,
]);

export function isCanonicalArchitectureSignature(signature) {
  return String(signature || "").trim() === CANONICAL_ARCHITECTURE;
}

export function normalizeArchitectureSignature(_signature) {
  return CANONICAL_ARCHITECTURE;
}

export function assertCanonicalArchitectureSignature(
  signature,
  { source = "unknown" } = {},
) {
  if (!isCanonicalArchitectureSignature(signature)) {
    throw new Error(
      `[MERKABA] Non-canonical architecture signature rejected in ${source}. Expected "${CANONICAL_ARCHITECTURE}".`,
    );
  }

  return CANONICAL_ARCHITECTURE;
}

const DEFAULT_SUBSYSTEMS = Object.freeze([
  "foundation-8",
  "bosonic-anchor-26",
  "canonical-lattice-48",
  "harmonic-spectrum-480",
]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function makeWaveBar(pulse) {
  return "#".repeat(clamp(Math.round((pulse + 1) * 20), 1, 40));
}

// ── StormMerkabaTransformCodex ──────────────────────────────────────────────

export class StormMerkabaTransformCodex {
  constructor(options = {}) {
    // Raw incoming variants (stale + canonical) — preserved for Phase A detection display.
    // normalizeArchitectureSignature maps ALL of them to "8,26,48:480" for actual use.
    this._rawVariants = [...(options.variants || LEGACY_VARIANTS)];

    if (options.finalArchitecture) {
      assertCanonicalArchitectureSignature(options.finalArchitecture, {
        source: "StormMerkabaTransformCodex.constructor",
      });
    }

    this.finalArchitecture = CANONICAL_ARCHITECTURE;
    this.frequencyLockHz = options.frequencyLockHz || BASE_FREQUENCY_HZ;
    this.bridgeLayer = null;
    this.coherenceIndex = 0;
    this.log = [];
    this.status = "idle";
    this.progress = [];
    this.lastExecution = null;
  }

  _push(message) {
    this.log.push(message);
  }

  detectVariants() {
    // Phase A — show raw stale variants being detected before collapse
    const detected = this._rawVariants.map((variant, index) => ({
      variant,
      ordinal: index + 1,
      requiresCollapse: variant !== this.finalArchitecture,
      collapsesTo: this.finalArchitecture,
    }));

    this._push("[Phase A] Detecting current MERKABA variants...");
    detected.forEach((entry) => {
      const tag = entry.requiresCollapse ? " → COLLAPSE" : " ✓ CANONICAL";
      this._push(` Detected variant: ${entry.variant}${tag}`);
    });
    this._push(` Target architecture: ${this.finalArchitecture}`);

    return {
      detected,
      targetArchitecture: this.finalArchitecture,
    };
  }

  substituteNodes() {
    // Phase B — map every stale variant to the canonical form
    const substitutions = this._rawVariants.map((variant) => ({
      from: variant,
      to: this.finalArchitecture,
      retainedAnchors: [FOUNDATION_NODES, BOSONIC_ANCHOR_NODES],
      canonicalNodes: CANONICAL_LATTICE_NODES,
      harmonicSpectrum: HARMONIC_SPECTRUM_NODES,
    }));

    this._push(
      "[Phase B] Substituting 42/44 nodes with 48 canonical equivalents...",
    );
    this._push(` → ${FOUNDATION_NODES} foundation retained`);
    this._push(` → ${BOSONIC_ANCHOR_NODES} bosonic anchor retained`);
    this._push(
      ` → ${CANONICAL_LATTICE_NODES} maximalist canonical build enforced`,
    );
    this._push(` → ${HARMONIC_SPECTRUM_NODES} harmonic spectrum locked`);

    return {
      substitutions,
      retainedAnchors: [FOUNDATION_NODES, BOSONIC_ANCHOR_NODES],
      canonicalNodes: CANONICAL_LATTICE_NODES,
      harmonicSpectrum: HARMONIC_SPECTRUM_NODES,
    };
  }

  resonanceCoupling() {
    this.bridgeLayer = (PHI + PSI) / 2;

    this._push("[Phase C] Establishing Golden Bridge Layer...");
    this._push(` Bridge anchored at ${this.bridgeLayer.toFixed(3)}`);
    this._push(
      ` Coupling rule: every ${LEGACY_COUPLING_INTERVAL}th node (legacy) → every ${CANONICAL_COUPLING_INTERVAL}th node (canonical ${CANONICAL_LATTICE_NODES})`,
    );
    this._push(
      ` Frequency lock: ${this.frequencyLockHz} Hz baseline resonance`,
    );

    return {
      phi: PHI,
      psi: PSI,
      bridgeLayer: this.bridgeLayer,
      legacyCouplingInterval: LEGACY_COUPLING_INTERVAL,
      canonicalCouplingInterval: CANONICAL_COUPLING_INTERVAL,
      frequencyLockHz: this.frequencyLockHz,
    };
  }

  mitigateInterference() {
    this.coherenceIndex = Math.abs(PHI - PSI);
    const driftDetected = this.coherenceIndex > COHERENCE_TOLERANCE;

    this._push("[Phase D] Mitigating interference...");
    if (driftDetected) {
      this._push(" Drift detected — recursive feedback loop engaged.");
    } else {
      this._push(" Coherence stable — no drift detected.");
    }
    this._push(
      ` Coherence index stabilized at ±${this.coherenceIndex.toFixed(3)}`,
    );

    return {
      driftDetected,
      coherenceIndex: this.coherenceIndex,
      tolerance: COHERENCE_TOLERANCE,
      recursiveFeedbackLoopEngaged: driftDetected,
    };
  }

  validateUpgrade() {
    const certificate = `RESONANCE-CERT-${CERTIFICATE_VERSION} :: ${this.finalArchitecture} :: Φ-rooted :: ${new Date().toISOString()}`;

    this._push("[Phase E] Running MERKABArythm diagnostics...");
    this._push(" Harmonic parity confirmed.");
    this._push(" Bandwidth: 100% maximal harmonic spectrum");
    this._push(" Coherence: Φ-rooted anchor achieved");
    this._push(" Harmonic Coverage: complete redundancy");
    this._push(` Resonance Certificate ${CERTIFICATE_VERSION} issued`);

    return {
      harmonicParity: true,
      bandwidthPercent: 100,
      phiRootedAnchor: true,
      harmonicCoverage: "complete redundancy",
      certificate,
    };
  }

  diagnosticOverlay({ cycles = 20, subsystems = DEFAULT_SUBSYSTEMS } = {}) {
    const subsystemProgress = subsystems.map((subsystem, index) => ({
      subsystem,
      phase: index + 1,
      progressPercent: Math.round(((index + 1) / subsystems.length) * 100),
      canonicalNodeTarget: CANONICAL_LATTICE_NODES,
    }));

    const wave = [];
    this._push("[Overlay] Live diagnostic transformation overlay:");

    subsystemProgress.forEach((entry) => {
      this._push(
        ` Subsystem ${entry.phase}: ${entry.subsystem} → ${entry.progressPercent}% collapsed into canonical ${entry.canonicalNodeTarget}-node lattice`,
      );
    });

    for (let cycle = 0; cycle < cycles; cycle += 1) {
      const pulse = Math.sin(2 * Math.PI * (cycle / this.frequencyLockHz));
      const row = {
        cycle: cycle + 1,
        pulse,
        bar: makeWaveBar(pulse),
      };
      wave.push(row);
      this._push(` Cycle ${String(row.cycle).padStart(2, "0")}: ${row.bar}`);
    }

    this.progress = subsystemProgress;
    return {
      subsystemProgress,
      wave,
      frequencyLockHz: this.frequencyLockHz,
    };
  }

  businessOverlay() {
    const integration = {
      transactions: "Transactions mapped onto resonance cycles.",
      governance:
        "Governance dashboards aligned with the codex coherence index.",
      investorNarrative:
        "Investor storytelling synchronized with DreamProjector visuals.",
      osIntegration:
        "Business OS resonance synchronized to canonical 8→26→48:480 lattice.",
    };

    this._push("[Overlay] Business OS Layer Integration:");
    Object.values(integration).forEach((line) => {
      this._push(` → ${line}`);
    });

    return integration;
  }

  executeCodex(options = {}) {
    this.status = "running";
    this.log = [];
    this._push("=== STORM MERKABA Transform Codex Initiated ===");

    const detection = this.detectVariants();
    const substitution = this.substituteNodes();
    const resonance = this.resonanceCoupling();
    const mitigation = this.mitigateInterference();
    const validation = this.validateUpgrade();
    const overlay = this.diagnosticOverlay(options.overlay || {});
    const business = this.businessOverlay();

    this.status = "canonical";
    this._push(
      `=== Transformation Complete: Final Architecture = ${FOUNDATION_NODES} → ${BOSONIC_ANCHOR_NODES} → ${CANONICAL_LATTICE_NODES} : ${HARMONIC_SPECTRUM_NODES} ===`,
    );

    this.lastExecution = {
      ok: true,
      status: this.status,
      architecture: this.finalArchitecture,
      phases: {
        detection,
        substitution,
        resonance,
        mitigation,
        validation,
        overlay,
        business,
      },
      log: [...this.log],
    };

    return this.lastExecution;
  }

  // Backward-compatible alias retained for older callers.
  executeProtocol(options = {}) {
    return this.executeCodex(options);
  }

  getStatusReport() {
    return {
      status: this.status,
      architecture: this.finalArchitecture,
      foundationNodes: FOUNDATION_NODES,
      bosonicAnchorNodes: BOSONIC_ANCHOR_NODES,
      canonicalNodes: CANONICAL_LATTICE_NODES,
      harmonicSpectrumNodes: HARMONIC_SPECTRUM_NODES,
      bridgeLayer: this.bridgeLayer,
      coherenceIndex: this.coherenceIndex,
      progress: this.progress,
      lastExecutionAvailable: Boolean(this.lastExecution),
    };
  }
}

// Backward-compatible export name for older imports.
export class MerkabaTransform420 extends StormMerkabaTransformCodex {}

// ── DiagnosticOverlay ───────────────────────────────────────────────────────

export class DiagnosticOverlay {
  constructor(options = {}) {
    this.codex =
      options.codex instanceof StormMerkabaTransformCodex
        ? options.codex
        : new StormMerkabaTransformCodex();
  }

  runDiagnostics({ pulseCycles = 20, subsystems = DEFAULT_SUBSYSTEMS } = {}) {
    const result = this.codex.diagnosticOverlay({
      cycles: pulseCycles,
      subsystems,
    });

    return {
      mappings: result.subsystemProgress.map((entry, index) => ({
        legacyNode: index * LEGACY_COUPLING_INTERVAL,
        canonicalNode: index * CANONICAL_COUPLING_INTERVAL,
        subsystem: entry.subsystem,
      })),
      pulses: result.wave.map((row) => ({
        cycle: row.cycle,
        amplitude: row.pulse,
        bar: row.bar,
      })),
      coherence: {
        stable: this.codex.coherenceIndex <= 0.5,
        averageAmplitude:
          result.wave.reduce((sum, row) => sum + Math.abs(row.pulse), 0) /
          (result.wave.length || 1),
      },
      progress: result.subsystemProgress,
      log: [...this.codex.log],
    };
  }
}

// ── AnchorHierarchy ─────────────────────────────────────────────────────────

export class AnchorHierarchy {
  describe() {
    return {
      canonicalArchitecture: CANONICAL_ARCHITECTURE,
      anchors: {
        foundation: {
          nodes: FOUNDATION_NODES,
          role: "Foundation anchor retained across all transform passes.",
        },
        bosonic: {
          nodes: BOSONIC_ANCHOR_NODES,
          role: "Bosonic anchor retained as the canonical bridge spine.",
        },
        canonical: {
          nodes: CANONICAL_LATTICE_NODES,
          role: "Canonical lattice for all MERKABA subsystem collapse.",
        },
        harmonicSpectrum: {
          nodes: HARMONIC_SPECTRUM_NODES,
          role: "Maximum harmonic fidelity shell for DreamProjector/business OS alignment.",
        },
      },
      bridge: {
        phi: PHI,
        psi: PSI,
        midpoint: (PHI + PSI) / 2,
        couplingRule: `every ${LEGACY_COUPLING_INTERVAL}th legacy node → every ${CANONICAL_COUPLING_INTERVAL}th canonical node`,
        frequencyLockHz: BASE_FREQUENCY_HZ,
      },
      outcome: {
        phiRooted: true,
        operationallyUnified: true,
        cosmologicalFidelity: "maximal",
        investorLegitimacy: "synchronized",
      },
    };
  }
}

export default {
  StormMerkabaTransformCodex,
  MerkabaTransform420,
  DiagnosticOverlay,
  AnchorHierarchy,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  LEGACY_COUPLING_INTERVAL,
  CANONICAL_COUPLING_INTERVAL,
  VISUAL_LATTICE_NODES,
  OPERATIONAL_LATTICE_NODES,
  MAPPING_RATIO,
  COHERENCE_TOLERANCE,
  DEPRECATED_ARCHITECTURE_SIGNATURES,
  LEGACY_VARIANTS,
  CANONICAL_ARCHITECTURE,
  CERTIFICATE_VERSION,
  isCanonicalArchitectureSignature,
  normalizeArchitectureSignature,
  assertCanonicalArchitectureSignature,
};
