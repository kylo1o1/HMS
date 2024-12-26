const { Router } = require("express");
const { addPatient } = require("../controller/patientController");


const patientRoutes = Router()


patientRoutes.route('/addPatient').post(addPatient)

module.exports = patientRoutes