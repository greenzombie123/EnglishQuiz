import { Router, type Request, type Response, type NextFunction } from "express";
import { getIndexPage } from "./home.controller.ts"

const indexRouter = Router();

indexRouter.get("/a/a", (a: Request, b: Response, c: NextFunction) => {
  b.render("testing")
})

indexRouter.get("/", getIndexPage);

export default indexRouter