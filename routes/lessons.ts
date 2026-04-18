import { Router } from "express";
import { deleteLesson, fetchLessonSlides, getDashBoard, getLessonPage } from "../controllers/lessons.ts";
import { addLesson, getCreateLessonPage } from "../controllers/createLesson.ts";
import multer from "multer"; // Handles multipart/form-data

const upload = multer() // Do this to parse the formdata

const lessonsRouter = Router();

lessonsRouter.delete('/:lessonId', deleteLesson)

lessonsRouter.get('/createlesson/:lessonId', getCreateLessonPage)
lessonsRouter.get('/createlesson', getCreateLessonPage)
lessonsRouter.post('/createlesson', upload.none(), addLesson)
lessonsRouter.get('/get/:lessonId', fetchLessonSlides)
lessonsRouter.get('/:lessonId', getLessonPage)
lessonsRouter.get('/', getDashBoard)


// lessonsRouter.post('/')

export default lessonsRouter