const jwt = require("jsonwebtoken");
const Admin=require("../models/AdminModel");

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRETE_KEY);
};

const tokenValidator = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    // console.log("token",token);
    if (!token) {
      return res.status(400).send({
        status: 0,
        message: "Unauthorized : Token is required",
      });
    }
    const token_user = await Admin.findOne({ user_auth: token });
    if (!token_user) {
      return res.status(400).send({
        status: 0,
        message: "not a valid token",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    const user_id = decoded?.id;
    const user = await Admin.findById(user_id);
    if (!user) {
      return res.status(400).send({
        status: 0,
        message: "Unauthorized : User not found",
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
    req.admin = user;
    next();
  } catch (err) {
    console.error("error", err.message);
    return res.status(500).send({
      status: 0,
      message: "Something went wrong",
    });
  }
};

module.exports = { createToken, tokenValidator };
