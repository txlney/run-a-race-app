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
    const { raceId, results } = req.body;
    console.log(`Received race ${raceId} with results: ${results}`);
    
    try {
        const filePath = path.join(__dirname, 'data', `race-${raceId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    } catch (error) {
        console.log('Error saving results:', error);
        res.status(500).send('Server error when saving results');
    }
    

    res.status(200).send('Results saved.');
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});