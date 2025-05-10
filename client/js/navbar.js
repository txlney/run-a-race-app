export async function loadNavbar() {
    try {
        const response = await fetch('pages/navbar.inc');
        if (response.ok) {
            const text =  await response.text();
            document.body.insertAdjacentHTML('afterbegin', text);
            initNavbar();
        } else {
            throw new Error('Network response not ok');
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

export async function initNavbar() {
    document.querySelector('#back').addEventListener('click', () => {
        const currentPath = window.location.pathname;

        // had issues with back button, had to hardcode these paths
        if (currentPath === '/timer' || currentPath === '/previous-races') {
            appRoutes['/']();
        } else if (currentPath.startsWith('/race-details')) {
            appRoutes['/previous-races']();
        } else {
            history.back();
        }
    });

    document.querySelector('#home').addEventListener('click', e => {
        e.preventDefault();

        // redirect to home page if logged in
        const username = localStorage.getItem('username');
        if (username) {
            window.appRoutes['/']?.();
        } else {
            window.appRoutes['/login']?.();
        }
    });

    document.querySelector('#settings').addEventListener('click', () => {

        // redirect to settings page if logged in
        const username = localStorage.getItem('username');
        if (username) {
            window.appRoutes['/settings']?.();
        } else {
            window.appRoutes['/login']?.();
        }
    });
}