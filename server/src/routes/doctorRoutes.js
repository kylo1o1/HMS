const { Router } = require("express");
const { authentication, authoriazation } = require("../middlewares/auths");
const { updateDoctor, viewDoctorProfile, deleteDoctor } = require("../controller/doctorController");
const uploadProfile = require("../middlewares/profileMulter");
const doctorRouter = Router()

doctorRouter.route('/view-profile').get(authentication,authoriazation('Doctor'),viewDoctorProfile)
doctorRouter.route('/update-profile').put(authentication,authoriazation('Doctor'),uploadProfile.single('pfp'),updateDoctor)
doctorRouter.route('/delete-profile').delete(authentication,authoriazation('Doctor'),deleteDoctor)

module.exports = doctorRouter