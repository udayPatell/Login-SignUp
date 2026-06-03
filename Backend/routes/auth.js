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

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim())
    return res.status(400).json({ msg: "Email is required." });

  if (!isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Enter a valid email address." });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      return res.json({ exists: true, name: user.name });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});
router.post("/change-password", async (req, res) => {
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
    if (!user)
      return res.status(400).json({ msg: "No account found with this email." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect." });

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame)
      return res.status(400).json({
        msg: "New password must be different from your current password.",
      });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password changed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   if (!email || !email.trim())
//     return res.status(400).json({ msg: "Email is required." });
//   if (!isValidEmail(email.trim()))
//     return res.status(400).json({ msg: "Enter a valid email address." });

//   try {
//     const user = await User.findOne({ email: email.trim().toLowerCase() });
//     if (!user)
//       return res.status(400).json({ msg: "No account found with that email." });

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     await transporter.sendMail({
//       from: `"UserBase App" <${process.env.EMAIL_USER}>`,
//       to: email.trim(),
//       subject: "Your Password Reset OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
//           <h2 style="color: #333;">Password Reset OTP</h2>
//           <p>Hi <strong>${user.name}</strong>,</p>
//           <p>Your OTP expires in <strong>10 minutes</strong>.</p>
//           <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
//                       background: #f4f4f4; padding: 16px 24px; border-radius: 8px;
//                       text-align: center; color: #222; margin: 16px 0;">
//             ${otp}
//           </div>
//           <p style="color: #888; font-size: 13px;">If you did not request this, ignore this email.</p>
//         </div>
//       `,
//     });

//     res.json({ msg: "OTP sent to your email." });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ msg: "Failed to send OTP. Check server email config." });
//   }
// });

// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !isValidEmail(email.trim()))
//     return res.status(400).json({ msg: "Valid email is required." });
//   if (!otp || !isValidOTP(otp.trim()))
//     return res.status(400).json({ msg: "OTP must be exactly 6 digits." });

//   try {
//     const user = await User.findOne({ email: email.trim().toLowerCase() });
//     if (!user) return res.status(400).json({ msg: "User not found." });
//     if (!user.otp || user.otp !== otp.trim())
//       return res.status(400).json({ msg: "Invalid OTP. Please try again." });
//     if (user.otpExpiry < new Date()) {
//       user.otp = null;
//       user.otpExpiry = null;
//       await user.save();
//       return res
//         .status(400)
//         .json({ msg: "OTP has expired. Please request a new one." });
//     }

//     res.json({ msg: "OTP verified." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error. Please try again." });
//   }
// });

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

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim())
    return res.status(400).json({ msg: "Email is required." });
  if (!isValidEmail(email.trim()))
    return res.status(400).json({ msg: "Enter a valid email address." });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user)
      return res.status(400).json({ msg: "No account found with that email." });

    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"UserBase App" <${process.env.EMAIL_USER}>`,
      to: email.trim(),
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px;">
          
          <h2 style="color: #333; margin-bottom: 8px;">Reset Your Password</h2>
          
          <p>Hi <strong>${user.name}</strong>,</p>
          
          <p>We received a request to reset your password. 
             Click the button below to create a new one.</p>
          
          <p style="color: #888; font-size: 13px;">
            This link expires in <strong>1 hour</strong>.
          </p>

          <!-- Reset Button -->
          <a href="${resetLink}"
             style="display: inline-block; margin: 24px 0;
                    padding: 14px 28px; background: #4ade80;
                    color: #085041; font-weight: bold; font-size: 15px;
                    border-radius: 8px; text-decoration: none;">
            Reset Password
          </a>

          <!-- Plain link fallback -->
          <p style="font-size: 12px; color: #aaa;">
            If the button doesn't work, copy this link:<br/>
            <a href="${resetLink}" style="color: #4ade80; word-break: break-all;">
              ${resetLink}
            </a>
          </p>

          <p style="color: #888; font-size: 12px; margin-top: 24px;">
            If you did not request this, you can safely ignore this email.
            Your password will not change.
          </p>
        </div>
      `,
    });

    res.json({ msg: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send reset email. Try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) return res.status(400).json({ msg: "Reset token is required." });
  if (!newPassword || !isStrongPassword(newPassword))
    return res.status(400).json({
      msg: "Password must be 8+ chars with 1 uppercase, 1 number, and 1 special character.",
    });

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "Reset link is invalid or has expired." });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ msg: "User not found." });

    if (user.resetToken !== token)
      return res
        .status(400)
        .json({ msg: "Reset link is invalid or already used." });

    if (user.resetTokenExpiry < new Date())
      return res
        .status(400)
        .json({ msg: "Reset link has expired. Please request a new one." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ msg: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

module.exports = router;
