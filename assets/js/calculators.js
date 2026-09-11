/**
 * ==========================================================================
 * ALTN NE KADAR - CALCULATOR ENGINE (ASSETS/JS/CALCULATORS.JS)
 * ==========================================================================
 */

const GoldCalculators = {
    /**
     * Gold Unit & TL Conversion Calculation
     * @param {string} assetId - Selected asset ID (e.g. 'gram', 'ceyrek')
     * @param {number} amount - Quantity
     * @param {string} rateType - 'sell' (Bozdurma) or 'buy' (Satın Alma)
     * @returns {object} calculation results
     */
    calculateGoldValue(assetId, amount, rateType = 'sell') {
        const qty = parseFloat(amount) || 0;
        const asset = window.GoldData ? window.GoldData.getAsset(assetId) : null;
        
        if (!asset) {
            return { totalTL: 0, unitPrice: 0, assetName: 'Bilinmiyor' };
        }

        // Use Buy rate if user is selling gold to market, or Sell rate if user is buying gold from market
        const unitPrice = rateType === 'sell' ? asset.buy : asset.sell;
        const totalTL = qty * unitPrice;

        return {
            amount: qty,
            assetName: asset.name,
            unitPrice: unitPrice,
            totalTL: totalTL,
            rateType: rateType
        };
    },

    /**
     * Profit / Loss Calculation
     * @param {number} buyPrice - Purchase price per unit (TL)
     * @param {number} quantity - Quantity bought
     * @param {number} currentPrice - Current market price per unit (TL)
     * @returns {object} profit & loss breakdown
     */
    calculateProfitLoss(buyPrice, quantity, currentPrice) {
        const pBuy = parseFloat(buyPrice) || 0;
        const qty = parseFloat(quantity) || 0;
        const pCurr = parseFloat(currentPrice) || 0;

        const totalInvestment = pBuy * qty;
        const currentTotalValue = pCurr * qty;
        const profitLossTL = currentTotalValue - totalInvestment;
        const profitLossPercent = totalInvestment > 0 ? (profitLossTL / totalInvestment) * 100 : 0;

        return {
            totalInvestment: totalInvestment,
            currentTotalValue: currentTotalValue,
            profitLossTL: profitLossTL,
            profitLossPercent: profitLossPercent,
            isProfit: profitLossTL >= 0
        };
    }
};

if (typeof window !== "undefined") {
    window.GoldCalculators = GoldCalculators;
}
