const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  generateAppointmentInvoice,
  generateMedicineInvoice,
} = require("../controller/invoiceController");

const invoiceRoutes = Router();

invoiceRoutes
  .route("/get-appointment-invoice/:appointmentId")
  .get(authentication, authorization("Admin"), generateAppointmentInvoice);
invoiceRoutes
  .route("/get-medicine-invoice/:billId")
  .get(authentication, authorization("Admin"), generateMedicineInvoice);
module.exports = invoiceRoutes;
