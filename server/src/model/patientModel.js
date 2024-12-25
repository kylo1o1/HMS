const { default: mongoose, Types } = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  insuranceDetails: {
    provider: {
      String,
    },
    policyNumber: {
      String,
    },
    validUntil: {
      Date,
    },
  },

  emergencyContact: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },
  
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
