const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

const cacheDir = path.join('/', 'usr', 'src', 'app', 'files')
const imagePath = path.join(cacheDir, 'image.jpg');

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
  res.send('<h1>Hello DevOps with Kubernetes!</h1><img src="/image" alt="Random Image" />');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchAndCacheImage();
});