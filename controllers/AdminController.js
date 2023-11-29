const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");
const OtpMailer = require("../utils/OtpMailer");

const signin = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await Admin.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const is_verified = user?.is_verified;
    if (!is_verified) {
      return res.status(400).send({
        status: 0,
        message: "user not verified",
      });
    }
    const is_blocked = user?.is_blocked;
    if (is_blocked) {
      return res.status(400).send({
        status: 0,
        message: "user account has been blocked, please contact admin",
      });
    }
    const is_delete = user?.is_delete;
    if (is_delete) {
      return res.status(400).send({
        status: 0,
        message: "user account has been deleted, please contact admin",
      });
    }
    const user_password = user?.password;
    const user_id = user?._id;
    const matchPassword = await bcrypt.compare(typed_password, user_password);
    if (matchPassword) {
      const token = create_token(user_id);
      const user = await Admin.findByIdAndUpdate(
        user_id,
        { user_auth: token },
        { new: true }
      );
      return res.status(200).send({
        status: 0,
        message: "logged in succesfully",
        user,
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const otp_verfy = async (req, res) => {
  try {
    const { email: typed_email, otp_code: typed_otp_code } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_otp_code) {
      return res.status(400).send({
        status: 0,
        message: "please enter OTP code",
      });
    } else if (typed_otp_code.length !== 6) {
      return res.status(400).send({
        status: 0,
        message: "OTP code must be of six digits",
      });
    } else if (!typed_otp_code.match(/^[0-9]*$/)) {
      return res.status(400).send({
        status: 0,
        message: "OTP code consists of numbers only",
      });
    }

    const user = await Admin.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found,try again",
      });
    }
    const is_blocked = user?.is_blocked;
    if (is_blocked) {
      return res.status(400).send({
        status: 0,
        message: "user account has been blocked, please contact admin",
      });
    }
    const is_delete = user?.is_delete;
    if (is_delete) {
      return res.status(400).send({
        status: 0,
        message: "user account has been deleted, please contact admin",
      });
    }
    const user_otp_code = user?.otp_code;
    const user_id = user?._id;
    if (parseInt(typed_otp_code) !== user_otp_code) {
      return res.status(200).send({
        status: 0,
        message: "OTP does not match",
      });
    } else {
      const user_verfied = await Admin.findByIdAndUpdate(
        user_id,
        { is_verified: true },
        { new: true }
      );
      const { email, is_verified, is_forgot_password } = user_verfied;
      if (is_forgot_password) {
        res.status(200).send({
          status: 1,
          message: "OTP successfully verified",
          email,
          is_verified,
          is_forgot_password,
        });
      } else {
        res.status(200).send({
          status: 1,
          message: "OTP successfully verified",
          email,
          is_verified,
        });
      }
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const forgot_password = async (req, res) => {
  try {
    const email_typed = req.body.email;
    if (!email_typed) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !email_typed.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    }
    const user = await Admin.findOne({ email: email_typed });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const is_blocked = user?.is_blocked;
    if (is_blocked) {
      return res.status(400).send({
        status: 0,
        message: "user account has been blocked, please contact admin",
      });
    }
    const is_delete = user?.is_delete;
    if (is_delete) {
      return res.status(400).send({
        status: 0,
        message: "user account has been deleted, please contact admin",
      });
    }
    const user_id = user?._id;
    const gen_otp_code = Math.floor(Math.random() * 900000) + 100000;
    if (email && gen_otp_code) {
      OtpMailer(typed_email, gen_otp_code);
    }
    const user_updated = await Admin.findByIdAndUpdate(
      user_id,
      { is_verified: false, is_forgot_password: true, otp_code: gen_otp_code },
      { new: true }
    );
    const email = user_updated?.email;
    return res.status(200).send({
      status: 0,
      message: "forgot password successfully",
      email,
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const reset_password = async (req, res) => {
  try {
    const { email: typed_email, password: typed_password } = req.body;
    if (!typed_email) {
      return res.status(400).send({
        status: 0,
        message: "please enter email",
      });
    } else if (
      !typed_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      return res.status(400).send({
        status: 0,
        message: "please enter valid email",
      });
    } else if (!typed_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !typed_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const user = await Admin.findOne({ email: typed_email });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "user not found",
      });
    }
    const user_verfied = user?.is_verified;
    if (!user_verfied) {
      return res.status(400).send({
        status: 0,
        message: "user not verified",
      });
    }
    const is_blocked = user?.is_blocked;
    if (is_blocked) {
      return res.status(400).send({
        status: 0,
        message: "user account has been blocked, please contact admin",
      });
    }
    const is_delete = user?.is_delete;
    if (is_delete) {
      return res.status(400).send({
        status: 0,
        message: "user account has been deleted, please contact admin",
      });
    }
    const user_id = user?._id;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(typed_password, salt);
    const user_updated = await Admin.findByIdAndUpdate(
      user_id,
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "reset password successful",
    });
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const complete_profile = async (req, res) => {
  try {
    const user_id = req?.admin?._id;
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
    const user = await Admin.findByIdAndUpdate(
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

const signout = async (req, res) => {
  try {
    const user_id = req?.admin?._id;
    const signout_user = await Admin.findByIdAndUpdate(
      user_id,
      { user_auth: null },
      { new: true }
    );
    return res.status(200).send({
      status: 1,
      message: "signout succesfully",
    });
  } catch (err) {
    console.error("Error", err.message.red);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const change_password = async (req, res) => {
  try {
    const user_id = req?.admin?._id;
    const { password, new_password } = req.body;
    if (!password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    } else if (!new_password) {
      return res.status(400).send({
        status: 0,
        message: "please enter password",
      });
    } else if (
      !new_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).send({
        status: 0,
        message:
          "Password should include at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    const user_password = req?.user?.password;
    const matchPassword = await bcrypt.compare(password, user_password);
    if (matchPassword) {
      await User.findByIdAndUpdate(
        user_id,
        { password: hashedPassword },
        { new: true }
      );
      return res.status(200).send({
        status: 1,
        message: "password changed successfully",
      });
    } else {
      return res.status(400).send({
        status: 0,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const admin_delete_user = async (req, res) => {
  try {
    const admin_id = req?.admin?._id;
    const user_id = req?.query?.id;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(400).send({
        status: 0,
        message: "you are not admin",
      });
    }
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid user ID",
      });
    }
    const user = await User.findOne({ _id: user_id, role: "user" });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "User not found",
      });
    }
    const del = user?.is_delete;
    const user_delete = await User.findOneAndUpdate(
      { _id: user_id, role: "user" },
      { is_delete: !del },
      { new: true }
    );
    const is_delete = user_delete.is_delete;

    if (is_delete) {
      res.status(200).send({
        status: 1,
        message: "User deleted successfully",
        is_delete: is_delete,
      });
    } else {
      return res.status(400).send({
        status: 1,
        message: "User delete failed",
        is_delete: is_delete,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

const admin_block_user = async (req, res) => {
  try {
    const admin_id = req?.admin?.id;
    const user_id = req.query.id;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(400).send({
        status: 0,
        message: "you are not admin",
      });
    }
    if (!mongoose.isValidObjectId(user_id)) {
      return res.status(400).send({
        status: 0,
        message: "Not a valid user ID",
      });
    }
    const user = await User.findOne({ _id: user_id, role: "user" });
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "User not found",
      });
    }
    const block = user?.is_blocked;
    const user_blocked = await User.findOneAndUpdate(
      { _id: user_id, role: "user" },
      { is_blocked: !block },
      { new: true }
    );
    const is_blocked = user_blocked?.is_blocked;
    const user_email = user_blocked?.email;
    if (is_blocked) {
      res.status(200).send({
        status: 1,
        message: `User ${user_email} is blocked`,
        is_blocked: is_blocked,
      });
    } else {
      res.status(200).send({
        status: 1,
        message: `User ${user_email} is unblocked`,
        is_blocked: is_blocked,
      });
    }
  } catch (err) {
    console.error("Error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signin,
  forgot_password,
  reset_password,
  otp_verfy,
  complete_profile,
  signout,
  change_password,
  admin_delete_user,
  admin_block_user,
};
