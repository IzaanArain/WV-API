const express = require("express");
const { upload } = require("../middlewares/Multer");
const { signin, forgot_password, reset_password, otp_verfy,signout, complete_profile, change_password, admin_block_user, admin_delete_user } = require("../controllers/AdminController");
const { tokenValidator } = require("../middlewares/AdminAuth");
const { createContent } = require("../controllers/ContentController");
const router = express.Router();

router.post("/signin", signin);
router.post("/forgot_password", forgot_password);
router.post("/otp_verfy", otp_verfy);
router.post("/reset_password", reset_password);
router.post("/complete_profile",tokenValidator,upload.fields([{name:"profile_image",maxCount:1}]), complete_profile);
router.post("/signout",tokenValidator, signout);
router.post("/change_password",tokenValidator, change_password);
router.post("/admin_block_user",tokenValidator, admin_block_user);
router.post("/admin_delete_user",tokenValidator, admin_delete_user);
/********** Content *************/
router.post("/create_content",tokenValidator, createContent);

module.exports = router;
