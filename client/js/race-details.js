import { formatTime } from '../utils.js';

// retrieve id parameter for specific race
const urlParams = new URLSearchParams(window.location.search);
const raceId = urlParams.get('id');

export function initRaceDetails() {

    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id'); 

    async function loadRaceDetails() {
        try {
            const response = await fetch(`/api/results/${raceId}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
            const data = await response.json();
            console.log('API Response:', data);
    
            // set race title and add cards for each runner in the race
            document.querySelector('#race-title').textContent = `Race ${raceId} Results`;
            document.querySelector('#race-details').innerHTML = `
                <p>Date: ${new Date(data.timestamp).toLocaleString()}</p>
                <div class="results-container">
                    ${data.results.map(result => `
                            <div class="result-card">
                                <span class="position">${result.position}.</span>
                                <span class="time">${result.time}</span>
                            </div>
                        `
                    ).join('')}
                </div>
            `;
        } catch (error) {
            document.querySelector('#race-details').innerHTML = `
                <p class="error">Error loading race results: ${error.message}</p>
            `;
        }
    }

    loadRaceDetails();
}
