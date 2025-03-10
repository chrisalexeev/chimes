export const getRandomVelocity: (speed: number) => {
  dX: number;
  dY: number;
} = (speed: number) => {
  const angle = Math.random() * 2 * Math.PI;
  return {
    dX: Math.cos(angle) * speed,
    dY: Math.sin(angle) * speed,
  };
};

export const getRandomColor: () => string = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getNoteName: (
  noteNumber: number,
  showOctave?: boolean
) => string = (noteNumber, showOctave = true) => {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const noteIndex = noteNumber % 12;
  return `${noteNames[noteIndex]}${
    showOctave ? Math.floor(noteNumber / 12) - 2 : ""
  }`;
};
