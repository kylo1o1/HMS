const express = require("express");
const router = express.Router();
const { getAllTestimonials, createTestimonial, getTestimonial, deleteTestimonial } = require("../controller/testimonialController");

router.route("/").get(getAllTestimonials).post(createTestimonial)
router.route('/:id').get(getTestimonial).delete(deleteTestimonial)

module.exports = router;
