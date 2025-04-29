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
            <button onclick="loadRaceDetails('${race.id}')">
                Race ${race.id} - ${race.date} ${race.time}
            </button>
        </li>`
    ).join('');
}

async function loadRaceDetails(raceId) {
    const response = await fetch(`/api/results/${raceId}`);
    const data = await response.json();
    document.querySelector('#race-details').innerHTML = `
        <h3>Race ${raceId} Results</h3>
        <ul>
            ${data.results.map(result => `<li>${result.runner}: ${result.time}</li>`).join('')}
        </ul>
    `;
}

loadRaceList();