import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

let startTime;
let elapsedTime = 0;
let timerInterval;

const stopwatchDisplay = document.querySelector('#stopwatch');
const startStopButton = document.querySelector('#startStop');
const raceResultsHeader = document.querySelector('#results-header');
const resetButton = document.querySelector('#reset');
const lapButton = document.querySelector('#lap');

function formatTime(ms) {
    const hrs = Math.floor(ms / 3600000);
    const min = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const mil = Math.floor(ms % 100);
    return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
}

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
        startStopButton.style.backgroundColor = '#2ecc71';
        if (resTimes.length > 0) {
            raceResultsHeader.innerHTML = '<button id="export" title="Export Results">Export Results</button>';
            const exportButton = document.querySelector('#export');
            exportButton.addEventListener('click', exportResults);
        }
    }
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = '00:00:00';
    startStopButton.innerHTML = '<i class="fas fa-play"></i>';
    startStopButton.style.backgroundColor = '#2ecc71';
    raceResultsHeader.innerHTML = '<h2>Race Results</h2>';
    resTimes = [];
    displayRes();
}

startStopButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', reset);

// Results

const resList = document.querySelector('#results-list');
let resTimes = [];

function displayRes() {
    resList.innerHTML = '';

    resTimes.forEach(res => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <span class="position">${res.position}.</span>
            <span class="time">${formatTime(res.time)}</span>
        `;
        resList.appendChild(card);
    })
}

function recordRes() {
    const res = {
        position: resTimes.length + 1,
        time: elapsedTime,
    };
    resTimes.push(res);
    displayRes();
}

lapButton.addEventListener('click', recordRes);

async function exportResults() {
    const isConfirmed = confirm("Are you sure you want to export results?\nThis action cannot be undone");
    if (isConfirmed) {
        console.log('Export started.');
        try {
            const dataToSend = {
                raceId: Date.now(),
                results: resTimes
            };
            const response = await fetch('http://localhost:8080/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                alert('Results exported successfully.');
            } else {
                throw new Error('Server responded with an error.');
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Check console for details');
        }
    } else {
        console.log('Export cancelled.');
    }
    
}
