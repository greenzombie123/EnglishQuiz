import type { NextFunction, Request, Response } from "express";
import { pool } from "../../config/database.config.ts";
import type { AddStudentToTeacherRequest } from "./findTeacher.types.ts";
import { FindTeacher } from "./findTeacher.model.ts";


export const addStudentToTeacher = async (req:Request<{}, {}, AddStudentToTeacherRequest>, res:Response, next:NextFunction)=>{
    try {
        if(!req.user) throw new Error("User has not been authenticated")
        const studentUserName = req.user.username
        const teacherUserName = req.body.teacher
        await FindTeacher.addToTeachersStudents(teacherUserName, studentUserName)
        // await pool.query("INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)", [teacher, student])
       
        res.redirect("/signup/completed")
    } catch (error) {
        console.error(error)
        next(error)
    }
   
}

export const getFindTeacherPage = (req:Request, res:Response, next:NextFunction)=>{
    res.locals = {username:"",isTeacherFound:false}
    res.render("findTeacherPage")
}

export const doesTeacherExist = async (req:Request<{},{}, AddStudentToTeacherBody>, res:Response)=>{
    try {
        const {teacher} = req.body
        const {rows} = await pool.query<Teacher>("SELECT * FROM teachers WHERE username = $1", [teacher])
        res.locals.username = teacher
        if(!rows[0]) {
            res.locals.isTeacherFound = false
            return res.render(`findTeacherPage`)
        }
        res.locals.isTeacherFound = true
        res.render("findTeacherPage")
    } catch (error) {
        res.send(error)
    }
}

