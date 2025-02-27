const Cart = require("../model/medicineCartModel");
const Medicine = require("../model/medicineModel");

/**
 * Utility: Recalculate the overall cart total.
 */
const recalculateTotalPrice = async (cart) => {
  const total = cart.medicines.reduce((acc, item) => {
    return acc + (Number(item.itemTotal) || 0);
  }, 0);
  cart.totalPrice = total;
  await cart.save();
  return cart;
};


exports.addToCart = async (req, res) => {
  try {
    const { userId, medicineId, quantity } = req.body;

    if (!userId || !medicineId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (userId === null || userId === undefined) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }
    
    // Fetch medicine details
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    
    // Calculate discounted price
    const discountPercentage = Number(medicine.discount) || 0;
    const discountedPrice = medicine.price * (1 - discountPercentage / 100);
    const newItemTotal = discountedPrice * qty;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, medicines: [] });
    } 

    const existingItem = cart.medicines.find(
      (item) => item.medicineId.toString() === medicineId
    );

    if (existingItem) {
      existingItem.quantity += qty;  // Add the new quantity to the existing quantity
      existingItem.itemTotal = discountedPrice * existingItem.quantity;
    } else {
      // If medicine is not already in the cart, add it
      cart.medicines.push({
        medicineId,
        quantity: qty,
        amount: discountedPrice,
        itemTotal: newItemTotal,
      });
    }

    // Recalculate the overall total and save the cart
    await recalculateTotalPrice(cart);

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.stack });
  }
};




exports.updateCartItem = async (req, res) => {
  try {
    const { userId, medicineId, quantity } = req.body;
    if (!userId || !medicineId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const newQuantity = Number(quantity);
    if (isNaN(newQuantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a number" });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    // Find the medicine item
    const item = cart.medicines.find((i) => i.medicineId.toString() === medicineId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Medicine not found in cart" });
    }
    
    // Fetch medicine to recalc discounted price
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    const discountPercentage = Number(medicine.discount) || 0;
    const discountedPrice = medicine.price * (1 - discountPercentage / 100);
    
    if (newQuantity < 1) {
      // Remove the item if quantity is less than 1.
        item.quantity -= newQuantity
      
    } else {
      // Update the quantity and recalc itemTotal
      item.quantity = newQuantity;
      item.amount = discountedPrice;
      item.itemTotal = discountedPrice * newQuantity;
    }
    
    await recalculateTotalPrice(cart);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


exports.deleteCartItem = async (req, res) => {
  try {
    const userId= req.id
    const { medicineId } = req.body;
    if (!userId || !medicineId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    // Remove the medicine from the cart
    cart.medicines = cart.medicines.filter(
      (i) => i.medicineId.toString() !== medicineId
    );
    
    await recalculateTotalPrice(cart);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/**
 * GET CART:
 *  - Expects userId as a URL parameter.
 *  - Returns the cart with populated medicine details.
 */
exports.getCart = async (req, res) => {
  try {
    const  userId  = req.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }
    
    const cart = await Cart.findOne({ userId }).populate("medicines.medicineId");
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Empty the cart
    cart.medicines = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully", data: cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
