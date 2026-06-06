import { expect, test, vi, describe, afterEach, Mock, beforeEach } from "vitest";
import { FindTeacher } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";
import { addToTeachersStudents, doesTeacherExist } from "../../features/findTeacher/findTeacher.service.ts";
import request from "supertest"
import express, { NextFunction, Request, Response } from "express"
import { addStudentToTeacher, searchTeacher } from "../../features/findTeacher/findTeacher.controller.ts";

describe("FindTeacher", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("FindTeacher.addToStudentsTeachers inserts the student username and teacher username into the database", async () => {
        const spy = vi.spyOn(pool, "query").mockImplementation(vi.fn())

        await FindTeacher.addToTeachersStudents("Teacher", "Student")

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith('INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)',
            ["Teacher", "Student"])
    })

    test("FindTeacher.doesTeacherExist gets the teacher username", async () => {
        vi.spyOn(pool, "query").mockImplementation(() => ({ rows: [{ username: "Teacher" }] }))

        const teacherExist = await FindTeacher.doesTeacherExist("Teacher")

        expect(teacherExist).toBe(true)
    })
})

describe("FindTeacher services", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("addToTeachersStudents creates a row in the db table", async () => {
        const spy = vi.spyOn(FindTeacher, "addToTeachersStudents").mockImplementation(vi.fn())

        await addToTeachersStudents("Teacher", "Student")

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith("Teacher", "Student")
    })

    test("doesTeacherExist returns true is teacher exists in the database", async () => {
        vi.spyOn(pool, "query").mockImplementation(() => ({ rows: [{ username: "Teacher" }] }))

        const teacherExist = await doesTeacherExist("Teacher")

        expect(teacherExist).toBe(true)
    })
})

describe("findteacher controllers", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    const app = express()
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const mockController = (request: Request, res: Response, next: NextFunction) => {
        request.user = { username: "apple", userType: "teacher" }
        next()
    }

    app.post("/findTeacher/finished", mockController, addStudentToTeacher)

    test("addStudentToTeacher creates a row in the students_teachers db", async () => {

        const spy = vi.spyOn(FindTeacher, "addToTeachersStudents").mockImplementation(vi.fn())

        await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

        expect(spy).toHaveBeenCalled()
    })

    // test.skip("doesTeacherExist returns true if teacher exist", async () => {
    //     const spy = vi.spyOn(FindTeacher, "addToTeachersStudents").mockResolvedValue()

    //     await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

    //     expect(spy).toHaveBeenCalled()
    // })

    test.skip("getTeacher returns a teacher", async () => {
        const spy = vi.spyOn(FindTeacher, "addToTeachersStudents").mockResolvedValue()

        await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

        expect(spy).toHaveBeenCalled()
    })
})