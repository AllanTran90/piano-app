import { useReducer } from "react";
import type { Song } from "./songs";

// "Wait mode" practice: the song only moves on when the right key (or every
// key of a chord) is held down, so you can learn at your own pace.
export type PracticeState = {
  song: Song | null;
  stepIndex: number;
  mistakes: number;
  startedAt: number | null; // set on the first key press, not on selection
  finishedAt: number | null;
};

type PracticeAction =
  | { type: "select"; song: Song | null }
  | { type: "restart" }
  | {
      type: "press";
      note: string;
      heldNotes: ReadonlySet<string>; // every note held right now
      now: number;
    };

const initialState: PracticeState = {
  song: null,
  stepIndex: 0,
  mistakes: 0,
  startedAt: null,
  finishedAt: null,
};

function practiceReducer(
  state: PracticeState,
  action: PracticeAction
): PracticeState {
  switch (action.type) {
    case "select":
      return { ...initialState, song: action.song };

    case "restart":
      return { ...initialState, song: state.song };

    case "press": {
      const { song } = state;
      if (!song || state.finishedAt !== null) return state;

      const step = song.steps[state.stepIndex];
      const startedAt = state.startedAt ?? action.now;

      if (!step.keys.some((key) => key.note === action.note)) {
        return { ...state, startedAt, mistakes: state.mistakes + 1 };
      }

      // Part of a chord, but not all of it is held yet - wait for the rest.
      if (!step.keys.every((key) => action.heldNotes.has(key.note))) {
        return { ...state, startedAt };
      }

      const stepIndex = state.stepIndex + 1;
      const finished = stepIndex === song.steps.length;
      return {
        ...state,
        startedAt,
        stepIndex,
        finishedAt: finished ? action.now : null,
      };
    }
  }
}

export function useSongPractice() {
  return useReducer(practiceReducer, initialState);
}
