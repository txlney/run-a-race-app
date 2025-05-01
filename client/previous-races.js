import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

async function loadRaceList() {
    const response = await fetch('/api/races');
    const races = await response.json();
    const raceList = document.querySelector('#race-list');

    raceList.innerHTML = races.map(race =>
        `<div>
            <button class="race-btn" data-id="${race.id}">
                <h3>${race.date}, ${race.time.slice(0, -3)}</h3>
                <h4>ID ${race.id}</h4>
            </button>
        </div>`
    ).join('');

    raceList.addEventListener('click', event => {
        const button = event.target.closest('.race-btn');
        if (button) {
            const raceId = button.dataset.id;
            window.location.href = `race-details.html?id=${raceId}`;
        }
    });
}

loadRaceList();