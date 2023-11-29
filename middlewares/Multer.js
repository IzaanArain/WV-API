const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "./uploads/profile_images");
    } else if (file.fieldname === "information_image") {
      cb(null, "./uploads/information_images");
    } else if (file.fieldname === "service_image") {
      cb(null, "./uploads/service_images");
    }
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    const unique_infix = date + "-" + Math.floor(Math.random() * 1e9);
    // console.log(file);
    const filename = file.fieldname + "-" + unique_infix + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  //   fileFilter: (req, file, cb) => {
  //     if (file.fieldname === "profile_image") {
  //         // console.log("filefilter",req.files.profile_image)
  //       if (!req.files.profile_image) {
  //         cb(new Error("Image is required!"), false);
  //       } else {
  //         cb(null, true);
  //       }
  //     }
  //   },
});

module.exports = { upload };
