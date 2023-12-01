const User = require("../models/UserModel");
const { createToken } = require("../middlewares/Auth");
const mongoose = require("mongoose");
const OtpMailer = require("../utils/OtpMailer");

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
    if (email && gen_otp_code) {
      OtpMailer(email, gen_otp_code);
    }
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

//verify otp
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
    const user_deleted = user?.is_delete;
    const user_blocked = user?.is_blocked;
    if (user_deleted === 1) {
      return res.status(200).send({
        status: 0,
        message:
          "user account has been deleted, please contact admin for further details",
      });
    } else if (user_blocked === 1) {
      return res.status(200).send({
        status: 0,
        message:
          "user account has been blocked, please contact admin for further details",
      });
    }

    const user_otp_code = user?.otp_code;
    if (user_otp_code === parseInt(otp_code)) {
      const token = createToken(id);
      const verified_user = await User.findByIdAndUpdate(
        id,
        {
          is_verified: 1,
          user_auth: token,
        },
        { new: true }
      );
      if (verified_user) {
        return res.status(200).send({
          status: 1,
          message: "user verified",
          user: verified_user,
        });
      } else {
        return res.status(400).send({
          status: 0,
          message: "failed to verify user",
        });
      }
    } else {
      return res.status(400).send({
        status: 0,
        message: "OTP does not match",
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
    const user_deleted = user?.is_delete;
    const user_blocked = user?.is_blocked;
    if (user_deleted === 1) {
      return res.status(200).send({
        status: 0,
        message:
          "user account has been deleted, please contact admin for further details",
      });
    } else if (user_blocked === 1) {
      return res.status(200).send({
        status: 0,
        message:
          "user account has been blocked, please contact admin for further details",
      });
    } else {
      const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
      if (email && gen_otp_code) {
        OtpMailer(email, gen_otp_code);
      }
      const login_user = await User.findOneAndUpdate(
        { email },
        {
          otp_code: gen_otp_code,
        },
        { new: true }
      );
      const user_id = login_user?._id;
      if (login_user) {
        return res.status(200).send({
          status: 1,
          message: "otp generated successfully",
          id: user_id,
        });
      } else {
        return res.status(400).send({ status: 0, message: "login failed" });
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const social_login = async (req, res) => {
  try {
    const {
      social_phone,
      device_token,
      device_type,
      social_token,
      social_type,
    } = req.body;
    if (!social_type) {
      return res.status(400).send({
        status: 0,
        message: "please enter social type",
      });
    } else if (!social_token) {
      return res.status(400).send({
        status: 0,
        message: "please enter social token",
      });
    } else if (!device_token) {
      return res.status(400).send({
        status: 0,
        message: "please enter social token",
      });
    } else if (!device_type) {
      return res.status(400).send({
        status: 0,
        message: "please enter social token",
      });
    }
    const user = await User.findOne({ social_token: social_token });
    if (!user) {
      const new_user = new User({
        social_phone,
        social_token,
        social_type,
        device_token,
        device_type,
      });
      const social_user = await new_user.save();
      const id = social_user?._id;
      const token = createToken(id);
      const update_user = await User.findByIdAndUpdate(
        id,
        {
          is_verified: 1,
          user_auth: token,
        },
        { new: true }
      );
      return res.status(200).send({
        status: 1,
        message: "social login successful",
        user: update_user,
      });
    } else {
      const user_deleted = user?.is_delete;
      const user_blocked = user?.is_blocked;
      if (user_deleted === 1) {
        return res.status(200).send({
          status: 0,
          message:
            "user account has been deleted, please contact admin for further details",
        });
      } else if (user_blocked === 1) {
        return res.status(200).send({
          status: 0,
          message:
            "user account has been blocked, please contact admin for further details",
        });
      } else {
        const user_id = user?._id;
        const token = createToken(user_id);
        const update_user = await User.findOneAndUpdate(
          { social_token },
          {
            user_auth: token,
            is_verified: 1,
            device_token,
            device_type,
          },
          {
            new: true,
          }
        );
        return res.status(200).send({
          status: 1,
          message: "social login successful",
          user: update_user,
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//resend otp
const resend_otp = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter id",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid ID",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
    const update_user = await User.findByIdAndUpdate(
      id,
      { otp_code: gen_otp_code },
      { new: true }
    );
    const otp_code = update_user?.otp_code;
    return res.status(200).send({
      status: 1,
      message: "otp resend successfully",
      otp_code,
    });
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//signout
const signout = async (req, res) => {
  try {
    // const id = req?.query?.id;
    const id = req?.user?._id;
    if (!id) {
      return res.status(400).send({
        status: 0,
        message: "please enter id",
      });
    } else if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({
        status: 0,
        message: "not a valid ID",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const updated_user = await User.findByIdAndUpdate(
      id,
      { user_auth: null, is_verified: 0, otp_code: null },
      { new: true }
    );
    return res.status(200).send({
      status: 0,
      message: "signout successfully",
      user: updated_user,
    });
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//complete profile
const complete_profile = async (req, res) => {
  try {
    const user_id = req?.user?._id;
    const { name, contact_number } = req.body;
    if (!name) {
      return res.status(400).send({
        status: 0,
        message: "please enter name",
      });
    } else if (!contact_number) {
      return res.status(400).send({
        status: 0,
        message: "please enter phone number",
      });
    } else if (
      !contact_number.match(
        /^(\+\d{1,2}\s?)?(\d{10}|\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4}|\(\d{3}\)[-\.\s]?\d{3}[-\.\s]?\d{4})$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid phone number",
      });
    }
    const profileImage = req?.files?.profile_image;
    const profileImagePath = profileImage
      ? profileImage[0]?.path.replace(/\\/g, "/")
      : null;
    const user = await User.findByIdAndUpdate(
      user_id,
      {
        name,
        contact_number,
        profile_image: profileImagePath,
        is_complete: 1,
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "complete profile successful",
      user,
    });
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

//delete profile
const delete_profile = async (req, res) => {
  try {
    const user_id = req?.user._id;
    const deleted_user = await User.findByIdAndUpdate(
      user_id,
      {
        is_delete: 1,
      },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "user deleted successfully",
      user: deleted_user,
    });
  } catch (err) {
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  otp_verify,
  signin,
  social_login,
  resend_otp,
  signout,
  complete_profile,
  delete_profile,
};
