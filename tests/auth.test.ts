import request from "supertest"
import express from "express"
import { getLogInPage, redirectToDashBoard } from "../features/auth/auth.controller.ts";
import { test, expect, describe, vi, Mock } from 'vitest'
import views from "../dirNames.ts";
import { handleAddNewStudent, handleAddNewTeacher, handleDoesUserExist } from "../features/auth/auth.service.ts";
import { Student, Teacher } from "../features/auth/auth.model.ts";
import { pool } from "../config/database.config.ts";
import { User } from "../features/users/Users.model.ts";

const app = express()
app.set("views", views);
app.set("view engine", "ejs");

vi.mock("uuid", () => ({
    v4: vi.fn().mockReturnValue("12")
}))

vi.mock(import("../config/database.config.ts"))


describe("authentication", () => {

    test("redirectToDashBoard renders the dashboard", async () => {

        app.post("/login", redirectToDashBoard)

        await request(app).post("/login").expect("Content-Type", "text/plain; charset=utf-8").expect(302)
    })

    test("getLoginPage renders the correct view", async () => {

        app.get("/login", getLogInPage)

        await request(app).get("/login").expect("Content-Type", /html/).expect(200)
    })
})

describe("Authentication Service", () => {
    test("handleAddNewTeacher adds a new teacher to database", async () => {
        const spy = vi.spyOn(User, "registerUser").mockImplementation(vi.fn())

        await handleAddNewTeacher("bb", "gg")

        expect(spy).toHaveBeenCalledWith("bb", "gg", "12", "teacher")
    })

    test("handleAddNewStudent adds a new student to database", async () => {
        const spy = vi.spyOn(User, "registerUser").mockImplementation(vi.fn())

        await handleAddNewStudent("bb", "gg")

        expect(spy).toHaveBeenCalledWith("bb", "gg", "12", "student")
    })
})

describe("Services", () => {
    test("handleDoesUserExist returns true if user is student and has already registered", async () => {
        vi.spyOn(Teacher, "findByUserName").mockResolvedValue(undefined)
        vi.spyOn(Student, "findByUserName").mockResolvedValue({ username: "Sam" } as Student)

        const hasUserRegistered = await handleDoesUserExist("Sam")

        expect(hasUserRegistered).toBe(true)
    })
})