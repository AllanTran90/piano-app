import { pianoKeys, type PianoKeyData } from "./pianoLayout";

export type Difficulty = "easy" | "medium" | "hard" | "boss";

export const DIFFICULTIES: {
  id: Difficulty;
  label: string;
  description: string;
}[] = [
  {
    id: "easy",
    label: "Lätt",
    description: "Nybörjare: korta melodier med bara vita tangenter.",
  },
  {
    id: "medium",
    label: "Mellan",
    description: "Längre melodier med större tonomfång.",
  },
  {
    id: "hard",
    label: "Svår",
    description: "Svarta tangenter, snabba mönster och stora hopp.",
  },
  {
    id: "boss",
    label: "BOSS",
    description: "Kromatiska löpningar, ackord och båda händerna. Lycka till.",
  },
];

// One step = the keys to press at the same time (one key, or a chord).
export type Step = { index: number; keys: PianoKeyData[] };

export type Song = {
  id: string;
  title: string;
  origin: string;
  difficulty: Difficulty;
  lines: Step[][]; // for display: one array per phrase
  steps: Step[]; // the same steps, flattened in playing order
};

type SongSource = Omit<Song, "lines" | "steps"> & { notation: string };

// Notation: notes separated by spaces, "|" starts a new phrase/line and
// "+" joins notes into a chord, e.g. "C3+E4 D4 | E4". Sharps are written
// the usual way (F#4) and mapped to the flat names the sound files use.
const SHARP_TO_FLAT: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};

const keyByNote = new Map(pianoKeys.map((key) => [key.note, key]));

