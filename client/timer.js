import { loadNavbar } from './navbar/navbar.js';
import { formatTime } from './utils.js';

let wasRunning = false;

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();

    // load a saved race if necessary
    const savedRace = localStorage.getItem('currentRace');
    if (savedRace) {
        const race = JSON.parse(savedRace);
        wasRunning = race.isRunning;

        startTime = race.startTime;
        elapsedTime = race.elapsedTime;
        resTimes = race.results || [];

        if (race.isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateDisplay, 100);
            startStopButton.innerHTML = '<i class="fas fa-pause></i>';
            startStopButton.style.backgroundColor = '#e74c3c';
        }
    }
});

let startTime;
let elapsedTime = 0;
let timerInterval;

const stopwatchDisplay = document.querySelector('#stopwatch');
const startStopButton = document.querySelector('#startStop');
const raceResultsHeader = document.querySelector('#results-header');
const resetButton = document.querySelector('#reset');
const lapButton = document.querySelector('#lap');

// update stopwatch
function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
}

// start/stop button functions
function toggleTimer() {
    if (startStopButton.innerHTML.includes('fa-play')) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 100);
        startStopButton.innerHTML = '<i class="fas fa-pause"></i>';
        startStopButton.style.backgroundColor = '#e74c3c';
        raceResultsHeader.innerHTML = '<h2>Race Results</h2>';
    } else {
        clearInterval(timerInterval);
        startStopButton.innerHTML = '<i class="fas fa-play"></i>';
        startStopButton.style.backgroundColor = '#2abb67';
        if (resTimes.length > 0) {
            raceResultsHeader.innerHTML = '<button id="export" title="Export Results">Export Results</button>';
            const exportButton = document.querySelector('#export');
            exportButton.addEventListener('click', exportResults);
        }
    }
    saveRaceState();
}

// reset stopwatch and results display
function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = '00:00:00';
    startStopButton.innerHTML = '<i class="fas fa-play"></i>';
    startStopButton.style.backgroundColor = '#2ecc71';
    raceResultsHeader.innerHTML = '<h2>Race Results</h2>';
    resTimes = [];
    displayRes();
    saveRaceState();
}

startStopButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', reset);

const resList = document.querySelector('#results-list');
let resTimes = [];

// display live results from the race
function displayRes() {
    resList.innerHTML = '';

    resTimes.forEach(res => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <span class="position">${res.position}.</span>
            <span class="time">${res.time}</span>
        `;
        resList.appendChild(card);
    })
}

// record a result
function recordRes() {
    const res = {
        position: resTimes.length + 1,
        time: formatTime(elapsedTime),
    };
    resTimes.push(res);
    displayRes();
    saveRaceState();
}

lapButton.addEventListener('click', recordRes);

// export results to server
async function exportResults() {
    const isConfirmed = confirm("Are you sure you want to export results?");
    if (!isConfirmed) return;

    console.log('Export started');

    // generate race id and gather data to send
    const tempId = Date.now().toString();
    const dataToSend = {
        raceId: parseFloat(tempId.slice(tempId.length - 5)),
        results: resTimes
    };

    try {
        // post race data to server
        const response = await fetch('http://localhost:8080/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        
        if (response.ok) {
            localStorage.removeItem('currentRace');
            alert('Export complete.');
        } else {
            throw new Error('Server responded with an error.');
        }
    } catch (error) {
        dataToSend.needsSync = true;
        localStorage.setItem('currentRace', JSON.stringify({
            ...dataToSend,
            isRunning: startStopButton.innerHTML.includes('fa-pause')
        }));

        alert('Export failed - saved for offline retry.\nError:', error.message);
    }
    
}

// save the current state of the race locally
function saveRaceState() {
    const raceData = {
        startTime: startTime,
        elapsedTime: wasRunning ? Date.now() - startTime : elapsedTime,
        isRunning: wasRunning,
        results: resTimes
    };
    localStorage.setItem('currentRace', JSON.stringify(raceData));
}

// retry failed export when online again
window.addEventListener('online', async () => {
    const saved = localStorage.getItem('currentRace');
    if (saved && JSON.parse(saved).needsSync) {
        if (confirm('Connection restored. Retry exporting results?')) {
            await exportResults();
        }
    }
});

let lastKnownUpdate = 0;

async function checkForUpdates() {
    try {
        const response = await fetch('/api/results/updates');
        const { lastModified } = await response.json();

        if (lastModified > lastKnownUpdate) {
            lastKnownUpdate = lastModified;
            displayRes();
            showNotification('New results available');
        }
    } catch (error) {
        console.debug('Polling error (normal if offline):', error);
    }
}
