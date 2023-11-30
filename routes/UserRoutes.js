const express=require("express");
const { signin,signup, otp_verify, social_login, resend_otp, signout, complete_profile, delete_profile, book_service } = require("../controllers/UserController");
const { tokenValidator } = require("../middlewares/Auth");
const { upload } = require("../middlewares/Multer");
const router=express.Router();

router.post("/signin",signin);
router.post("/signup",signup);
router.post("/otp_verify",otp_verify);
router.post("/social_login",social_login);
router.post("/resend_otp",resend_otp);
router.post("/complete_profile",tokenValidator,upload.fields([{name:"profile_image",maxCount:1}]),complete_profile);
router.post("/signout",tokenValidator,signout);
router.post("/delete_profile",tokenValidator,delete_profile);
router.post("/book_service",tokenValidator,book_service);


module.exports=router;