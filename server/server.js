import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static('client'));
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('Created data directory');
}

app.post('/api/results', (req, res) => {
    const raceData = {
        timestamp: new Date().toISOString(),
        results: req.body.results
    };
    const raceId = req.body.raceId;
    console.log(`Received race ${raceId} with results: ${raceData.results}`);
    
    try {
        const filePath = path.join(__dirname, 'data', `race-${raceId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(raceData, null, 2));
    } catch (error) {
        console.log('Error saving results:', error);
        res.status(500).send('Server error when saving results');
    }
    

    res.status(200).send('Results saved.');
});

app.get('/api/races', (req, res) => { // explain this function more detailed
    try {
        const files = fs.readFileSync(path.join(__dirname, 'data'));
        const races = files.map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
            return {
                id: file.replace('race-', '').replace('.json', ''),
                date: new Date(data.timestamp).toLocaleDateString(),
                time: new Date(data.timestamp).toLocaleDateString()
            };
        })
        res.json(races);
    } catch (error) {
        res.status(500).send('Error loading race list'); // what does the 500 mean
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});