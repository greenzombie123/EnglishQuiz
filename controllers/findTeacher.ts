import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";
import type { Teacher } from "../app.ts";

type FindTeacherLocalsType = {
    username:string,
    isTeacherFound:boolean
}

export const addStudentToTeacher = async (req:Request<{}, {}, {teacher:string}>, res:Response, next:NextFunction)=>{
    if(!req.user)return res.redirect("/")
    try {
        const {username:student} = req.user
        const teacher = req.body.teacher
        await pool.query("INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)", [teacher, student])
        res.redirect("/signup/completed")
    } catch (error) {
        res.send(error)
    }
   
}

export const getFindTeacherPage = (req:Request, res:Response<unknown, FindTeacherLocalsType>, next:NextFunction)=>{
    res.locals = {username:"",isTeacherFound:false}
    res.render("findTeacherPage")
}

 const createUserNameValidator = ()=> body("username").notEmpty().escape() 

 export const createTeacherValidator = ()=> body("teacher").notEmpty().escape() 

 const validateUserName = (req:Request, res:Response, next:NextFunction)=>{
    const results = validationResult(req)
    if(!results.isEmpty()) return res.send({errors:results.array()})
    next()
}

export const getTeacher = async (req:Request<{},{},{username:string}>, res:Response<unknown, FindTeacherLocalsType>)=>{
    try {
        const username = req.body.username
        const {rows} = await pool.query<Teacher>("SELECT * FROM teachers WHERE username = $1", [username])
        res.locals.username = username
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

export const findTeacher = [createUserNameValidator(), validateUserName]

