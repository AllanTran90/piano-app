
export type PianoKeyData = {
  letter: string;
  note: string;
  type: "white" | "black";
};

export const pianoKeys: PianoKeyData[] = [
  { letter: "a", note: "C4", type: "white" },
  { letter: "s", note: "D4", type: "white" },
  { letter: "d", note: "E4", type: "white" },
  { letter: "f", note: "F4", type: "white" },
  { letter: "g", note: "G4", type: "white" },
  { letter: "h", note: "A4", type: "white" },
  { letter: "j", note: "B4", type: "white" },
  { letter: "k", note: "C5", type: "white" },
];