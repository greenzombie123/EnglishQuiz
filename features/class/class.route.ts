import { Router } from "express";
import { createClass, getCreateClassPage } from "./class.controller.ts";

export const classRouter = Router()

classRouter.get("/", getCreateClassPage)

classRouter.post("/", createClass)