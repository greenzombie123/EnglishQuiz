import type { PoolClient } from "pg";
import { pool } from "../../config/database.config.ts"
import { deleteAudioFilesFromStorage, getAudioFileFromStorage, getAudioFileNamesFromStorage } from "../../config/s3client.config.ts";
import { User } from "../users/Users.model.ts";
import { IntroSlide, Lesson, QuestionSlide, type LessonData, type LessonSlide, } from "./lessons.model.ts";
import type { LessonStore, PostLessonArg, PostLessonResult } from "./lessons.types.ts";
import { body } from "express-validator";
import { Recording } from "../audio/audio.model.ts";

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
export const postLessonService = async (postLessonArg: PostLessonArg): Promise<PostLessonResult> => {
  const client = await pool.connect()

  let postLessonResult: PostLessonResult

  try {
    await client.query("BEGIN");

    const { lessonId: currentLessonId, name, groupname, introSlides, questionSlides, teacherName, deleteSlideIds } = postLessonArg
    let newLessonId: number

    if (!currentLessonId) {
      const teacherData = await User.findByUserName(teacherName, "teacher", client)
      newLessonId = await Lesson.post(name, groupname, teacherData.currentclass, client)
    }
    else {
      newLessonId = currentLessonId
      await Lesson.update(newLessonId, name, groupname, client)
    }

    const lessonId: number = newLessonId

    //TODO turn this into a service

    if (deleteSlideIds.length) await deleteSlides(deleteSlideIds, client)

    if (introSlides.length) await processIntroSlides(introSlides, lessonId, client)

    if (questionSlides.length) await processQuestionSlides(questionSlides, lessonId, client)

    // await client.query("ROLLBACK");

    await client.query("COMMIT");

    postLessonResult = { isError: false }

  } catch (error) {
    console.log(error)
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

export const deleteLessonAndAudio = async (lessonId: number) => {
  // await Lesson.delete(lessonId)
  // const soundUrls = await Lesson.getSoundUrls(lessonId)
  // await deleteAudioFilesFromStorage(lessonId, soundUrls)
}

const deleteSlides = async (slides: { id: string, slideType: string }[], client: PoolClient) => {
  await Promise.all(
    slides.map(async slide => {
      if (slide.slideType === "question") {
        return await QuestionSlide.deleteById(slide.id, client)
      }
      else {
        return await IntroSlide.deleteById(slide.id, client)
      }
    })
  )
}

const processIntroSlides = async (slides: IntroSlide[], lessonId: number, client: PoolClient) => {
  const processedSlides = slides.map(async slide => {
    if (slide.action === "add") return await IntroSlide.post(slide, lessonId, client)
    else return await IntroSlide.update(slide, client)
  })

  await Promise.all(processedSlides)
}

const processQuestionSlides = async (slides: QuestionSlide[], lessonId: number, client: PoolClient) => {
  const processedSlides = slides.map(async slide => {
    if (slide.action === "add") return await QuestionSlide.post(slide, lessonId, client)
    else return await QuestionSlide.update(slide, client)
  })

  await Promise.all(processedSlides)
}



const g = QuestionSlide
const b = IntroSlide