const { default: mongoose, Types } = require("mongoose");

const docSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },

  speciality: {
    type:String,
    required: true,
  },

  qualification: {
    type:   [String],
  },

  department: {
    type:String,
    required: true,
  },

  experience: {
    type:String,
    required: true,
  },

  schedule: {
    days: [{
      type: String,
    }],
    startsAt: {
      type: String,
    },
    endsAt: {
      type: String,
    },
  },

  docPicture: {
    type: String,
  },

  appointmentCharges: {
    type: String,
  },
});

const Doctor = mongoose.model("Doctor", docSchema);
module.exports = Doctor;
