import {pool} from "../../config/database.config.ts"
import type { IntroSlide, LessonData, QuestionSlide } from "./lessons.model.ts";
import type { LessonStore } from "./lessons.types.ts";

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

export const postLesson = async ({ name, groupname, lessonId, introSlides, questionSlides }: { name: string, groupname: string, lessonId: string, introSlides: IntroSlide[], questionSlides: QuestionSlide[] }) => {
  const client = await pool.connect()

  try {
    
  } catch (error) {
    
  }
}
