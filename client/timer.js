import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

let startTime;
let elapsedTime = 0;
let timerInterval;

const stopwatchDisplay = document.querySelector('#stopwatch');
const startStopButton = document.querySelector('#startStop');
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
    if (startStopButton.textContent === 'Start') {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 100);
        startStopButton.textContent = 'Stop';
        startStopButton.style.backgroundColor = '#e74c3c';
    } else {
        clearInterval(timerInterval);
        startStopButton.textContent = 'Start';
        startStopButton.style.backgroundColor = '#2ecc71';
    }
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = '00:00:00';
    startStopButton.textContent = 'Start';
    startStopButton.style.backgroundColor = '#2ecc71';
    resTimes = [];
    displayRes();
}

startStopButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', reset);

let resTimes = [];

function displayRes() {
    const resContainer = document.querySelector('#results-list');
    resContainer.innerHTML = '';

    resTimes.forEach((resTime, i) => {
        const resEl = document.createElement('div');
        resEl.textContent = `${i + 1}. ${formatTime(resTime)}`;
        resContainer.appendChild(resEl);
    })
}

function recordRes() {
    const resTime = elapsedTime;
    resTimes.push(resTime);
    displayRes();
}

lapButton.addEventListener('click', recordRes);