/**
 * ==========================================================================
 * ALTN NE KADAR - SHARED UI HANDLERS (ASSETS/JS/APP.JS)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    highlightActiveNav();

    if (window.GoldData) {
        window.GoldData.onReady(() => {
            renderHeaderNoticeBadge();
            renderStatusMetaBar();
            renderAlertBanner();
            renderTickerData();
            renderMainPriceGrid();
            renderDetailHeroBlock();
        });
    }
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

// Render Header Top Status Badge
function renderHeaderNoticeBadge() {
    const badge = document.querySelector('.demo-notice-badge') || document.querySelector('.status-badge');
    if (!badge || !window.GoldData) return;

    const mode = window.GoldData.getMode(); // "live" | "fallback" | "offline"
    const source = window.GoldData.getDataSource();

    if (mode === 'live') {
        badge.className = 'status-badge badge-live';
        badge.innerHTML = `<i class="fa-solid fa-bolt"></i><span>LIVE (Canlı) - ${source}</span>`;
    } else if (mode === 'fallback') {
        badge.className = 'status-badge badge-fallback';
        badge.innerHTML = `<i class="fa-solid fa-calculator"></i><span>FALLBACK (Gösterge) - ${source}</span>`;
    } else {
        badge.className = 'status-badge badge-offline';
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><span>OFFLINE (Son Kayıtlı) - ${source}</span>`;
    }
}

// Render Hero Live Status Meta Bar (Veri Kaynağı & Son Güncelleme & LIVE/FALLBACK/OFFLINE)
function renderStatusMetaBar() {
    if (!window.GoldData) return;
    const heroHeader = document.querySelector('.hero-header-block');
    if (!heroHeader) return;

    let metaBar = document.getElementById('liveStatusMetaBar');
    if (!metaBar) {
        metaBar = document.createElement('div');
        metaBar.id = 'liveStatusMetaBar';
        metaBar.className = 'live-status-meta-bar';
        heroHeader.appendChild(metaBar);
    }

    const mode = window.GoldData.getMode();
    const source = window.GoldData.getDataSource();
    const lastUpdated = window.GoldData.getLastUpdated();

    let badgeHTML = '';
    if (mode === 'live') {
        badgeHTML = `<span class="status-badge badge-live"><i class="fa-solid fa-circle-check"></i> LIVE</span>`;
    } else if (mode === 'fallback') {
        badgeHTML = `<span class="status-badge badge-fallback"><i class="fa-solid fa-triangle-exclamation"></i> FALLBACK</span>`;
    } else {
        badgeHTML = `<span class="status-badge badge-offline"><i class="fa-solid fa-ban"></i> OFFLINE</span>`;
    }

    metaBar.innerHTML = `
        <div class="meta-item">${badgeHTML}</div>
        <div class="meta-item"><i class="fa-solid fa-database highlight-text"></i> <strong>Veri Kaynağı:</strong> ${source}</div>
        <div class="meta-item"><i class="fa-solid fa-clock text-muted"></i> <strong>Son Güncelleme:</strong> ${lastUpdated}</div>
    `;
}

// Render Top Alert Banner for Fallback or Offline
function renderAlertBanner() {
    if (!window.GoldData) return;
    const msg = window.GoldData.getNoticeMessage();
    const mainEl = document.querySelector('main.container');
    if (!mainEl) return;

    let banner = document.getElementById('systemAlertBanner');

    if (!msg) {
        if (banner) banner.remove();
        return;
    }

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'systemAlertBanner';
        const heroBlock = mainEl.querySelector('.hero-header-block') || mainEl.querySelector('.breadcrumb-container') || mainEl.querySelector('h1');
        if (heroBlock) {
            heroBlock.after(banner);
        } else {
            mainEl.prepend(banner);
        }
    }

    const mode = window.GoldData.getMode();
    const alertClass = mode === 'offline' ? 'alert-danger' : 'alert-warning';
    const iconClass = mode === 'offline' ? 'fa-triangle-exclamation text-danger' : 'fa-circle-info highlight-text';
    const modeTag = mode === 'offline' ? 'OFFLINE' : 'FALLBACK';

    banner.className = `system-alert-banner ${alertClass}`;
    banner.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <div><strong>[${modeTag}]</strong> ${msg}</div>
    `;
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
                <strong style="color: var(--text-primary);">${item.unit}${item.sell.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                <span class="${changeClass}" style="font-size: 11px;">(${sign}%${item.change.toFixed(2)})</span>
            </div>
        `;
    }).join('');
}

// Render Main Price Grid (Home Page)
function renderMainPriceGrid() {
    const grid = document.getElementById('mainPriceGrid');
    if (!grid || !window.GoldData) return;

    const assets = window.GoldData.getAllAssets();
    const mode = window.GoldData.getMode();
    const isLive = mode === 'live';

    grid.innerHTML = assets.map(item => {
        const isPos = item.change >= 0;
        const sign = isPos ? '+' : '';
        const changeClass = isPos ? 'positive' : 'negative';
        const isIndicator = item.isIndicator || !isLive;

        const isRoot = window.location.pathname.endsWith('/') && !window.location.pathname.includes('/gram-altin/');
        const prefix = isRoot ? '' : '../';

        if (isIndicator) {
            return `
                <article class="price-card">
                    <div class="card-top">
                        <h2 class="card-title"><a href="${prefix}${item.slug}/">${item.name}</a></h2>
                        <span class="card-badge">${item.code}</span>
                    </div>
                    <div class="card-prices">
                        <div class="price-row highlight">
                            <span>Gösterge Değer:</span>
                            <span class="price-val">${window.GoldData.formatMoney(item.sell, item.unit)}</span>
                        </div>
                    </div>
                    <div class="card-footer-info">
                        <span class="change-badge ${changeClass}">${sign}%${item.change.toFixed(2)}</span>
                        <span style="color: var(--gold-primary); font-weight: 600;">[FALLBACK] Gösterge Veri</span>
                    </div>
                </article>
            `;
        } else {
            return `
                <article class="price-card">
                    <div class="card-top">
                        <h2 class="card-title"><a href="${prefix}${item.slug}/">${item.name}</a></h2>
                        <span class="card-badge">${item.code}</span>
                    </div>
                    <div class="card-prices">
                        <div class="price-row highlight">
                            <span>Satış:</span>
                            <span class="price-val">${window.GoldData.formatMoney(item.sell, item.unit)}</span>
                        </div>
                        <div class="price-row">
                            <span>Alış:</span>
                            <span>${window.GoldData.formatMoney(item.buy, item.unit)}</span>
                        </div>
                    </div>
                    <div class="card-footer-info">
                        <span class="change-badge ${changeClass}">${sign}%${item.change.toFixed(2)}</span>
                        <span style="color: var(--accent-success); font-weight: 600;"><i class="fa-solid fa-bolt" style="font-size: 10px;"></i> [LIVE] Canlı Piyasa</span>
                    </div>
                </article>
            `;
        }
    }).join('');
}

// Render Detail Hero Block (Subpages)
function renderDetailHeroBlock() {
    const hero = document.querySelector('.detail-price-hero');
    if (!hero || !window.GoldData) return;

    const canonical = document.querySelector('link[rel="canonical"]');
    const path = canonical ? canonical.getAttribute('href') : window.location.pathname;

    let assetId = 'gram';
    if (path.includes('ceyrek-altin')) assetId = 'ceyrek';
    else if (path.includes('yarim-altin')) assetId = 'yarim';
    else if (path.includes('tam-altin')) assetId = 'tam';
    else if (path.includes('cumhuriyet-altini')) assetId = 'cumhuriyet';
    else if (path.includes('ata-altin')) assetId = 'ata';
    else if (path.includes('22-ayar-bilezik')) assetId = 'bilezik22';
    else if (path.includes('14-ayar-altin')) assetId = 'ayar14';
    else if (path.includes('ons-altin')) assetId = 'ons';

    const asset = window.GoldData.getAsset(assetId);
    if (!asset) return;

    const mode = window.GoldData.getMode();
    const isLive = mode === 'live';
    const isPos = asset.change >= 0;
    const sign = isPos ? '+' : '';
    const changeClass = isPos ? 'text-success' : 'text-danger';
    const changeLabel = asset.changeLabel || 'Günlük Değişim';

    const modeTag = mode.toUpperCase();

    if (!isLive || asset.isIndicator) {
        hero.innerHTML = `
            <div class="hero-price-item">
                <span class="label">${asset.name} Gösterge Değer</span>
                <span class="val">${window.GoldData.formatMoney(asset.sell, asset.unit)}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">${changeLabel}</span>
                <span class="val ${changeClass}">${sign}%${asset.change.toFixed(2)}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">Son Güncelleme</span>
                <span class="val" style="font-size: 16px; font-weight: 600;">${window.GoldData.getLastUpdated()}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">Veri Kaynağı [${modeTag}]</span>
                <span class="val" style="font-size: 14px; font-weight: 600; color: var(--gold-primary);">${window.GoldData.getDataSource()}</span>
            </div>
        `;
    } else {
        hero.innerHTML = `
            <div class="hero-price-item">
                <span class="label">${asset.name} Satış</span>
                <span class="val" id="detSell">${window.GoldData.formatMoney(asset.sell, asset.unit)}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">${asset.name} Alış</span>
                <span class="val" id="detBuy">${window.GoldData.formatMoney(asset.buy, asset.unit)}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">Günlük Değişim</span>
                <span class="val ${changeClass}" id="detChange">${sign}%${asset.change.toFixed(2)}</span>
            </div>
            <div class="hero-price-item">
                <span class="label">Veri Kaynağı [${modeTag}]</span>
                <span class="val" style="font-size: 14px; font-weight: 600; color: var(--accent-success);"><i class="fa-solid fa-bolt"></i> ${window.GoldData.getDataSource()}</span>
            </div>
        `;
    }
}
