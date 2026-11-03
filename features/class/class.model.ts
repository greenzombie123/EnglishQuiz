import { pool } from "../../config/database.config.ts";
import { format } from "node-pg-format";

export class Classes {

    static async create(teacherid: string, name: string) {
        const response = await pool.query<{id:number}>(`INSERT INTO classes (teacherid, name) values($1, $2) RETURNING id`, [teacherid, name])

        const id = response.rows[0]?.id

        if(!id) throw new Error("Couldn't create class")

        return id
    }
}