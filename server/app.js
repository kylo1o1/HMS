const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRouter = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const doctorRouter = require("./src/routes/doctorRoutes");
const patientRoutes = require("./src/routes/patientRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(cookieParser())
app.use(userRoutes)
app.use('/admin',adminRouter)
app.use('/doctor',doctorRouter)
app.use('/patient',patientRoutes)

module.exports = app;
