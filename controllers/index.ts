import type { Request, Response, NextFunction } from "express";

export const getIndexPage = (req:Request, res:Response)=>{
    res.render('indexPage')    
}