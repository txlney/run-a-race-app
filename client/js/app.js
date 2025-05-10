import { initTimer } from './timer.js';
import { initNavbar, loadNavbar } from './navbar.js';
import { initPreviousRaces } from './previous-races.js';
import { initRaceDetails } from './race-details.js';
import { updateLoggedInMessage } from './utils.js';
import { initSettings } from './settings.js';
import { initLogin } from './login.js';

// set the theme based on system/saved preference
(function initialiseTheme() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme') || systemTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

(async () => {

    await loadNavbar();
    initNavbar();

    console.log('Logged in as:', localStorage.getItem('username'));

    const username = localStorage.getItem('username');
    if (!username) {
        history.replaceState({}, '', '/login');
        appRoutes['/login']();
    } else {
        const initialPath = window.location.pathname;
        appRoutes[initialPath]?.() || appRoutes['/']();
    }
})();

window.appRoutes = {
    '/': () => loadPage('home'),
    '/home': () => loadPage('home'),
    '/login': () => loadPage('login'),
    '/timer': () => loadPage('timer'),
    '/previous-races': () => loadPage('previous-races'),
    '/race-details': (id) => loadPage('race-details', id),
    '/settings': () => loadPage('settings')
};

// core load page function
async function loadPage(page, param, addToHistory = true) {
    try {
        const response = await fetch(`pages/${page}.inc`);

        if (!response.ok) {
            throw new Error(`Error fetching pages: ${response.statusText}`);
        }

        const html = await response.text();
        document.querySelector('#app').innerHTML = html;

        // initialise each page's functions
        switch(page) {
            case 'login':
                console.log('Loading login...');
                initLogin();
                break;
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
                initRaceDetails(param);
                break;
            case 'settings':
                console.log('Loading settings...');
                initSettings();
                break;
        }

        // store app state in history API
        if (addToHistory) {
            history.pushState({ page, param }, '', `/${page}`);
        }

        // hide and show navbar buttons where appropriate
        const backButton = document.querySelector('#back');
        const settingsButton = document.querySelector('#settings');
        backButton.classList.toggle('hidden', page === 'home' || page === 'login');
        settingsButton.classList.toggle('hidden', page === 'settings' || page === 'login');

        updateLoggedInMessage();

    } catch (error) {
        console.error(`Failed to load ${page}:`, error);
        document.querySelector('#app').innerHTML = `
            <div class="error">
                Failed to load page. Please try again.
            </div>
        `;
    }
}

// event listeners for home page
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

// handles browser back/forward buttons
window.addEventListener('popstate', event => {
    const state = event.state || {};
    const page = state.page || window.location.pathname.slice(1) || 'home';
    const param = state.param || null;

    appRoutes[`/${page}`]?.(param, false);
});
