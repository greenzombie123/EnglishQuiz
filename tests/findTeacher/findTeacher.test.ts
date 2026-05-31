import { expect, test, vi, describe, afterEach, Mock } from "vitest";
import { FindTeacher } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";
import { beforeEach } from "node:test";
import { addToTeachersStudents, doesTeacherExist } from "../../features/findTeacher/findTeacher.service.ts";

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

describe("FindTeacher controllers", () => {

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