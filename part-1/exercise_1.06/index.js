const express = require('express')
const app = express()
require('dotenv').config()



app.get('/', (req, res) => {
  res.send('<h1>Hello DevOps with Kubernetes!</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})