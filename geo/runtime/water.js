// geo/runtime/water.js
// Water molecule QBITS materialization engine

export class WaterMolecule {
  constructor(id = `water-${Date.now()}`) {
    this.id = id;
    this.qbitState = "DORMANT"; // DORMANT, MATERIALIZED, RESONATING, CRYSTALLIZED
    this.frequency = null;
    this.harmonic = null;
    this.crystallizationLogs = [];
  }

  /**
   * Materialize QBITS in water via cymatic sonic driver
   * @param {string} frequency - Sonic frequency (~wave(f))
   * @param {number} harmonic - Harmonic multiplier (φ^n)
   */
  materializeQBIT(frequency, harmonic) {
    this.qbitState = "MATERIALIZED";
    this.frequency = frequency;
    this.harmonic = harmonic;

    const materialization = {
      timestamp: Date.now(),
      waterId: this.id,
      frequency,
      harmonic,
      state: this.qbitState,
      crystallizationIndex: this.harmonic * 137.5, // Golden angle approximation
    };

    this.crystallizationLogs.push(materialization);
    console.log(
      `[Water ${this.id}] QBITS materialized at ${frequency}, Φ[${harmonic}]`,
    );

    return materialization;
  }

  /**
   * Crystallize QBITS into stable geometric pattern
   */
  crystallize() {
    if (this.qbitState !== "MATERIALIZED") {
      throw new Error("QBITS must be materialized before crystallization");
    }

    this.qbitState = "CRYSTALLIZED";

    const crystallization = {
      timestamp: Date.now(),
      waterId: this.id,
      geometry: `${this.harmonic}-fold symmetry`,
      frequency: this.frequency,
      state: this.qbitState,
    };

    this.crystallizationLogs.push(crystallization);
    console.log(`[Water ${this.id}] QBITS crystallized in stable geometry`);

    return crystallization;
  }

  /**
   * Get water state
   */
  getState() {
    return {
      id: this.id,
      qbitState: this.qbitState,
      frequency: this.frequency,
      harmonic: this.harmonic,
      crystallizationCount: this.crystallizationLogs.length,
    };
  }

  /**
   * Get crystallization logs
   */
  getLogs() {
    return this.crystallizationLogs;
  }
}

/**
 * Water Pool — manages multiple water molecules
 */
export class WaterPool {
  constructor(size = 1000) {
    this.molecules = Array.from(
      { length: size },
      (_, i) => new WaterMolecule(`water-${i}`),
    );
    this.materializedCount = 0;
    this.crystallizedCount = 0;
  }

  materializeQBIT(frequency, harmonic) {
    const molecule =
      this.molecules[this.materializedCount % this.molecules.length];
    molecule.materializeQBIT(frequency, harmonic);
    this.materializedCount++;
    return molecule;
  }

  crystallizeAll() {
    let crystallized = 0;
    for (const molecule of this.molecules) {
      if (molecule.qbitState === "MATERIALIZED") {
        molecule.crystallize();
        crystallized++;
      }
    }
    this.crystallizedCount += crystallized;
    console.log(`[WaterPool] Crystallized ${crystallized} water molecules`);
    return crystallized;
  }

  getStats() {
    return {
      totalMolecules: this.molecules.length,
      materializedCount: this.materializedCount,
      crystallizedCount: this.crystallizedCount,
      activeMolecules: this.molecules.filter((m) => m.qbitState !== "DORMANT")
        .length,
    };
  }

  getMoleculeStates() {
    return this.molecules.map((m) => m.getState());
  }

  reset() {
    this.molecules = Array.from(
      { length: this.molecules.length },
      (_, i) => new WaterMolecule(`water-${i}`),
    );
    this.materializedCount = 0;
    this.crystallizedCount = 0;
  }
}
