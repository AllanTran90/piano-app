import { useCallback, useEffect, useRef, useState } from "react";
import { startNote, preloadNotes } from "./audio";
import { keyMap } from "./keyMap";
import {
  keyboardHeight,
  keyboardWidth,
  pianoKeys,
  positionedKeys,
  type PianoKeyData,
} from "./pianoLayout";
import PianoKey from "./PianoKey";
import SongLibrary from "./SongLibrary";
import SongPractice from "./SongPractice";
import { useSongPractice } from "./useSongPractice";

function App() {
  // A Set holds every currently pressed key, so several keys can be
  // highlighted at once.
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  // The stop function for each sounding note, by key letter.
  const stopFunctions = useRef<Map<string, () => void>>(new Map());
  // The notes held right now, so a chord can be checked as a whole.
  const heldNotes = useRef<Set<string>>(new Set());

  const [practice, dispatchPractice] = useSongPractice();

  useEffect(() => {
    void preloadNotes(pianoKeys.map((key) => key.note));
  }, []);

  const press = useCallback(
    (key: PianoKeyData) => {
      if (stopFunctions.current.has(key.letter)) return; // already sounding
      stopFunctions.current.set(key.letter, startNote(key.note));
      heldNotes.current.add(key.note);
      // Create a new Set rather than mutating the old one, so React notices.
      setActiveKeys((prev) => new Set(prev).add(key.letter));
      dispatchPractice({
        type: "press",
        note: key.note,
        heldNotes: new Set(heldNotes.current), // a snapshot, not the live ref
        now: performance.now(),
      });
    },
    [dispatchPractice]
  );

  const release = useCallback((key: PianoKeyData) => {
    const stop = stopFunctions.current.get(key.letter);
    if (!stop) return;
    stop();
    stopFunctions.current.delete(key.letter);
    heldNotes.current.delete(key.note);
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.delete(key.letter);
      return next;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = keyMap[e.code];
      if (!key || e.repeat) return;
      // Leave shortcuts like Cmd+C or Ctrl+R to the browser.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      press(key);
    }

    function handleKeyUp(e: KeyboardEvent) {
      const key = keyMap[e.code];
      if (key) release(key);
    }

    // If the window loses focus (e.g. Cmd+Tab) while a key is held, its
    // keyup never arrives - so release everything to avoid stuck notes.
    function handleBlur() {
      pianoKeys.forEach(release);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      handleBlur();
    };
  }, [press, release]);

  // The keys of the step to play next light up as a hint.
  const { song, stepIndex, finishedAt } = practice;
  const hintLetters = new Set(
    song && finishedAt === null
      ? song.steps[stepIndex].keys.map((key) => key.letter)
      : []
  );

  return (
    <main>
      <h1>Piano-app</h1>
      <div
        style={{
          position: "relative",
          width: keyboardWidth,
          height: keyboardHeight,
          margin: "0 auto",
        }}
      >
        {positionedKeys.map((key) => (
          <PianoKey
            key={key.letter}
            data={key}
            isActive={activeKeys.has(key.letter)}
            isHint={hintLetters.has(key.letter)}
            onPress={press}
            onRelease={release}
          />
        ))}
      </div>

      <SongPractice
        state={practice}
        onRestart={() => dispatchPractice({ type: "restart" })}
        onClose={() => dispatchPractice({ type: "select", song: null })}
      />

      <SongLibrary
        selectedId={song?.id ?? null}
        onSelect={(selected) =>
          dispatchPractice({ type: "select", song: selected })
        }
      />
    </main>
  );
}

export default App;
