import type { Request, Response, NextFunction } from "express";

export const getDashBoard = (req:Request, res:Response, next:NextFunction)=>{
    if(!req.user) return res.redirect('/')
    const {username, userType} = req.user
    res.locals = {username, userType}
    res.render('dashboard')
}