import * as url from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

const PORT = process.env.SERVER_PORT || 4000,
      DB_PORT = process.env.DB_PORT || 5432,
      DB_HOST = process.env.DB_HOST || 'localhost',
      DB_USER = process.env.DB_USER || 'postgres',
      DB_PASSWORD = process.env.DB_PASSWORD || 'rootroot',
      DATABASE = process.env.DATABASE || 'node_postgres';


export {
  PORT,
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DATABASE
};
