import { pianoKeys, type PianoKeyData } from "./pianoLayout";

// KeyboardEvent.code names the physical key ("KeyQ", "Digit2"), so it is the
// same with Shift, Caps Lock, or a Swedish/English layout - unlike e.key,
// which turns "q" into "Q" and could leave a key stuck on keyup.
function codeFor(letter: string): string {
  return /^\d$/.test(letter) ? `Digit${letter}` : `Key${letter.toUpperCase()}`;
}

// Derived from pianoKeys so letter, note and sound file can't drift apart.
export const keyMap: Record<string, PianoKeyData> = Object.fromEntries(
  pianoKeys.map((key) => [codeFor(key.letter), key])
);
