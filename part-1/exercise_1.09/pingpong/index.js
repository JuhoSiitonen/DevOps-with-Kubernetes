const express = require('express')
const app = express()
require('dotenv').config()

var counter = 0


app.get('/pingpong', (req, res) => {
  res.send(`<h1>Pong ${counter}</h1>`)
  counter++
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})