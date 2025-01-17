const { Router } = require("express");
const {
  addPatient,
  viewPatientProfile,
  updatePatientProfile,
  deletePatient,
  viewDoctorSchedules,
} = require("../controller/patientController");
const { authentication, authorization } = require("../middlewares/auths");

const patientRoutes = Router();

patientRoutes.route("/register").post(addPatient);

patientRoutes
  .route("/profile")
  .get(authentication, authorization("Patient"), viewPatientProfile);

patientRoutes
  .route("/update-profile")
  .put(authentication, authorization("Patient"), updatePatientProfile);

patientRoutes
  .route("/delete-profile")
  .delete(authentication, authorization("Patient"), deletePatient);

  

module.exports = patientRoutes;
