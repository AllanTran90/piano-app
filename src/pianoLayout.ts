export type KeyType = "white" | "black";

export type PianoKeyData = {
  letter: string;
  note: string;
  type: KeyType;
};

export const KEY_SIZE: Record<KeyType, { width: number; height: number }> = {
  white: { width: 40, height: 160 },
  black: { width: 26, height: 100 },
};

export const KEY_GAP = 4;

// The keys in playing order (low to high), so each black key sits between
// its two white neighbours. This is the only place that knows which letter
// plays which note.
// The bottom keyboard row (z x c v b n m, s d g h j) plays the octave below
// the top row (q w e r t y u i, 2 3 5 6 7) - same pattern, one octave down.
export const pianoKeys: PianoKeyData[] = [
  { letter: "z", note: "C3", type: "white" },
  { letter: "s", note: "Db3", type: "black" },
  { letter: "x", note: "D3", type: "white" },
  { letter: "d", note: "Eb3", type: "black" },
  { letter: "c", note: "E3", type: "white" },
  { letter: "v", note: "F3", type: "white" },
  { letter: "g", note: "Gb3", type: "black" },
  { letter: "b", note: "G3", type: "white" },
  { letter: "h", note: "Ab3", type: "black" },
  { letter: "n", note: "A3", type: "white" },
  { letter: "j", note: "Bb3", type: "black" },
  { letter: "m", note: "B3", type: "white" },
  { letter: "q", note: "C4", type: "white" },
  { letter: "2", note: "Db4", type: "black" },
  { letter: "w", note: "D4", type: "white" },
  { letter: "3", note: "Eb4", type: "black" },
  { letter: "e", note: "E4", type: "white" },
  { letter: "r", note: "F4", type: "white" },
  { letter: "5", note: "Gb4", type: "black" },
  { letter: "t", note: "G4", type: "white" },
  { letter: "6", note: "Ab4", type: "black" },
  { letter: "y", note: "A4", type: "white" },
  { letter: "7", note: "Bb4", type: "black" },
  { letter: "u", note: "B4", type: "white" },
  { letter: "i", note: "C5", type: "white" },
];

// Distance from one white key's left edge to the next one's.
const whitePitch = KEY_SIZE.white.width + KEY_GAP;

const whiteKeyCount = pianoKeys.filter((key) => key.type === "white").length;

export const keyboardWidth = whiteKeyCount * whitePitch - KEY_GAP;

export const keyboardHeight = KEY_SIZE.white.height;

export type PositionedKey = PianoKeyData & { offset: number };

// Every key is positioned absolutely from the same left edge: white keys in
// a row, black keys centred over the seam between the white keys around them.
function positionKeys(): PositionedKey[] {
  const positioned: PositionedKey[] = [];
  let whiteKeysBefore = 0;

  for (const key of pianoKeys) {
    if (key.type === "white") {
      positioned.push({ ...key, offset: whiteKeysBefore * whitePitch });
      whiteKeysBefore++;
    } else {
      const seamCenter = whiteKeysBefore * whitePitch - KEY_GAP / 2;
      positioned.push({
        ...key,
        offset: seamCenter - KEY_SIZE.black.width / 2,
      });
    }
  }

  return positioned;
}

export const positionedKeys = positionKeys();
