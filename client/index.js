// npm i to install node modules

import { homeNavbar } from './navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    homeNavbar();
});

const topHalf = document.querySelector('#top-half');
const bottomHalf = document.querySelector('#bottom-half');

topHalf.addEventListener('click', () => {
    window.location.href = 'timer.html';
});

bottomHalf.addEventListener('click', () => {
    window.location.href = 'page2.html';
});