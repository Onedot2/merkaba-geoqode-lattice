Program MultiFrequency {
  Node.emit(Δ[red], Φ[1]);
  Node.detect(⊗, ⧉);
  Water.qbit(~wave(432Hz), Φ[1]);

  Node.emit(Δ[blue], Φ[2]);
  Node.detect(⊗, ⧉);
  Water.qbit(~wave(528Hz), Φ[2]);

  Node.emit(Δ[amber], Φ[3]);
  Node.detect(⊗, ⧉);
  Water.qbit(~wave(741Hz), Φ[3]);

  Log("Multi-frequency resonance complete");
}
