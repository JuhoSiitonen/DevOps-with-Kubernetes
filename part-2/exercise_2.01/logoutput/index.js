const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PINGPONG_URL = process.env.PINGPONG_URL || 'http://pingpong-service:8082/pingpong-count';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString() {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(PINGPONG_URL);
    const pongCount = response.data.pongCount;
    const timestamp = new Date().toISOString();
    const hash = generateString()
    
    res.send(`[${timestamp}] : ${hash},  Pong count: ${pongCount}`);
  } catch (error) {
    console.error('Error fetching pong count:', error.message);
    res.status(500).send('Error retrieving pong count');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Log output server running on port ${PORT}`);
});

