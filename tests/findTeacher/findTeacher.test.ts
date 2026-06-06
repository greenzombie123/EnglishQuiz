import { expect, test, vi, describe, afterEach, Mock, beforeEach } from "vitest";
import { TeacherStudent } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";
import request from "supertest"
import express, { NextFunction, Request, Response } from "express"
import { addStudentToTeacher, searchTeacher } from "../../features/findTeacher/findTeacher.controller.ts";

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

    const mockController = (request: Request, res: Response, next: NextFunction) => {
        request.user = { username: "apple", userType: "teacher" }
        next()
    }

    app.post("/findTeacher/finished", mockController, addStudentToTeacher)

    test("addStudentToTeacher creates a row in the students_teachers db", async () => {

        const spy = vi.spyOn(TeacherStudent, "registerPair").mockImplementation(vi.fn())

        await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

        expect(spy).toHaveBeenCalled()
    })

    // test.skip("doesTeacherExist returns true if teacher exist", async () => {
    //     const spy = vi.spyOn(FindTeacher, "addToTeachersStudents").mockResolvedValue()

    //     await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

    //     expect(spy).toHaveBeenCalled()
    // })

    test.skip("getTeacher returns a teacher", async () => {
        const spy = vi.spyOn(TeacherStudent, "registerPair").mockResolvedValue()

        await request(app).post("/findTeacher/finished").send({teacher:"apple"}) .expect(302) 

        expect(spy).toHaveBeenCalled()
    })
})