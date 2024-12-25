const multer = require("multer");
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: (req, File, cb) => {
    cb(null, "./Public/media/profiles");
  },

  filename: (req, file, cb) => {
    const uqSuffix = shortid.generate();
    const uniqueSuffix = Date.now();

    cb(
      null,
      file.fieldname +
        "_" +
        uqSuffix +
        "_" +
        uniqueSuffix +
        "_" +
        file.originalname
    );
  },
});

const profileUpload = multer({ storage });

module.exports = profileUpload