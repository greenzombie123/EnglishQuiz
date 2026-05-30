import { Student, Teacher } from "../features/auth/auth.model.ts";
import { expect, vi, describe, test, Mock } from "vitest";
import { pool } from "../config/database.config.ts";

vi.mock("../config/database.config.ts", () => ({
    pool: { query: vi.fn() }
}))

describe("Teacher", () => {
    test("Teacher.create adds a new teacher to the database", async () => {
        await Teacher.create("aaa", "bbb", "12")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "12"])
    })

    test("Teacher.findByUserName returns a teacher", async ()=>{
        (vi.mocked(pool.query) as Mock).mockReturnValue({ rows: [{ username: "aa" }] })

        const teacher = await Teacher.findByUserName("aa")

        expect(teacher?.username).toBe("aa")
    })
})

describe("Student", () => {
    test("Student.create adds a new student to the database", async () => {
        await Student.create("aaa", "bbb", "12")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO students (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "12"])
    })

    test("Student.findByUsername returns a student", async () => {
        (vi.mocked(pool.query) as Mock).mockReturnValue({ rows: [{ username: "aa" }] })

        const student = await Student.findByUserName("aa")

        expect(student?.username).toBe("aa")
    })
})