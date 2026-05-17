import { expect, test, vi, describe } from "vitest";
import { pool } from "../config/database.config.ts";
import { TeacherRepository } from "../features/auth/auth.teacherrepository.ts";

vi.mock("../config/database.config.ts", () => ({
    pool: { query: vi.fn() }
}))

describe("TeacherRepository.addTeacher", () => {

    test("calls pool.query with the correct arguments", () => {
        const teacherRepository = new TeacherRepository()

        teacherRepository.addTeacher("aaa", "bbb", 1)

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", 1])
    })
})
