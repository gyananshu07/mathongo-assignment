const express = require("express");
const {
  signup,
  login,
  logout,
  verifyEmail,
  resetPassword,
  newResetPasswordToken,
} = require("../controllers/authController");
const authRoute = express.Router();

// SIGNUP/REGISTER
authRoute.post("/signup", signup);

// VERIFY OTP
authRoute.post("/verify", verifyEmail);

// LOGIN
authRoute.post("/login", login);

// LOGOUT
authRoute.post("/logout", logout);

// RESET LINK
authRoute.post("/reset", resetPassword);

// SET NEW PASSWORD
authRoute.get("/reset/:userId/:token", newResetPasswordToken);

module.exports = authRoute;
