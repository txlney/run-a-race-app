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
        history.back();
    });

    document.querySelector('#home').addEventListener('click', e => {
        e.preventDefault();
        const username = localStorage.getItem('username');
        if (username) {
            window.appRoutes['/']?.();
        } else {
            window.appRoutes['/login']?.();
        }
    });

    document.querySelector('#settings').addEventListener('click', () => {
        window.appRoutes['/settings']?.() || console.warn('Settings page not yet implemented');
    });
}