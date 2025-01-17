const { Router } = require("express");
const {
  addAdmin,
  addDoctor,
  updateAdmin,
  viewAdminProfile,
  deleteAdmin,
  viewDoctors,
  viewPatients,
  viewSinglePatient,
  viewSingleDoctor,
  addPharmacist,
} = require("../controller/adminController");
const { authentication, authorization } = require("../middlewares/auths");
const uploadProfile = require("../middlewares/profileMulter");

const adminRouter = Router();

adminRouter.route("/addNew").post(addAdmin);
adminRouter
  .route("/addNewDoctor")
  .post(
    authentication,
    authorization("Admin"),
    uploadProfile.single("pfp"),
    addDoctor
  );

adminRouter
  .route("/addPharmacist")
  .post(authentication, authorization("Admin"), addPharmacist);

adminRouter
  .route("/view-profile")
  .get(authentication, authorization("Admin"), viewAdminProfile);

adminRouter
  .route("/update-profile")
  .put(authentication, authorization("Admin"), updateAdmin);

adminRouter
  .route("/delete-profile")
  .delete(authentication, authorization("Admin"), deleteAdmin);

adminRouter
  .route("/view-doctors")
  .get(authentication, authorization("Admin"), viewDoctors);

adminRouter
  .route("/view-patients")
  .get(authentication, authorization("Admin"), viewPatients);

adminRouter
  .route("/view-patients/:id")
  .get(authentication, authorization("Admin", "Doctor"), viewSinglePatient);

adminRouter
  .route("/view-doctors/:id")
  .get(authentication, authorization("Admin", "Doctor"), viewSingleDoctor);


module.exports = adminRouter;
