/**
 * geo/cinema/index.js
 * Cinema layer public exports
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
 */

export {
  CinemaVirtualizer,
  CINEMA_PLAYBOOK_REGISTRY,
  PROJECTION_MODES,
} from "./cinema-virtualizer.js";
export { ScriptParser } from "./script-parser.js";
export {
  NarrativeEmbedder,
  GENRE_FREQUENCY_MODIFIERS,
} from "./narrative-embedder.js";
export { CinemaProjector } from "./cinema-projector.js";
