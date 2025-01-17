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
      expiryDate,
    } = req.body;

    if (
      !name ||
      !stock ||
      !price ||
      !description ||
      !manufacturer ||
      !category ||
      !expiryDate
    ) {
      if (req.file) {
        unsyncImage(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Please provide All fields",
      });
    }

    const exist = await Medicine.findOne({ name });
    if (exist) {
      unsyncImage(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Already Exists",
      });
    }

    const medicine = new Medicine(req.body);
    medicine.image = req.file.path;
    await medicine.save();

    return res.status(201).json({
      success: true,
      message: "Medicine Has been Added",
      medicine,
    });
  } catch (error) {
    if (req.file) {
      unsyncImage(req.file.path);
    }

    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine Registration Error",
      error: error.message,
    });
  }
};

exports.ViewMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    if (!medicines) {
      return res.status(404).json({
        success: false,
        message: "No Medicines Found",
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
      message: "Error Fetching Medicines",
      error: error.message,
    });
  }
};

exports.singleMedicine = async (req, res) => {
  try {
    const { medId } = req.params;

    const medicine = await Medicine.findById(medId);

    const isStockLow = medicine.stock <= 20;

    return res.status(200).json({
      success: true,
      medicine,
      isStockLow,
    });
  } catch (error) {
    console.error("error Fetching Medicine");
    return res.status(500).json({
      success: false,
      message: "Error fetching Medicine ",
      error: error.message,
    });
  }
};

exports.updateMedicines = async (req, res) => {
  try {
    const { medId } = req.params;

    if (!medId) {
      if (req.file) {
        unsyncImage(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Medicine Id is missing",
      });
    }

    const medicine = await Medicine.findById(medId);

    if (!medicine) {
      if (req.file) {
        unsyncImage(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Medicine Not Found",
      });
    }

    await medicine.updateOne(req.body, { new: true });

    if (req.file) {
      unsyncImage(medicine.image);
      medicine.image = req.file.path;
    }

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "medicine Has been Updated",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine Updation Error",
      error: error.message,
    });
  }
};
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
        message: "Medicine Not Found",
      });
    }

    unsyncImage(medicine.image);

    await medicine.deleteOne();

    return res.status(200).json({
      success: true,
      message: "medicine Has been Deleted",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Medicine Updation Error",
      error: error.message,
    });
  }
};
