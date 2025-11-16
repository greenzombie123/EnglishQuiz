import type { Request, Response, NextFunction } from "express";

export const getsignupPage = (req:Request, res:Response)=>{
    res.render('signupPage')    
}