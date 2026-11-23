// Plays notes with the Web Audio API instead of <audio> elements: every sound
// is downloaded and decoded once up front, so a key press plays instantly,
// and a GainNode lets us boost quiet files above 100% volume.

// Some sound files are recorded quieter than others - adjust per note here.
const VOLUME_OVERRIDES: Record<string, number> = {
  A4: 1.5, // y key - compensate for a quietly recorded file
};

// How quickly a note fades out after the key is released, in seconds.
// A short fade sounds like a damper; cutting the sound instantly clicks.
const RELEASE_TIME = 0.15;

const context = new AudioContext();
const buffers = new Map<string, AudioBuffer>();

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

  const gain = context.createGain();
  gain.gain.value = VOLUME_OVERRIDES[note] ?? 1;

  source.connect(gain).connect(context.destination);
  source.start();

  return () => {
    const now = context.currentTime;
    gain.gain.setTargetAtTime(0, now, RELEASE_TIME / 3);
    source.stop(now + RELEASE_TIME * 2);
  };
}
