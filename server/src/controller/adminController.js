const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { validateRequest } = require("../util/validateRequest");
const { hashPassword } = require("../util/hashPassword");
const { unsyncImage } = require("../util/syncUnsyncImages");
const Patient = require("../model/patientModel");
const { default: mongoose } = require("mongoose");
const { sendLoginInfo } = require("../libs/emailSevices");


exports.addAdmin = async (req, res) => {
  const { email, password, name, dateOfBirth, gender, contact } = req.body;

  try {
    const role = "Admin";

    const requiredFields = "";
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
  const { email, name, gender, contact, dateOfBirth, ...additionalFields } = req.body;

  console.log(req.file);

  const session = await mongoose.startSession();
  session.startTransaction();
  const password = Math.random().toString(36).slice(-8);

  try {
    const role = "Doctor";

    const requiredFields = ["speciality", "qualification", "experience", "appointmentCharges"];
    const validateError = validateRequest(requiredFields, req.body);

    if (validateError) {
      if (req.file) unsyncImage(req.file.path);
      return res.status(400).json({ success: false, message: "Please Fill The form", error: validateError });
    }

    const exUser = await User.findOne({ email });

    if (exUser) {
      if (req.file) unsyncImage(req.file.path);
      return res.status(400).json({ success: false, message: `${role} with this email already exists!` });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create([{ name, email, password: hashedPassword, dateOfBirth, gender, role, contact }]);

    const savedUser = newUser[0];

    const doctorData = {
      userId: savedUser._id,
      ...additionalFields,
      shifts: [],
    };

    if (req.file) {
      doctorData.docPicture = req.file.path;
    }

    const newDoctor = await Doctor.create([doctorData]);

    await session.commitTransaction();
    await sendLoginInfo(email, password);

    return res.status(201).json({ success: true, message: "Doctor registered successfully", doctor: newDoctor[0] });

  } catch (error) {
    if (req.file) unsyncImage(req.file.path);

    await session.abortTransaction();
    console.error("Doctor registration error:", error.stack);

    return res.status(500).json({ success: false, message: "Doctor registration failed", error: error.message });

  } finally {
    session.endSession();
  }
};


exports.addPharmacist = async (req, res) => {
  const { email, password, name, dateOfBirth, gender, contact } = req.body;

  try {
    const role = "Pharmacist";

    const requiredFields = "";
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
      message: "Pharmacist registered",
    });
  } catch (error) {
    console.error(`Pharmacist registration error`, error.message);

    return res.status(500).json({
      success: false,
      message: `Admin registration Failed`,
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

exports.viewDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "-password");

    if (!doctors) {
      return res.status(404).json({
        success: false,
        message: "No Doctors Found",
      });
    }

    const noOfDoctors = doctors.length

    return res.status(200).json({
      success: true,
      doctors,
      noOfDoctors
    });
  } catch (error) {
    console.error("Error Fetching Doctors :", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching Doctor Error",
      error: error.message,
    });
  }
};

exports.viewPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("userId", "-password");

    const noOfPatients = patients.length

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Patients Found",
      });
    }

    return res.status(200).json({
      success: true,
      patients,
      noOfPatients
    });
  } catch (error) {
    console.error("Error Fetching Patients :", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching Patients Error",
      error: error.message,
    });
  }
};

exports.viewSinglePatient = async (req, res) => {
  try {
    const patId = req.params.id;

    console.log(req.params);

    const patient = await Patient.findById(patId).populate(
      "userId",
      "-password"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "No Patient Found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Error Fetching Patient Details :", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching Patients Details Error",
      error: error.message,
    });
  }
};

exports.viewSingleDoctor = async (req, res) => {
  try {
    const docId = req.params.id;

    const doctor = await Doctor.findById(docId).populate("userId", "-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "No Doctor Found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Error Fetching Doctor Details :", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching Doctor Details Error",
      error: error.message,
    });
  }
};
