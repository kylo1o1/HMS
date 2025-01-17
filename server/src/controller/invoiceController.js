const Appointments = require("../model/appointmentModel");
const MedicineBill = require("../model/medicineCartModel");

exports.generateAppointmentInvoice = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    console.log(appointmentId);

    const appointment = await Appointments.findById(appointmentId)
      .populate({
        path: "patientId",
        select: "insuranceDetails",
        populate: {
          path: "userId",
          select: "name email contact",
        },
      })
      .populate({
        path: "doctorId",
        select: "speciality",
        populate: {
          path: "userId",
          select: "name",
        },
      });
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment Not Found",
      });
    }

    const {
      patientId,
      doctorId,
      date,
      status,
      fee,
      paymentStatus,
      reason,
      notes,
    } = appointment;

    console.log(patientId, doctorId);

    const invoice = {
      invoiceNumber: `INV-${appointment._id}`,
      patient: {
        name: patientId.userId.name,
        email: patientId.userId.email,
        contact: patientId.userId.contact,
      },
      doctor: {
        name: doctorId.userId.name,
        speciality: doctorId.speciality,
      },
      appointmentDate: date,
      reason,
      notes,
      fee,
      paymentStatus,
      issuedDate: Date.now(),
    };

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Appointment Invoice",
      error: error.message,
    });
  }
};
exports.generateMedicineInvoice = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await MedicineBill.findById(billId)
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name email contact",
        },
      })
      .populate("medicines.medicineId", "name price");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "No Bill Found",
      });
    }

    const { patientId, medicines, totalPrice, status, createdAt } = bill;

    const medicineDetails = medicines.map((item) => ({
      name: item.medicineId.name,
      quantity: item.quantity,
      pricePerUnit: item.medicineId.price,
      total: item.quantity * item.medicineId.price,
    }));

    let grandTotal = 0;
    medicineDetails.forEach((item) => {
      grandTotal += item.total;
    });
    const invoice = {
      invoiceNumber: `INV_${bill._id}`,
      patient: {
        name: patientId.userId.name,
        email: patientId.userId.email,
        contact: patientId.userId.contact,
      },
      medicineDetails,
      grandTotal,
      status,
      issuedDate: Date.now(),
    };

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Error generating medicine bill:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the medicine bill ",
      error: error.message,
    });
  }
};
