import { format } from "node-pg-format";
import { pool } from "../../config/database.config.js";
export class Recording {
    constructor() {
        this.url = "";
        this.isNew = true;
    }
    // Avoid making unnecessary delete request 
    static async get(id, client) {
        const p = client ? client : pool;
        let rows;
        const queryString = format(`SELECT * from recordings where id in (%L)`, id);
        rows = (await p.query(queryString)).rows.map(row => ({ ...row, isNew: false }));
        return rows;
    }
    static async getByKey(key, client) {
        const p = client ? client : pool;
        const queryString = format(`SELECT * from recordings where id in (%L)`, key);
        const rows = (await p.query(queryString)).rows; //.map(row => ({ ...row, isNew: false }))
        if (rows[0])
            return rows[0];
        else
            throw new Error("Something is wrong, yo!");
    }
    static async post(recording, client) {
        const p = client ? client : pool;
        if (Array.isArray(recording)) {
            const recordings = recording.map(recording => [recording.id, recording.key, recording.name]);
            const queryString = format("INSERT INTO recordings (id, key, name) VALUES %L ON CONFLICT (id) DO NOTHING", recordings);
            await p.query(queryString);
        }
        else {
            const { id, key, name } = recording;
            await p.query(`INSERT INTO recordings (id, key, name) VALUES($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [id, key, name]);
        }
    }
    static async delete(id, client) {
        const p = client ? client : pool;
        if (Array.isArray(id)) {
            const queryString = format("DELETE FROM recordings WHERE id IN (%L)", id);
            await p.query(queryString);
        }
        else {
            await p.query("DELETE FROM recordings WHERE id = $1", [id]);
        }
    }
    static async getKeys(id, client) {
        const p = client ? client : pool;
        let rows;
        if (typeof id === "string") {
            rows = ((await p.query(`SELECT key from recordings where id = $1`, [id])).rows).map(row => row.key);
        }
        else {
            const queryString = format(`SELECT key from recordings where id in (%L)`, id);
            rows = (await p.query(queryString)).rows.map(row => row.key);
        }
        return rows;
    }
}
//# sourceMappingURL=audio.model.js.map