const pg = require('pg');
const Client = pg.Client;

const config = process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
const client = new Client(config);

client.connect(() => {
  console.log('connected to database');
});

module.exports = client;