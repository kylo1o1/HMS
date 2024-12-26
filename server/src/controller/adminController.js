const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { validateRequest } = require("../util/validateRequest");
const { hashPassword } = require("../util/hashPassword");
const { unsyncImage } = require("../util/syncUnsyncImages");

exports.addAdmin = async (req, res) => {
  const { email, password, name, dateOfBirth, gender, contact } = req.body;

  try {
    const role = "Admin";

    const requiredFields = ''
    const validateError = validateRequest(requiredFields, req.body);

    if (validateError) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
        error: validateError,
      });
    }

    const exUser = await User.findOne({ email });

    if (exUser) {
      return res.status(400).json({
        success: false,
        message: `${role} with this email already Exist!!`,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      role,
      contact,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered",
    });
  } catch (error) {
    console.error(`Admin registration error`, error.message);

    return res.status(500).json({
      success: false,
      message: `Admin registration Failed`,
      error: error.message,
    });
  }
};

exports.addDoctor = async (req, res) => {
  const {
    email,
    password,
    name,
    dateOfBirth,
    gender,
    contact,
    ...additionalFields
  } = req.body;

  try {
    const role = "Doctor";

    const requiredFields = [
      "speciality",
      "qualification",
      "department",
      "experience",
      "schedule",
      "appointmentCharges",
    ];

    const validateError = validateRequest(requiredFields, req.body);

    if (validateError) {
      if (req.file) {
        unsyncImage(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Please Fill The form",
        error: validateError,
      });
    }

    const exUser = await User.findOne({ email });

    if (exUser) {
      if (req.file) {
        unsyncImage(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: `${role} with this email already Exist!!`,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      role,
      contact,
    });

    const savedUser = await newUser.save();

    const doctor = await Doctor.create({
      userId: savedUser._id,
      ...additionalFields,
    });

    if (req.file) {
      doctor.docPicture = req?.file?.path;
    }
    await doctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor registered",
    });
  } catch (error) {
    if (req.file) {
      unsyncImage(req.file.path);
    }

    console.error("Doctor registration error", error.message);
    return res.status(500).json({
      success: false,
      message: "Doctor registration Error",
      error: error.message,
    });
  }
};

exports.viewAdminProfile = async (req, res) => {
  const uid = req.id;

  try {
    const admin = await User.findById(uid).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No Admin Found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Admin Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Admin Error",
      error: error.message,
    });
  }
};

exports.updateAdmin = async (req, res) => {
  const updates = req.body;
  try {
    const uid = req.id;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, updates).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Admin Updated",
    });
  } catch (error) {
    console.error("Updation Error :", error.message);

    return res.status(500).json({
      success: false,
      message: "Updation Error",
      error: error.message,
    });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const uid = req.id;

    const admin = await User.findById(uid);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No Admin found",
      });
    }

    await User.findByIdAndDelete(uid);
    return res.status(200).cookie("token", "").json({
      success: true,
      message: "Admin Deleted",
    });
  } catch (error) {
    console.error("Deletion Error :", error.message);

    return res.status(500).json({
      success: false,
      message: "Deletion Error",
      error: error.message,
    });
  }
};
