const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: [3, "Password must have atleast 3 chars"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor","Pharmacist"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    contact: {
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
