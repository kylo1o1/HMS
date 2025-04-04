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
  appointmentId:{
    type:String,
    required:true
  },
  slotDate:{type:String,required:true},
  slotTime:{type:String,required:true},
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
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
