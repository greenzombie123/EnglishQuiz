import { Router } from "express";
import { fetchLessonSlides, getDashBoard, getLessonPage } from "../controllers/lessons.ts";
import { getCreateLessonPage } from "../controllers/createLesson.ts";

const lessonsRouter = Router();

lessonsRouter.get('/createlesson', getCreateLessonPage)
lessonsRouter.get('/get/:lessonId', fetchLessonSlides)
lessonsRouter.get('/:lessonId', getLessonPage)
lessonsRouter.get('/', getDashBoard)


// lessonsRouter.post('/')

export default lessonsRouter