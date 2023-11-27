const User = require("../models/UserModel");
const { createToken } = require("../middlewares/Auth");
const mongoose = require("mongoose");

//sign up
const signup = async (req, res) => {
  try {
    const email = req?.body?.email;
    if (!email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        status: 0,
        message: "user has already registered",
      });
    }
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
    // if (email && gen_otp_code) {
    //   OtpMailer(typed_email, gen_otp_code);
    // }
    const signup_user = await User.create({
      email: email,
      otp_code: gen_otp_code,
    });
    const user_id = signup_user?._id;
    if (signup_user) {
      return res.status(200).send({
        status: 1,
        message: "sign up successful",
        id: user_id,
      });
    } else {
      return res.status(400).send({ status: 0, message: "sign up failed" });
    }
  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//otp_verify
const otp_verify = async (req, res) => {
  try {
    const { id, otp_code } = req?.body;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter id",
      });
    } else if (!otp_code) {
      return res.status(400).send({
        status: 0,
        message: "please enter otp code",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid ID",
      });
    } else if (otp_code.length !== 6) {
      return res.status(400).send({
        status: 0,
        message: "OTP code must be of six digits",
      });
    } else if (!otp_code.match(/^[0-9]*$/)) {
      return res.status(400).send({
        status: 0,
        message: "OTP code consists of numbers only",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const token = createToken(id);
    const verified_user = await User.findByIdAndUpdate(
      id,
      {
        is_verified: true,
        user_auth: token,
      },
      { new: true }
    );
    if(verified_user){
        return res.status(200).send({
            status:1,
            message:"user verified",
            user:verified_user
        })
    }else{
        return res.status(400).send({
            status: 0,
            message: "failed to verify user",
          });
    }
  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//sign in
const signin = async (req, res) => {
  try {
    const email = req?.body?.email;
    if (!email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
    // if (email && gen_otp_code) {
    //   OtpMailer(typed_email, gen_otp_code);
    // }
    const login_user = await User.findOneAndUpdate(
      { email },
      {
        otp_code: gen_otp_code,
      },
      { new: true }
    );
    if (login_user) {
      return res.status(200).send({
        status: 1,
        message: "otp generated successfully",
      });
    } else {
      return res.status(400).send({ status: 0, message: "login failed" });
    }
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = { signup, otp_verify, signin };
