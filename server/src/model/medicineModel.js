const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min:[0],
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
  },
  refilledAt: {
    type: Date,
  },
});

const Medicine = mongoose.model("Medicine", schema);
module.exports = Medicine;
