import Store from "./store.ts";

type LessonCreateState = {
  audioFiles: Blob[];
};

const initialState: LessonCreateState = {
  audioFiles: [],
};

export const lesssonCreaterStore = new Store(initialState);


