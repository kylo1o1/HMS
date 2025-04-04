const { error } = require("console");
const { sendOtp } = require("../libs/emailSevices");
const Doctor = require("../model/doctorModel");
const Otp = require("../model/OtpModel");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { verifyPassword, hashPassword } = require("../util/hashPassword");
const { generateToken } = require("../util/tokenGenerator");
const crypto = require("crypto");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter Email And Password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User Found",
      });
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Please enter a Valid Email and Password",
      });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    generateToken(req, res);
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login Error",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "User Logged Out successfull",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Logout Error",
      error: error.message,
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const doctor = await Doctor.findOne({ userId: user._id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });
    }

    const otp = crypto.randomInt(10000, 99999).toString();

      const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    await Otp.findOneAndUpdate(
      {
        email,
      },
      { email, otp, expiresAt },
      { upsert: true }
    );

    await sendOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "An Otp has been sent To your Email",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed To Send Otp",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not Found",
      });
    }

    const otp = crypto.randomInt(1000, 9999).toString();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await Otp.findOneAndUpdate(
      {
        email,
      },
      { otp, expiresAt },
      { upsert: true }
    );

    await sendOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "A token/OTP has been sent to your Email ",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To send Token/OTP",
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp,  } = req.body;

    if (!otp ) {
      return res.status(400).json({
        success: false,
        message: "Please fill the form",
      });
    }

    const existOtp = await Otp.findOne({ otp });
    if (!existOtp) {
      return res.status(404).json({
        success: false,
        message: "Invalid/Expired OTP",
      });
    }

    
    await existOtp.deleteOne();

    return res.status(200).json({
      success: true,
      message: "OTP Verified",
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update Password Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};


exports.verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Not Authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.clearCookie("token"); // Automatically clear expired token
    res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
};
