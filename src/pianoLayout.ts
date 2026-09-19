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

// Tangenterna i spelordning, så en svart tangent ligger mellan sina två vita.
// Detta är enda stället som vet vilken bokstav som hör till vilken ton.
export const pianoKeys: PianoKeyData[] = [
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

// Avstånd från en vit tangents vänsterkant till nästas.
const whitePitch = KEY_SIZE.white.width + KEY_GAP;

const whiteKeyCount = pianoKeys.filter((key) => key.type === "white").length;

export const keyboardWidth = whiteKeyCount * whitePitch - KEY_GAP;

export const keyboardHeight = KEY_SIZE.white.height;

export type PositionedKey = PianoKeyData & { offset: number };

// Alla tangenter placeras absolut från samma vänsterkant: de vita på rad,
// de svarta centrerade över skarven mellan de vita omkring dem.
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
