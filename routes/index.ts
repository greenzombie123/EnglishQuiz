import { Router } from "express";
import { getIndexPage } from "../controllers/index.ts";

const indexRouter = Router();

indexRouter.get("/", getIndexPage);

export default indexRouter
