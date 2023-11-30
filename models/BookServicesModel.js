const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookServiceSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      default: null,
    },
    is_booked: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("book_service", bookServiceSchema);
