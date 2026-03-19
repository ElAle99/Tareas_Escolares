const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.query("SELECT pg_get_constraintdef(c.oid) AS constraint_def FROM pg_constraint c WHERE c.conname = 'chk_dia_semana';")
  .then(res => { console.log("Constraint:", res.rows[0]); })
  .catch(err => console.log(err))
  .finally(() => pool.end());
