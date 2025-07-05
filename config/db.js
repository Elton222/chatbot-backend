// db.js (PostgreSQL version for Supabase)
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully (Supabase)'))
  .catch(err => console.error('PostgreSQL connection error:', err));

module.exports = pool;
