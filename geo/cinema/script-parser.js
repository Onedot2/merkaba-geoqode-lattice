/**
 * geo/cinema/script-parser.js
 * ScriptParser — Phase 1 of Cinema Virtualization Pipeline
 *
 * Parses raw script text, .geo playbooks, or natural language narratives
 * into structured semantic units that the Merkaba-LLM can embed.
 *
 * Supported formats:
 *   - .geo playbook format (TITLE/SCENES/OUTPUT blocks)
 *   - Raw screenplay format (Scene headings, ACTION, DIALOGUE)
 *   - Plain narrative text (paragraph-based)
 *
 * Source: MerkabaTheatre Hollywood update (April 29, 2026)
 */

// ─── Scene Unit ──────────────────────────────────────────────────────────────

/**
 * @typedef {object} SceneUnit
 * @property {number} sceneNumber
 * @property {string} title
 * @property {string} action
 * @property {string[]} characters
 * @property {string} location
 * @property {string[]} dialogue
 * @property {string} rawText
 */

/**
 * @typedef {object} ParsedScript
 * @property {string} title
 * @property {string} genre
 * @property {SceneUnit[]} scenes
 * @property {string[]} characters  All unique characters across scenes
 * @property {string[]} locations   All unique locations across scenes
 * @property {string} projection    Projection mode hint
 * @property {string} authorship
 * @property {string} rawText
 */

// ─── ScriptParser ─────────────────────────────────────────────────────────────

export class ScriptParser {
  constructor(options = {}) {
    this.version = "1.0.0";
    this.trimWhitespace = options.trimWhitespace ?? true;
    this.maxScenes = options.maxScenes ?? 500;
  }

  /**
   * Parse input into a structured ParsedScript.
   * Auto-detects format (.geo, screenplay, narrative).
   *
   * @param {string} scriptText
   * @returns {ParsedScript}
   */
  parse(scriptText) {
    if (!scriptText || typeof scriptText !== "string") {
      throw new Error(
        "ScriptParser.parse: scriptText must be a non-empty string",
      );
    }

    const text = this.trimWhitespace ? scriptText.trim() : scriptText;

    if (this._isGeoFormat(text)) {
      return this._parseGeoFormat(text);
    }
    if (this._isScreenplayFormat(text)) {
      return this._parseScreenplayFormat(text);
    }
    return this._parseNarrativeFormat(text);
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _isGeoFormat(text) {
    return /^TITLE:/im.test(text) || /^SCENES:/im.test(text);
  }

  _isScreenplayFormat(text) {
    return /^(INT\.|EXT\.|FADE IN|FADE OUT|CUT TO)/im.test(text);
  }

  /**
   * Parse structured .geo playbook format.
   * TITLE, GENRE, SCENES (with sub-fields), PROJECTION, AUTHORSHIP
   */
  _parseGeoFormat(text) {
    const title = this._extractField(text, "TITLE") || "Untitled";
    const genre = this._extractField(text, "GENRE") || "Unknown";
    const projection =
      this._extractField(text, "PROJECTION") ||
      "DreamProjector Immersive Overlay";
    const authorship =
      this._extractField(text, "AUTHORSHIP") || "Founder — Bradley";

    const scenes = this._parseGeoScenes(text);
    const { characters, locations } = this._extractCrossSceneEntities(scenes);

    return {
      title,
      genre,
      scenes,
      characters,
      locations,
      projection,
      authorship,
      rawText: text,
    };
  }

  _parseGeoScenes(text) {
    const scenes = [];
    // Support both YAML-style "- Scene N:" and bare "SCENE N:" formats
    const sceneBlocks = text.split(/\n\s*(?:-\s*[Ss]cene|SCENE)\s+\d+:/i);

    for (
      let i = 1;
      i < Math.min(sceneBlocks.length + 1, this.maxScenes + 1);
      i++
    ) {
      const block = sceneBlocks[i - 1] ? sceneBlocks[i] : null;
      if (!block) continue;

      const sceneTitle = this._extractQuotedOrLine(sceneBlocks[i - 1] || "");
      const action =
        this._extractField(block, "ACTION") ||
        this._extractQuotedValue(block, "ACTION") ||
        "";
      const characters = this._extractArrayField(block, "CHARACTERS");
      const location = this._extractField(block, "LOCATION") || "";

      scenes.push({
        sceneNumber: i,
        title: sceneTitle,
        action,
        characters,
        location,
        dialogue: [],
        rawText: block,
      });
    }

    return scenes;
  }

  _parseScreenplayFormat(text) {
    const lines = text.split("\n");
    const scenes = [];
    let current = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (/^(INT\.|EXT\.)/i.test(line)) {
        if (current) scenes.push(current);
        current = {
          sceneNumber: scenes.length + 1,
          title: line,
          action: "",
          characters: [],
          location: line
            .replace(/^(INT\.|EXT\.)\s*/i, "")
            .split(/[-–—]/)[0]
            .trim(),
          dialogue: [],
          rawText: line,
        };
      } else if (current && /^[A-Z\s]{3,}$/.test(line) && line.length < 40) {
        // All-caps character name
        if (!current.characters.includes(line)) current.characters.push(line);
      } else if (current && line.startsWith("(")) {
        // Parenthetical, skip
      } else if (current) {
        const prevChars = current.characters;
        if (prevChars.length > 0 && !current.action) {
          current.dialogue.push(line);
        } else {
          current.action += (current.action ? " " : "") + line;
        }
      }
    }
    if (current) scenes.push(current);

    const { characters, locations } = this._extractCrossSceneEntities(scenes);
    return {
      title: lines[0]?.trim() || "Untitled Screenplay",
      genre: "Screenplay",
      scenes,
      characters,
      locations,
      projection: "DreamProjector Immersive Overlay",
      authorship: "Founder — Bradley",
      rawText: text,
    };
  }

  _parseNarrativeFormat(text) {
    const paragraphs = text.split(/\n\n+/);
    const scenes = paragraphs.slice(0, this.maxScenes).map((p, idx) => ({
      sceneNumber: idx + 1,
      title: `Scene ${idx + 1}`,
      action: p.trim(),
      characters: [],
      location: "",
      dialogue: [],
      rawText: p,
    }));

    return {
      title: "Narrative",
      genre: "Narrative",
      scenes,
      characters: [],
      locations: [],
      projection: "DreamProjector Immersive Overlay",
      authorship: "Founder — Bradley",
      rawText: text,
    };
  }

  // ─── Field Extractors ────────────────────────────────────────────────────────

  _extractField(text, key) {
    const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "im"));
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
  }

  _extractQuotedValue(text, key) {
    const match = text.match(new RegExp(`${key}:\\s*["']([^"']+)["']`, "i"));
    return match ? match[1].trim() : null;
  }

  _extractQuotedOrLine(text) {
    const match = text.match(/["']([^"']+)["']/);
    if (match) return match[1];
    return text.split(":").slice(1).join(":").trim() || "";
  }

  _extractArrayField(text, key) {
    const match = text.match(new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`, "i"));
    if (!match) return [];
    return match[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  _extractCrossSceneEntities(scenes) {
    const characters = [...new Set(scenes.flatMap((s) => s.characters))];
    const locations = [
      ...new Set(scenes.map((s) => s.location).filter(Boolean)),
    ];
    return { characters, locations };
  }
}

export default ScriptParser;
