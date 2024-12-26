const Doctor = require("../model/doctorModel");
const User = require("../model/userModel");
const { unsyncImage } = require("../util/syncUnsyncImages");

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
