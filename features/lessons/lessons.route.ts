import { Router } from "express";
import { createPresignedUrls, deleteLesson, getAudioFiles, getCreateLessonPage, getDashBoard, getGroupNames, getLesson, getLessonPage, postLesson} from "./lessons.controller.ts"
import multer from "multer"; // Handles multipart/form-data

const upload = multer() // Do this to parse the formdata

const lessonsRouter = Router();

// Lesson Deletion in Dashboard
lessonsRouter.delete('/:lessonId', deleteLesson)

// Lesson Creation
//TODO Put into lessons/controller.ts
lessonsRouter.get('/createlesson/:lessonId', getCreateLessonPage)
lessonsRouter.get('/createlesson', getCreateLessonPage)

// lessonsRouter.post('/createlesson', upload.none(), postLesson)
lessonsRouter.post('/createlesson', postLesson)

// Get groupnames by teacher username
lessonsRouter.get('/groupnames', getGroupNames)

// Lesson Retrieval
lessonsRouter.get('/get/:lessonId', getLesson)

//Send mock audiofiles
lessonsRouter.get('/audiofiles', getAudioFiles)

//Send presigned urls
lessonsRouter.post('/audiofiles/put', createPresignedUrls)

// Lesson Page
lessonsRouter.get('/:lessonId', getLessonPage)

// Dashboard
lessonsRouter.get('/', getDashBoard)

export default lessonsRouter