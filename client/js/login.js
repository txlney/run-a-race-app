export function initLogin() {
    const acceptedUsernames = ['tom', 'seb', 'matt', 'rich', 'kirsten'];
    const loginForm = document.querySelector('#login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.querySelector('#username').value;

        // check list of accepted usernames
        if (acceptedUsernames.includes(username)) {
            console.log(`Logged in as: ${username}`);
            localStorage.setItem('username', username);
            appRoutes['/']();
        } else {
            alert(`Invalid username. Please try again.\nAccepted usernames for now: ${acceptedUsernames.join(', ')}`);
        }
    });
}