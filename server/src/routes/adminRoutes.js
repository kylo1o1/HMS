const { Router } = require("express");
const {
  addAdmin,
  addDoctor,
  updateAdmin,
  viewAdminProfile,
  deleteAdmin,
} = require("../controller/adminController");
const { authentication, authoriazation } = require("../middlewares/auths");
const uploadProfile = require("../middlewares/profileMulter");

const adminRouter = Router();

adminRouter.route("/addNew").post(addAdmin),
  adminRouter
    .route("/addNewDoctor")
    .post(
      authentication,
      authoriazation("Admin"),
      uploadProfile.single("pfp"),
      addDoctor
    );
adminRouter
  .route("/view-profile")
  .get(authentication, authoriazation("Admin"), viewAdminProfile);
adminRouter
  .route("/update-profile")
  .put(authentication, authoriazation("Admin"), updateAdmin);
adminRouter
  .route("/delete-profile")
  .delete(authentication, authoriazation("Admin"), deleteAdmin);

module.exports = adminRouter;
