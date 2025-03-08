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
    if (startStopButton.innerHTML.includes('fa-play')) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 100);
        startStopButton.innerHTML = '<i class="fas fa-pause"></i>';
        startStopButton.style.backgroundColor = '#e74c3c';
    } else {
        clearInterval(timerInterval);
        startStopButton.innerHTML = '<i class="fas fa-play"></i>';
        startStopButton.style.backgroundColor = '#2ecc71';
    }
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    stopwatchDisplay.textContent = '00:00:00';
    startStopButton.innerHTML = '<i class="fas fa-play"></i>';
    startStopButton.style.backgroundColor = '#2ecc71';
    resTimes = [];
    displayRes();
}

startStopButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', reset);

// Results

const positionsList = document.querySelector('#positions-list');
const timesList = document.querySelector('#times-list');
let resTimes = [];

function displayRes() {
    positionsList.innerHTML = '';
    timesList.innerHTML = '';

    resTimes.forEach(res => {
        const positionEl = document.createElement('div');
        positionEl.textContent = `${res.position}.`;
        positionsList.appendChild(positionEl);

        const timeEl = document.createElement('div');
        timeEl.textContent = `${formatTime(res.time)}`;
        timesList.appendChild(timeEl);
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