import { initTimer } from './timer.js';
import { initNavbar, loadNavbar } from './navbar.js';
import { initPreviousRaces } from './previous-races.js';
import { initRaceDetails } from './race-details.js';
import { fetchRaceData } from './data.js';

(async () => {

    await loadNavbar();
    initNavbar();

    window.appRoutes = {
        '/': () => loadPage('home'),
        '/timer': () => loadPage('timer'),
        '/previous-races': () => loadPage('previous-races'),
        '/race-details/:id': (id) => loadRaceDetails(id)
    };

    const initialPath = window.location.pathname;
    appRoutes[initialPath]?.() || appRoutes['/']();
})();

async function loadPage(page) {

    try {
        const response = await fetch(`includes/${page}.inc`);

        const html = await response.text();
        document.querySelector('#app').innerHTML = html;

        switch(page) {
            case 'timer':
                console.log('Loading timer...');
                initTimer();
                break;
            case 'home':
                console.log('Loading home...');
                setupHomePage();
                break;
            case 'previous-races':
                console.log('Loading previous races...');
                initPreviousRaces();
                break;
            case 'race-details':
                console.log('Loading race details...');
                initRaceDetails();
                break;
        }

        if (page !== 'home') {
            history.pushState({}, '', `/${page}`);
        } else {
            history.pushState({}, '', '/');
        }

        document.querySelector('#back').classList.toggle('hidden', page === 'home');
        document.querySelector('#settings').classList.toggle('visible', page === 'settings');

    } catch (error) {
        console.error(`Failed to load ${page}:`, error);
        document.querySelector('#app').innerHTML = `
            <div class="error">
                Failed to load page. Please try again.
            </div>
        `;
    }
}

function setupHomePage() {
    const timerPage = document.querySelector('#top-half');
    const previousRacesPage = document.querySelector('#bottom-half');

    timerPage.addEventListener('click', () => {
        appRoutes['/timer']();
    });

    previousRacesPage.addEventListener('click', () => {
        appRoutes['/previous-races']();
    });
}

async function loadRaceDetails(raceId) {
    try {
        const response = await fetch('includes/race-details.inc');
        document.querySelector('#app').innerHTML = await response.text();

        const race = await fetchRaceData(raceId);
        displayRaceDetails(race);

        history.pushState({}, '', `/race-details/${raceId}`);
    } catch (error) {
        console.error('Error loading race details:', error);
    }
}

function displayRaceDetails(race) {
    if (!race) return;

    document.querySelector('#race-title').textContent = 
        `Race ${race.id} - ${new Date(race.date).toLocaleDateString()}`;

    const container = document.querySelector('#race-details-container');
    container.innerHTML = race.results.map(result => `
        <div class="result-row">
            <span>${result.position}</span>
            <span>${formatTime(result.time)}</span>
        </div>
    `).join('');
}

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    appRoutes[path]?.() || appRoutes['/']();
});
