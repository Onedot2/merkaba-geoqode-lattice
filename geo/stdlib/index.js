// geo/stdlib/index.js
// Minimal GeoQode standard library constants and helpers

export const STDLIB_FREQUENCIES = Object.freeze({
  LOVE: "528Hz",
  CLARITY: "741Hz",
  GROUNDING: "396Hz",
  RESONANCE: "432Hz",
});

export const SACRED_COLOR_SPECTRUM = Object.freeze([
  "red",
  "amber",
  "gold",
  "green",
  "blue",
  "violet",
  "white",
]);

export const GEOQODE_STDLIB = Object.freeze({
  frequencies: STDLIB_FREQUENCIES,
  colors: SACRED_COLOR_SPECTRUM,
  harmonics: Object.freeze(["1", "2", "3", "5", "8", "13"]),
});

export function getStdlibConstant(namespace, key) {
  return GEOQODE_STDLIB?.[namespace]?.[key] ?? null;
}
