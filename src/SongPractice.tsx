import type { Step } from "./songs";
import type { PracticeState } from "./useSongPractice";

type SongPracticeProps = {
  state: PracticeState;
  onRestart: () => void;
  onClose: () => void;
};

// A chord is shown as its keys joined with "+", e.g. "Z+E".
function stepLabel(step: Step): string {
  return step.keys.map((key) => key.letter.toUpperCase()).join("+");
}

function stepStatus(step: Step, stepIndex: number): string {
  if (step.index < stepIndex) return "done";
  if (step.index === stepIndex) return "current";
  return "upcoming";
}

function SongPractice({ state, onRestart, onClose }: SongPracticeProps) {
  const { song, stepIndex, mistakes, startedAt, finishedAt } = state;
  if (!song) return null;

  const finished = finishedAt !== null;
  const seconds =
    finished && startedAt !== null ? (finishedAt - startedAt) / 1000 : 0;

  return (
    <section className="practice">
      <div className="practice-header">
        <div>
          <h2>{song.title}</h2>
          <p className="song-meta">{song.origin}</p>
        </div>
        <div className="practice-actions">
          <button onClick={onRestart}>Börja om</button>
          <button onClick={onClose}>Stäng</button>
        </div>
      </div>

      {finished ? (
        <p className="practice-result">
          Klart! Tid: {seconds.toFixed(1).replace(".", ",")} s · Fel:{" "}
          {mistakes}
          {mistakes === 0 && " · Felfritt!"}
        </p>
      ) : (
        <p className="practice-status">
          Steg {stepIndex + 1} av {song.steps.length} · Fel: {mistakes} · Tryck
          på den gula tangenten. Ackord som Z+E trycks samtidigt.
        </p>
      )}

      <div className="song-text">
        {song.lines.map((line) => (
          <div className="song-line" key={line[0].index}>
            {line.map((step) => (
              <span
                key={step.index}
                className={`song-step ${stepStatus(step, stepIndex)}`}
              >
                {stepLabel(step)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SongPractice;
