import { StringDecoder } from "string_decoder"
import { pool } from "../../config/database.config.ts"
import type { Role } from "./Users.types.ts"
import type { PoolClient } from "pg"

export class User {
    username: string
    password: string
    id: string
    currentclass: number

    constructor(username: string, password: string, id: string, currentclass: number) {
        this.username = username
        this.password = password
        this.id = id
        this.currentclass = currentclass
    }

    static decideRole = (role: Role) => role === "student" ? "student" : "teacher"

    static async registerUser(username: string, password: string, id: string, role: Role) {

        const table = this.decideRole(role)

        await pool.query(
            `INSERT INTO ${table}s (username, password, id) VALUES($1,$2,$3)`,
            [username, password, id]
        );
    }

    static async findByUserName(username: string, role: Role, client?: PoolClient) {

        let p = client ? client : pool


        const table = this.decideRole(role)

        const userRow = await p.query<User>(
            `SELECT * FROM ${table}s WHERE username = $1`,
            [username]
        );

        if (!userRow.rows[0]) throw new Error(`Couldn't find user because ${userRow.rows[0]}`)

        return userRow.rows[0]

    }

    static doesUserExist = async (userName: string, role: Role): Promise<boolean> => {

        const table = this.decideRole(role)

        const { rows } = await pool.query(`SELECT * FROM ${table}s WHERE username = $1`, [userName])
        return (rows[0] && (rows[0].username === userName))
    }

    static changeCurrentClass = async (classId: number, teacherId: string) => {
        await pool.query(`UPDATE teachers SET currentclass = $1 WHERE id = $2`, [classId, teacherId])
    }
}
