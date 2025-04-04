const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  updateDoctor,
  viewDoctorProfile,
  deleteDoctor,
  addDiagnosisAndPrescription,
  editDiagnosis,
  deleteDiagnosis,
  updatePassword,
  updateSchedule,
  getDoctorSchedule,
  getDoctorPatients,
  getPatientAppointments,
} = require("../controller/doctorController");
const uploadProfile = require("../middlewares/profileMulter");
const { sendOtp } = require("../controller/generalController");

const doctorRouter = Router();

doctorRouter.route("/send-Otp-doctor").post(sendOtp);
doctorRouter
  .route("/profile")
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
  .route("/update-password")
  .put(authentication, authorization("Doctor"), updatePassword);
doctorRouter
  .route("/delete-profile")
  .delete(authentication, authorization("Doctor"), deleteDoctor);

doctorRouter
  .route("/schedule")
  .get(authentication, authorization("Doctor"), getDoctorSchedule);
doctorRouter
  .route("/update-schedule")
  .put(authentication, authorization("Doctor"), updateSchedule);

doctorRouter
  .route("/patients")
  .get(authentication, authorization("Doctor"), getDoctorPatients);

doctorRouter
  .route("/my-appointments/:appointmentId")
  .post(authentication, authorization("Doctor"), addDiagnosisAndPrescription)
  .put(authentication, authorization("Doctor"), editDiagnosis)
  .delete(authentication, authorization("Doctor", "Admin"), deleteDiagnosis);

doctorRouter.get(
  "/patients/:patientId/appointments",
  authentication,
  authorization("Doctor"),
  getPatientAppointments
);
module.exports = doctorRouter;
