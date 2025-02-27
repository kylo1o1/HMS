const { Router } = require("express");
const {
  login,
  logout,
  forgotPassword,
  verifyOTP,
  verifyToken,
} = require("../controller/generalController");
const { authentication } = require("../middlewares/auths");

const userRoutes = Router();

userRoutes.route("/login").post(login);

userRoutes.route("/logout").get(authentication, logout);

userRoutes.route("/forgot-password").post(forgotPassword).put(verifyOTP);
userRoutes.route("/auth/verify-token").get(verifyToken)
module.exports = userRoutes;
