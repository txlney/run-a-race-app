export function initSettings() {
    const logoutButton = document.querySelector('#logout-button');
    const themeToggleButton = document.querySelector('#theme-toggle-button');
    
    // handle logout button
    logoutButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('username');
            console.log('User logged out');
            appRoutes['/login']();
        }
    });

    // handle theme toggle button
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleButton.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });

    // set text of theme toggle button
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggleButton.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}