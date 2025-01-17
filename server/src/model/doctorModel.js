const { default: mongoose, Types } = require("mongoose");

const docSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },

  speciality: {
    type: String,
    required: true,
  },

  qualification: {
    type: [String],
  },

  department: {
    type: String,
    required: true,
  },

  experience: {
    type: Number,
    required: true,
  },

  availableSlots: [
    {
     day:{
      type:String,
      required:true,

     },
     hours:{
      type:String,
      required:true,
     }
    },
  ],

  docPicture: {
    type: String,
  },

  doctorType: {
    type: String,
    enum: ["Specialist", "General"],
  },

  appointmentCharges: {
    type: String,
    required: true,
  },
});

const Doctor = mongoose.model("Doctor", docSchema);
module.exports = Doctor;
