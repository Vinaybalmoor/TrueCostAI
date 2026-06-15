require("dotenv").config();
const pricingData = require("./PRICING_DATA.json");
const express = require("express");
const cors = require("cors");
const { calculateAudit } = require("./controllers/auditController");
const app = express();
const PORT = process.env.PORT || 5000;
const {connectDB} = require('./db');

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
connectDB();
app.use(express.json());
app.get("/api/available-tools", (req, res) => {
    try {
        // We only send the ID (the json key) and the formal Name.
        // We do NOT send the pricing data itself to the frontend for security.
        const toolsList = Object.keys(pricingData).map((key) => {
            return {
                id: key, // e.g., "github_copilot"
                name: pricingData[key].name // e.g., "GitHub Copilot"
            };
        });

        res.status(200).json({
            success: true,
            data: toolsList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching tools", error: error.message });
    }
});
app.post("/api/audit", calculateAudit);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
