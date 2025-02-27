const Medicine = require("../model/medicineModel");
const { unsyncImage } = require("../util/syncUnsyncImages");

exports.addMedicine = async (req, res) => {
  try {
    const {
      name,
      stock,
      price,
      description,
      discount,
      manufacturer,
      category,
      form,
      prescriptionRequired,
      expiryDate,
    } = req.body;

    
    if (
      !name ||
      stock === undefined ||
      price === undefined ||
      !description ||
      !manufacturer ||
      !category ||
      !form ||
      !expiryDate
    ) {
      if (req.file) {
        unsyncImage(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const exist = await Medicine.findOne({ name });
    if (exist) {
      if (req.file) unsyncImage(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Medicine already exists",
      });
    }

    const medicineData = {
      name,
      stock,
      price,
      description,
      discount,
      manufacturer,
      category,
      form,
      prescriptionRequired: prescriptionRequired || false,
      expiryDate,
      image: req.file ? req.file.path : undefined,
    };

    const medicine = new Medicine(medicineData);
    await medicine.save();

    return res.status(201).json({
      success: true,
      message: "Medicine has been added",
      medicine,
    });
  } catch (error) {
    if (req.file) unsyncImage(req.file.path);
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine registration error",
      error: error.message,
    });
  }
};

// View all medicines
exports.ViewMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    if (!medicines || medicines.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medicines found",
      });
    }
    return res.status(200).json({
      success: true,
      medicines,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message,
    });
  }
};

// View a single medicine by ID
exports.singleMedicine = async (req, res) => {
  try {
    const { medId } = req.params;
    const medicine = await Medicine.findById(medId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const isStockLow = medicine.stock <= 20;
    return res.status(200).json({
      success: true,
      medicine,
      isStockLow,
    });
  } catch (error) {
    console.error("Error fetching medicine:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message,
    });
  }
};

// Update a medicine
exports.updateMedicines = async (req, res) => {
  try {
    const { medId } = req.params;
    if (!medId) {
      if (req.file) unsyncImage(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Medicine Id is missing",
      });
    }

    let medicine = await Medicine.findById(medId);
    if (!medicine) {
      if (req.file) unsyncImage(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // If new image provided, clean up old one and update image field.
    if (req.file) {
      unsyncImage(medicine.image);
      req.body.image = req.file.path;
    }

    // Update the document with new values, running validators.
    medicine = await Medicine.findByIdAndUpdate(medId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Medicine has been updated",
      medicine,
    });
  } catch (error) {
    if (req.file) unsyncImage(req.file.path);
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine update error",
      error: error.message,
    });
  }
};

// Delete a medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { medId } = req.params;
    if (!medId) {
      return res.status(400).json({
        success: false,
        message: "Medicine Id is missing",
      });
    }

    const medicine = await Medicine.findById(medId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    unsyncImage(medicine.image);
    await medicine.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Medicine has been deleted",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine deletion error",
      error: error.message,
    });
  }
};


