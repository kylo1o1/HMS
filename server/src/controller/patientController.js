const Patient = require("../model/patientModel");
const User = require("../model/userModel");
const { hashPassword } = require("../util/hashPassword");
const { validateRequest } = require("../util/validateRequest");
const Doctor = require("../model/doctorModel");
const Appointments = require("../model/appointmentModel");
const { default: mongoose } = require("mongoose");
const Diagnosis = require("../model/diagnosisModel");

const getUserAndPatient = async (userId) => {
  const user = await User.findById(userId);
  const patient = await Patient.findOne({ userId }).populate(
    "userId",
    "-password"
  );
  return { user, patient };
};

exports.addPatient = async (req, res) => {
  const role = "Patient";

  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const { body } = req;

    const {
      name,
      email,
      password,
      gender,
      dateOfBirth,
      contact,
      ...additionalFields
    } = body;

    // const requiredFields = ["insuranceDetails", "emergencyContact"];

    const requiredFields = ""

    const validationError = validateRequest(requiredFields, body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Please Fill The form",
        error: validationError,
      });
    }

    console.log(additionalFields.insuranceDetails);

    const exPatient = await User.findOne({ email });

    if (exPatient) {
      return res.status(400).json({
        success: false,
        message: `${role} with this email already Exist!!`,
      });
    }

    const hashedPassword = await hashPassword(password);

    const commonFields = {
      name,
      email,
      password: hashedPassword,
      gender,
      contact,
      dateOfBirth,
      role,
    };

    const user = await User.create({
      ...commonFields,
    });

    const patient = await Patient.create({
      userId: user._id,
      ...additionalFields,
    });

    session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `${role} Registered !!`,
    });
  } catch (error) {
    session.abortTransaction();
    console.error("Patient registration error", error.message);
    return res.status(500).json({
      success: false,
      message: "Patient registration Error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

exports.viewPatientProfile = async (req, res) => {
  try {
    const userId = req.id;

    const { user, patient } = await getUserAndPatient(userId);

    if (!user || !patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OK",
      patient,
    });
  } catch (error) {
    console.error("Patient Profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Patient Profile error",
      error: error.message,
    });
  }
};

exports.updatePatientProfile = async (req, res) => {
  try {
    const userId = req.id;

    const { email, name, contact, gender, dateOfBirth, ...additionalFields } =
      req.body;

    const commonFields = {
      email,
      name,
      contact,
      gender,
      dateOfBirth,
    };

    const { user, patient } = await getUserAndPatient(userId);

    if (!user || !patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, commonFields, {
      new: true,
    });
    const updatedPatient = await Patient.findOneAndUpdate(
      { userId },
      additionalFields,
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json({
      success: true,
      message: "Profile Updated",
      updatedPatient,
    });
  } catch (error) {
    console.error("Patient Updation Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Patient Updation Error",
      error: error.message,
    });
  }
};

exports.deletePatient = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const userId = req.id;

    const { user, patient } = await getUserAndPatient(userId);

    if (!user || !patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not found",
      });
    }

    res.clearCookie("token");

    await Patient.findOneAndDelete({ userId });
    await User.findByIdAndDelete(userId);

    session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: "Patient Deleted",
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    console.error("Patient Deletion Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Patient Deletion Error",
      error: error.message,
    });
  }
};

exports.viewDoctorSchedules = async (req, res) => {
  try {
    const docId = req.params.id;

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Id not Found",
      });
    }

    const schedules = await Doctor.findOne({ _id: docId }).select(
      "availableSlots"
    );

    if (!schedules) {
      return res.status(404).json({
        success: false,
        message: "No Schedules Found",
      });
    }

    return res.status(200).json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.error("Error fetching Schedules:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching Schedules",
      error: error.message,
    });
  }
};
