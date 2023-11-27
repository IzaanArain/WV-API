const express=require("express");
const { signin,signup } = require("../controllers/UserController");
const router=express.Router();

router.post("/signin",signin);
router.post("/signup",signup);

module.exports=router;