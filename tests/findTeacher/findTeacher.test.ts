import { expect, test, vi, describe, afterEach, Mock } from "vitest";
import { FindTeacher } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";
import { beforeEach } from "node:test";

describe("FindTeacher", () => {

    beforeEach(()=>{
        vi.restoreAllMocks()
    })

    test("FindTeacher.addToStudentsTeachers inserts the student username and teacher username into the database", async () => {
        const spy = vi.spyOn(pool, "query").mockImplementation(vi.fn())

        await FindTeacher.addToTeachersStudents("Teacher", "Student")

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith('INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)',
            ["Teacher", "Student"])
    })

    test("FindTeacher.doesTeacherExist gets the teacher username", async ()=>{
        vi.spyOn(pool, "query").mockImplementation(()=>({rows:[{username:"Teacher"}]}))

        const teacherExist = await FindTeacher.doesTeacherExist("Teacher")

        expect(teacherExist).toBe(true)
    })
})