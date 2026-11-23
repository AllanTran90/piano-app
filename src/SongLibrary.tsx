import { useState } from "react";
import { DIFFICULTIES, songs, type Difficulty, type Song } from "./songs";

type SongLibraryProps = {
  selectedId: string | null;
  onSelect: (song: Song) => void;
};

function SongLibrary({ selectedId, onSelect }: SongLibraryProps) {
  const [level, setLevel] = useState<Difficulty>("easy");
  const levelInfo = DIFFICULTIES.find((d) => d.id === level)!;

  return (
    <section className="library">
      <h2>Låtbibliotek</h2>

      <div className="level-tabs" role="tablist">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === level}
            className={`level-tab level-${d.id}`}
            onClick={() => setLevel(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="level-description">{levelInfo.description}</p>

      <ul className="song-list">
        {songs
          .filter((song) => song.difficulty === level)
          .map((song) => (
            <li key={song.id}>
              <button
                className="song-button"
                aria-pressed={song.id === selectedId}
                onClick={() => onSelect(song)}
              >
                <span className="song-title">{song.title}</span>
                <span className="song-meta">
                  {song.origin} · {song.steps.length} steg
                </span>
              </button>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default SongLibrary;
