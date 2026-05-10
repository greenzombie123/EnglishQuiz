import request from "supertest"
import express from "express"
import { getLogInPage, redirectToDashBoard} from "../features/auth/auth.controller.ts";
import { test, expect, describe } from 'vitest'
import views from "../dirNames.ts";

const app = express()
app.set("views", views);
app.set("view engine", "ejs");
// app.use(express.static("views"));


describe("authentication", ()=>{

    test("redirectToDashBoard renders the dashboard", async ()=>{

        app.post("/login", redirectToDashBoard)

        await request(app).post("/login").expect("Content-Type", "text/plain; charset=utf-8").expect(302)
    })

    test("getLoginPage renders the correct view", async ()=>{

        app.get("/login", getLogInPage)

        await request(app).get("/login").expect("Content-Type", /html/).expect(200)
    })
})