function toKey(token: string, songId: string): PianoKeyData {
  const match = /^([A-G][#b]?)(\d)$/.exec(token);
  const name = match ? (SHARP_TO_FLAT[match[1]] ?? match[1]) : "";
  const key = match && keyByNote.get(name + match[2]);
  if (!key) throw new Error(`Song "${songId}": unknown note "${token}"`);
  return key;
}

function parseSong({ notation, ...info }: SongSource): Song {
  let index = 0;
  const lines = notation
    .split("|")
    .map((line) => line.trim().split(/\s+/).filter(Boolean))
    .filter((tokens) => tokens.length > 0)
    .map((tokens) =>
      tokens.map((token) => {
        const keys = token.split("+").map((note) => toKey(note, info.id));
        if (new Set(keys).size !== keys.length) {
          throw new Error(`Song "${info.id}": repeated note in "${token}"`);
        }
        return { index: index++, keys };
      })
    );
  return { ...info, lines, steps: lines.flat() };
}

// All songs are public domain (traditional or composed before 1900), except
// the BOSS etude, which was written for this app. Pieces that span more than
// the app's two octaves (C3-C5) are moved down an octave or simplified.
const SONG_SOURCES: SongSource[] = [
  // ---------- Easy ----------
  {
    id: "hot-cross-buns",
    title: "Hot Cross Buns",
    origin: "Engelsk folkvisa",
    difficulty: "easy",
    notation: `
      E4 D4 C4 | E4 D4 C4 |
      C4 C4 C4 C4 D4 D4 D4 D4 |
      E4 D4 C4`,
  },
  {
    id: "mary-lamb",
    title: "Mary Had a Little Lamb",
    origin: "Amerikansk barnvisa",
    difficulty: "easy",
    notation: `
      E4 D4 C4 D4 E4 E4 E4 | D4 D4 D4 E4 G4 G4 |
      E4 D4 C4 D4 E4 E4 E4 E4 | D4 D4 E4 D4 C4`,
  },
  {
    id: "twinkle",
    title: "Blinka lilla stjärna",
    origin: "Fransk folkmelodi",
    difficulty: "easy",
    notation: `
      C4 C4 G4 G4 A4 A4 G4 | F4 F4 E4 E4 D4 D4 C4 |
      G4 G4 F4 F4 E4 E4 D4 | G4 G4 F4 F4 E4 E4 D4 |
      C4 C4 G4 G4 A4 A4 G4 | F4 F4 E4 E4 D4 D4 C4`,
  },
  {
    id: "ode-to-joy",
    title: "Ode till glädjen",
    origin: "Ludwig van Beethoven",
    difficulty: "easy",
    notation: `
      E4 E4 F4 G4 G4 F4 E4 D4 | C4 C4 D4 E4 E4 D4 D4 |
      E4 E4 F4 G4 G4 F4 E4 D4 | C4 C4 D4 E4 D4 C4 C4 |
      D4 D4 E4 C4 D4 E4 F4 E4 C4 | D4 E4 F4 E4 D4 C4 D4 G3 |
      E4 E4 F4 G4 G4 F4 E4 D4 | C4 C4 D4 E4 D4 C4 C4`,
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    origin: "James Lord Pierpont",
    difficulty: "easy",
    notation: `
      E4 E4 E4 | E4 E4 E4 | E4 G4 C4 D4 E4 |
      F4 F4 F4 F4 F4 E4 E4 E4 E4 E4 D4 D4 E4 D4 G4 |
      E4 E4 E4 | E4 E4 E4 | E4 G4 C4 D4 E4 |
      F4 F4 F4 F4 F4 E4 E4 E4 E4 G4 G4 F4 D4 C4`,
  },

  // ---------- Medium ----------
  {
    id: "frere-jacques",
    title: "Broder Jakob",
    origin: "Fransk folkvisa",
    difficulty: "medium",
    notation: `
      C4 D4 E4 C4 | C4 D4 E4 C4 | E4 F4 G4 | E4 F4 G4 |
      G4 A4 G4 F4 E4 C4 | G4 A4 G4 F4 E4 C4 |
      C4 G3 C4 | C4 G3 C4`,
  },
  {
    id: "happy-birthday",
    title: "Happy Birthday",
    origin: "Mildred & Patty Hill",
    difficulty: "medium",
    notation: `
      G3 G3 A3 G3 C4 B3 | G3 G3 A3 G3 D4 C4 |
      G3 G3 G4 E4 C4 B3 A3 | F4 F4 E4 C4 D4 C4`,
  },
  {
    id: "saints",
    title: "When the Saints Go Marching In",
    origin: "Amerikansk gospel",
    difficulty: "medium",
    notation: `
      C4 E4 F4 G4 | C4 E4 F4 G4 | C4 E4 F4 G4 E4 C4 E4 D4 |
      E4 E4 D4 C4 C4 E4 G4 G4 F4 | E4 F4 G4 E4 C4 D4 C4`,
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    origin: "Amerikansk psalm",
    difficulty: "medium",
    notation: `
      G3 C4 E4 C4 E4 D4 C4 A3 G3 | G3 C4 E4 C4 E4 D4 G4 |
      E4 G4 E4 G4 E4 C4 G3 A3 C4 A3 G3 | G3 C4 E4 C4 E4 D4 C4`,
  },
  {
    id: "oh-susanna",
    title: "Oh! Susanna",
    origin: "Stephen Foster",
    difficulty: "medium",
    notation: `
      C4 D4 E4 G4 G4 A4 G4 E4 C4 D4 E4 E4 D4 C4 D4 |
      C4 D4 E4 G4 G4 A4 G4 E4 C4 D4 E4 E4 D4 D4 C4 |
      F4 F4 A4 A4 A4 G4 G4 E4 C4 D4 |
      C4 D4 E4 G4 G4 A4 G4 E4 C4 D4 E4 E4 D4 D4 C4`,
  },

  // ---------- Hard ----------
  {
    id: "fur-elise",
    title: "Für Elise",
    origin: "Ludwig van Beethoven (inledningen)",
    difficulty: "hard",
    notation: `
      E4 D#4 E4 D#4 E4 B3 D4 C4 A3 | C3 E3 A3 B3 | E3 G#3 B3 C4 |
      E3 E4 D#4 E4 D#4 E4 B3 D4 C4 A3 | C3 E3 A3 B3 | E3 C4 B3 A3`,
  },
  {
    id: "minuet-in-g",
    title: "Menuett i G-dur",
    origin: "Christian Petzold (förr tillskriven Bach)",
    difficulty: "hard",
    notation: `
      D4 G3 A3 B3 C4 D4 G3 G3 | E4 C4 D4 E4 F#4 G4 G3 G3 |
      C4 D4 C4 B3 A3 B3 C4 B3 A3 G3 | F#3 G3 A3 B3 G3 B3 A3 |
      D4 G3 A3 B3 C4 D4 G3 G3 | E4 C4 D4 E4 F#4 G4 G3 G3 |
      C4 D4 C4 B3 A3 B3 C4 B3 A3 G3 | A3 B3 A3 G3 F#3 G3`,
  },
  {
    id: "canon-in-d",
    title: "Kanon i D-dur",
    origin: "Johann Pachelbel",
    difficulty: "hard",
    notation: `
      F#4 E4 D4 C#4 B3 A3 B3 C#4 | D4 C#4 B3 A3 G3 F#3 G3 E3 |
      D4 F#4 A4 G4 F#4 D4 F#4 E4 | D4 B3 D4 A3 G3 B3 A3 G3`,
  },
  {
    id: "entertainer",
    title: "The Entertainer",
    origin: "Scott Joplin",
    difficulty: "hard",
    notation: `
      D3 D#3 E3 C4 E3 C4 E3 C4 | C4 D4 D#4 E4 C4 D4 E4 B3 D4 C4 |
      D3 D#3 E3 C4 E3 C4 E3 C4 | A3 G3 F#3 A3 C4 E4 D4 C4 A3 D4 |
      D3 D#3 E3 C4 E3 C4 E3 C4 | C4 D4 D#4 E4 C4 D4 E4 B3 D4 C4`,
  },
  {
    id: "mountain-king",
    title: "I Bergakungens sal",
    origin: "Edvard Grieg",
    difficulty: "hard",
    notation: `
      A3 B3 C4 D4 E4 C4 E4 | D#4 B3 D#4 | D4 A#3 D4 |
      A3 B3 C4 D4 E4 C4 E4 A4 | G4 E4 C4 E4 G4 |
      A3 B3 C4 D4 E4 C4 E4 | D#4 B3 D#4 | D4 A#3 D4 |
      A3 B3 C4 D4 E4 C4 E4 A4 | G4 E4 C4 E4 G4`,
  },

  // ---------- BOSS ----------
  {
    id: "bumblebee",
    title: "Humlans flykt",
    origin: "Nikolaj Rimskij-Korsakov (inledningen, i två oktaver)",
    difficulty: "boss",
    notation: `
      E4 D#4 D4 C#4 C4 F4 E4 D#4 | E4 D#4 D4 C#4 C4 C#4 D4 D#4 |
      E4 D#4 D4 C#4 C4 F4 E4 D#4 | E4 D#4 D4 C#4 C4 C#4 D4 D#4 |
      E3 D#3 D3 C#3 C3 F3 E3 D#3 | E3 D#3 D3 C#3 C3 C#3 D3 D#3 |
      E3 D#3 D3 C#3 C3 F3 E3 D#3 | E3 D#3 D3 C#3 C3 C#3 D3 D#3 | E3+E4`,
  },
  {
    id: "rondo-alla-turca",
    title: "Rondo alla turca",
    origin: "Wolfgang Amadeus Mozart (inledningen)",
    difficulty: "boss",
    notation: `
      B3 A3 G#3 A3 C4 | D4 C4 B3 C4 E4 |
      F4 E4 D#4 E4 B4 A4 G#4 A4 B4 A4 G#4 A4 C5 | A4 C5 |
      B4 A4 G4 A4 B4 A4 G4 A4 B4 A4 G4 F#4 E4 |
      B3 A3 G#3 A3 C4 | D4 C4 B3 C4 E4 |
      F4 E4 D#4 E4 B4 A4 G#4 A4 B4 A4 G#4 A4 C5 | A3+A4`,
  },
  {
    id: "toccata",
    title: "Toccata och fuga i d-moll",
    origin: "Johann Sebastian Bach (inledningen)",
    difficulty: "boss",
    notation: `
      A4 G4 A4 | G4 F4 E4 D4 C#4 D4 |
      A3 G3 A3 | E3 F3 C#3 D3 |
      A3 G3 A3 | G3 F3 E3 D3 C#3 D3 |
      C#3+E3 G3+A#3 C#4+E4 G4+A#4 | D3+F3 A3+D4 F4+A4 D3+D4`,
  },
  {
    id: "ode-two-hands",
    title: "Ode till glädjen – två händer",
    origin: "Ludwig van Beethoven (arrangemang med vänsterhand)",
    difficulty: "boss",
    notation: `
      C3+E4 E4 F4 G3+G4 | G4 F4 E4 G3+D4 |
      C3+C4 C4 D4 C3+E4 | G3+E4 D4 D4 |
      C3+E4 E4 F4 G3+G4 | G4 F4 E4 G3+D4 |
      C3+C4 C4 D4 G3+E4 | G3+D4 C4 C3+C4 |
      G3+D4 D4 E4 C3+C4 | G3+D4 E4 F4 C3+E4 C4 |
      G3+D4 E4 F4 C3+E4 D4 | C3+C4 D4 G3 |
      C3+E4 E4 F4 G3+G4 | G4 F4 E4 G3+D4 |
      C3+C4 C4 D4 G3+E4 | G3+D4 C4 C3+C4`,
  },
  {
    id: "boss-etude",
    title: "Bossens etyd",
    origin: "Egen övning skriven för appen",
    difficulty: "boss",
    notation: `
      C3 C#3 D3 D#3 E3 F3 F#3 G3 G#3 A3 A#3 B3 |
      C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5 |
      C5 C4 B4 B3 A#4 A#3 A4 A3 G#4 G#3 G4 G3 |
      F#4 F#3 F4 F3 E4 E3 D#4 D#3 D4 D3 C#4 C#3 C4 C3 |
      C3+E3 D3+F3 E3+G3 F3+A3 G3+B3 A3+C4 B3+D4 C4+E4 |
      D4+F4 E4+G4 F4+A4 G4+B4 A4+C5 |
      C3+C4 E3+E4 G3+G4 C4+C5`,
  },
];

export const songs: Song[] = SONG_SOURCES.map(parseSong);
