/**
 * ==========================================================================
 * ALTN NE KADAR - CENTRAL LIVE DATA LAYER (ASSETS/JS/GOLD-DATA.JS)
 * ==========================================================================
 */

// Price normalizer for strings, numbers, Turkish/US comma formats, and NaNs
function normalizePrice(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return (Number.isFinite(val) && val > 0) ? val : 0;
    let str = String(val).trim();
    if (!str) return 0;
    if (str.includes('.') && str.includes(',')) {
        if (str.indexOf('.') < str.indexOf(',')) {
            // Turkish format: 6.412,50 -> 6412.50
            str = str.replace(/\./g, '').replace(',', '.');
        } else {
            // US format: 6,412.50 -> 6412.50
            str = str.replace(/,/g, '');
        }
    } else if (str.includes(',')) {
        str = str.replace(',', '.');
    }
    const num = parseFloat(str);
    return (Number.isFinite(num) && num > 0) ? num : 0;
}

// Validate price: must be finite number > 0
function isValidPrice(val) {
    return typeof val === 'number' && Number.isFinite(val) && val > 0;
}

// Static Metadata Reference
const ASSET_METADATA = {
    gram: { id: "gram", name: "Gram Altın", code: "GAU/TRY", unit: "₺", karat: "24 Ayar", purity: "%99.9 (999.9 Milyem)", weight: "1.00 gram", slug: "gram-altin" },
    ceyrek: { id: "ceyrek", name: "Çeyrek Altın", code: "CEYREK", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "1.75 gram (Brüt) / ~1.606 gram (Net Has)", slug: "ceyrek-altin" },
    yarim: { id: "yarim", name: "Yarım Altın", code: "YARIM", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "3.50 gram (Brüt) / ~3.21 gram (Net Has)", slug: "yarim-altin" },
    tam: { id: "tam", name: "Tam Altın (Ziynet)", code: "TAM", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "7.00 gram (Brüt) / ~6.42 gram (Net Has)", slug: "tam-altin" },
    cumhuriyet: { id: "cumhuriyet", name: "Cumhuriyet Altını", code: "CUMHURIYET", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "7.216 gram (Brüt) / ~6.614 gram (Net Has)", slug: "cumhuriyet-altini" },
    ata: { id: "ata", name: "Ata Altın", code: "ATA", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "7.216 gram (Brüt) / ~6.614 gram (Net Has)", slug: "ata-altin" },
    bilezik22: { id: "bilezik22", name: "22 Ayar Bilezik", code: "22AYAR", unit: "₺", karat: "22 Ayar", purity: "%91.6 (916 Milyem)", weight: "1.00 gram (İşlenmiş)", slug: "22-ayar-bilezik" },
    ayar14: { id: "ayar14", name: "14 Ayar Altın", code: "14AYAR", unit: "₺", karat: "14 Ayar", purity: "%58.5 (585 Milyem)", weight: "1.00 gram", slug: "14-ayar-altin" },
    ons: { id: "ons", name: "Ons Altın", code: "XAU/USD", unit: "$", karat: "24 Ayar (Saf)", purity: "%99.99 (999.9 Milyem)", weight: "31.1034768 gram (1 Truva Ons)", slug: "ons-altin" }
};

// Direct Primary Mapping Table for Truncgil API
const PRIMARY_TRUNCGIL_MAP = {
    gram: "GRA",
    ceyrek: "CEYREKALTIN",
    yarim: "YARIMALTIN",
    tam: "TAMALTIN",
    cumhuriyet: "CUMHURIYETALTINI",
    ata: "ATAALTIN",
    bilezik22: "YIA",
    ayar14: "14AYARALTIN"
};

// Primary Provider: Truncgil (8 Turkish gold assets + USD + EUR) + Gold API (Ons Altın XAU/USD)
const PrimaryGoldProvider = {
    name: "Kapalıçarşı Piyasa Verileri (Truncgil & Gold API)",
    async fetchPrices() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        try {
            const [truncRes, xauRes] = await Promise.all([
                fetch("https://finans.truncgil.com/v4/today.json", { cache: "no-store", signal: controller.signal }),
                fetch("https://api.gold-api.com/price/XAU", { cache: "no-store", signal: controller.signal }).catch(() => null)
            ]);
            clearTimeout(timeoutId);

            if (!truncRes.ok) throw new Error("Truncgil API HTTP error " + truncRes.status);
            const truncData = await truncRes.json();
            if (!truncData || typeof truncData !== "object" || !truncData.GRA) {
                throw new Error("Invalid payload structure from Truncgil API");
            }

            let xauPrice = 0;
            if (xauRes && xauRes.ok) {
                try {
                    const xauData = await xauRes.json();
                    xauPrice = normalizePrice(xauData.price);
                } catch (e) {
                    xauPrice = 0;
                }
            }

            return { truncData, xauPrice };
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }
};

