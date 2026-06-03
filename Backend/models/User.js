const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", UserSchema);
