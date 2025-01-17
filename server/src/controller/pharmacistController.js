const Medicine = require("../model/medicineModel");
const MedicineBill = require("../model/medicineCartModel");
const mongoose = require("mongoose");

exports.createMedicineBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { patientId, medicines } = req.body;

    if (!patientId || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const medicineIds = medicines.map((item) => item.medicineId);
    const dbMedicines = await Medicine.find({ _id: { $in: medicineIds } });

    if (dbMedicines.length !== medicines.length) {
      return res.status(404).json({
        success: false,
        message: "Some medicines were not found.",
      });
    }

    let totalPrice = 0;
    const updatedMedicines = medicines.map((item) => {
      const medicine = dbMedicines.find((m) => m.id === item.medicineId);

      if (!medicine) {
        throw new Error(`Medicine not found: ID ${item.medicineId}`);
      }
      if (medicine.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for medicine: ID ${item.medicineId}`
        );
      }

      const amount = item.quantity * medicine.price;
      totalPrice += amount;

      return {
        ...item,
        amount,
      };
    });

    const bill = new MedicineBill({
      patientId,
      medicines: updatedMedicines,
      totalPrice,
    });

    await bill.save();

    for (let item of updatedMedicines) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { stock: -item.quantity },
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      bill: await bill.populate("medicines.medicineId"),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Billing Error",
      error: error.message,
    });
  }
};

exports.updateMedicineBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { billId, updatedMedicines } = req.body;

    if (!billId || !Array.isArray(updatedMedicines)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const bill = await MedicineBill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    const previousMedicine = bill.medicines;

    const previousMedicineMap = Object.fromEntries(
      previousMedicine.map((item) => [item.medicineId.toString(), item])
    );

    let totalPrice = 0;
    for (let item of updatedMedicines) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: "Medicine Not Found",
        });
      }

      const previousItem = previousMedicineMap[item.medicineId];
      const quantityChange = item.quantity - (previousItem?.quantity || 0);

      if (medicine.stock < quantityChange) {
        throw new Error(
          `Insufficient stock for medicine: ID ${item.medicineId}`
        );
      }

      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { stock: -quantityChange },
      });

      const amount = item.quantity * medicine.price;
      item.amount = amount;
      totalPrice += amount;

      delete previousMedicineMap[item.medicineId];
    }

    for (let removedMedicineId in previousMedicineMap) {
      const removedItem = previousMedicineMap[removedMedicineId];
      await Medicine.findByIdAndUpdate(removedMedicineId, {
        $inc: { stock: removedItem.quantity },
      });
    }

    bill.medicines = updatedMedicines;
    bill.totalPrice = totalPrice;
    await bill.save();

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: "Bill Updated",
      bill,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};
exports.viewBills = async (req, res) => {
  try {
    const bills = await MedicineBill.find();

    if (!bills) {
      return res.status(404).json({
        success: false,
        message: "No Bills Found",
      });
    }

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching Bills",
      error: error.message,
    });
  }
};

exports.view_A_Bill = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await MedicineBill.findById(billId).populate("medicineId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      bill,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching Bill",
      error: error.message,
    });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await MedicineBill.findById(billId)

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    await bill.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Bill Deleted",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Error Deleting Bill",
      error: error.message,
    });
  }
};
