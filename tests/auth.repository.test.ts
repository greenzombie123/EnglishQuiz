import { expect, test, vi, describe, afterEach, Mock } from "vitest";
import { pool } from "../config/database.config.ts";
import { TeacherRepository } from "../features/auth/auth.teacherrepository.ts";
import { StudentRepository } from "../features/auth/auth.studentrepository.ts";

afterEach(() => {
    vi.clearAllMocks()
})

vi.mock(import("../config/database.config.ts"))


describe("TeacherRepository", () => {

    const teacherRepository = new TeacherRepository()

    test("addTeacher calls pool.query with the correct arguments", () => {

        teacherRepository.addTeacher("aaa", "bbb", "1")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "1"])
    })

    test("findByUserName returns a row with one Teacher object", async () => {

        (vi.mocked(pool.query) as Mock).mockResolvedValue({rows:[{username:"gg"}]})

        const teacher = await teacherRepository.findByUserName("gg")

        expect(teacher).toEqual({ username: "gg" })
    })
})

describe("StudentRepository", () => {

    const studentRepository = new StudentRepository()

    test("addStudent calls pool.query with the correct arguments", () => {

        studentRepository.addStudent("aaa", "bbb", "1")

        expect(pool.query).toHaveBeenCalledWith("INSERT INTO students (username, password, id) VALUES($1,$2,$3)", ["aaa", "bbb", "1"])
    })

    test("findByUserName returns a row with one Teacher object", async () => { 
        
        (vi.mocked(pool.query) as Mock).mockResolvedValue({rows:[{username:"gg"}]})

        const teacher = await studentRepository.findByUsername("gg")

        expect(teacher).toEqual({ username: "gg" })
    })
})