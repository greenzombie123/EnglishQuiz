import { Router } from "express";
import { getDashBoard } from "../controllers/lessons.ts";

const lessonsRouter = Router();

lessonsRouter.get('/', getDashBoard)

// lessonsRouter.post('/')

export default lessonsRouter