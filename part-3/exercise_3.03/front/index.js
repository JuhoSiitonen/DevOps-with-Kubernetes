const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

const cacheDir = path.join('/', 'usr', 'src', 'app', 'files')
const imagePath = path.join(cacheDir, 'image.jpg');

const todos = [
    { text: "Learn Kubernetes" },
    { text: "Build a Node.js app" },
    { text: "Deploy to cloud" },
  ];

async function fetchAndCacheImage() {
  try {
    const response = await axios({
      url: 'https://picsum.photos/1200',
      method: 'GET',
      responseType: 'stream'
    });

    fs.mkdirSync(cacheDir, { recursive: true });

    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    writer.on('finish', () => console.log('New image cached.'));
    writer.on('error', (err) => console.error('Error writing image:', err));
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

app.get('/image', (req, res) => {
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    fetchAndCacheImage().then(() => res.sendFile(imagePath));
  }
});

setInterval(fetchAndCacheImage, 60 * 60 * 1000); 

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todos App</title>
  <style>
    #todo-input { width: 300px; margin-bottom: 10px; }
    #send-btn { padding: 5px 10px; }
    #error-message { color: red; }
  </style>
</head>
<body>
  <h1>Hello DevOps with Kubernetes!</h1>
  <img src="/image" alt="Random Image" style="max-width:50%; height:50%;" />
  
  <h2>Todos</h2>
  <ul id="todo-list"></ul>

  <h3>Add a new todo</h3>
  <input type="text" id="todo-input" placeholder="Enter a new todo (max 140 characters)" maxlength="140" />
  <button id="send-btn" onclick="addTodo()">Send</button>
  <p id="error-message"></p>

  <script>
    const API_URL = 'http://localhost:8081/todos';

    async function fetchTodos() {
      try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = todos.map((todo) => "<li>" + todo.todo + "</li>").join('');
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    }

    async function addTodo() {
      const input = document.getElementById('todo-input');
      const errorMessage = document.getElementById('error-message');
      
      if (input.value.length > 140) {
        errorMessage.textContent = "Todo must be 140 characters or less!";
        return;
      }

      errorMessage.textContent = "";
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input.value })
        });
        input.value = "";
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
    fetchTodos();
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchAndCacheImage();
});