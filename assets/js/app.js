/**
 * ==========================================================================
 * ALTN NE KADAR - SHARED UI HANDLERS (ASSETS/JS/APP.JS)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    highlightActiveNav();
    renderTickerData();
});

// Theme Toggle Handler
function initTheme() {
    const savedTheme = localStorage.getItem('altn_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('altn_theme', next);
            themeBtn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }
}

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });
    }
}

// Active Nav Link Highlighting
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || (href !== '/' && href !== '../' && currentPath.includes(href)))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Render Top Ticker Bar Data
function renderTickerData() {
    const tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack || !window.GoldData) return;

    const assets = window.GoldData.getAllAssets();
    tickerTrack.innerHTML = assets.map(item => {
        const isPos = item.change >= 0;
        const sign = isPos ? '+' : '';
        const changeClass = isPos ? 'text-success' : 'text-danger';
        return `
            <div class="ticker-item">
                <span style="color: var(--text-secondary);">${item.name}:</span>
                <strong style="color: var(--text-primary);">${item.unit}${item.sell.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong>
                <span class="${changeClass}" style="font-size: 11px;">(${sign}%${item.change.toFixed(2)})</span>
            </div>
        `;
    }).join('');
}
