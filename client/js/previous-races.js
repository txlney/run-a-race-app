export function initPreviousRaces() {
    // load list of previous races
    async function loadRaceList() {
        console.log('Loading races...');

        try {
            const response = await fetch('/api/races');

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const races = await response.json();
            const raceList = document.querySelector('#race-list');
            const noRacesMsg = document.querySelector('#no-races-msg');

            if (!raceList || !noRacesMsg) {
                throw new Error('Required DOM elements missing');
            }

            // display 'no races found' message if no races exist
            if (races.length === 0) {
                noRacesMsg.classList.remove('hidden');
                raceList.classList.add('hidden');
            } else {
                noRacesMsg.classList.add('hidden');

                // add a button for each race saved
                raceList.innerHTML = races.map(race =>
                    `<div>
                        <button class="race-btn" data-id="${race.id}">
                            <h3>${race.date}, ${race.time.slice(0, -3)}</h3>
                            <h4>ID ${race.id}</h4>
                        </button>
                    </div>`
                ).join('');
            
                raceList.addEventListener('click', handleRaceButton);
            }
        } catch (error) {
            console.error('Error loading races:', error);
            document.querySelector('#no-races-msg h2').textContent = 'Error loading races.';
            document.querySelector('#no-races-msg h2').classList.remove('hidden');
        }
    }

    function handleRaceButton(event) {
        const button = event.target.closest('.race-btn');
        if (button) {
            const raceId = button.dataset.id;
            window.appRoutes[`/race-details`](raceId);
            history.pushState({ raceId }, '', `/race-details/${raceId}`);
        }
    }

    loadRaceList();
}