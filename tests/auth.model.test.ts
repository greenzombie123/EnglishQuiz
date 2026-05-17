import { Student, Teacher } from "../features/auth/auth.model.ts";
import { expect, vi, describe, test } from "vitest";
import { pool } from "../config/database.config.ts";

vi.mock("../config/database.config.ts", () => ({
    pool:{query:vi.fn()}
}))

describe("Teacher", ()=>{
    test("Teacher.create adds a new teacher to the database", ()=>{
        Teacher.create("aaa", "bbb", "12")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "12"])
    })
})

describe("Student", ()=>{
    test("Student.create adds a new student to the database", ()=>{
        Student.create("aaa", "bbb", "12")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO students (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "12"])
    })
})