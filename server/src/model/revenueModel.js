const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  sourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  displayId: { type: String, requried: true },
  sourceType: { type: String, enum: ["Order", "Appointment"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;
