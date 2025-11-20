import type { Request, Response, NextFunction } from "express";

export const getLessonsPage = (req:Request, res:Response, next:NextFunction)=>{
    if(!req.user) return res.redirect('/')
    const {username, userType} = req.user
    res.locals = {username, userType}
    res.render('lessonsPage')
}