import type { Request, Response, NextFunction } from "express";

export const getSignUpPage = (req:Request, res:Response)=>{
    res.render('signupPage')    
}