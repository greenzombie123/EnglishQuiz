import { pool } from "../../config/database.config.ts"
import { deleteAudioFilesFromStorage, getAudioFileFromStorage, getAudioFileNamesFromStorage } from "../../config/s3client.config.ts";
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
export const postLessonService = async (isLessonNew: boolean, postLessonArg: PostLessonArg): Promise<PostLessonResult> => {
  const client = await pool.connect()

  let postLessonResult: PostLessonResult

  try {
    await client.query("BEGIN");

    const { lessonId, name, groupname, introSlides, questionSlides } = postLessonArg

    if (!isLessonNew) {

      await Lesson.update(lessonId, name, groupname, client)

      await IntroSlide.delete(lessonId, client)

      await QuestionSlide.delete(lessonId, client)
    }

    if (introSlides.length) {
      const IntroSlideIds = await IntroSlide.post(introSlides, client)
      await LessonSlideData.post(lessonId, IntroSlideIds, "intro", client)
    }

    if (questionSlides.length) {
      const questionSlideIds = await QuestionSlide.post(questionSlides, client)
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

export const areAudioFilesStored = async (soundUrls: string[], lessonId: number): Promise<boolean> => {

  const keyList = await getAudioFileNamesFromStorage(lessonId)

  const clientSoundUrls = soundUrls.map(soundUrl => `${lessonId}/${soundUrl}`)

  return clientSoundUrls.some(soundUrl => keyList.has(soundUrl))
}

export const getAudioUrlsService = async (lessonId: number, fileNames: string[]): Promise<{ fileName: string, url: string }[]> => {
  const audioItems = fileNames.map(async (fileName) => {
    const url = await getAudioFileFromStorage(lessonId, fileName)

    return { fileName, url }
  })

  return Promise.all(audioItems)
}

export const deleteLessonAndAudio = async (lessonId:number)=>{
  await Lesson.delete(lessonId)
  const soundUrls = await Lesson.getSoundUrls(lessonId)
  await deleteAudioFilesFromStorage(lessonId, soundUrls)
}
