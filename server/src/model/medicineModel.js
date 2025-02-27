const { default: mongoose } = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, min: [0] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  manufacturer: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      "Analgesic", "Antibiotic", "Antihistamine", "Antipyretic", 
      "Antidiabetic", "Cardiovascular", "Gastrointestinal", "Other"
    ] 
  },
  form: { 
    type: String, 
    required: true, 
    enum: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Other"] 
  },
  prescriptionRequired: { type: Boolean, default: false },
  expiryDate: { type: Date, required: true },
  image: { type: String, required: true },
  discount: { type: Number, default: 0 },
  refilledAt: { type: Date },
});

medicineSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock < 10) return "Low Stock";
  return "In Stock";
});

// Optionally, you can add an instance method to check if a quantity is available.
medicineSchema.methods.isQuantityAvailable = function(requestedQty) {
  return this.stock >= requestedQty;
};

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
