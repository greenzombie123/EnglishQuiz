import type { LessonData } from "./lessons.model.ts";
import type { LessonStore } from "./lessons.types.ts";

export const createLessonStore = (lessons: LessonData[]) => {
    let store: LessonStore = { nogroup: [] };
    store.nogroup = [];

    lessons.forEach((lesson) => {
        const groupname = lesson.groupname;
        if (!groupname) store.nogroup.push(lesson);
        else if (!store[groupname]) {
            store[groupname] = [];
            store[groupname].push(lesson);
        } else {
            store[groupname].push(lesson);
        }
    });

    return store;
}