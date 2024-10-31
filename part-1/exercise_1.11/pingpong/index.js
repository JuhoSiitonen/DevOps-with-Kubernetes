const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'output.txt')

var counter = 0

function writeCounterToFile() {
    fs.writeFile(filePath, `Counter: ${counter}`, (err) => {
      if (err) {
        console.error('Error writing counter to file:', err);
      }
    });
  }

app.get('/pingpong', (req, res) => {
  res.send(`<h1>Pong ${counter}</h1>`)
  counter++
  writeCounterToFile()
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) console.error('Error creating directory:', err);
    writeCounterToFile(); 
  });
})