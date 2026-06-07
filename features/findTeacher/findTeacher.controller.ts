import type { NextFunction, Request, Response } from "express";
import { pool } from "../../config/database.config.ts";
import type { AddStudentToTeacherRequest } from "./findTeacher.types.ts";
import { TeacherStudent } from "./findTeacher.model.ts";
import { User } from "../users/Users.model.ts";


export const addStudentToTeacher = async (req: Request<{}, {}, AddStudentToTeacherRequest>, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error("User has not been authenticated")
        const studentUserName = req.user.username
        const teacherUserName = req.body.teacher
        await TeacherStudent.registerPair(teacherUserName, studentUserName)
        res.redirect("/signup/completed")
    } catch (error) {
        console.error(error)
        next(error)
    }

}

export const getFindTeacherPage = (req: Request, res: Response, next: NextFunction) => {
    res.locals = { username: "", isTeacherFound: false }
    res.render("findTeacherPage")
}

export const searchTeacher = async (req: Request<{}, {}, AddStudentToTeacherRequest>, res: Response) => {
    try {
        const { teacher: teacherUsername } = req.body
        const user = await User.findByUserName(teacherUsername, "teacher")
        res.locals.username = teacherUsername
        if (!user) {
            res.locals.isTeacherFound = false
            return res.render(`findTeacherPage`)
        }
        res.locals.isTeacherFound = true
        res.render("findTeacherPage")
    } catch (error) {
        throw new Error("Experienced an error while searching for teacher")
    }
}
