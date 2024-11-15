const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PINGPONG_URL = process.env.PINGPONG_URL || 'http://pingpong-service:8082/pingpong-count';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const message = process.env.MESSAGE || "Default message";

const infoFilePath = path.join('/usr/src/app/config', 'information.txt');
let information = '';

try {
  information = fs.readFileSync(infoFilePath, 'utf8');
} catch (err) {
  console.error('Error reading information.txt:', err);
}

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
    
    res.send(`[${timestamp}] : ${hash},  Pong count: ${pongCount}, message: ${message}`);
  } catch (error) {
    console.error('Error fetching pong count:', error.message);
    res.status(500).send('Error retrieving pong count');
  }
});

app.get('/healthz', (req,res) => {
  return res.status(200).send('Healthy!')
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Log output server running on port ${PORT}`);
});

