import { expect, test, vi, describe, afterEach, Mock, beforeEach } from "vitest";
import { TeacherStudent } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";
import request from "supertest"
import express, { NextFunction, Request, Response } from "express"
import { addStudentToTeacher, searchTeacher } from "../../features/findTeacher/findTeacher.controller.ts";
import { User } from "../../features/users/Users.model.ts";
import views from "../../dirNames.ts";

describe("FindTeacher", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("FindTeacher.addToStudentsTeachers inserts the student username and teacher username into the database", async () => {
        const spy = vi.spyOn(pool, "query").mockImplementation(vi.fn())

        await TeacherStudent.registerPair("Teacher", "Student")

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith('INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)',
            ["Teacher", "Student"])
    })
})

describe("findteacher controllers", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    const app = express()
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.set("views", views);
    app.set("view engine", "ejs");
    app.use(express.static("views"));

    const mockController = (request: Request, res: Response, next: NextFunction) => {
        request.user = { username: "apple", userType: "teacher" }
        next()
    }

    app.post("/findTeacher/finished", mockController, addStudentToTeacher)

    test("addStudentToTeacher creates a row in the students_teachers db", async () => {

        const spy = vi.spyOn(TeacherStudent, "registerPair").mockImplementation(vi.fn())

        await request(app).post("/findTeacher/finished").send({ teacher: "apple" }).expect(302)

        expect(spy).toHaveBeenCalled()
    })

    test("searchTeacher returns a teacher", async () => {

        const teacher: User = { username: "pop", password: "o", id: "p" }

        app.post("/findTeacher/", searchTeacher)

        const spy1 = vi.spyOn(User, "findByUserName").mockResolvedValueOnce(teacher)

        const res1 = await request(app).post("/findTeacher").send({ teacher: teacher.username }).expect("Content-type", /html/).expect(200)

        // Testing for erros
        const spy2 = vi.spyOn(User, "findByUserName").mockRejectedValueOnce("Wow")

        let res2 = await request(app).post("/findTeacher").send({}).expect("Content-type", /html/)

        expect(spy1).toHaveBeenNthCalledWith(1, "pop", "teacher")
        expect(res2.statusCode).toBe(500)
    })
})