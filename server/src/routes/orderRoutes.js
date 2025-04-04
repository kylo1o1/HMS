const express = require("express");
const router = express.Router();
const { authentication, authorization } = require("../middlewares/auths");
const {
  placeOrder,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  cancelOrderItem,
  getAllOrders,
  getUserOrders,
  payOrder,
} = require("../controller/orderController");

router.post("/place", authentication, authorization("Patient"), placeOrder);

router.get("/user", authentication, authorization("Patient"), getUserOrders);

router.get("/getAll", authentication, authorization("Admin"), getAllOrders);

router.put(
  "/cancelItem",
  authentication,
  authorization("Patient"),
  cancelOrderItem
);

router.put("/cancel/:ordId", authentication, authorization("Patient"), cancelOrder);

router.put(
  "/status/:id",
  authentication,
  authorization("Admin"),
  updateOrderStatus
);


module.exports = router;
