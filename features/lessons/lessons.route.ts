import { Router } from "express";
import { createLesson, deleteLesson, getAudioFileUrls, getCreateLessonPage, getDashBoard, getGroupNames, getLesson, getLessonPage, postLesson, processSoundUrls} from "./lessons.controller.ts"
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

// Send audiofiles to client
lessonsRouter.get('/audiofiles/:lessonId', getAudioFileUrls)

// Send presigned urls
lessonsRouter.post('/audiofiles', processSoundUrls)

// Create only lesson. Return lessonId
lessonsRouter.post('/createjustlesson', createLesson)

// Lesson Page
lessonsRouter.get('/:lessonId', getLessonPage)

// Dashboard
lessonsRouter.get('/', getDashBoard)

export default lessonsRouter