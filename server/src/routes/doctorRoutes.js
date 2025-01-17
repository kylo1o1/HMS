const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  updateDoctor,
  viewDoctorProfile,
  deleteDoctor,
  addDiagnosisAndPrescription,
  editDiagnosis,
  deleteDiagnosis,
} = require("../controller/doctorController");
const uploadProfile = require("../middlewares/profileMulter");

const doctorRouter = Router();

doctorRouter
  .route("/view-profile")
  .get(authentication, authorization("Doctor"), viewDoctorProfile);
doctorRouter
  .route("/update-profile")
  .put(
    authentication,
    authorization("Doctor"),
    uploadProfile.single("pfp"),
    updateDoctor
  );
doctorRouter
  .route("/delete-profile")
  .delete(authentication, authorization("Doctor"), deleteDoctor);

doctorRouter
  .route("/my-appointments/:appointmentId")
  .post(authentication, authorization("Doctor"), addDiagnosisAndPrescription)
  .put(authentication, authorization("Doctor"), editDiagnosis)
  .delete(authentication,authorization("Doctor","Admin"),deleteDiagnosis)
module.exports = doctorRouter;
