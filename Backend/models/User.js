// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   otp: { type: String, default: null },
//   otpExpiry: { type: Date, default: null },
//   tokens: [{ token: String }],
// });

// module.exports = mongoose.model("User", UserSchema);
// ============================================
// USER MODEL
// Added 2 new fields for reset password flow:
//   resetToken       — JWT token saved after requesting reset
//   resetTokenExpiry — when the token expires (1 hour)
// ============================================

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
