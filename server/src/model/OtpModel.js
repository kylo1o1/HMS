const { default: mongoose, Types } = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
