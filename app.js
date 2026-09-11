/**
 * ==========================================================================
 * ALTINNEKADAR - CANLI PİYASA & ALTIN TAKİP UYGULAMA MANTIĞI
 * ==========================================================================
 */

// Initial Financial Database (Real Market Simulation Baseline)
const INITIAL_MARKET_DATA = [
    { id: 'gram', code: 'GAU/TRY', name: 'Gram Altın', category: 'ziynet', buy: 3480.10, sell: 3485.40, change: 0.82, changeVal: 28.40, low: 3430.00, high: 3492.50, unit: '₺', icon: 'fa-coins' },
    { id: 'ceyrek', code: 'CEYREK', name: 'Çeyrek Altın', category: 'ziynet', buy: 5620.00, sell: 5698.00, change: 0.75, changeVal: 42.00, low: 5580.00, high: 5710.00, unit: '₺', icon: 'fa-ring' },
    { id: 'yarim', code: 'YARIM', name: 'Yarım Altın', category: 'ziynet', buy: 11240.00, sell: 11396.00, change: 0.72, changeVal: 84.00, low: 11150.00, high: 11420.00, unit: '₺', icon: 'fa-circle-dot' },
    { id: 'tam', code: 'TAM', name: 'Tam Altın (Ziynet)', category: 'ziynet', buy: 22480.00, sell: 22750.00, change: 0.68, changeVal: 154.00, low: 22300.00, high: 22800.00, unit: '₺', icon: 'fa-gem' },
    { id: 'cumhuriyet', code: 'ATA', name: 'Cumhuriyet Altını (Ata)', category: 'ziynet', buy: 23150.00, sell: 23480.00, change: 0.90, changeVal: 210.00, low: 22900.00, high: 23550.00, unit: '₺', icon: 'fa-crown' },
    { id: 'bilezik22', code: '22AYAR', name: '22 Ayar Bilezik (Gram)', category: 'ayar', buy: 3180.50, sell: 3245.00, change: 0.78, changeVal: 25.10, low: 3150.00, high: 3260.00, unit: '₺', icon: 'fa-bacon' },
    { id: 'ayar14', code: '14AYAR', name: '14 Ayar Altın (Gram)', category: 'ayar', buy: 1980.00, sell: 2090.00, change: 0.65, changeVal: 13.50, low: 1950.00, high: 2100.00, unit: '₺', icon: 'fa-certificate' },
    { id: 'has', code: 'HASALTIN', name: 'Has Altın (999.9)', category: 'ayar', buy: 3482.00, sell: 3486.20, change: 0.84, changeVal: 29.00, low: 3432.00, high: 3494.00, unit: '₺', icon: 'fa-box' },
    { id: 'ons', code: 'XAU/USD', name: 'Ons Altın ($)', category: 'ons', buy: 2941.80, sell: 2942.50, change: 0.45, changeVal: 13.20, low: 2925.10, high: 2948.80, unit: '$', icon: 'fa-globe' },
    { id: 'kulce_usd', code: 'KG/USD', name: 'Külçe Altın ($/KG)', category: 'ons', buy: 94500.00, sell: 94650.00, change: 0.48, changeVal: 450.00, low: 93800.00, high: 94900.00, unit: '$', icon: 'fa-cubes' },
    { id: 'gumus_tl', code: 'XAG/TRY', name: 'Gümüş (Gram/TL)', category: 'doviz', buy: 38.40, sell: 38.85, change: 1.15, changeVal: 0.44, low: 37.80, high: 39.10, unit: '₺', icon: 'fa-shield-halved' },
    { id: 'dolar', code: 'USD/TRY', name: 'Amerikan Doları', category: 'doviz', buy: 36.8150, sell: 36.8420, change: -0.08, changeVal: -0.03, low: 36.7800, high: 36.8900, unit: '₺', icon: 'fa-dollar-sign' },
    { id: 'euro', code: 'EUR/TRY', name: 'Euro / TL', category: 'doviz', buy: 39.9200, sell: 39.9850, change: 0.15, changeVal: 0.06, low: 39.8000, high: 40.0500, unit: '₺', icon: 'fa-euro-sign' }
];

