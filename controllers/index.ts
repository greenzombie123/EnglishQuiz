import type { Request, Response, NextFunction } from "express";

export const getIndexPage = (req:Request, res:Response)=>{
    if(req.user) res.locals.user = req.user
    res.render('indexPage')   
}

