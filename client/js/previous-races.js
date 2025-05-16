export function initPreviousRaces() {

    async function loadRaceList() {
        console.log('Loading races...');

        try {
            const response = await fetch('/api/races');

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const races = await response.json();
            console.log('Retrieved races:', JSON.stringify(races, null, 2));

            const raceList = document.querySelector('#race-list');
            const noRacesMsg = document.querySelector('#no-races-msg');

            if (!raceList || !noRacesMsg) {
                throw new Error('Required DOM elements missing');
            }

            // filter races for the current user
            const username = localStorage.getItem('username');
            const userRaces = races.filter(race => race.user === username);

            // display 'no races found' message if no races exist
            if (userRaces.length === 0) {
                noRacesMsg.classList.remove('hidden');
                raceList.classList.add('hidden');
            } else {
                noRacesMsg.classList.add('hidden');

                // add a button for each race saved
                raceList.innerHTML = userRaces.map(race => createRaceItem(race)).join('');
                
                // add event listeners for buttons
                raceList.addEventListener('click', handleRaceButton);
                raceList.addEventListener('click', handleDeleteButton);
            }
        } catch (error) {
            console.error('Error loading races:', error);
            document.querySelector('#no-races-msg h2').textContent = 'Error loading races.';
            document.querySelector('#no-races-msg h2').classList.remove('hidden');
        }
    }

    // create html for each race button
    function createRaceItem(race) {
        return `
            <div class="race-item">
                <button class="race-button" data-id="${race.id}">
                    <h3>${race.date}, ${race.time.slice(0, -3)}</h3>
                    <h4>ID ${race.id}</h4>
                </button>
                <button class="delete-button" data-id="${race.id}" title="Delete Race">
                    <img src="images/icons8-trash-white.png" alt="Delete" class="delete-icon">
                </button>
            </div>
        `;
    }

    // direct to race-details page for specific race
    function handleRaceButton(event) {
        const button = event.target.closest('.race-button');
        if (button) {
            const raceId = button.dataset.id;
            window.appRoutes[`/race-details`](raceId);
            history.pushState({ raceId }, '', `/race-details/${raceId}`);
        }
    }

    // handle delete button, confirm deletion
    function handleDeleteButton(event) {
        const button = event.target.closest('.delete-button');
        if (button) {
            const raceId = button.dataset.id;

            if (confirm(`Are you sure you want to delete Race ${raceId}?`)) {
                deleteRace(raceId);
            }
        }
    }

    async function deleteRace(raceId) {
        try {
            const response = await fetch(`/api/races/${raceId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Failed to delete Race ${raceId}: ${response.status}`);
            }

            console.log(`Race ${raceId} deleted successfully`);
            loadRaceList();
        } catch (error) {
            console.error(`Error deleting race ${raceId}: ${error.message}`);
            alert('Failed to delete race. Please try again.');
        }
    }

    loadRaceList();
}