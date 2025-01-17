const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRouter = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const doctorRouter = require("./src/routes/doctorRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const medicineRoutes = require("./src/routes/medicineRoutes");
const pharmacistRoutes = require("./src/routes/pharmacistRoutes");
const invoiceRoutes = require("./src/routes/invoicesRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(cookieParser());
app.use(userRoutes);
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/pharmacist", pharmacistRoutes);
app.use("/medicine", medicineRoutes);
app.use("/invoice", invoiceRoutes);

module.exports = app;
