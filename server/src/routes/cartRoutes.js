
const express = require("express");
const { getCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require("../controller/cartController");
const { authentication } = require("../middlewares/auths");
const router = express.Router();

router.get("/:userId", authentication, getCart);

router.post("/add", authentication, addToCart);

router.patch("/update", authentication, updateCartItem);

router.delete("/delete",authentication, deleteCartItem);
router.post('/clear',authentication,clearCart)

module.exports = router;
