import express from 'express';
import dotenv from 'dotenv';
import { startPublisherService } from './publisher-service';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

interface ImageData {
  image_urls?: string[];
}

app.post('/sendVideo', (req, res) => {
  const videoUrl = req.body.image_urls;

  if (!videoUrl) {
      return res.status(400).send('videoUrl is required');
  }

  let data: ImageData = {};
  try {
      const rawData = fs.readFileSync('./images/image_urls.json', 'utf8');
      data = JSON.parse(rawData);
  } catch (err) {
      console.error('Error reading from image_urls.json:', err);
  }

  if (!data.image_urls) {
      data.image_urls = [];
  }
  data.image_urls.push(videoUrl);

  fs.writeFileSync('./images/image_urls.json', JSON.stringify(data, null, 2), 'utf8');

  res.send('Video URL added successfully!');
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

startPublisherService();
