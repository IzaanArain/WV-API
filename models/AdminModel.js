const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    email: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    role:{
      type: String,
      enum:["admin"],
      default: "admin",
    },
    social_phone: {
      type: String,
      default: "",
    },
    contact_number:{
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
      type: Number,
      default: 0,
    },
    user_auth: {
      type: String,
      default: "",
    },
    is_complete: {
      type: Number,
      default: 0,
    },
    is_notification: {
      type: Number,
      default: 0,
    },
    is_forgot_password: {
      type: Number,
      default: 0,
    },
    is_blocked: {
      type: Number,
      default: 0,
    },
    is_delete: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("admin", adminSchema);
