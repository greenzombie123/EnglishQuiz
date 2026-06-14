import { Router } from "express";
import { deleteLesson, fetchLessonSlides, getDashBoard, getLessonPage} from "./lessons.controller.ts"
import { addLesson, getCreateLessonPage } from "../../controllers/createLesson.ts";
import multer from "multer"; // Handles multipart/form-data

const upload = multer() // Do this to parse the formdata

const lessonsRouter = Router();

// Lesson Deletion in Dashboard
lessonsRouter.delete('/:lessonId', deleteLesson)

// Lesson Creation
lessonsRouter.get('/createlesson/:lessonId', getCreateLessonPage)
lessonsRouter.get('/createlesson', getCreateLessonPage)
lessonsRouter.post('/createlesson', upload.none(), addLesson)

// Lesson Page
lessonsRouter.get('/:lessonId', getLessonPage)

// Dashboard
lessonsRouter.get('/', getDashBoard)

// Lesson Retrieval
lessonsRouter.get('/get/:lessonId', fetchLessonSlides)

export default lessonsRouter