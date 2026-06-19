// controllers/auditController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const Lead = require("../models/Lead");
const pricingData = require("../PRICING_DATA.json");
const nodemailer = require("nodemailer");

// Import our new pure functions
const { validateInput, checkUseCaseAlignment, checkRedundancy, calculateOptimalTier } = require("../utils/auditRules");

const calculateAudit = async (req, res) => {
  // In your controller function

  if (!req.body || !req.body.tools || !Array.isArray(req.body.tools)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request. Provide an array of tool objects.",
    });
  }

  const { teamSize, primaryUseCase, tools } = req.body;
  let totalMonthlyWaste = 0;
  const receipt = [];

  // --- THE MODULAR MATH ENGINE ---
  tools.forEach((toolInput) => {
    const toolKey = toolInput.name.toLowerCase();
    const toolTruth = pricingData[toolKey];

    if (!toolTruth) return;
const planKey = Object.keys(toolTruth.tiers).find(
    key => key.toLowerCase() === toolInput.plan.toLowerCase()
);
    // 1. Strict Server-Side Validation
    const validation = validateInput(toolInput.monthlySpend, toolInput.seats, toolTruth.tiers[planKey]);
    if (!validation.isValid) {
      console.warn(`Skipping tool ${toolInput.name}: ${validation.error}`);
      return; 
    }

    let finalDecision = null;

    // 2. Logic Cascade 
    finalDecision = checkUseCaseAlignment(toolInput, primaryUseCase, toolTruth.category);
    
    if (!finalDecision) {
      finalDecision = checkRedundancy(toolInput, tools);
    }

    if (!finalDecision) {
      finalDecision = calculateOptimalTier(toolInput, toolTruth);
    }

    // 3. Calculate Savings
    const savings = toolInput.monthlySpend - finalDecision.optimalSpend;

    if (savings > 0) {
      totalMonthlyWaste += savings;
      receipt.push({
        tool: toolTruth.name,
        action: finalDecision.action,
        savings: savings,
        reason: finalDecision.reason,
      });
    }
  });

  // --- AI SUMMARY GENERATION (Cost Controlled) ---
  let executiveSummary = `We audited your AI stack and found $${totalMonthlyWaste} in monthly waste. Review the receipt below to optimize your spending.`;

  // Financial Gate: Only trigger LLM if waste is significant to save API costs
  if (totalMonthlyWaste > 100) {
    try {
      const prompt = `You are a financial auditor. A startup (Use Case: ${primaryUseCase}) is wasting $${totalMonthlyWaste}/mo on AI tools. Receipt: ${JSON.stringify(receipt)}. Write a punchy, professional 2-sentence executive summary telling the CEO why they are losing money. No greetings.`;
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      executiveSummary = result.response.text();
    } catch (error) {
      console.error("AI Generation failed:", error.message);
    }
  }

  // --- DATABASE SAVE ---
  // --- DATABASE SAVE ---
  try {
    // Only save if we actually have data we care about
    if (teamSize && primaryUseCase) { 
      const newLead = new Lead({
        email: req.body.email || "no-email@provided.com", // Provide a fallback if email is missing!
        teamSize: Number(teamSize) || 1, // <--- BULLETPROOF FIX: Forces a valid number
        primaryUseCase: primaryUseCase,
        totalMonthlyWaste: totalMonthlyWaste,
        totalAnnualSavings: totalMonthlyWaste * 12,
        toolsAudited: tools,
      });
      
      await newLead.save();
      console.log("Lead saved successfully!");
    }
  } catch (dbError) {
    console.error("Failed to save lead:", dbError.message);
  }

  // --- ASYNC EMAIL NOTIFICATION ---
  if (req.body.email && totalMonthlyWaste > 0) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"TrueCost AI" <${process.env.EMAIL_USER}>`,
        to: req.body.email,
        subject: "Your AI Spend Audit Results",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>AI Spend Audit Complete</h2>
            <p><strong>${executiveSummary}</strong></p>
            <p>You have an estimated <strong>$${totalMonthlyWaste}</strong> in monthly waste.</p>
            <p>Log back into your dashboard to view the full itemized receipt and start optimizing your stack.</p>
            <br/>
            <p>Best,</p>
            <p>The TrueCost AI Team</p>
          </div>
        `,
      };

      // Added AWAIT to catch silent email failures
      await transporter.sendMail(mailOptions);
      console.log(`Follow-up email sent to ${req.body.email}`);
    } catch (emailError) {
      console.error("Failed to send follow-up email:", emailError.message);
    }
  }

  res.status(200).json({
    success: true,
    executiveSummary: executiveSummary,
    heroMetrics: {
      totalMonthlyWaste: totalMonthlyWaste,
      totalAnnualSavings: totalMonthlyWaste * 12,
    },
    receipt: receipt,
  });
};

module.exports = { calculateAudit };