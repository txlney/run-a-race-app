import { formatTime } from './utils.js';

export function initTimer() {

    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let wasRunning = false;
    let resTimes = [];

    const stopwatchDisplay = document.querySelector('#stopwatch');
    const startStopButton = document.querySelector('#startStop');
    const raceResultsHeader = document.querySelector('#results-header');
    const resetButton = document.querySelector('#reset');
    const lapButton = document.querySelector('#lap');
    const resList = document.querySelector('#results-list');
    const exportButton = document.querySelector('#export');

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
            startStopButton.style.backgroundColor = '#2abb67';
            wasRunning = false;
            elapsedTime = Date.now() - startTime;
        }
        saveRaceState();
    }

    function reset() {
        clearInterval(timerInterval);
        elapsedTime = 0;
        stopwatchDisplay.textContent = '00:00:00';
        startStopButton.innerHTML = '<i class="fas fa-play"></i>';
        startStopButton.style.backgroundColor = '#2ecc71';
        resTimes = [];
        displayRes();
        localStorage.removeItem('currentRace');
    }

    // update results display
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

    function recordRes() {
        const res = {
            position: resTimes.length + 1,
            time: formatTime(elapsedTime),
        };
        resTimes.push(res);
        displayRes();
        saveRaceState();
    }

    async function exportResults() {
        if (resTimes.length === 0) {
            alert('No results to export');
            return;
        }

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

    // save current state of race to local storage
    function saveRaceState() {
        const raceData = {
            startTime: startTime,
            elapsedTime: wasRunning ? Date.now() - startTime : elapsedTime,
            isRunning: wasRunning,
            results: resTimes
        };
        localStorage.setItem('currentRace', JSON.stringify(raceData));
    }

    // load any saved race in local storage
    function loadSavedRace() {
        try {
            const savedRace = localStorage.getItem('currentRace');
            if (savedRace) {
                const race = JSON.parse(savedRace);
                wasRunning = race.isRunning;

                startTime = race.startTime;
                elapsedTime = race.elapsedTime;
                resTimes = race.results || [];

                stopwatchDisplay.textContent = formatTime(elapsedTime);

                if (race.isRunning) {
                    startTime = Date.now() - elapsedTime;
                    timerInterval = setInterval(updateDisplay, 100);
                    startStopButton.innerHTML = '<i class="fas fa-pause></i>';
                    startStopButton.style.backgroundColor = '#e74c3c';
                }
                displayRes();
                console.log('Race state restored.')
            }
        } catch (error) {
            console.error('Error loading saved race', error);
            localStorage.removeItem('currentRace');
        }
    }

    function handleOnlineRecovery() {
        const saved = localStorage.getItem('currentRace');
        if (saved && JSON.parse(saved).needsSync) {
            if (confirm('Connection restored. Retry exporting results?')) {
                exportResults();
            }
        }
    }

    startStopButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', reset);
    lapButton.addEventListener('click', recordRes);
    exportButton.addEventListener('click', exportResults);

    loadSavedRace();
    window.addEventListener('online', handleOnlineRecovery);

}