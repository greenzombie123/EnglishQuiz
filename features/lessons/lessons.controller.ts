import type { Request, Response, NextFunction } from "express";
import { format } from "node-pg-format";
import { IntroSlide, Lesson, QuestionSlide } from "./lessons.model.ts";
import { areAudioFilesStored, createLessonStore, deleteLessonAndAudio, getAudioUrlsService, postLessonService } from "./lessons.service.ts";
import type {
  LessonIdParams,
} from "../../shared.types.ts";
import { User } from "../users/Users.model.ts";
import { createPresignedUrls, deleteAudioFilesFromStorage, getAudioFileFromStorage } from "../../config/s3client.config.ts";

export const getLesson = async (
  req: Request<LessonIdParams>,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.getLessonById(Number(lessonId))

    if (!lesson) throw Error("Lesson doesn't exist")



    res.send(lesson);

  } catch (error) {
    res.send(error)
  }
};


export const getLessonPage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const { lessonId } = req.params as { lessonId: string };
  res.locals.lessonId = parseInt(lessonId);
  res.render("lesson");
};

export const getDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");
  const { username, userType } = req.user;
  const lessonData = await Lesson.getAllLessonDataByUserName(username, userType) //getLessons(userType, username);
  const lessonStore = createLessonStore(lessonData);

  res.locals = { username, userType, lessonStore };
  res.render("dashboard");
};

//TODO Change to where the user is sent to dashboard right after the request is successful.
export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { lessonId } = req.params as { lessonId: string };
  const id: number = Number(lessonId)

  // Delete audio from storage

  const soundUrls = await Lesson.getSoundUrls(id)
  await deleteAudioFilesFromStorage(id, soundUrls)

  // PostgreSQL deletes slides as well because of trigger function and trigger event
  await Lesson.delete(lessonId)

  res.send("The lesson was deleted.");
};

export const postLesson = async (
  req: Request<{}, {}, { name: string, groupname: string, id: number, isLessonNew: boolean, question: QuestionSlide[], intro: IntroSlide[] }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.userType === "student") return res.redirect("/");

  const { question, intro, name, groupname, id: lessonId, isLessonNew } = req.body;

  const soundUrls: string[] = [...intro, ...question].map(slide => slide.soundurl)

  // check if at least on soundurl is a string or not
  const wereFilesSent = soundUrls.reduce((prev, cur) => prev + cur)

  // If there any soundurl strings for audio files, check if the audio files were properly stored in storage
  if (wereFilesSent) {

    try {


      const areFilesThere = await areAudioFilesStored(soundUrls, lessonId)

      //TODO Create abort function to delete files and lesson
      if (!areFilesThere) {
        if (isLessonNew) {
          await Lesson.delete(lessonId)
          await deleteLessonAndAudio(lessonId)
          // throw new Error("Audio files were not successfully deleted")
        }
        else {
          await deleteLessonAndAudio(lessonId)
          // throw new Error("Audio files were not successfully deleted")
        }
      }

    } catch (error) {
      console.error(error)
    }

  }

  const postLessonResult = await postLessonService(isLessonNew, { name, groupname, lessonId, questionSlides: question, introSlides: intro })

  if (postLessonResult.isError) {
    throw postLessonResult.message
  }

  return res.end()
}

export const getGroupNames = async (
  req: Request<{ lessonId: string }>,
  res: Response,
  next: NextFunction,
) => {

  if (!req.user) res.render("/")

  const { username } = req.user!

  const groupnames = await Lesson.getAllGroupNamesByTeacher(username)

  res.send(groupnames)
}

export const getCreateLessonPage = (
  req: Request<{ lessonId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");

  const { lessonId } = req.params;

  res.locals.lessonId = lessonId || "";

  res.render("createLesson");
};

export const getAudioFileUrls = async (
  req: Request<{ lessonId: string }>,
  res: Response,
  next: NextFunction) => {

  const { lessonId } = req.params

  const id = Number(lessonId)

  const fileNames = await Lesson.getSoundUrls(id)

  const audioItems = await getAudioUrlsService(id, fileNames)

  res.send(audioItems)
}

export const processSoundUrls = async (
  req: Request<{}, {}, { fileNames: string[], lessonId: number }>,
  res: Response,
  next: NextFunction) => {

  const { fileNames, lessonId } = req.body

  const newSoundUrls = new Set(fileNames)

  const oldSoundUrls = await Lesson.getSoundUrls(lessonId)

  const toBeDeleted: string[] = []


  //TODO Turn to map later
  await Promise.all(oldSoundUrls.map(async (oldSoundUrl) => {
    //* Audio is already stored so there is no need to add it again
    if (newSoundUrls.has(oldSoundUrl)) newSoundUrls.delete(oldSoundUrl)
    //* If there is no new souldUrl that matches old one, it means user wants to delete the old one.
    else toBeDeleted.push(oldSoundUrl)
    //* If there is a new soundurl but no old one, it means user is adding a new audio
  }))

  // Send a request to delete all unused audio with one request. A later request will delete soundurl from database
  await deleteAudioFilesFromStorage(lessonId, toBeDeleted)


  const soundUrls = Array.from(newSoundUrls)

  const putAudioItems: { fileName: string, url: string }[] = await Promise.all(

    soundUrls.map(async (newSoundUrl) => {

      const presignedUrl = await createPresignedUrls(newSoundUrl, lessonId)

      return { fileName: newSoundUrl, url: presignedUrl }
    })
  )

  res.send(putAudioItems)
}

export const createLesson = async (
  req: Request<{}, {}, { name: string, groupname: string }>,
  res: Response,
  next: NextFunction) => {

  if (!req.user || req.user.userType === "student") return res.redirect("/");

  const { name, groupname } = req.body

  const { username: teacherUsername } = req.user

  const teacher = await User.findByUserName(teacherUsername, "teacher")

  if (!teacher) throw new Error("Can't find teacher")

  const lessonId = await Lesson.post(name, groupname, teacher.id)
  if (!lessonId) throw new Error("Couldn't post new lesson")

  res.send(lessonId)

  // res.send(0)
}
