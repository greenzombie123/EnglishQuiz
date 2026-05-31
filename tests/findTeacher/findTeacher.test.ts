import { expect, test, vi, describe, afterEach, Mock } from "vitest";
import { FindTeacher } from "../../features/findTeacher/findTeacher.model.ts";
import { pool } from "../../config/database.config.ts";

describe("FindTeacher", () => {
    test("FindTeacher.addToStudentsTeachers inserts the student username and teacher username into the database", () => {
        const spy = vi.spyOn(pool, "query")

        FindTeacher.addToTeachersStudents("Teacher", "Student")

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith('INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)',
            ["Teacher", "Student"])
    })
})