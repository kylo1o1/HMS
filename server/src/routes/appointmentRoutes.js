const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  createAppointment,

  updateAppointment,
  viewAppointments,
  viewSingleAppointment,
} = require("../controller/appointmentController");
const { getAppointmentInvoice } = require("../controller/invoiceController");
const appointmentRoutes = Router();

appointmentRoutes
  .route("/post")
  .post(authentication, authorization("Patient"), createAppointment);
appointmentRoutes
  .route("/viewAll")
  .get(
    authentication,
    authorization("Patient", "Doctor", "Admin"),
    viewAppointments
  );
appointmentRoutes
  .route("/:aId")
  .get(
    authentication,
    authorization("Admin", "Patient", "Doctor"),
    viewSingleAppointment
  )
  .put(authentication, authorization("Admin", "Patient"), updateAppointment);

module.exports = appointmentRoutes;
