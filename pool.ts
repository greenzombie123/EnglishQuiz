import { Pool } from "pg";
import 'dotenv/config';

// Set up Pool to query Postgres through node
export const pool = new Pool({
    host:process.env.HOST,
    user:process.env.USER,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:5432
})