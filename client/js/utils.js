// format time from ms to XX:XX:XX
export function formatTime(ms) {
    const hrs = Math.floor(ms / 3600000);
    const min = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const mil = Math.floor(ms % 100);
    return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// format date from DD/MM/YYYY to 'XX Month, XXXX'
export function formatDate(dateString) {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const formattedDate = `${parseInt(day, 10)} ${months[date.getMonth()]} ${year}`;
    return formattedDate;
}

// hide and show elements
export function hideElement(selector) {
    document.querySelector(selector)?.classList.add('hidden');
}

export function showElement(selector) {
    document.querySelector(selector).classList.remove('hidden');
}

// displays current logged in user when logged in
export function updateLoggedInMessage() {
    const username = localStorage.getItem('username');
    const loggedInMessage = document.querySelector('#logged-in-message');
    const usernameDisplay = document.querySelector('#username-display');
    if (username) {
        usernameDisplay.textContent = username;
        loggedInMessage.classList.remove('hidden');
    } else {
        loggedInMessage.classList.add('hidden');
    }
}