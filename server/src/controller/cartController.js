const { isNumber } = require("razorpay/dist/utils/razorpay-utils");
const Cart = require("../model/medicineCartModel");
const Medicine = require("../model/medicineModel");

const recalculateTotalPrice = async (cart) => {
  if (!Array.isArray(cart.medicines)) {
    console.error("Error: cart.medicines is not an array", cart.medicines);
    cart.medicines = [];
  }

  let subtotal = 0;
  let totalDiscount = 0;

  cart.medicines.forEach((item) => {
    const price = Number(item.medicineId?.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const originalPrice = price * quantity;
    const discountedPrice = Number(item.itemTotal) || 0;

    subtotal += originalPrice;
    totalDiscount += originalPrice - discountedPrice;
  });

  const grandTotal = subtotal - totalDiscount;

  if (isNaN(subtotal) || isNaN(totalDiscount) || isNaN(grandTotal)) {
    console.error("Error: NaN detected in total calculations", {
      subtotal,
      totalDiscount,
      grandTotal,
    });
    return null; // Prevent saving NaN values
  }

  cart.subtotal = subtotal;
  cart.totalDiscount = totalDiscount;
  cart.totalPrice = grandTotal;

  await cart.save();

  return cart;
};

exports.addToCart = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.id;

    if (!userId || !medicineId || quantity === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    if (medicine.stock < qty) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock available" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, medicines: [] });
    }

    const discountedPrice =
      medicine.price - (medicine.price * medicine.discount) / 100;

    const existingItem = cart.medicines.find(
      (item) => item.medicineId.toString() === medicineId
    );

    if (existingItem) {
      if (medicine.stock < existingItem.quantity + qty) {
        return res
          .status(400)
          .json({ success: false, message: "Not enough stock available" });
      }
      existingItem.quantity += qty;
      existingItem.itemTotal = discountedPrice * existingItem.quantity;
    } else {
      cart.medicines.push({
        medicineId,
        quantity: qty,
        amount: discountedPrice,
        itemTotal: discountedPrice * qty,
      });
    }
    console.log(cart);


    await recalculateTotalPrice(cart);
    
    await cart.populate("medicines.medicineId");
    res.status(200).json({
      success: true,
      data: {
        cart,
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        grandTotal: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
   const  { quantity } = req.body;
    const medicineId = req.params.itemId
    const userId = req.id;
    if (!userId || !medicineId || quantity === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newQuantity = Number(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.medicines.find(
      (i) => i.medicineId.toString() === medicineId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found in cart" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    if (newQuantity > medicine.stock) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock available" });
    }

    const discountedPrice =
      medicine.price - (medicine.price * medicine.discount) / 100;
    item.quantity = newQuantity;
    item.itemTotal = discountedPrice * newQuantity;

    await recalculateTotalPrice(cart);
    res.status(200).json({
      success: true,
      data: {
        cart,
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        grandTotal: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const userId = req.id;
    const { medicineId } = req.body;
    if (!userId || !medicineId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Remove the medicine from the cart
    cart.medicines = cart.medicines.filter(
      (i) => i.medicineId.toString() !== medicineId
    );

    await recalculateTotalPrice(cart);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    let cart = await Cart.findOne({ userId }).populate(
      "medicines.medicineId"
    );
    
    // ✅ If cart doesn't exist, return an empty cart
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          cart: [],
          subtotal: 0,
          totalDiscount: 0,
          grandTotal: 0,
        },
      });
    }

    // ✅ Return the cart if it exists
    res.status(200).json({
      success: true,
      data: {
        cart,
        subtotal: cart.subtotal,
        totalDiscount: cart.totalDiscount,
        grandTotal: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Empty the cart
    cart.medicines = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
