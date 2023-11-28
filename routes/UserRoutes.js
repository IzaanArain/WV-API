const express=require("express");
const { signin,signup, otp_verify, social_login, resend_otp, signout } = require("../controllers/UserController");
const router=express.Router();

router.post("/signin",signin);
router.post("/signup",signup);
router.post("/otp_verify",otp_verify);
router.post("/social_login",social_login);
router.post("/resend_otp",resend_otp);
router.post("/signout",signout);

module.exports=router;