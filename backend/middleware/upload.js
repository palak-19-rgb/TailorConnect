const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage
});

function uploadImage(file, cloudinary, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
}

module.exports = {
  upload,
  uploadImage
};