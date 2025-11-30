import { Router } from "express";
import { getDashBoard, getLessonPage } from "../controllers/lessons.ts";

const lessonsRouter = Router();

lessonsRouter.get('/', getDashBoard)
lessonsRouter.get('/:lessonId', getLessonPage)


// lessonsRouter.post('/')

export default lessonsRouter