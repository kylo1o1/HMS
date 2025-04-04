const { Router } = require("express");
const {
  login,
  logout,
  forgotPassword,
  verifyOTP,
  verifyToken,
  updatePassword,
} = require("../controller/generalController");
const { authentication } = require("../middlewares/auths");

const userRoutes = Router();

userRoutes.route("/login").post(login);

userRoutes.route("/logout").get(logout);

userRoutes.route("/send-otp").post(forgotPassword);
userRoutes.post("/verify-otp", verifyOTP);
userRoutes.route("/auth/verify-token").get(verifyToken);
userRoutes.put("/reset-password",updatePassword)
module.exports = userRoutes;
