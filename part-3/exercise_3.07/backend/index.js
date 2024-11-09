const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Pool } = require('pg');
app.use(bodyParser.json());
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

app.use(requestLogger)

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
      CREATE TABLE IF NOT EXISTS todo_list (
        id SERIAL PRIMARY KEY,
        todo TEXT
      );
    `);
    
    console.log("Todo table is ready!");
  } finally {
    client.release();
  }
})();


async function readTodosFromDB() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM todo_list');
    return result.rows;
  } finally {
    client.release();
  }
}

async function writeTodoToDB(newTodo) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO todo_list (todo) VALUES ($1) RETURNING *',
      [newTodo]
    );
    return result.rows[0];
  } finally {
    console.log("todo added")
    client.release();
  }
}

app.get('/', (req, res) => res.status(200).send('Healthy'));

app.get('/todos', async (req, res) => {
  try {
    const todos = await readTodosFromDB();
    res.json(todos);
  } catch (err) {
    console.error("Error reading todos:", err);
    res.status(500).json({ error: "Failed to retrieve todos." });
  }
});

app.post('/todos', async (req, res) => {
  console.log("Received POST request:", req.body);
  const newTodo = req.body.text;
  
  if (!newTodo || newTodo.length > 140) {
    return res.status(400).json({ error: 'Todo must be 140 characters or less.' });
  }

  try {
    const addedTodo = await writeTodoToDB(newTodo);
    res.status(201).json(addedTodo);
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).json({ error: "Failed to add todo." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Todos backend server running on port ${PORT}`);
});
