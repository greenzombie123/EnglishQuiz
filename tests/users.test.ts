import { beforeEach, describe, expect, vi, test } from "vitest";
import { pool } from "../config/database.config.ts";
import { User } from "../features/users/Users.model.ts";

describe("User", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("User.registerUser add new teacher to database", async () => {

        const spy = vi.spyOn(pool, "query").mockImplementation(vi.fn())

        await User.registerUser("aaa", "ccc", "bbb", "teacher")
        await User.registerUser("aaa", "ccc", "bbb", "student")

        expect(spy).toHaveBeenNthCalledWith(1, `INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)`,
            ["aaa", "ccc", "bbb"])

        expect(spy).toHaveBeenNthCalledWith(2, `INSERT INTO students (username, password, id) VALUES($1,$2,$3)`,
            ["aaa", "ccc", "bbb"])
    })
})