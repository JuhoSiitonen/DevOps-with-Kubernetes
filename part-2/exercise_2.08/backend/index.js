const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const filePath = path.join('/usr/src/app/files', 'todos.json');

function readTodosFromFile() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading todos from file:', error);
    return [];
  }
}

function writeTodosToFile(todos) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error writing todos to file:', error);
  }
}

app.get('/todos', (req, res) => {
  const todos = readTodosFromFile();
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const newTodo = req.body.text;
  
  if (!newTodo || newTodo.length > 140) {
    return res.status(400).json({ error: 'Todo must be 140 characters or less.' });
  }

  const todos = readTodosFromFile();
  const todo = { id: todos.length + 1, text: newTodo };
  todos.push(todo);
  writeTodosToFile(todos);
  res.status(201).json(todo);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Todos backend server running on port ${PORT}`);
});
