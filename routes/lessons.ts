import { Router } from "express";
import { getLessonsPage } from "../controllers/lessons.ts";

const lessonsRouter = Router();

lessonsRouter.get('/', getLessonsPage)

// lessonsRouter.post('/')

export default lessonsRouter