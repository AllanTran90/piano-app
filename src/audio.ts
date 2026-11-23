// Plays notes with the Web Audio API instead of <audio> elements: every sound
// is downloaded and decoded once up front, so a key press plays instantly.
// The sound files are normalized to the same peak level and trimmed to start
// right at the hammer attack.

// Every note goes through one shared volume knob. The files are loud, so
// this leaves headroom for chords - several notes added together would
// otherwise go above full scale and distort.
const MASTER_VOLUME = 0.35;

// How quickly a note fades out after the key is released, in seconds.
// A short fade sounds like a damper; cutting the sound instantly clicks.
const RELEASE_TIME = 0.15;

const context = new AudioContext();
const buffers = new Map<string, AudioBuffer>();

const master = context.createGain();
master.gain.value = MASTER_VOLUME;
master.connect(context.destination);

export async function preloadNotes(notes: string[]): Promise<void> {
  await Promise.all(
    notes.map(async (note) => {
      try {
        const response = await fetch(`/sounds/${note}.mp3`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.arrayBuffer();
        buffers.set(note, await context.decodeAudioData(data));
      } catch (error) {
        console.error(`Could not load sound for ${note}:`, error);
      }
    })
  );
}

// Starts a note and returns a function that stops it.
export function startNote(note: string): () => void {
  // Browsers keep audio suspended until the user has interacted with the
  // page; the first key press counts, so resume here.
  if (context.state === "suspended") void context.resume();

  const buffer = buffers.get(note);
  if (!buffer) return () => {}; // not loaded (yet) - stay silent

  const source = context.createBufferSource();
  source.buffer = buffer;

  // Each note has its own gain so it can fade out independently on release.
  const gain = context.createGain();

  source.connect(gain).connect(master);
  source.start();

  return () => {
    const now = context.currentTime;
    gain.gain.setTargetAtTime(0, now, RELEASE_TIME / 3);
    source.stop(now + RELEASE_TIME * 2);
  };
}
