const { Router } = require("express");
const { authentication, authorization } = require("../middlewares/auths");
const {
  addMedicine,
  ViewMedicines,
  updateMedicines,
  deleteMedicine,
  singleMedicine,
} = require("../controller/medicineController");
const uploadMedicine = require("../middlewares/medicineMulter");

const medicineRoutes = Router();

medicineRoutes
  .route("/add")
  .post(
    authentication,
    authorization("Admin", "Pharmacist"),
    uploadMedicine.single("med"),
    addMedicine
  );
medicineRoutes
  .route("/viewAll")
  .get(
    authentication,
    authorization("Admin", "Pharmacist", "Doctor"),
    ViewMedicines
  );

medicineRoutes
  .route("/:medId")
  .get(authentication, authorization("Pharmacist"), singleMedicine)
  .put(
    authentication,
    authorization("Admin", "Pharmacist"),
    uploadMedicine.single("med"),
    updateMedicines
  )
  .delete(authentication, authorization("Admin", "Pharmacist"), deleteMedicine);

module.exports = medicineRoutes;
