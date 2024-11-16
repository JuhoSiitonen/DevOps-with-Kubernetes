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

async function setupDatabase(client) {
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
  } catch (err) {
    console.error("Error during database setup:", err.message);
  }
}

async function connectToDatabase() {
  while (true) {
    try {
      const client = await pool.connect();
      console.log("Database connection successful!");
      await setupDatabase(client);
      client.release();
      break;
    } catch (err) {
      console.error(`Database connection failed: ${err.message}`);
      await new Promise(res => setTimeout(res, 2000));
      }
    }
  }

connectToDatabase()

app.get('/', (req, res) => res.status(200).send('Healthy'));

app.get('/healthz', async (req,res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).send('Healthy!');
  } catch (err) {
    console.error("Health check failed:", err.message);
    return res.status(500).send('Unhealthy!');
  }
});

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
