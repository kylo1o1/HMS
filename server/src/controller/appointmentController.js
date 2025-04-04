const Doctor = require("../model/doctorModel");
const Patient = require("../model/patientModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");
const Appointments = require("../model/appointmentModel");
const generateUniqueId = require("../util/uniqueId");
const Revenue = require("../model/revenueModel");



const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, slotDate, slotTime, reason, fee } = req.body;
    const patientId = req.id;

    if (!doctorId || !slotDate || !slotTime) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const isSlotBooked = await Appointments.findOne({
      doctorId,
      slotDate,
      slotTime,
    });
    if (isSlotBooked) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already booked" });
    }

    const appointmentId = await generateUniqueId("appointment")

    const appointment = new Appointments({
      patientId,
      doctorId,
      slotDate,
      slotTime,
      reason,
      fee,
      status: "Scheduled",
      paymentStatus: "Pending",
      appointmentId, // ✅ Custom Appointment ID
    });
    await appointment.save();

    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { slotsBooked: { slotDate, slotTime } },
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId, newSlotDate, newSlotTime } = req.body;
    const userId = req.id;
    const userRole = req.role;

    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (
      userRole !== "Admin" &&
      userId !== appointment.patientId.toString() &&
      userId !== appointment.doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    const isSlotBooked = await Appointments.findOne({
      doctorId: appointment.doctorId,
      slotDate: newSlotDate,
      slotTime: newSlotTime,
    });
    if (isSlotBooked) {
      return res
        .status(400)
        .json({ success: false, message: "New slot already booked" });
    }

    appointment.slotDate = newSlotDate;
    appointment.slotTime = newSlotTime;
    appointment.updated = Date.now();
    await appointment.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Appointment rescheduled successfully",
        appointment,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    console.log(req.body);
    
    const { appointmentId } = req.body;
    const userId = req.id;
    const userRole = req.role;

    console.log(appointmentId);
    
    if(!appointmentId){
      return res.status(400).json({
        success:false,
        message:"Appointment Id is Not Found"
      })
    }
    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    
    let doctor 
    if(userRole === "Doctor"){
      doctor = await Doctor.findOne({userId})
      if(!doctor){
        return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
      }
    }

    if (
      userRole !== "Admin" &&
      userId !== appointment.patientId.toString() &&
      doctor._id.toString() !== appointment.doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const payOnlineAppmnt = async (req,res) => {
  try {
    
    const appntId = req.params.appId

    const appointment = await Appointments.findById(appntId)

    if(!appointment){
      return res.status(404).json({
        success:false,
        message:"Appointment Not Found"
      })
    }

    appointment.paymentStatus = "Completed"

    await appointment.save()

     await Revenue.create({
          sourceId: appointment._id,
          displayId:appointment.appointmentId,
          sourceType: "Appointment",
          amount: appointment.fee,
        });
    

    return res.status(200).json({
      success:true,
      message:"Payment Success"
    })

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success:false,
      message:"Internal Error",
      error:error.message
    })
  }
}

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.id;
    const userRole = req.role;

    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    if(appointment.status === "Completed" || appointment.status === "Cancelled"){
      return res.status(400).json({
        success:false,
        message:`Appointment is  ${appointment.status},You Cannot Update it.`
      })
    }

    const doctor = await Doctor.findOne({userId})
    if(req.role === "Doctor" && !doctor){
      return res.status(400).json({
        success:false,
        message:"Doctor Not Found"
      })
    }

    if (userRole !== "Admin" && doctor._id.toString() !== appointment.doctorId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    appointment.status = "Completed";
    await appointment.save();

    res
      .status(200)
      .json({ success: true, message: "Appointment marked as completed" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getPatientAppointments = async (req, res) => {
  try {
    const userId = req.id;

    const patientExist = await Patient.findOne({ userId });
    if (!patientExist) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    const appointments = await Appointments.find({ patientId: userId }).populate({
    path: "doctorId",
    select: "userId docPicture speciality -_id ", 
    populate: {
      path: "userId", 
      select: "name email", 
    },
  });
    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Fetch Appointments",
      error: error.message,
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.id;

    const doctorExists = await Doctor.findOne({ userId });
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });
    }

    const appointments = await Appointments.find({ doctorId: doctorExists._id })
    .populate({
      path: "patientId", 
      model: "User", 
      select: "name email",
    }).sort({createdAt:-1});
    
    const numberOfPatients = new Set(appointments.map((app)=> app.patientId._id.toString())).size
    const numberOfAppointments = appointments.length
    const numberOfCompletedAppointments = appointments.filter(app=> app.status === "Completed").length
    const numberOfCancelledAppointments = appointments.filter(app=> app.status === "Cancelled").length


  return res.status(200).json({
    success: true,
    appointments,
    numberOfPatients,
    numberOfAppointments,
    numberOfCompletedAppointments,
    numberOfCancelledAppointments,
  });
    } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Fetch Appointments",
      error: error.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {  
    const appointments = await Appointments.find()
      .populate({
        path: "patientId",
        model:  "User",
        select: "name email",
      })
      .populate({
        path: "doctorId",
        select: "userId docPicture speciality -_id",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

      console.log(appointments);
      
    const numberOfAppointments = appointments.length;
    const numberOfCompletedAppointments = appointments.filter(
      (app) => app.status === "Completed"
    ).length;
    const numberOfCancelledAppointments = appointments.filter(
      (app) => app.status === "Cancelled"
    ).length;

    return res.status(200).json({
      success: true,
      appointments,
      numberOfAppointments,
      numberOfCompletedAppointments,
      numberOfCancelledAppointments,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Fetch Appointments",
      error: error.message,
    });
  }
};




module.exports = {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  payOnlineAppmnt
};
