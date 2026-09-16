import { useEffect, useState } from "react";
import { keyMap } from "./keyMap";
import { pianoKeys } from "./pianoLayout";
import PianoKey from "./PianoKey";

function App() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const note = keyMap[e.key];
      if (note) {
        setActiveKey(e.key);
        const audio = new Audio(`/sounds/${note}.mp3`);
        audio.play();
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (keyMap[e.key]) {
        setActiveKey(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div>
      <h1>Piano-app</h1>
      <div style={{ display: "flex", gap: "4px" }}>
        {pianoKeys.map((key) => (
          <PianoKey
            key={key.letter}
            letter={key.letter}
            isActive={activeKey === key.letter}
          />
        ))}
      </div>
    </div>
  );
}

export default App;