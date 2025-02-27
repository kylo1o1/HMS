const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  createAppointment,

  updateAppointment,
  viewAppointments,
  viewSingleAppointment,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  getPatientAppointments,
} = require("../controller/appointmentController");
const appointmentRoutes = Router();

appointmentRoutes.post("/book",authentication,authorization("Patient"),bookAppointment);
appointmentRoutes.put("/reschedule",authentication,authorization("Patient","Doctor"),rescheduleAppointment)
appointmentRoutes.put('/completed',authentication,authorization,completeAppointment)
appointmentRoutes.put('/cancel',authentication,authorization("Patient","Doctor"),cancelAppointment)
appointmentRoutes.get("/patientAppointments",authentication,authorization("Patient"),getPatientAppointments)

module.exports = appointmentRoutes