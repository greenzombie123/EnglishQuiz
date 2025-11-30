import { Router } from "express";
import { fetchLessonSlides, getDashBoard, getLessonPage } from "../controllers/lessons.ts";

const lessonsRouter = Router();

lessonsRouter.get('/get/:lessonId', fetchLessonSlides)
lessonsRouter.get('/:lessonId', getLessonPage)
lessonsRouter.get('/', getDashBoard)


// lessonsRouter.post('/')

export default lessonsRouter