// App State Management
class AppState {
    constructor() {
        this.marketData = JSON.parse(localStorage.getItem('gold_market_data')) || INITIAL_MARKET_DATA;
        this.favorites = JSON.parse(localStorage.getItem('gold_favorites')) || ['gram', 'ceyrek'];
        this.alarms = JSON.parse(localStorage.getItem('gold_alarms')) || [];
        this.selectedChartSymbol = 'gram';
        this.selectedChartPeriod = '1W';
        this.chartType = 'area';
        this.activeCategoryTab = 'all';
        this.theme = localStorage.getItem('gold_theme') || 'dark';
    }

    saveFavorites() {
        localStorage.setItem('gold_favorites', JSON.stringify(this.favorites));
    }

    saveAlarms() {
        localStorage.setItem('gold_alarms', JSON.stringify(this.alarms));
    }

    toggleFavorite(symbolId) {
        if (this.favorites.includes(symbolId)) {
            this.favorites = this.favorites.filter(id => id !== symbolId);
            showToast('Enstrüman favorilerden çıkarıldı.');
        } else {
            this.favorites.push(symbolId);
            showToast('Enstrüman favorilerinize eklendi!');
        }
        this.saveFavorites();
        updateUI();
    }
}

const state = new AppState();

// Initialize App on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    renderTicker();
    renderHeroCards();
    renderGoldTable();
    initChart();
    initConverter();
    initSearch();
    initEvents();
    startLiveWebsocketSimulator();
});

// Theme Toggle Manager
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeBtn = document.getElementById('themeToggleBtn');
    themeBtn.innerHTML = state.theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    
    themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('gold_theme', state.theme);
        themeBtn.innerHTML = state.theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        renderChart(); // Redraw chart for theme colors
    });
}

