const { default: mongoose } = require("mongoose");
const Appointments = require("../model/appointmentModel");
const Doctor = require("../model/doctorModel");
const Patient = require("../model/patientModel");
const { checkAvailability } = require("../util/appoinmentUtils");

exports.createAppointment = async (req, res) => {
  try {
    const { date, doctorId, reason } = req.body;

    const userId = req.id;
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findOne({ userId });

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "No Doctor  Found",
      });
    }

    const isAvailable = checkAvailability(date, doctor.availableSlots);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available On this date",
      });
    }

    const appointment = new Appointments({
      doctorId,
      patientId: patient._id,
      date,
      reason,
    });

    const isVisited = await Appointments.find({
      patientId: patient._id,
      doctorId,
      _id: { $ne: appointment._id },
    });

    console.log(isVisited);

    if (isVisited.length !== 0) {
      appointment.hasVisited = true;
    }

    appointment.fee = doctor.appointmentCharges;
    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment has Been Scheduled",
    });
  } catch (error) {
    console.error("Appointment registration Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Appointment registration Error",
      error: error.message,
    });
  }
};
exports.viewAppointments = async (req, res) => {
  try {
    const userId = req.id;
    const { role } = req;

    let appointment;

    const doctorPopulate = {
      path: "doctorId",
      populate: {
        path: "userId",
        select: "-password",
      },
    };

    const patientPopulate = {
      path: "patientId",
      populate: {
        path: "userId",
        select: "-password",
      },
    };

    if (role === "Admin") {
      appointment = await Appointments.find()
        .populate(patientPopulate)
        .populate(doctorPopulate);
    } else if (role === "Patient") {
      const patient = await Patient.findOne({ userId }).select("_id");
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }
      appointment = await Appointments.find({
        patientId: patient._id,
      }).populate(doctorPopulate);
    } else if (role === "Doctor") {
      const doctor = await Doctor.findOne({ userId }).select("_id");
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
      appointment = await Appointments.find({ doctorId: doctor._id }).populate(
        patientPopulate
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    return res.status(200).json({
      success: true,
      appointments: appointment,
    });
  } catch (error) {
    console.error("Cannot View Appointments Due to:", error.message);
    return res.status(500).json({
      success: false,
      message: "Cannot View Appointments",
      error: error.message,
    });
  }
};

exports.viewSingleAppointment = async (req, res) => {
  try {
    const { aId } = req.params; // appointment Id
    const { role } = req;
    let appointment;

    const doctorPopulate = {
      path: "doctorId",
      populate: {
        path: "userId",
        select: "-password",
      },
    };

    const patientPopulate = {
      path: "patientId",
      populate: {
        path: "userId",
        select: "-password",
      },
    };

    
    console.log(await Appointments.find().populate("diagnosisId"));
    
    

    if (role === "Admin") {
      appointment = await Appointments.findById(aId)
        .populate(patientPopulate)
        .populate(doctorPopulate)
        .populate("diagnosisId");
    } else if (role === "Patient") {
      appointment = await Appointments.findById(aId)
        .populate(doctorPopulate)
        .populate("diagnosisId");
    } else if (role === "Doctor") {
      appointment = await Appointments.findById(aId)
        .populate(patientPopulate,"diagnosis")
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error while fetching Appointment",
      error: error.message,
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { type, date, reason } = req.body;
    const { aId } = req.params;

    let appointment = await Appointments.findById(aId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No Appointment Found",
      });
    }

    switch (type) {
      case "Reschedule": {
        const { availableSlots } = await Doctor.findById(appointment.doctorId);

        const isAvailable = checkAvailability(date, availableSlots);
        if (!isAvailable) {
          return res.status(400).json({
            success: false,
            message: "Doctor is not available at the given time",
          });
        }

        appointment.date = date;
        appointment.reason = reason;
        appointment.status = "Scheduled";
        await appointment.save();
        break;
      }
      case "Cancel": {
        appointment.status = "Cancelled";
        await appointment.save();
        break;
      }
      default: {
        return res.status(400).json({
          success: false,
          message: "Invalid Type of Updation",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Appointment has been ${
        type === "Reschedule" ? "Rescheduled" : "Cancelled"
      }`,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Appointment updation error",
      error: error.message,
    });
  }
};