// Fallback Provider: Gold API (XAU) + Frankfurter (USD/TRY, EUR/TRY)
const FallbackGoldProvider = {
    name: "Gösterge Kuru (Gold API & Frankfurter)",
    async fetchPrices() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        try {
            const [xauRes, fxRes] = await Promise.all([
                fetch("https://api.gold-api.com/price/XAU", { cache: "no-store", signal: controller.signal }),
                fetch("https://api.frankfurter.app/latest?from=USD&to=TRY,EUR", { cache: "no-store", signal: controller.signal })
            ]);
            clearTimeout(timeoutId);
            if (!xauRes.ok) throw new Error("Gold API HTTP " + xauRes.status);
            if (!fxRes.ok) throw new Error("Frankfurter HTTP " + fxRes.status);

            const xauData = await xauRes.json();
            const fxData = await fxRes.json();

            const xauUsd = normalizePrice(xauData.price);
            const usdTry = normalizePrice(fxData.rates && fxData.rates.TRY);
            const eurTry = normalizePrice(fxData.rates && fxData.rates.EUR);

            if (!isValidPrice(xauUsd) || !isValidPrice(usdTry)) {
                throw new Error("Invalid prices from Fallback APIs");
            }

            return { xauUsd, usdTry, eurTry };
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }
};

// LocalStorage Cache Manager
const CACHE_KEY = "altn_live_market_data";
const CacheManager = {
    save(mode, assets, dataSource, lastUpdateStr) {
        try {
            const payload = {
                mode: mode,
                assets: assets,
                dataSource: dataSource,
                lastUpdateStr: lastUpdateStr,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("GoldData Cache save failed:", e);
        }
    },
    load() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.assets || !data.timestamp) return null;
            return data;
        } catch (e) {
            return null;
        }
    },
    isValid(cacheData) {
        if (!cacheData) return false;
        const now = Date.now();
        const age = now - cacheData.timestamp;
        const ttl = cacheData.mode === "live" ? 60000 : 300000;
        return age < ttl;
    }
};

