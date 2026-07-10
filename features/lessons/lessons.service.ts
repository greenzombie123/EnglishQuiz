import { pool } from "../../config/database.config.ts"
import { User } from "../users/Users.model.ts";
import { IntroSlide, Lesson, LessonSlideData, QuestionSlide, type LessonData } from "./lessons.model.ts";
import type { LessonStore, PostLessonArg, PostLessonFunc, PostLessonResult } from "./lessons.types.ts";

// Create lesson store the dashboard use to display available lessons
export const createLessonStore = (lessons: LessonData[]) => {
  let store: LessonStore = { nogroup: [] };

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
export const postLessonService = async (teacherUsername: string, postLessonArg: PostLessonArg): Promise<PostLessonResult> => {
  const client = await pool.connect()

  let postLessonResult: PostLessonResult

  try {
    await client.query("BEGIN");

    const teacher = await User.findByUserName(teacherUsername, "teacher", client)

    if (!teacher) throw new Error("Can't find teacher")

    let lessonId: number | "" | undefined = postLessonArg.lessonId

    if (!lessonId) {
      lessonId = await Lesson.post(postLessonArg.name, postLessonArg.groupname, teacher.id, client)
      if (!lessonId) throw new Error("Couldn't post new lesson")
    }

    if (postLessonArg.introSlides) {
      const IntroSlideIds = await IntroSlide.post(postLessonArg.introSlides, client)
      await LessonSlideData.post(lessonId, IntroSlideIds, "intro")
    }

    if (postLessonArg.questionSlides) {
      const questionSlideIds = await QuestionSlide.post(postLessonArg.questionSlides, client)
      await LessonSlideData.post(lessonId, questionSlideIds, "question", client)
    }

    await client.query("COMMIT");

    postLessonResult = { isError: false }

  } catch (error) {
    await client.query("ROLLBACK");
    postLessonResult = {
      isError: true,
      message: error
    }
  }
  finally {
    client.release()
  }
  return postLessonResult
}

// Extract id values from each row in the rows prop. Used for bridging tables
const getIds = (lessonId: string, rows: { id: string }[]) => {
  return rows.map((row) => [lessonId, row.id]);
};
