const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { validateRequest } = require("../util/validateRequest");
const { hashPassword } = require("../util/hashPassword");

exports.addAdmin = async (req, res) => {
  const { email, password, name, dateOfBirth, gender, contact } = req.body;

  console.log(contact);

  try {
    const role = "Admin";

    const requiredFields = [
      "email",
      "password",
      "name",
      "dateOfBirth",
      "gender",
      "contact",
    ];

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
      "email",
      "password",
      "name",
      "dateOfBirth",
      "gender",
      "contact",
      "speciality",
      "qualification",
      "department",
      "experience",
      "schedule",
      "appointmentCharges",
    ];

    const validateError = validateRequest(requiredFields, req.body);

    if (validateError) {
      return res.status(400).json({
        success: false,
        message: "Please Fill The form",
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

    const savedUser = await newUser.save();

    const doctor = await Doctor.create({
      userId: savedUser._id,
      ...additionalFields,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor registered",
    });
  } catch (error) {
    console.error("Doctor registration error", error.message);
    return res.status(500).json({
      success: false,
      message: "Doctor registration Error",
      error: error.message,
    });
  }
};
