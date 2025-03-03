export class ChordParser {
  private static readonly CHORD_REGEX =
    /([A-G][#b]?)(sus2|sus4)?(maj|min|[mM]?)([79]|add9)?([b#])?(\+|\-)?/;
  private static readonly MODIFIER_REGEX = /([b#]?)([mM]?[7-9]?)/;

  static parseChord(chord: string) {
    const match = chord.match(ChordParser.CHORD_REGEX);
    if (!match) {
      throw new Error(`Invalid chord format: ${chord}`);
    }
    return {
      root: match[1],
      sus: match[2],
      type: match[3],
      modifier: match[4],
      accidental: match[5],
      extension: match[6],
    };
  }

  static parseModifier(modifier: string): { accidental: string; type: string } {
    const match = modifier.match(ChordParser.MODIFIER_REGEX);
    if (!match) {
      throw new Error(`Invalid modifier format: ${modifier}`);
    }
    return {
      accidental: match[1],
      type: match[2],
    };
  }

  static parseChordIntervals(chord: string): number[] {
    const { root, sus, type, modifier, accidental, extension } =
      this.parseChord(chord);
    const rootNote = this.noteToNumber(root);

    if (sus) {
      if (sus === "sus2") {
        return [rootNote, rootNote + 2, rootNote + 7];
      } else if (sus === "sus4") {
        return [rootNote, rootNote + 5, rootNote + 7];
      }
    }
    if (type === "") {
      if (modifier === "7") {
        return [rootNote, rootNote + 4, rootNote + 7, rootNote + 10];
      }
      if (modifier === "9") {
        return [
          rootNote,
          rootNote + 4,
          rootNote + 7,
          rootNote + 10,
          rootNote + 14,
        ];
      }
      if (modifier === "add9") {
        return [rootNote, rootNote + 4, rootNote + 7, rootNote + 14];
      }
      return [rootNote, rootNote + 4, rootNote + 7];
    }
    if (type === "maj" || type === "M") {
      if (modifier === "7") {
        return [rootNote, rootNote + 4, rootNote + 7, rootNote + 11];
      } else if (modifier === "9") {
        return [
          rootNote,
          rootNote + 4,
          rootNote + 7,
          rootNote + 11,
          rootNote + 14,
        ];
      } else if (modifier === "add9") {
        return [rootNote, rootNote + 4, rootNote + 7, rootNote + 14];
      }
      return [rootNote, rootNote + 4, rootNote + 7];
    } else if (type === "min" || type === "m") {
      if (modifier === "7") {
        return [rootNote, rootNote + 3, rootNote + 7, rootNote + 10];
      } else if (modifier === "9") {
        return [
          rootNote,
          rootNote + 3,
          rootNote + 7,
          rootNote + 10,
          rootNote + 14,
        ];
      } else if (modifier === "add9") {
        return [rootNote, rootNote + 3, rootNote + 7, rootNote + 14];
      }
      return [rootNote, rootNote + 3, rootNote + 7];
    }
    throw new Error(`Unsupported chord: ${chord}`);
  }

  static noteToNumber(note: string): number {
    const noteMap = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11,
    };
    const noteIndex = noteMap[note];
    if (noteIndex === undefined) {
      throw new Error(`Invalid note name: ${note}`);
    }
    return noteIndex;
  }
}
