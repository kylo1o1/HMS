const { default: mongoose, Types } = require("mongoose");

const schema = new mongoose.Schema(
  {
    patientId: {
      type: Types.ObjectId,
      ref: "Patient",
    },
    medicines: [
      {
        medicineId: {
          type: Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const MedicineBill = mongoose.model("MedicineBill", schema);
module.exports = MedicineBill;
