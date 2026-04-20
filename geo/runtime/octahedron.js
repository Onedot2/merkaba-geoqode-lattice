// geo/runtime/octahedron.js
// Inner Octahedron Field of Light — Execution chamber for GeoQode programs

const MAX_OCTAHEDRON_HISTORY = 10000;

export class InnerOctahedron {
  constructor() {
    this.active = false;
    this.resonanceLevel = 0;
    this.spectralSpectrum = [];
    this.emissionLogs = [];
    this.detectionLogs = [];
  }

  /**
   * Activate the Inner Octahedron field
   * Maps to MERKABA Tier 2: Operational Systems
   */
  activate() {
    this.active = true;
    this.resonanceLevel = 1.0;
    this.log("Inner Octahedron field activated");
  }

  /**
   * Deactivate the field
   */
  deactivate() {
    this.active = false;
    this.resonanceLevel = 0;
    this.log("Inner Octahedron field deactivated");
  }

  /**
   * Emit chromodynamic spectral light into the field
   * @param {string} color - Chromodynamic color (red, green, blue, amber, etc.)
   * @param {number} harmonic - Harmonic frequency ratio (φ^n)
   */
  emit(color, harmonic) {
    if (!this.active) {
      throw new Error("Octahedron field not active. Call activate() first.");
    }

    const emission = {
      timestamp: Date.now(),
      color,
      harmonic,
      resonanceLevel: this.resonanceLevel,
    };

    this.emissionLogs.push(emission);
    this.spectralSpectrum.push(color);
    if (this.emissionLogs.length > MAX_OCTAHEDRON_HISTORY) {
      this.emissionLogs = this.emissionLogs.slice(-MAX_OCTAHEDRON_HISTORY);
    }
    if (this.spectralSpectrum.length > MAX_OCTAHEDRON_HISTORY) {
      this.spectralSpectrum = this.spectralSpectrum.slice(
        -MAX_OCTAHEDRON_HISTORY,
      );
    }
    this.resonanceLevel = Math.min(2.0, this.resonanceLevel + harmonic * 0.1);

    this.log(`Emitted ${color} spectrum at harmonic Φ[${harmonic}]`);
    return emission;
  }

  /**
   * Detect helixial duality and resonance patterns
   * @param {boolean} duality - Whether to detect ⊗ (opposing tetrahedrons)
   * @param {boolean} octahedronPattern - Whether to detect ⧉ (octahedron resonance)
   */
  detect(duality, octahedronPattern) {
    if (!this.active) {
      throw new Error("Octahedron field not active.");
    }

    const detection = {
      timestamp: Date.now(),
      duality,
      octahedronPattern,
      spectralContent: [...this.spectralSpectrum],
      resonanceLevel: this.resonanceLevel,
    };

    this.detectionLogs.push(detection);
    if (this.detectionLogs.length > MAX_OCTAHEDRON_HISTORY) {
      this.detectionLogs = this.detectionLogs.slice(-MAX_OCTAHEDRON_HISTORY);
    }
    this.log(`Detected duality=${duality}, octahedron=${octahedronPattern}`);

    return detection;
  }

  /**
   * Get current field state
   */
  getState() {
    return {
      active: this.active,
      resonanceLevel: this.resonanceLevel,
      spectralSpectrum: [...this.spectralSpectrum],
      emissionCount: this.emissionLogs.length,
      detectionCount: this.detectionLogs.length,
    };
  }

  /**
   * Reset field to initial state
   */
  reset() {
    this.active = false;
    this.resonanceLevel = 0;
    this.spectralSpectrum = [];
    this.emissionLogs = [];
    this.detectionLogs = [];
  }

  /**
   * Get all execution logs
   */
  getLogs() {
    return {
      emissions: this.emissionLogs,
      detections: this.detectionLogs,
    };
  }

  log(message) {
    // Logs are captured but also printed for debugging
    console.log(`[Octahedron] ${message}`);
  }
}
