import { loadNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();
});

// load list of previous races
async function loadRaceList() {
    try {
        const response = await fetch('/api/races');
        const races = await response.json();
        const raceList = document.querySelector('#race-list');
        const noRacesMsg = document.querySelector('#no-races-msg');

        // display 'no races found' message if no races exist
        if (races.length === 0) {
            noRacesMsg.classList.remove('hidden');
            raceList.classList.add('hidden');
        } else {
            noRacesMsg.classList.add('hidden');

            // add a button fro each race saved
            raceList.innerHTML = races.map(race =>
                `<div>
                    <button class="race-btn" data-id="${race.id}">
                        <h3>${race.date}, ${race.time.slice(0, -3)}</h3>
                        <h4>ID ${race.id}</h4>
                    </button>
                </div>`
            ).join('');
        
            // event listener to direct to 'race-details' page
            raceList.addEventListener('click', event => {
                const button = event.target.closest('.race-btn');
                if (button) {
                    const raceId = button.dataset.id;
                    window.location.href = `race-details.html?id=${raceId}`;
                }
            });
        }
    } catch (error) {
        console.error('Error loading races:', error);
        document.querySelector('#no-races-msg h2').textContent = 'Error loading races.';
        document.querySelector('#no-races-msg h2').classList.remove('hidden');
    }
    
}

loadRaceList();