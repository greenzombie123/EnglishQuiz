import Store from "./store.ts";

type LessonCreateState = {
  audioFiles: File[];
  // haveSoundSelect:boolean
};

const initialState: LessonCreateState = {
  audioFiles: [],
  // haveSoundSelect:false
};

export const lesssonCreaterStore = new Store(initialState);


