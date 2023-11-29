const express=require("express");
const { signin,signup, otp_verify, social_login, resend_otp, signout, complete_profile } = require("../controllers/UserController");
const { tokenValidator } = require("../middlewares/Auth");
const { upload } = require("../middlewares/Multer");
const router=express.Router();

router.post("/signin",signin);
router.post("/signup",signup);
router.post("/otp_verify",otp_verify);
router.post("/social_login",social_login);
router.post("/resend_otp",resend_otp);
router.post("/signout",signout);
router.post("/complete_profile",tokenValidator,upload.fields([{name:"profile_image",maxCount:1}]),complete_profile);

module.exports=router;