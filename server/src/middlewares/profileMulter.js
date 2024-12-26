const multer = require("multer");
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/media/profiles");
  },

  filename: (req, file, cb) => {
    const uq = shortid.generate();
    const date = Date.now();

    cb(null, file.fieldname + "_" + uq + "_" + date + "_" + file.originalname);
  },
});


const uploadProfile = multer({storage})

module.exports = uploadProfile
