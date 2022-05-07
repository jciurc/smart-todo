const pg = require('pg');
const Pool = pg.Pool;

const config = process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
const pool = new Pool(config);

pool.connect(() => {
  console.log('connected to database');
});

module.exports = pool;