const GoldData = {
    dataMode: "live", // "live" | "fallback" | "offline"
    dataSource: "Kapalıçarşı Piyasa Verileri",
    lastUpdateStr: "-",
    lastUpdateTimestamp: null,
    noticeMessage: "",
    isFallback: false,
    assets: {},
    subscribers: [],
    intervalId: null,

    init() {
        this.refresh();
        this.setupVisibilityListener();
        this.startPolling();
    },

    async refresh() {
        // Try Primary
        try {
            const primaryRes = await PrimaryGoldProvider.fetchPrices();
            this.processPrimaryData(primaryRes);
            return;
        } catch (errPrimary) {
            console.warn("Primary API failed, switching to Fallback API:", errPrimary.message);
        }

        // Try Fallback
        try {
            const fallbackData = await FallbackGoldProvider.fetchPrices();
            this.processFallbackData(fallbackData);
            return;
        } catch (errFallback) {
            console.warn("Fallback API failed, switching to Offline Cache:", errFallback.message);
        }

        // Try Cache
        const cached = CacheManager.load();
        if (cached && cached.assets) {
            this.dataMode = "offline";
            this.isFallback = true;
            this.dataSource = (cached.dataSource || "Kayıtlı Veri") + " (Son Kayıtlı)";
            this.lastUpdateStr = cached.lastUpdateStr || "Bilinmiyor";
            this.noticeMessage = "Fiyat verisi şu anda güncellenemiyor. Son kayıtlı fiyatlar gösteriliyor.";
            this.assets = cached.assets;
            this.notifySubscribers();
        } else {
            this.dataMode = "offline";
            this.isFallback = true;
            this.dataSource = "Servis Dışı";
            this.noticeMessage = "Fiyat verisi şu anda alınamıyor.";
            this.notifySubscribers();
        }
    },

    processPrimaryData({ truncData, xauPrice }) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const dateStr = now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
        this.lastUpdateStr = `${dateStr} ${timeStr}`;
        this.lastUpdateTimestamp = now.getTime();
        this.dataMode = "live";
        this.isFallback = false;
        this.dataSource = PrimaryGoldProvider.name;
        this.noticeMessage = "";

        const usdItem = truncData.USD || {};
        const usdSell = normalizePrice(usdItem.Selling);
        const usdBuy = normalizePrice(usdItem.Buying);

        const newAssets = {};

        for (const [id, meta] of Object.entries(ASSET_METADATA)) {
            let buy = 0;
            let sell = 0;
            let change = 0;

            if (id === "ons") {
                // Ons Altın: Use direct Gold API XAU/USD price if valid
                if (isValidPrice(xauPrice)) {
                    buy = xauPrice;
                    sell = xauPrice;
                } else {
                    // Fallback to calculation from Gram/USD if Gold API unavailable
                    const graSell = normalizePrice((truncData.GRA || {}).Selling);
                    const graBuy = normalizePrice((truncData.GRA || {}).Buying);
                    if (isValidPrice(graSell) && isValidPrice(usdSell)) {
                        sell = (graSell / usdSell) * 31.1034768;
                    }
                    if (isValidPrice(graBuy) && isValidPrice(usdBuy)) {
                        buy = (graBuy / usdBuy) * 31.1034768;
                    }
                }
                change = normalizePrice((truncData.GRA || {}).Change);
            } else {
                // Turkish gold assets mapped directly via PRIMARY_TRUNCGIL_MAP
                const apiKey = PRIMARY_TRUNCGIL_MAP[id];
                const item = truncData[apiKey] || {};
                buy = normalizePrice(item.Buying);
                sell = normalizePrice(item.Selling);
                change = normalizePrice(item.Change);
            }

            const hasValidBuy = isValidPrice(buy);
            const hasValidSell = isValidPrice(sell);

            newAssets[id] = {
                ...meta,
                buy: hasValidBuy ? buy : (hasValidSell ? sell : 0),
                sell: hasValidSell ? sell : (hasValidBuy ? buy : 0),
                change: change,
                changeVal: 0,
                isIndicator: false,
                isValid: hasValidBuy || hasValidSell
            };
        }

        this.assets = newAssets;
        CacheManager.save("live", this.assets, this.dataSource, this.lastUpdateStr);
        this.notifySubscribers();
    },

    processFallbackData({ xauUsd, usdTry, eurTry }) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const dateStr = now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
        this.lastUpdateStr = `${dateStr} ${timeStr}`;
        this.lastUpdateTimestamp = now.getTime();
        this.dataMode = "fallback";
        this.isFallback = true;
        this.dataSource = FallbackGoldProvider.name;
        this.noticeMessage = "Canlı piyasa verisi geçici olarak alınamadı. Gösterge fiyat gösteriliyor.";

        const gramGoldUSD = xauUsd / 31.1034768;
        const gramGoldTRY = gramGoldUSD * usdTry;

        const prevCache = CacheManager.load();
        const prevAssets = prevCache ? prevCache.assets : null;

        const newAssets = {};

        for (const [id, meta] of Object.entries(ASSET_METADATA)) {
            let indicatorPrice = 0;

            if (id === "gram") indicatorPrice = gramGoldTRY;
            else if (id === "ceyrek") indicatorPrice = gramGoldTRY * 1.75 * 0.916;
            else if (id === "yarim") indicatorPrice = gramGoldTRY * 3.50 * 0.916;
            else if (id === "tam") indicatorPrice = gramGoldTRY * 7.00 * 0.916;
            else if (id === "cumhuriyet") indicatorPrice = gramGoldTRY * 7.216 * 0.916;
            else if (id === "ata") indicatorPrice = gramGoldTRY * 7.216 * 0.916;
            else if (id === "bilezik22") indicatorPrice = gramGoldTRY * 0.916;
            else if (id === "ayar14") indicatorPrice = gramGoldTRY * 0.585;
            else if (id === "ons") indicatorPrice = xauUsd;

            const validIndPrice = isValidPrice(indicatorPrice) ? indicatorPrice : 0;

            let changePercent = 0;
            if (prevAssets && prevAssets[id] && isValidPrice(prevAssets[id].sell)) {
                const oldVal = prevAssets[id].sell;
                changePercent = ((validIndPrice - oldVal) / oldVal) * 100;
            }

            newAssets[id] = {
                ...meta,
                buy: validIndPrice,
                sell: validIndPrice,
                change: changePercent,
                changeLabel: "Son Güncellemeye Göre Değişim",
                isIndicator: true,
                isValid: validIndPrice > 0
            };
        }

        this.assets = newAssets;
        CacheManager.save("fallback", this.assets, this.dataSource, this.lastUpdateStr);
        this.notifySubscribers();
    },

    startPolling() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                this.refresh();
            }
        }, 60000);
    },

    setupVisibilityListener() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                const now = Date.now();
                if (!this.lastUpdateTimestamp || (now - this.lastUpdateTimestamp > 30000)) {
                    this.refresh();
                }
                this.startPolling();
            } else {
                if (this.intervalId) clearInterval(this.intervalId);
            }
        });
    },

    getAsset(id) {
        return this.assets[id] || null;
    },

    getAllAssets() {
        return Object.values(this.assets);
    },

    getPrices() {
        return this.assets;
    },

    getMode() {
        return this.dataMode; // "live" | "fallback" | "offline"
    },

    getLastUpdated() {
        return this.lastUpdateStr;
    },

    getDataSource() {
        return this.dataSource;
    },

    getNoticeMessage() {
        return this.noticeMessage;
    },

    formatMoney(amount, symbol = "₺") {
        if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return "0.00 " + symbol;
        return amount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + symbol;
    },

    subscribe(fn) {
        if (typeof fn === "function") {
            this.subscribers.push(fn);
            if (Object.keys(this.assets).length > 0) {
                fn(this);
            }
        }
    },

    onReady(fn) {
        this.subscribe(fn);
    },

    notifySubscribers() {
        this.subscribers.forEach(fn => {
            try { fn(this); } catch (e) { console.error("GoldData subscriber error:", e); }
        });
    }
};

if (typeof window !== "undefined") {
    window.GoldData = GoldData;
    document.addEventListener("DOMContentLoaded", () => {
        GoldData.init();
    });
}
