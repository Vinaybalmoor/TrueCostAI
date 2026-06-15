// utils/auditRules.js

const validateInput = (monthlySpend, seats, planData) => {
    if (monthlySpend < 0) return { isValid: false, error: "Monthly spend cannot be negative." };
    if (seats < 1) return { isValid: false, error: "Seats must be greater than 0." };
    if (!planData) return { isValid: false, error: "Invalid plan selected." };
    return { isValid: true };
};

const checkUseCaseAlignment = (toolInput, primaryUseCase, toolCategory) => {
    if (toolCategory !== "general" && toolCategory !== primaryUseCase) {
        return {
            action: "CANCEL SUBSCRIPTION",
            optimalSpend: 0,
            reason: `Your primary use case is ${primaryUseCase}. You do not need specialized ${toolCategory} tools.`
        };
    }
    return null;
};

const checkRedundancy = (toolInput, toolsArray) => {
    const hasCopilot = toolsArray.some((t) => t.name.toLowerCase() === "github_copilot");
    
    // Explicitly targets known redundancies instead of broad categories
    if (toolInput.name.toLowerCase() === "cursor" && hasCopilot) {
        return {
            action: "CANCEL AND CONSOLIDATE",
            optimalSpend: 0,
            reason: "Redundant capability. Your team is already paying for GitHub Copilot."
        };
    }
    return null; 
};

const calculateOptimalTier = (toolInput, toolTruth) => {
    let optimalRetailPrice = toolInput.monthlySpend; 
    let action = "OPTIMIZED";
    let reason = "You are spending efficiently on this tool.";

    const currentPlanDetails = toolTruth.tiers[toolInput.plan];
    
    // Cascade 1: Find optimal retail tier
    if (currentPlanDetails && toolInput.seats < currentPlanDetails.minSeats) {
        const teamPlan = toolTruth.tiers["team"];
        if (teamPlan) {
            optimalRetailPrice = teamPlan.pricePerSeat * toolInput.seats;
            action = "DOWNGRADE TIER";
            reason = `Over-provisioned. You do not meet the minimum ${currentPlanDetails.minSeats} seats for ${toolInput.plan}. Downgrading to Team tier.`;
        }
    }

    // Cascade 2: Compare against Credex wholesale
    const credexWholesalePrice = toolTruth.credexDiscountPrice * toolInput.seats;
    
    if (credexWholesalePrice < optimalRetailPrice) {
         action = action === "OPTIMIZED" ? "OPTIMIZE PRICING" : `${action} & SWITCH TO WHOLESALE`;
         reason = `${reason} Furthermore, you could save money by accessing wholesale vendor pricing.`;
         optimalRetailPrice = credexWholesalePrice;
    }

    return { action, optimalSpend: optimalRetailPrice, reason };
};

module.exports = { validateInput, checkUseCaseAlignment, checkRedundancy, calculateOptimalTier };