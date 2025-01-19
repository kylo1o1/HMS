const { default: mongoose } = require("mongoose");
const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const { unsyncImage } = require("../util/syncUnsyncImages");
const Diagnosis = require("../model/diagnosisModel");
const Appointments = require("../model/appointmentModel");
const { hashPassword } = require("../util/hashPassword");

const getUserAndDoctor = async (userId) => {
  const user = await User.findById(userId);
  const doctor = await Doctor.findOne({ userId }).populate("userId");
  return { user, doctor };
};

exports.viewDoctorProfile = async (req, res) => {
  try {
    const userId = req.id;

    const { user, doctor } = await getUserAndDoctor(userId);

    if (!doctor || !user) {
      return res.status(404).json({
        success: false,
        message: "No Doctor Found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {}
};

exports.updateDoctor = async (req, res) => {
  try {
    const { name, email, gender, dateOfBirth, contact, ...extraUpdates } =
      req.body;

    const commonUpdates = { name, email, gender, dateOfBirth, contact };

    const userId = req.id;

    const { user, doctor } = await getUserAndDoctor(userId);

    if (!doctor || !user) {
      if (req.file) {
        unsyncImage(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "No Doctor Found",
      });
    }

    if (req.file) {
      const { path } = req.file;
      unsyncImage(doctor?.docPicture);
      doctor.docPicture = path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, commonUpdates, {
      new: true,
    });
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId },
      extraUpdates,
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json({
      success: true,
      message: "Doctor updated",
      updatedDoctor,
    });
  } catch (error) {
    if (req.file) {
      unsyncImage(req.file.path);
    }
    console.error("Updation Error :", error.message);

    return res.status(500).json({
      success: false,
      message: "Updation Error",
      error: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.id;


    const doctor = await User.findOne({ _id: userId, role: "Doctor" });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "No Doctor Found",
      });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "fill the form",
      });
    }

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password Has been updated",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To update Password",
      error: error.message,
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const userId = req.id;

    const { user, doctor } = await getUserAndDoctor(userId);

    if (!doctor || !user) {
      return res.status(404).json({
        success: false,
        message: "No Doctor Found",
      });
    }
    res.clearCookie("token");

    if (doctor.docPicture) {
      unsyncImage(doctor.docPicture);
    }

    await Doctor.findOneAndDelete({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Doctor Deleted",
    });
  } catch (error) {
    console.error("Deletion Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Deletion Error",
      error: error.message,
    });
  }
};

exports.addDiagnosisAndPrescription = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { appointmentId } = req.params;
    const uid = req.id;
    const { diagnosis, prescriptions, examination } = req.body;

    const doctor = await Doctor.findOne({ userId: uid });
    const appointment = await Appointments.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No Appointment Found",
      });
    }

    if (doctor._id.toString() !== appointment.doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access || This is not Your Appointment",
      });
    }

    if (!diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis not Found",
      });
    }

    const diagnosisReport = await Diagnosis.create({
      appointmentId,
      doctor: doctor._id,
      examination,
      diagnosis,
      prescriptions,
    });

    appointment.diagnosisId = diagnosisReport._id;
    appointment.status = "Completed";
    await appointment.save();

    session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Appointment has been Updated",
    });
  } catch (error) {
    session.abortTransaction();
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "diagnosis And prescription Error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

exports.editDiagnosis = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const uid = req.id;

    const { diagnosis, prescriptions, examination } = req.body;

    const doctor = await Doctor.findOne({ userId: uid });

    const diagnosisReport = await Diagnosis.findOne({ appointmentId });

    if (!diagnosisReport) {
      return res.status(404).json({
        success: false,
        message: "No diagnosis Found",
      });
    }

    if (doctor._id.toString() !== diagnosisReport.doctor.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access || This is not Your Appointment",
      });
    }

    await diagnosisReport.updateOne(req.body);

    return res.status(200).json({
      success: true,
      message: "Diagnosis Has been Updated",
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Diagnosis Updation Error",
      error: error.message,
    });
  }
};

exports.deleteDiagnosis = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const { appointmentId } = req.params;

    const uid = req.id;
    const { role } = req;

    const diagnosisReport = await Diagnosis.findOne({ appointmentId });
    const appointment = await Appointments.findById(appointmentId);

    if (!diagnosisReport || !appointment) {
      return res.status(404).json({
        success: false,
        message: "No Diagnosis || Appointment Found",
      });
    }

    if (role === "Doctor") {
      const doctor = await Doctor.findOne({ userId: uid });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor Not Found",
        });
      }

      if (diagnosisReport.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You have no authority To edit this ",
        });
      }
    }

    await diagnosisReport.deleteOne();

    appointment.diagnosis = null;
    await appointment.save();

    session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "Diagnosis Deleted",
    });
  } catch (error) {
    session.abortTransaction();
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Diagnosis Deletion Error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
