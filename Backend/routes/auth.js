const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  );
}

function isValidOTP(otp) {
  return /^\d{6}$/.test(otp);
}

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ msg: "Name is required." });

  if (name.trim().length < 2)
    return res.status(400).json({ msg: "Name must be at least 2 characters." });

  if (!/^[a-zA-Z\s]+$/.test(name.trim()))
    return res
      .status(400)
      .json({ msg: "Name can only contain letters and spaces." });

  if (!email || !email.trim())
    return res.status(400).json({ msg: "Email is required." });

  if (!isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Enter a valid email address." });

  if (!password) return res.status(400).json({ msg: "Password is required." });

  if (!isStrongPassword(password))
    return res.status(400).json({
      msg: "Password must be 8+ chars with 1 uppercase, 1 number, and 1 special character.",
    });

  try {
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
    });
    await user.save();

    res.json({ msg: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim())
    return res.status(400).json({ msg: "Email is required." });

  if (!isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Enter a valid email address." });

  if (!password) return res.status(400).json({ msg: "Password is required." });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user)
      return res.status(400).json({ msg: "No account found with this email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Incorrect password. Please try again." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Valid email is required." });

  if (!currentPassword)
    return res.status(400).json({ msg: "Current password is required." });

  if (!newPassword || !isStrongPassword(newPassword))
    return res.status(400).json({
      msg: "New password must be 8+ chars with 1 uppercase, 1 number, and 1 special character.",
    });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

// router.post("/change-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   if (!newPassword || !isStrongPassword(newPassword))
//     return res.status(400).json({
//       msg: "New password must be 8+ chars with 1 uppercase, 1 number, and 1 special character.",
//     });

//   try {
//     const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
//     if (!user) return res.status(400).json({ msg: "Invalid or expired reset token." });

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = null;
//     user.resetTokenExpiry = null;
//     await user.save();

//     res.json({ msg: "Password updated successfully." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error. Please try again." });
//   }

//   await transporter.sendMail({
//     from: `"UserBase App" <${process.env.EMAIL_USER}>`,
//     to: user.email,
//     subject: "Your Password Has Been Changed",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//         <h2 style="color: #333;">Password Changed Successfully</h2>
//         <p>Hi <strong>${user.name}</strong>,</p>
//         <p>Your password has been updated. If you did not make this change, please contact our support immediately.</p>
//         <p style="color: #888; font-size: 13px;">
//           This is an automated message, please do not reply.
//         </p>
//       </div>
//     `,
//   });
// });

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim())
    return res.status(400).json({ msg: "Email is required." });

  if (!isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Enter a valid email address." });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user)
      return res.status(400).json({ msg: "No account found with that email." });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await transporter.sendMail({
      from: `"UserBase App" <${process.env.EMAIL_USER}>`,
      to: email.trim(),
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                      background: #f4f4f4; padding: 16px 24px; border-radius: 8px;
                      text-align: center; color: #222; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ msg: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "Failed to send OTP. Check server email config." });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Valid email is required." });

  if (!otp || !isValidOTP(otp.trim()))
    return res.status(400).json({ msg: "OTP must be exactly 6 digits." });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found." });

    if (!user.otp || user.otp !== otp.trim())
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });

    if (user.otpExpiry < new Date()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res
        .status(400)
        .json({ msg: "OTP has expired. Please request a new one." });
    }

    res.json({ msg: "OTP verified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

router.post("/set-new-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Valid email is required." });

  if (!otp || !isValidOTP(otp.trim()))
    return res.status(400).json({ msg: "OTP must be exactly 6 digits." });

  if (!newPassword || !isStrongPassword(newPassword))
    return res.status(400).json({
      msg: "Password must be 8+ chars with 1 uppercase, 1 number, and 1 special character.",
    });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found." });

    if (!user.otp || user.otp !== otp.trim() || user.otpExpiry < new Date())
      return res
        .status(400)
        .json({ msg: "OTP invalid or expired. Please restart." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

module.exports = router;
