const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", UserSchema);
