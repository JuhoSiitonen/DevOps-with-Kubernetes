const express = require('express');
const app = express();
require('dotenv').config();

let counter = 0;

app.get('/pingpong', (req, res) => {
  counter++;
  res.send(`<h1>Pong ${counter}</h1>`);
});

app.get('/pingpong-count', (req, res) => {
  res.json({ pongCount: counter });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Ping-pong server running on port ${PORT}`);
});