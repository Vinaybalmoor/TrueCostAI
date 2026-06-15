
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    teamSize: {
        type: Number,
        required: true
    },
    primaryUseCase: {
        type: String,
        required: true
    },
    totalMonthlyWaste: {
        type: Number,
        required: true
    },
    totalAnnualSavings: {
        type: Number,
        required: true
    },
    // We can store the raw tool data for Credex's sales team to review later
    toolsAudited: {
        type: Array,
        default: []
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Lead', leadSchema);