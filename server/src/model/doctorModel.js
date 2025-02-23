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

  availableSlots: [
    {
     day:{
      type:String,

     },
     startsAt:{
      type:String,
     },
     endsAt:{
      type:String
     }
    },
  ],

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
});

const Doctor = mongoose.model("Doctor", docSchema);
module.exports = Doctor;
