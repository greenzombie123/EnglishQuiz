import { Router } from "express";
import { deleteLesson, fetchLessonSlides, getDashBoard, getLessonPage } from "../controllers/lessons.ts";
import { addLesson, getCreateLessonPage } from "../controllers/createLesson.ts";

const lessonsRouter = Router();

lessonsRouter.delete('/:lessonId', deleteLesson)

lessonsRouter.get('/createlesson', getCreateLessonPage)
lessonsRouter.post('/createlesson', addLesson)
lessonsRouter.get('/get/:lessonId', fetchLessonSlides)
lessonsRouter.get('/:lessonId', getLessonPage)
lessonsRouter.get('/', getDashBoard)


// lessonsRouter.post('/')

export default lessonsRouter