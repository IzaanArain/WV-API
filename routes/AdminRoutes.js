const express = require("express");
const { upload } = require("../middlewares/Multer");
const { signin, forgot_password, reset_password, otp_verify,signout, complete_profile, change_password, admin_block_user, admin_delete_user } = require("../controllers/AdminController");
const { tokenValidator } = require("../middlewares/AdminAuth");
const { getContent, editContent } = require("../controllers/ContentController");
const { createService, editService, deleteService,getAllServices,getServiceDetails } = require("../controllers/ServicesController");
const router = express.Router();

router.post("/signin", signin);
router.post("/forgot_password", forgot_password);
router.post("/otp_verfy", otp_verify);
router.post("/reset_password", reset_password);
router.post("/complete_profile",tokenValidator,upload.fields([{name:"profile_image",maxCount:1}]), complete_profile);
router.post("/signout",tokenValidator, signout);
router.post("/change_password",tokenValidator, change_password);
router.post("/admin_block_user",tokenValidator, admin_block_user);
router.post("/admin_delete_user",tokenValidator, admin_delete_user);
/********** Content *************/
router.get("/get_content",tokenValidator,getContent);
router.post("/edit_content",upload.fields([{name:"company_image",maxCount:1}]),tokenValidator,editContent);
/********** Service *************/
router.post("/create_service",tokenValidator,createService);
router.post("/edit_service",tokenValidator,editService);
router.post("/delete_service",tokenValidator,deleteService);
router.post("/get_all_service",tokenValidator,getAllServices);
router.post("/get_service_details",tokenValidator,getServiceDetails);

module.exports = router;
