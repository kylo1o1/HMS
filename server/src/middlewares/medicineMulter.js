const multer = require("multer");
const { diskStorage } = require("multer");
const shortid = require("shortid");

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/media/medicines");
  },
  filename: (req, file, cb) => {
    const uq = shortid.generate();
    const suffix = Date.now();

    cb(
      null,
      file.fieldname + "_" + uq + "_" + suffix + "_" + file.originalname
    );
  },
});

const uploadMedicine = multer({ storage });
module.exports = uploadMedicine;
