// geo/runtime/node.js
// Sensor/Emitter Node for GeoQode execution

export class Node {
  constructor(id = `node-${Date.now()}`) {
    this.id = id;
    this.state = "IDLE"; // IDLE, EMITTING, DETECTING, DORMANT
    this.chromodynamicShading = null;
    this.harmonic = null;
    this.emissionHistory = [];
    this.detectionHistory = [];
  }

  /**
   * Emit spectral light with chromodynamic shading
   * @param {string} color - Chromodynamic color
   * @param {number} harmonic - Harmonic frequency (φ^n)
   */
  emit(color, harmonic) {
    this.state = "EMITTING";
    this.chromodynamicShading = color;
    this.harmonic = harmonic;

    const emission = {
      timestamp: Date.now(),
      nodeId: this.id,
      color,
      harmonic,
      state: this.state,
    };

    this.emissionHistory.push(emission);
    console.log(
      `[Node ${this.id}] Emitted ${color} spectrum at Φ[${harmonic}]`,
    );

    return emission;
  }

  /**
   * Detect helixial duality and octahedron resonance
   * @param {boolean} duality - Detect opposing tetrahedrons (⊗)
   * @param {boolean} octahedron - Detect octahedron field (⧉)
   */
  detect(duality, octahedron) {
    this.state = "DETECTING";

    const detection = {
      timestamp: Date.now(),
      nodeId: this.id,
      duality,
      octahedron,
      currentColor: this.chromodynamicShading,
      currentHarmonic: this.harmonic,
      state: this.state,
    };

    this.detectionHistory.push(detection);
    console.log(
      `[Node ${this.id}] Detected duality=${duality}, octahedron=${octahedron}`,
    );

    return detection;
  }

  /**
   * Get node state
   */
  getState() {
    return {
      id: this.id,
      state: this.state,
      chromodynamicShading: this.chromodynamicShading,
      harmonic: this.harmonic,
      emissionCount: this.emissionHistory.length,
      detectionCount: this.detectionHistory.length,
    };
  }

  /**
   * Reset node
   */
  reset() {
    this.state = "IDLE";
    this.chromodynamicShading = null;
    this.harmonic = null;
  }

  /**
   * Get all execution history
   */
  getHistory() {
    return {
      emissions: this.emissionHistory,
      detections: this.detectionHistory,
    };
  }
}

/**
 * Node Pool — manages multiple nodes
 */
export class NodePool {
  constructor(size = 10) {
    this.nodes = Array.from({ length: size }, (_, i) => new Node(`node-${i}`));
    this.activeNodeIndex = 0;
  }

  getActiveNode() {
    return this.nodes[this.activeNodeIndex];
  }

  switchNode(index) {
    if (index < 0 || index >= this.nodes.length) {
      throw new Error(`Invalid node index: ${index}`);
    }
    this.activeNodeIndex = index;
    return this.nodes[index];
  }

  getAllNodes() {
    return this.nodes;
  }

  getStates() {
    return this.nodes.map((node) => node.getState());
  }

  resetAll() {
    this.nodes.forEach((node) => node.reset());
  }
}
