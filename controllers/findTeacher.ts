import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";
import type { Teacher } from "../app.ts";
import type { AddStudentToTeacherBody } from "../shared.types.ts";


export const addStudentToTeacher = async (req:Request<{}, {}, AddStudentToTeacherBody>, res:Response, next:NextFunction)=>{
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

export const getFindTeacherPage = (req:Request, res:Response, next:NextFunction)=>{
    res.locals = {username:"",isTeacherFound:false}
    res.render("findTeacherPage")
}

 const createUserNameValidator = ()=> body("teacher").notEmpty().escape() 

 const createTeacherValidator = ()=> body("teacher").notEmpty().escape() 

 const validateUserName = (req:Request, res:Response, next:NextFunction)=>{
    const results = validationResult(req)
    if(!results.isEmpty()) return res.send({errors:results.array()})
    next()
}

export const getTeacher = async (req:Request<{},{}, AddStudentToTeacherBody>, res:Response)=>{
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

export const findTeacher = [createTeacherValidator(), validateUserName]

