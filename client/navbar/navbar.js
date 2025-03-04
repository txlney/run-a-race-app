export async function loadNavbar() {
    try {
        const response = await fetch('navbar/navbar.html');
        if (response.ok) {
            const text =  await response.text();
            document.body.insertAdjacentHTML('afterbegin', text);
        } else {
            throw new Error('Network response not ok');
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

export async function homeNavbar() {
    try {
        const response = await fetch('navbar/homeNavbar.html');
        if (response.ok) {
            const text =  await response.text();
            document.body.insertAdjacentHTML('afterbegin', text);
        } else {
            throw new Error('Network response not ok');
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}