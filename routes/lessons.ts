import { Router } from "express";
import { getDashBoard, getLessonPage } from "../controllers/lessons.ts";

const lessonsRouter = Router();


lessonsRouter.get('/:lessonId', getLessonPage)
lessonsRouter.get('/', getDashBoard)


// lessonsRouter.post('/')

export default lessonsRouter