const { default: mongoose, Types } = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  reason:{
    type:String
  },
  notes: { type: String },
  
  hasVisited: {
    type: Boolean,
    default: false,
  },

  diagnosisId:{
    type:Types.ObjectId,
    ref:"Diagnosis"
  },

  fee:{
    type:Number
  },

  paymentStatus:{
    type:String,
    enum:["Pending","Completed"]
  },

  createdAt:{
    type:Date,
    default:Date.now()
  },
  updated:{
    type:Date,
    default:Date.now()
  }
});

const Appointments = mongoose.model("appointment", appointmentSchema);

module.exports = Appointments;
