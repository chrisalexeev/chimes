export type ChordOptions = "major" | "minor" | "diminished" | "augmented";
export type ChordModOptions = "maj7" | "min7" | "add9" | "maj7add9" | "min7add9" | "sus2" | "sus4" | "none";

export const NOTES: (
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"
)[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export type Note = typeof NOTES[number];
