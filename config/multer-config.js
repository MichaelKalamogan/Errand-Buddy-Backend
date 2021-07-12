const multer = require('multer')
const path = require('path')
const cloudinary = require('./cloudinary-config')
const streamifier = require('streamifier')

// Set The Storage Engine
const storage = multer.diskStorage({
    // destination: './uploads'
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
  // Init Upload
const upload = multer()

function streamUpload (req) {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

     streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

module.exports = { upload, streamUpload }