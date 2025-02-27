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

 
  experience: {
    type: Number,
    required: true,
  },

  shifts: {
    type: [
      {
        day: { type: String, required: true },
        startsAt: { type: String, default: "" }, 
        endsAt: { type: String, default: "" },
      },
    ],
    default: [], 
  },

  docPicture: {
    type: String,
  },

 about:{
  type:String,
  required:true
 },

appointmentCharges: {
    type: String,
    required: true,
  },

  hasVerified:{
    type:Boolean,
    default:false
  }
});

const Doctor = mongoose.model("Doctor", docSchema);
module.exports = Doctor;
