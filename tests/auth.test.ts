import type { NextFunction, Request, Response } from "express";
import request from "supertest"
import express from "express"
import { redirectToDashBoard, validateSignUpForm } from "../features/auth/auth.controller";
import { test, expect, describe } from 'vitest'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));



//! Test redirectToDashBoard


describe("authentication", ()=>{

    test("redirectToDashBoard renders the dashboard", async ()=>{

        app.post("/login", redirectToDashBoard)

        const response = await request(app).post("/login").expect("Content-Type", "text/plain; charset=utf-8").expect(302)

        // expect(response.c)
    })
})