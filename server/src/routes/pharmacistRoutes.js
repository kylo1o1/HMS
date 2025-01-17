const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  createMedicineBill,
  updateMedicineBill,
  viewBills,
  view_A_Bill,
  deleteBill,
} = require("../controller/pharmacistController");

const pharmacistRoutes = Router();

pharmacistRoutes
  .route("/createBill")
  .post(
    authentication,
    authorization("Pharmacist", "Admin"),
    createMedicineBill
  );
pharmacistRoutes
  .route("/editBills")
  .put(authentication, authorization("Pharmacist"), updateMedicineBill);
pharmacistRoutes
  .route("/medicineBills")
  .get(authentication, authorization("Pharmacist", "Admin"), viewBills);

pharmacistRoutes
  .route("/medicineBills/:billId")
  .get(authentication, authorization("Admin", "Pharmacist"), view_A_Bill)
  .delete(authentication, authorization("Admin", "Pharmacist"),deleteBill);
module.exports = pharmacistRoutes;
