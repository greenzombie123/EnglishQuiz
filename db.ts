import 'dotenv/config';
import { Pool } from "pg";


const initSetup = `
    CREATE TABLE IF NOT EXISTS <  >(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
);

    INSERT INTO questions (< >, < >) VALUES ('< >', '< >'); 
`

const pool = new Pool({
    host:process.env.RWHOST || process.env.HOST,
    user:process.env.RWUSER ||process.env.USER,
    database: process.env.RWDATABASE||process.env.DATABASE,
    password:process.env.RWPASSWORD||process.env.PASSWORD,
    port:Number(process.env.RWPORT) || 5432
})

await pool.query(initSetup)
const row = await pool.query("SELECT * FROM questions")