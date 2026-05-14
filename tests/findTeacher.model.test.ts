import { describe, expect, test } from "vitest";
import Teacher from "../features/findTeacher/findTeacher.model.ts";

describe.skip("Teacher", ()=>{
    
    test("Teacher.getTeacher returns one teacher from the database", async()=>{
        const teacher = Teacher.getTeacher("Boe")

        expect(teacher).toStrictEqual({username:"Boe", password:"Yo", userType:"teacher"})
    })
})