const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS pingpong_counter (
        id SERIAL PRIMARY KEY,
        counter INT DEFAULT 0
      );
    `);
    await client.query(`
      INSERT INTO pingpong_counter (counter)
      SELECT 0
      WHERE NOT EXISTS (SELECT 1 FROM pingpong_counter);
    `);

    console.log("pingpong_counter table is ready!");
  } finally {
    client.release();
  }
})();

app.get("/", (req, res) => {
  res.send("<h1>mainpage</h1>")
})

app.get('/pingpong', async (req, res) => {
  try {
    const result = await pool.query(`UPDATE pingpong_counter SET counter = counter + 1 RETURNING counter`);
    res.send(`<h1>Pong ${result.rows[0].counter}</h1>`);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});

app.get('/pingpong-count', async (req, res) => {
  const result = await pool.query('SELECT counter FROM pingpong_counter');
  res.json({ pongCount: result.rows[0].counter });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Ping-pong server running on port ${PORT}`);
});
