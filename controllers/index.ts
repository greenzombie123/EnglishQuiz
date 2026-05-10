import type { Request, Response, NextFunction } from "express";

export const getIndexPage = (req:Request, res:Response)=>{
    //TODO Remove this at some point
    if(req.user) res.locals.user = req.user
    
    // res.send("efe")
    res.render('indexPage')   
}

