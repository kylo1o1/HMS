const Order = require("../model/orderModel");
const Cart = require("../model/medicineCartModel");
const Medicine = require("../model/medicineModel");
const generateUniqueId = require("../util/uniqueId");
const Revenue = require("../model/revenueModel");

exports.placeOrder = async (req, res) => {
  try {
    const { userId, paymentMethod } = req.body;
    if (!userId || !paymentMethod)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    const cart = await Cart.findOne({ userId }).populate(
      "medicines.medicineId"
    );
    if (!cart || cart.medicines.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const insufficientStock = cart.medicines.some(
      (item) => item.medicineId.stock < item.quantity
    );
    if (insufficientStock)
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for some medicines",
      });

    const bulkOperations = cart.medicines.map((item) => ({
      updateOne: {
        filter: { _id: item.medicineId._id },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    await Medicine.bulkWrite(bulkOperations);

    const orderId = await generateUniqueId("order");
    const order = await Order.create({
      orderId,
      userId,
      medicines: cart.medicines.map(
        ({ medicineId, quantity, amount, itemTotal }) => ({
          medicineId: medicineId._id,
          quantity,
          amount,
          itemTotal,
        })
      ),
      totalPrice: cart.totalPrice,
      status: "Pending",
      paymentStatus: "Paid",
      paymentMethod,
    });

    await Revenue.create({
      sourceId: order._id,
      displayId:order.orderId,
      sourceType: "Order",
      amount: order.totalPrice,
    });

    await Cart.findOneAndDelete({ userId });

    await Cart.deleteOne({ userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ userId }).populate(
      "medicines.medicineId"
    );

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await Order.findById(ordId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel this order" });
    }

    const bulkOperations = order.medicines.map((item) => ({
      updateOne: {
        filter: { _id: item.medicineId },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await Medicine.bulkWrite(bulkOperations);

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.cancelOrderItem = async (req, res) => {
  try {
    const { orderId, medicineId } = req.body;
    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel item from this order",
      });
    }

    const itemIndex = order.medicines.findIndex(
      (item) => item.medicineId.toString() === medicineId
    );
    if (itemIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in order" });

    // ✅ Restore stock for that item
    const item = order.medicines[itemIndex];
    await Medicine.findByIdAndUpdate(medicineId, {
      $inc: { stock: item.quantity },
    });

    // ✅ Remove item & recalculate total
    order.medicines.splice(itemIndex, 1);
    order.totalPrice = order.medicines.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    );

    if (order.medicines.length === 0) order.status = "Cancelled";
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Item removed from order", data: order });
  } catch (error) {
    console.error("Error cancelling item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("medicines.medicineId", "name price discount");

    const deliveredCount = orders.filter(
      (o) => o.status === "Delivered"
    ).length;
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const cancelledCount = orders.filter(
      (o) => o.status === "Cancelled"
    ).length;
    const confirmedCount = orders.filter(
      (o) => o.status === "Confirmed"
    ).length;

    res.status(200).json({
      success: true,
      data: orders,
      deliveredCount,
      pendingCount,
      cancelledCount,
      confirmedCount,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!["Pending", "Confirmed", "Shipped", "Delivered"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot update a cancelled order" });
    }

    if (
      status === "Cancelled" &&
      ["Pending", "Confirmed"].includes(order.status)
    ) {
      const bulkOperations = order.medicines.map((item) => ({
        updateOne: {
          filter: { _id: item.medicineId },
          update: { $inc: { stock: item.quantity } },
        },
      }));
      await Medicine.bulkWrite(bulkOperations);
      order.status = "Cancelled";
    } else {
      order.status = status;
    }

    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
