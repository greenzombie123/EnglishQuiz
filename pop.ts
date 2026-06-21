
//(a:number)=>2

import { pool } from "./config/database.config.ts"

export const joke = {
    ab:()=>2,
    bg:(a:number)=>a+2
}

await pool.query("delete from jokes where id in ($1)", ["24, 44"])
// await pool.query("insert into jokes (id, text) values($1, $2)", [61, 'feeef'])