const { Router } = require("express");
const { login, logout } = require("../controller/loginLogout");
const { authentication } = require("../middlewares/auths");

const userRoutes = Router();

userRoutes.route("/login").post(login);

userRoutes.route("/logout").get(authentication, logout);

module.exports = userRoutes;
