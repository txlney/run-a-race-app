import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

async function loadRaceList() {
    const response = await fetch('/api/races');
    const races = await response.json();
    const listEl = document.querySelector('#race-list');

    listEl.innerHTML = races.map(race =>
        `<li>
            <a href="race-details.html?id=${race.id}" class="race-link">
                Race ${race.id} - ${race.date} ${race.time}
            </a>
        </li>`
    ).join('');
}

window.loadRaceDetails = async function(raceId) {
    try {
        console.log('Fetching race:', raceId);
        const response = await fetch(`/api/results/${raceId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        console.log('Received data:', data);

        document.querySelector('#race-details').innerHTML = `
            <h3>Race ${raceId} Results</h3>
            <ul>
                ${data.results.map(result => `<li>${result.runner}: ${result.time}</li>`).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error in loadRaceDetails:', error);
        document.querySelector('#race-details').innerHTML = 
            '<p>Error loading results. Check console for details.</p>';
    }
}

loadRaceList();