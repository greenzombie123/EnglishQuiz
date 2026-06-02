import { describe, expect, test } from "vitest";
import express, { NextFunction, Request, Response } from "express"
import request from "supertest"
import { isAuthenticated } from "../middleware/authenticate.ts";

const app = express()
const mockRequest = (req: Request, res: Response, next:NextFunction) => {
    req.user = {username:"WOW", userType:"teacher"}
    next()
}

const mockFinalRequest = (req: Request, res: Response, next:NextFunction) => {
    res.sendStatus(200)
}

app.get('/', mockRequest, isAuthenticated, mockFinalRequest)

test("Checks if the user is already autheticated", async () => {
    await request(app).get("/").expect(200)
})