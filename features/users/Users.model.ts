import { pool } from "../../config/database.config.ts"
import type { Role } from "./Users.types.ts"

export class User {
    username: string
    password: string
    id: string
    role: Role

    constructor(username: string, password: string, id: string, role: Role) {
        this.username = username
        this.password = password
        this.id = id
        this.role = role
    }

    static decideRole = (role: Role) => role === "student" ? "student" : "teacher"

    static async registerUser(username: string, password: string, id: string, role: Role) {

        const table = this.decideRole(role)

        await pool.query(
            `INSERT INTO ${table}s (username, password, id) VALUES($1,$2,$3)`,
            [username, password, id]
        );
    }

    static async findByUserName(username: string, role: Role) {

        const table = this.decideRole(role)

        const userRow = await pool.query<User>(
            `SELECT * FROM ${table}s WHERE username = $1`,
            [username]
        );

        return userRow.rows[0]
    }

    static doesUserExist = async (userName: string, role: Role): Promise<boolean> => {

        const table = this.decideRole(role)

        const { rows } = await pool.query(`SELECT * FROM ${table}s WHERE username = $1`, [userName])
        return (rows[0] && (rows[0].username === userName))
    }
}
