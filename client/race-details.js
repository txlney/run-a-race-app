import { loadNavbar } from './navbar/navbar.js';
import { formatTime } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

console.log('time value:', formatTime(123434));

const urlParams = new URLSearchParams(window.location.search);
const raceId = urlParams.get('id');

async function loadRaceDetails() {
    try {
        const response = await fetch(`/api/results/${raceId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        console.log('API Response:', data);

        document.querySelector('#race-title').textContent = `Race ${raceId} Results`;
        document.querySelector('#race-details').innerHTML = `
            <p>Date: ${new Date(data.timestamp).toLocaleString()}</p>
            <div class="results-container">
                ${data.results.map(result => `
                        <div class="result-card">
                            <span class="position">${result.position}</span>
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