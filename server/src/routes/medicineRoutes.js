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
    authorization("Admin",),
    uploadMedicine.single("medicineImage"),
    addMedicine
  );
medicineRoutes
  .route("/viewAll")
  .get(
    authentication,
    ViewMedicines
  );

medicineRoutes
  .route("/:medId")
  .get(authentication, authorization("Admin"), singleMedicine)
  .put(
    authentication,
    authorization("Admin"),
    uploadMedicine.single("medicineImage"),
    updateMedicines
  )
  .delete(authentication, authorization("Admin"), deleteMedicine);

module.exports = medicineRoutes;
