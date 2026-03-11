const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  revenue: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);