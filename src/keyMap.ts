import { pianoKeys } from "./pianoLayout";

// Härleds ur pianoKeys så att bokstav, ton och ljudfil inte kan glida isär.
export const keyMap: Record<string, string> = Object.fromEntries(
  pianoKeys.map((key) => [key.letter, key.note])
);
