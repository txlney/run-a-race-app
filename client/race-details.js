import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

const urlParams = new URLSearchParams(window.location.search);
const raceId = urlParams.get('id');

async function loadRaceDetails() {
    try {
        const response = await fetch(`/api/results/${raceId}`);
        if (!response.ok) throw new Error('Race not found');

        const data = await response.json();

        document.querySelector('#race-title').textContent = `Race ${raceId} Results`;
        document.querySelector('#race-details').innerHTML = `
            <p>Date: ${new Date(data.timestamp).toLocaleString()}</p>
            <ul class="results-list">
                ${data.results.map(result => `
                        <li>
                            <span class="runner">${result.runner}</span>
                            <span class="time">${result.time}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
    } catch (error) {
        document.querySelector('#race-details').innerHTML = `
            <p class="error">Error loading race results: ${error.message}</p>
        `;
    }
}

loadRaceDetails();