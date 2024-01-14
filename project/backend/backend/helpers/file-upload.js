const util = require("util");
const multer = require('multer');
const maxSize = 300 * 1024 * 1024;    //max size = 300MB
const helpersFormat = require('./file-operation');

// Multer upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.fileDetail.filePath);
},
  // By default, multer removes file extensions so let's add them back
  filename: (req, file, cb) => {
    cb(null, req.fileDetail.fileName + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
},
});


const uploadFile = multer(
  {
  storage: storage,
  limits: { fileSize: maxSize },
//   fileFilter: helpersFormat.lexFilter,
}).single("file");


module.exports = {
  uploadFileForAPI: function () {
    util.promisify(uploadFile);
  },

  uploadFileForUI: function () {
    return util.promisify(uploadFile);
  },
};
