const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  // force IPv4 by setting this to false:
  // this disables DNS lookup for IPv6 addresses
  // and forces IPv4 connection attempts
  family: 4,
});

module.exports = pool;
