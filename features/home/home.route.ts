import { Router } from "express";
import { getIndexPage } from "./home.controller.ts"

const indexRouter = Router();

indexRouter.get("/", getIndexPage);

export default indexRouter