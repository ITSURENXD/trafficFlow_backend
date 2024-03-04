const multer = require('multer');

// setup storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // addition of image on different folder based on the file field name
    const dest =
      file.fieldname === 'profileImage'
        ? './uploads/profiles'
        : './uploads/others';

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// create multer instance
const upload = multer({ storage: storage });

module.exports = upload;
