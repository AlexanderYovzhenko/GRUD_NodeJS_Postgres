import pkg from 'pg';
const { Pool } = pkg;
import { DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "../common/config.js";

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DATABASE
});

export {
  pool
};
