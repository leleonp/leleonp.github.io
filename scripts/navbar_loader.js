// Navbar loader - handles loading and setting active navigation links

function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            // Set active nav link after navbar is loaded
            const navLinks = document.querySelectorAll('.nav-link');
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
                const linkPath = href.replace('./', '');
                if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// Initialize navbar loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
