const mongoose = require("mongoose");
const { Types } = mongoose;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
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
          min: 1,
        },
        amount: {
          type: Number, 
        },
        itemTotal: { 
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
