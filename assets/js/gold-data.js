/**
 * ==========================================================================
 * ALTN NE KADAR - CENTRAL DATA LAYER (ASSETS/JS/GOLD-DATA.JS)
 * ==========================================================================
 * Note: Real API integrations will plug directly into the GoldData interface.
 * Demo mode indicator is enabled by default.
 */

const GoldData = {
    isDemo: true,
    dataSource: "Gösterge Kuru (Örnek Veri)",
    lastUpdate: "11 Eylül 2026 17:20",

    // Central Data Dictionary
    assets: {
        gram: {
            id: "gram",
            name: "Gram Altın",
            code: "GAU/TRY",
            buy: 3480.10,
            sell: 3485.40,
            change: 0.82,
            changeVal: 28.40,
            unit: "₺",
            karat: "24 Ayar",
            purity: "%99.9 (999.9 Milyem)",
            weight: "1.00 gram",
            slug: "gram-altin"
        },
        ceyrek: {
            id: "ceyrek",
            name: "Çeyrek Altın",
            code: "CEYREK",
            buy: 5620.00,
            sell: 5698.00,
            change: 0.75,
            changeVal: 42.00,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "1.75 gram (Brüt) / ~1.606 gram (Net Has)",
            slug: "ceyrek-altin"
        },
        yarim: {
            id: "yarim",
            name: "Yarım Altın",
            code: "YARIM",
            buy: 11240.00,
            sell: 11396.00,
            change: 0.72,
            changeVal: 84.00,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "3.50 gram (Brüt) / ~3.21 gram (Net Has)",
            slug: "yarim-altin"
        },
        tam: {
            id: "tam",
            name: "Tam Altın (Ziynet)",
            code: "TAM",
            buy: 22480.00,
            sell: 22750.00,
            change: 0.68,
            changeVal: 154.00,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "7.00 gram (Brüt) / ~6.42 gram (Net Has)",
            slug: "tam-altin"
        },
        cumhuriyet: {
            id: "cumhuriyet",
            name: "Cumhuriyet Altını",
            code: "CUMHURIYET",
            buy: 23150.00,
            sell: 23480.00,
            change: 0.90,
            changeVal: 210.00,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "7.216 gram (Brüt) / ~6.614 gram (Net Has)",
            slug: "cumhuriyet-altini"
        },
        ata: {
            id: "ata",
            name: "Ata Altın",
            code: "ATA",
            buy: 23160.00,
            sell: 23490.00,
            change: 0.88,
            changeVal: 205.00,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "7.216 gram (Brüt) / ~6.614 gram (Net Has)",
            slug: "ata-altin"
        },
        bilezik22: {
            id: "bilezik22",
            name: "22 Ayar Bilezik",
            code: "22AYAR",
            buy: 3180.50,
            sell: 3245.00,
            change: 0.78,
            changeVal: 25.10,
            unit: "₺",
            karat: "22 Ayar",
            purity: "%91.6 (916 Milyem)",
            weight: "1.00 gram (İşlenmiş)",
            slug: "22-ayar-bilezik"
        },
        ayar14: {
            id: "ayar14",
            name: "14 Ayar Altın",
            code: "14AYAR",
            buy: 1980.00,
            sell: 2090.00,
            change: 0.65,
            changeVal: 13.50,
            unit: "₺",
            karat: "14 Ayar",
            purity: "%58.5 (585 Milyem)",
            weight: "1.00 gram",
            slug: "14-ayar-altin"
        },
        ons: {
            id: "ons",
            name: "Ons Altın",
            code: "XAU/USD",
            buy: 2941.80,
            sell: 2942.50,
            change: 0.45,
            changeVal: 13.20,
            unit: "$",
            karat: "24 Ayar (Saf)",
            purity: "%99.99 (999.9 Milyem)",
            weight: "31.1034768 gram (1 Truva Ons)",
            slug: "ons-altin"
        }
    },

    // Public Data Getter
    getAllAssets() {
        return Object.values(this.assets);
    },

    getAsset(id) {
        return this.assets[id] || null;
    },

    // Format utility helper
    formatMoney(amount, symbol = "₺") {
        if (typeof amount !== "number" || isNaN(amount)) return "0.00 " + symbol;
        return amount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + symbol;
    }
};

// Freeze data interface baseline
if (typeof window !== "undefined") {
    window.GoldData = GoldData;
}
