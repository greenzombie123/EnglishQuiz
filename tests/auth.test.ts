import type { NextFunction, Request, Response } from "express";
import request from "supertest"
import express from "express"
import { redirectToDashBoard } from "../features/auth/auth.controller";

const app = express()
const stuff = (req:Request, res:Response, next:NextFunction)=>{
    res.send("1")
}

app.post("/login", redirectToDashBoard)

it("Checks if getLogInPage is called correctly", (done)=>{
    request(app).post("/login").expect("Content-Type","text/plain; charset=utf-8", done) 
})

it("")