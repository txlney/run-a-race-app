import { formatTime } from '../utils.js';

export function initRaceDetails(raceId) {

    async function loadDetails() {
        try {
            const response = await fetch(`/api/results/${raceId}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
            const data = await response.json();
    
            // set race title and add cards for each runner in the race
            document.querySelector('#race-title').textContent = `Race ${raceId} - ${new Date(data.timestamp).toLocaleDateString()}`;
            document.querySelector('#race-details-container').innerHTML = `
                ${data.results.map(result => `
                    <div class="result-card">
                        <span class="position">${result.position}.</span>
                        <span class="time">${result.time}</span>
                    </div>
                `).join('')}
            `;
        } catch (error) {
            document.querySelector('#race-details').innerHTML = `
                <p class="error">Error loading race results: ${error.message}</p>
            `;
        }
    }

    loadDetails();
}
