const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    profile_image: {
      type: String,
      default: "",
    },
    otp_code: {
      type: Number,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    user_auth: {
      type: String,
      default: "",
    },
    is_complete: {
      type: Boolean,
      default: false,
    },
    is_notification: {
      type: Boolean,
      default: false,
    },
    is_forgot_password: {
      type: Boolean,
      default: false,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
    device_token: {
      type: String,
      default: "123456789",
    },
    device_type: {
      type: String,
      default: "Android",
    },
    social_token: {
      type: String,
      default: "987654321",
    },
    social_type: {
      type: String,
      default: "facebook",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
