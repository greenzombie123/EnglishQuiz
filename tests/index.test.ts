import type { NextFunction, Request, Response } from "express";
import request from "supertest"
import express from "express"
import { test, expect, describe } from 'vitest'
import { getIndexPage } from "../controllers/index.ts";
import views from "../dirNames.ts";

const app = express()
app.set("views", views);
app.set("view engine", "ejs");

test("getIndexPage uses correct view", async ()=>{
    
    app.get("/", getIndexPage)

    await request(app).get('/').expect("Content-Type", /html/).expect(200)
})