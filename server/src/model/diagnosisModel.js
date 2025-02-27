const { default: mongoose, Types } = require("mongoose");

const schema = new mongoose.Schema({
  patientId: {
    type: Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointmentId: {
    type: Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctor: {
    type: Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  

  diagnosis: {
    type: String,
  },

  prescriptions: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Diagnosis = mongoose.model("Diagnosis", schema);
module.exports = Diagnosis;
