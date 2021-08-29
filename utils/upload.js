const multer = require('multer');
const fileExtension = require('file-extension')

const storage = multer.diskStorage({
  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    cb(null, 'file_storage')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: {
    // Setting Image Size Limit to 2MBs
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //Error
      cb(new Error('Please upload JPG and PNG images only!'))
    }
    //Success
    cb(undefined, true)
  }
});

module.exports = Object.freeze({
  storage,
  upload
});