// Live Header Clock
function initClock() {
    const clockEl = document.getElementById('marketClock');
    const updateTime = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('tr-TR');
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// 1. Ticker Renderer
function renderTicker() {
    const track = document.getElementById('tickerTrack');
    track.innerHTML = state.marketData.map(item => {
        const isPos = item.change >= 0;
        const changeClass = isPos ? 'positive' : 'negative';
        const sign = isPos ? '+' : '';
        return `
            <div class="ticker-item" onclick="selectChartAsset('${item.id}')">
                <span class="ticker-name">${item.name}:</span>
                <span class="ticker-price">${item.unit}${formatPrice(item.sell)}</span>
                <span class="ticker-change ${changeClass}">${sign}%${item.change.toFixed(2)}</span>
            </div>
        `;
    }).join('');
}

// 2. Hero Cards Renderer
function renderHeroCards() {
    const symbols = ['gram', 'ceyrek', 'ons', 'dolar'];
    symbols.forEach(id => {
        const item = state.marketData.find(m => m.id === id);
        if (!item) return;

        const priceEl = document.getElementById(`card-${id}-price`);
        const changeEl = document.getElementById(`card-${id}-change`);
        const buyEl = document.getElementById(`card-${id}-buy`);
        const sellEl = document.getElementById(`card-${id}-sell`);
        const favBtn = document.querySelector(`.fav-icon-btn[data-symbol="${id}"]`);

        if (priceEl) priceEl.textContent = `${item.unit}${formatPrice(item.sell)}`;
        if (buyEl) buyEl.textContent = `${item.unit}${formatPrice(item.buy)}`;
        if (sellEl) sellEl.textContent = `${item.unit}${formatPrice(item.sell)}`;

        if (changeEl) {
            const isPos = item.change >= 0;
            changeEl.className = `change-tag ${isPos ? 'positive' : 'negative'}`;
            const icon = isPos ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
            const sign = isPos ? '+' : '';
            changeEl.innerHTML = `<i class="fa-solid ${icon}"></i> ${sign}%${item.change.toFixed(2)} (${sign}${item.unit}${Math.abs(item.changeVal).toFixed(2)})`;
        }

        if (favBtn) {
            if (state.favorites.includes(id)) {
                favBtn.classList.add('active');
                favBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
            } else {
                favBtn.classList.remove('active');
                favBtn.innerHTML = '<i class="fa-regular fa-star"></i>';
            }
        }
    });

    document.getElementById('favCount').textContent = state.favorites.length;
    document.getElementById('alarmCount').textContent = state.alarms.length;
}

// 3. Main Gold Table Renderer
function renderGoldTable() {
    const tbody = document.getElementById('goldTableBody');
    const filteredData = state.marketData.filter(item => {
        if (state.activeCategoryTab === 'all') return true;
        return item.category === state.activeCategoryTab;
    });

    tbody.innerHTML = filteredData.map(item => {
        const isFav = state.favorites.includes(item.id);
        const isPos = item.change >= 0;
        const changeClass = isPos ? 'text-success' : 'text-danger';
        const sign = isPos ? '+' : '';
        const spread = (item.sell - item.buy).toFixed(2);
        
        // Calculate range bar percentage
        const rangeSpan = item.high - item.low;
        const rangePercent = rangeSpan > 0 ? Math.min(100, Math.max(0, ((item.sell - item.low) / rangeSpan) * 100)) : 50;

        return `
            <tr id="table-row-${item.id}" onclick="selectChartAsset('${item.id}')">
                <td class="text-center" onclick="event.stopPropagation();">
                    <button class="table-action-btn ${isFav ? 'text-warning' : ''}" onclick="state.toggleFavorite('${item.id}')" title="Favori">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                    </button>
                </td>
                <td>
                    <div class="gold-name-cell">
                        <div class="gold-icon"><i class="fa-solid ${item.icon}"></i></div>
                        <div class="gold-title">
                            <strong>${item.name}</strong>
                            <span>${item.code}</span>
                        </div>
                    </div>
                </td>
                <td class="text-right font-mono" id="row-buy-${item.id}">${item.unit}${formatPrice(item.buy)}</td>
                <td class="text-right font-mono font-bold" id="row-sell-${item.id}">${item.unit}${formatPrice(item.sell)}</td>
                <td class="text-right font-bold ${changeClass}" id="row-change-${item.id}">${sign}%${item.change.toFixed(2)}</td>
                <td class="text-center">
                    <div class="range-bar-wrapper">
                        <div class="range-labels">
                            <span>${formatPrice(item.low)}</span>
                            <span>${formatPrice(item.high)}</span>
                        </div>
                        <div class="range-track">
                            <div class="range-fill" style="width: ${rangePercent}%;"></div>
                        </div>
                    </div>
                </td>
                <td class="text-right text-muted">${item.unit}${spread}</td>
                <td class="text-center text-muted" style="font-size: 11px;">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                <td class="text-center" onclick="event.stopPropagation();">
                    <button class="table-action-btn" onclick="selectChartAsset('${item.id}')" title="Grafik Göster">
                        <i class="fa-solid fa-chart-line"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 4. Interactive Canvas Chart Engine
let chartCanvas, chartCtx;

function initChart() {
    chartCanvas = document.getElementById('mainChartCanvas');
    chartCtx = chartCanvas.getContext('2d');
    
    // Resize Canvas for sharp rendering
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Period Filter Events
    document.querySelectorAll('#chartTimeFilters .time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#chartTimeFilters .time-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedChartPeriod = e.target.dataset.period;
            renderChart();
        });
    });

    // Chart Type Events
    document.querySelectorAll('#chartTypeToggle .type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.type-btn');
            document.querySelectorAll('#chartTypeToggle .type-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            state.chartType = button.dataset.type;
            renderChart();
        });
    });

    renderChart();
}

function resizeCanvas() {
    if (!chartCanvas) return;
    const rect = chartCanvas.parentElement.getBoundingClientRect();
    chartCanvas.width = rect.width * window.devicePixelRatio;
    chartCanvas.height = rect.height * window.devicePixelRatio;
    chartCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    renderChart();
}

function selectChartAsset(symbolId) {
    state.selectedChartSymbol = symbolId;
    renderChart();
    
    // Smooth scroll to chart section
    const chartBlock = document.getElementById('chart-section');
    if (chartBlock) {
        chartBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function generateHistoricalData(basePrice, period) {
    const pointsCount = period === '1D' ? 24 : period === '1W' ? 30 : period === '1M' ? 45 : 60;
    const points = [];
    let current = basePrice * (period === '1Y' ? 0.72 : period === '3M' ? 0.88 : 0.96);

    for (let i = 0; i < pointsCount; i++) {
        const randomFactor = (Math.random() - 0.48) * 0.015;
        current = current * (1 + randomFactor);
        points.push(current);
    }
    // Ensure final point matches current live price
    points[points.length - 1] = basePrice;
    return points;
}

function renderChart() {
    if (!chartCanvas || !chartCtx) return;

    const item = state.marketData.find(m => m.id === state.selectedChartSymbol) || state.marketData[0];
    const width = chartCanvas.width / window.devicePixelRatio;
    const height = chartCanvas.height / window.devicePixelRatio;

    // Update Banner Titles
    document.getElementById('chartAssetBadge').textContent = item.code;
    document.getElementById('chartAssetTitle').textContent = `${item.name} Fiyat Grafiği`;
    document.getElementById('chartCurrentPrice').textContent = `${item.unit}${formatPrice(item.sell)}`;

    const isPos = item.change >= 0;
    const changeSign = isPos ? '+' : '';
    const changeEl = document.getElementById('chartPriceChange');
    changeEl.className = `price-change ${isPos ? 'positive' : 'negative'}`;
    changeEl.textContent = `${changeSign}${item.unit}${item.changeVal.toFixed(2)} (%${item.change.toFixed(2)})`;

    // Clear Canvas
    chartCtx.clearRect(0, 0, width, height);

    // Generate Points Data
    const dataPoints = generateHistoricalData(item.sell, state.selectedChartPeriod);
    const minVal = Math.min(...dataPoints);
    const maxVal = Math.max(...dataPoints);
    const avgVal = (dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length);

    // Update Chart Stats Bar
    document.getElementById('statLow').textContent = `${item.unit}${formatPrice(minVal)}`;
    document.getElementById('statHigh').textContent = `${item.unit}${formatPrice(maxVal)}`;
    document.getElementById('statAvg').textContent = `${item.unit}${formatPrice(avgVal)}`;

    const padding = { top: 20, right: 20, bottom: 30, left: 20 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Grid lines
    chartCtx.strokeStyle = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    chartCtx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        chartCtx.beginPath();
        chartCtx.moveTo(padding.left, y);
        chartCtx.lineTo(width - padding.right, y);
        chartCtx.stroke();
    }

    // Map Coordinates
    const points = dataPoints.map((val, idx) => {
        const x = padding.left + (idx / (dataPoints.length - 1)) * chartW;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal || 1)) * chartH;
        return { x, y, val };
    });

    // Draw Spline / Line
    chartCtx.beginPath();
    chartCtx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        chartCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    chartCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    const lineColor = isPos ? '#10b981' : '#ef4444';
    chartCtx.strokeStyle = lineColor;
    chartCtx.lineWidth = 3;
    chartCtx.stroke();

    // Draw Area Fill if area chart type selected
    if (state.chartType === 'area') {
        const fillCtx = chartCanvas.getContext('2d');
        fillCtx.lineTo(points[points.length - 1].x, height - padding.bottom);
        fillCtx.lineTo(points[0].x, height - padding.bottom);
        fillCtx.closePath();

        const gradient = fillCtx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        if (isPos) {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        }
        fillCtx.fillStyle = gradient;
        fillCtx.fill();
    }
}

// 5. Gold Converter Engine
function initConverter() {
    const amountInput = document.getElementById('calcAmount');
    const fromSelect = document.getElementById('fromAsset');
    const toSelect = document.getElementById('toAsset');
    const calcTypeRadios = document.querySelectorAll('input[name="calcType"]');
    const swapBtn = document.getElementById('swapConverterBtn');

    const calculate = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const fromKey = fromSelect.value;
        const toKey = toSelect.value;
        const calcType = document.querySelector('input[name="calcType"]:checked').value; // 'buy' or 'sell'

        // Convert base values to TRY
        const getTryRate = (key) => {
            if (key === 'try') return 1;
            const asset = state.marketData.find(m => m.id === key);
            if (!asset) return 1;
            
            // If user is buying gold from dealer -> use Sell price of asset
            // If user is selling gold to dealer -> use Buy price of asset
            const price = calcType === 'sell' ? asset.buy : asset.sell;
            if (key === 'ons') {
                const usdAsset = state.marketData.find(m => m.id === 'dolar');
                return price * (usdAsset ? usdAsset.sell : 36.8);
            }
            return price;
        };

        const fromInTry = getTryRate(fromKey);
        const toInTry = getTryRate(toKey);

        const totalTry = amount * fromInTry;
        const finalValue = totalTry / toInTry;

        const resultEl = document.getElementById('calcResultValue');
        const detailsEl = document.getElementById('calcResultDetails');

        const toAssetItem = state.marketData.find(m => m.id === toKey);
        const unitSymbol = toKey === 'try' ? '₺' : toKey === 'dolar' ? '$' : toKey === 'euro' ? '€' : ' Adet';

        resultEl.textContent = `${unitSymbol}${formatPrice(finalValue)}`;
        detailsEl.textContent = `1 ${getAssetName(fromKey)} = ${unitSymbol}${formatPrice(fromInTry / toInTry)}`;
    };

    amountInput.addEventListener('input', calculate);
    fromSelect.addEventListener('change', calculate);
    toSelect.addEventListener('change', calculate);
    calcTypeRadios.forEach(r => r.addEventListener('change', calculate));

    swapBtn.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        calculate();
    });

    calculate();
}

function getAssetName(key) {
    if (key === 'try') return 'Türk Lirası';
    if (key === 'dolar') return 'Amerikan Doları';
    if (key === 'euro') return 'Euro';
    const item = state.marketData.find(m => m.id === key);
    return item ? item.name : key;
}

// 6. Real-time Live Websocket Market Simulator
function startLiveWebsocketSimulator() {
    setInterval(() => {
        // Randomly pick 2 to 4 items to fluctuate price
        const count = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * state.marketData.length);
            const item = state.marketData[randomIndex];
            
            const deltaPercent = (Math.random() - 0.49) * 0.003; // +-0.15% shift
            const oldSell = item.sell;
            item.sell = Math.max(0.1, item.sell * (1 + deltaPercent));
            item.buy = Math.max(0.1, item.buy * (1 + deltaPercent));
            item.change += deltaPercent * 100;
            item.changeVal = item.sell - oldSell;

            // Trigger flash animation in table row
            const rowSell = document.getElementById(`row-sell-${item.id}`);
            const rowBuy = document.getElementById(`row-buy-${item.id}`);
            if (rowSell && rowBuy) {
                const flashClass = deltaPercent >= 0 ? 'flash-up' : 'flash-down';
                rowSell.classList.remove('flash-up', 'flash-down');
                rowBuy.classList.remove('flash-up', 'flash-down');
                void rowSell.offsetWidth; // Force reflow
                rowSell.classList.add(flashClass);
                rowBuy.classList.add(flashClass);
            }
        }

        // Check active user price alarms
        checkPriceAlarms();

        // Update UI
        renderTicker();
        renderHeroCards();
        renderGoldTable();

        // Update chart if current selected asset updated
        renderChart();
    }, 3000);
}

// Price Alarm Checker
function checkPriceAlarms() {
    state.alarms.forEach((alarm, idx) => {
        const item = state.marketData.find(m => m.id === alarm.asset);
        if (!item) return;

        if (item.sell >= alarm.targetPrice) {
            showToast(`🚨 ALARM TETİKLENDİ: ${item.name} hedef fiyatı geçti! Canlı: ${item.unit}${formatPrice(item.sell)}`);
            state.alarms.splice(idx, 1);
            state.saveAlarms();
            renderHeroCards();
        }
    });
}

// 7. Global Search & Autocomplete
function initSearch() {
    const input = document.getElementById('globalSearchInput');
    const dropdown = document.getElementById('searchResultsDropdown');

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            dropdown.classList.remove('active');
            return;
        }

        const matches = state.marketData.filter(m => 
            m.name.toLowerCase().includes(query) || 
            m.code.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="search-result-item" style="color: var(--text-muted);">Sonuç bulunamadı</div>';
        } else {
            dropdown.innerHTML = matches.map(m => `
                <div class="search-result-item" onclick="selectChartAsset('${m.id}'); document.getElementById('searchResultsDropdown').classList.remove('active');">
                    <div>
                        <strong>${m.name}</strong>
                        <span style="font-size: 11px; color: var(--text-muted); margin-left: 6px;">(${m.code})</span>
                    </div>
                    <div style="font-weight: 700; color: var(--gold-primary);">${m.unit}${formatPrice(m.sell)}</div>
                </div>
            `).join('');
        }
        dropdown.classList.add('active');
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Keyboard shortcut Ctrl + K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
        }
    });
}

// 8. Event Handlers & Modals
function initEvents() {
    // Category Tabs in Table
    document.querySelectorAll('#tableTabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#tableTabs .tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.activeCategoryTab = e.target.dataset.cat;
            renderGoldTable();
        });
    });

    // Favorites Modal
    const favModal = document.getElementById('favModal');
    const favModalBtn = document.getElementById('favModalBtn');
    const closeFavModal = document.getElementById('closeFavModal');

    favModalBtn.addEventListener('click', () => {
        renderFavModal();
        favModal.classList.add('active');
    });
    closeFavModal.addEventListener('click', () => favModal.classList.remove('active'));

    // Alarms Modal & Form
    const alarmModal = document.getElementById('alarmModal');
    const alarmModalBtn = document.getElementById('alarmModalBtn');
    const closeAlarmModal = document.getElementById('closeAlarmModal');
    const quickAlarmForm = document.getElementById('quickAlarmForm');

    alarmModalBtn.addEventListener('click', () => {
        renderAlarmModal();
        alarmModal.classList.add('active');
    });
    closeAlarmModal.addEventListener('click', () => alarmModal.classList.remove('active'));

    quickAlarmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const asset = document.getElementById('alarmAsset').value;
        const targetPrice = parseFloat(document.getElementById('alarmTargetPrice').value);
        if (!targetPrice) return;

        state.alarms.push({ asset, targetPrice, createdAt: new Date() });
        state.saveAlarms();
        document.getElementById('alarmTargetPrice').value = '';
        renderHeroCards();
        showToast('Fiyat alarmınız başarıyla oluşturuldu!');
    });
}

function renderFavModal() {
    const body = document.getElementById('favModalBody');
    if (state.favorites.length === 0) {
        body.innerHTML = '<p class="empty-state">Henüz favori enstrüman eklemediniz.</p>';
        return;
    }

    const items = state.marketData.filter(m => state.favorites.includes(m.id));
    body.innerHTML = items.map(m => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
            <div>
                <strong>${m.name}</strong>
                <span style="font-size: 11px; color: var(--text-muted); display: block;">${m.code}</span>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700;">${m.unit}${formatPrice(m.sell)}</div>
                <button style="color: var(--accent-danger); font-size: 11px; margin-top: 2px;" onclick="state.toggleFavorite('${m.id}'); renderFavModal();">Çıkar</button>
            </div>
        </div>
    `).join('');
}

function renderAlarmModal() {
    const body = document.getElementById('alarmModalBody');
    if (state.alarms.length === 0) {
        body.innerHTML = '<p class="empty-state">Aktif kurulmuş alarmınız bulunmuyor.</p>';
        return;
    }

    body.innerHTML = state.alarms.map((alarm, idx) => {
        const item = state.marketData.find(m => m.id === alarm.asset);
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                <div>
                    <strong>${item ? item.name : alarm.asset}</strong>
                    <span style="font-size: 11px; color: var(--text-muted); display: block;">Hedef: ${item ? item.unit : '₺'}${formatPrice(alarm.targetPrice)}</span>
                </div>
                <button style="color: var(--accent-danger); font-size: 11px;" onclick="state.alarms.splice(${idx}, 1); state.saveAlarms(); renderAlarmModal(); renderHeroCards();">Sil</button>
            </div>
        `;
    }).join('');
}

// Helpers
function formatPrice(val) {
    if (typeof val !== 'number') return '0.00';
    return val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info gold-text"></i> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function updateUI() {
    renderHeroCards();
    renderGoldTable();
}
