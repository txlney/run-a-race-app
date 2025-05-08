import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatDate } from '../client/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static('client'));
app.use(express.json());

// check existence of 'data' directory and create if needed
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('Created data directory');
}

let lastResultUpdate = Date.now();

// receive exported results
app.post('/api/results', (req, res) => {
    lastResultUpdate = Date.now();
    const raceData = {
        timestamp: new Date().toISOString(),
        results: req.body.results
    };
    const raceId = req.body.raceId;
    console.log(`Received race ${raceId} with results: ${raceData.results}`);
    
    try {

        // write results to 'data' directory
        const filePath = path.join(__dirname, 'data', `race-${raceId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(raceData, null, 2));
    } catch (error) {
        console.log('Error saving results:', error);
        res.status(500).send('Server error when saving results');
    }
    

    res.status(200).send('Results saved.');
});

// retrieve list of all races
app.get('/api/races', (req, res) => {
    try {
        const files = fs.readdirSync(path.join(__dirname, 'data'));

        const races = files.map(file => {
            const filePath = path.join(__dirname, 'data', file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                id: file.replace('race-', '').replace('.json', ''),
                date: formatDate(new Date(data.timestamp).toLocaleDateString()),
                time: new Date(data.timestamp).toLocaleTimeString()
            };
        })

        res.json(races);

    } catch (error) {
        res.status(500).send('Error loading race list');
    }
});

// retrieve details for each race
app.get('/api/results/:raceId', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', `race-${req.params.raceId}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('Race not found');
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).send('Error loading race details');
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/results/updates', (req, res) => {
    res.json({
        lastModified: lastResultUpdate,
        activeRaces: fs.readdirSync('./data').length
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});