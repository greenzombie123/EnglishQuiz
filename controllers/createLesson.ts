import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";

export const getCreateLessonPage = (req:Request, res:Response, next:NextFunction)=>{
    // if(!req.user)return res.redirect("/")
    res.render("createLesson")
}