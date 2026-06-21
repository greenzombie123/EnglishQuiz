import { pool } from "../../config/database.config.ts"
import type { IntroSlide, LessonData, QuestionSlide } from "./lessons.model.ts";
import type { LessonStore, PostLessonArg, PostLessonFunc } from "./lessons.types.ts";

// Create lesson store the dashboard use to display available lessons
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

// Insert lesson, lessonslidedata, and slides into database
export const postLessonService = async (postLessonArg: PostLessonArg) => {
  const client = await pool.connect()

  try {

  } catch (error) {

  }
}

// Extract id values from each row in the rows prop. Used for bridging tables
const getIds = (lessonId: string, rows: { id: string }[]) => {
  return rows.map((row) => [lessonId, row.id]);
};
