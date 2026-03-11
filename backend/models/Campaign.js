const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "paused"],
    default: "active"
  },
  budget: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    required: true
  },
  revenue: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Campaign", CampaignSchema);