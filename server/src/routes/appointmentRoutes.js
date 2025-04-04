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
  getDoctorAppointments,
  getAllAppointments,
  payOnlineAppmnt,
} = require("../controller/appointmentController");
const appointmentRoutes = Router();

appointmentRoutes.post("/book",authentication,authorization("Patient"),bookAppointment);
appointmentRoutes.put("/reschedule",authentication,authorization("Patient","Doctor"),rescheduleAppointment)
appointmentRoutes.put('/completed',authentication,authorization("Doctor","Admin"),completeAppointment)
appointmentRoutes.put('/cancel',authentication,authorization("Patient","Doctor","Admin"),cancelAppointment)
appointmentRoutes.put("/payment/:appId",authentication,authorization("Patient"),payOnlineAppmnt)
appointmentRoutes.get("/patientAppointments",authentication,authorization("Patient"),getPatientAppointments)
appointmentRoutes.get("/doctorAppointments",authentication,authorization("Doctor"),getDoctorAppointments)
appointmentRoutes.get('/adminAppointments',authentication,authorization("Admin"),getAllAppointments)
module.exports = appointmentRoutes