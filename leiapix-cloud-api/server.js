const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;
const mp4PresignedUrl = require('./src/data/mp4PresignedUrl.json');
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());

app.post('/sendImage', (req, res) => {
    const imageUrl = req.body.imageUrl;

    if (imageUrl) {
        fs.writeFile('./src/data/imageData.json', JSON.stringify({ imageUrl: imageUrl }), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('Image URL saved successfully');
        });
    } else {
        res.status(400).send('imageUrl not provided');
    }
});

app.get('/runScript', (req, res) => {
    exec('npm run start:nodejs', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Failed to run script');
        }
        res.json(mp4PresignedUrl);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
