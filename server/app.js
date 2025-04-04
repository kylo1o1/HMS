const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRouter = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const doctorRouter = require("./src/routes/doctorRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const medicineRoutes = require("./src/routes/medicineRoutes");
const cartRoutes = require('./src/routes/cartRoutes')
const orderRoutes = require("./src/routes/orderRoutes")
const revenueRoutes = require("./src/routes/revenueRoutes")
const testimonialRoutes =  require('./src/routes/testimonialRoutes')
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use("/docProfiles", express.static("Public/media/profiles"));
app.use('/medicineImages', express.static("Public/media/medicines"))

app.use(cookieParser());
app.use(userRoutes);
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/medicine", medicineRoutes);
app.use("/cart",cartRoutes)
app.use("/order",orderRoutes)
app.use("/revenue",revenueRoutes)
app.use('/testimonial',testimonialRoutes)
module.exports = app;
