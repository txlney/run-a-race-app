import { homeNavbar } from './js/navbar.js';

const pages = [
    { screen: 'home', title: 'Home' },
    { screen: 'timer', title: 'Timer' },
    { screen: 'previous-races', title: 'Previous Races' }
];

let currentScreen = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadScreens();
    setupNavigation();
    navigateTo(window.location.pathname);
    homeNavbar();
});

const topHalf = document.querySelector('#top-half');
const bottomHalf = document.querySelector('#bottom-half');

topHalf.addEventListener('click', () => {
    window.location.href = 'timer.html';
});

bottomHalf.addEventListener('click', () => {
    window.location.href = 'previous-races.html';
});