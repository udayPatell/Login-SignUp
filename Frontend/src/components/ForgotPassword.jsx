import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  forgotPasswordSetNew,
} from "../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateOTP,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import { toast } from "react-toastify";
import "../App.css";

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [apiMessage, setApiMessage] = useState("");

  async function handleSendOTP(e) {
    e.preventDefault();

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    setApiMessage("");

    const res = await dispatch(forgotPasswordSendOTP(email.trim()));

    setLoading(false);

    if (res.success) {
      toast.success("OTP sent! Check your email.");
      setStep(2);
    } else {
      toast.error(res.msg);
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();

    const err = validateOTP(otp);
    setOtpError(err);
    if (err) return;

    setLoading(true);
    setApiMessage("");

    const res = await dispatch(
      forgotPasswordVerifyOTP(email.trim(), otp.trim()),
    );

    setLoading(false);

    if (res.success) {
      toast.success("OTP verified!");
      setStep(3);
    } else {
      toast.error(res.msg);
    }
  }

  async function handleSetPassword(e) {
    e.preventDefault();

    const passErr = validatePassword(newPassword);
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);
    if (passErr || confirmErr) return;

    setLoading(true);
    setApiMessage("");

    const res = await dispatch(
      forgotPasswordSetNew(email.trim(), otp.trim(), newPassword),
    );

    setLoading(false);

    if (res.success) {
      toast.success("Password reset! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      toast.error(res.msg);
    }
  }

  const steps = ["Email", "OTP", "New Password"];

  return (
    <div className="container">
      <div className="form-box">
        <h2>Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendOTP} noValidate>
            <p className="step-desc">
              Enter the email linked to your account and we'll send a one-time
              code.
            </p>
            <div className="field-wrap">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                className={emailError ? "input-error" : ""}
              />
              {emailError && <p className="error-msg">{emailError}</p>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} noValidate>
            <p className="step-desc">
              Enter the 6-digit OTP sent to <strong>{email}</strong>.
            </p>
            <div className="field-wrap">
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                onBlur={() => setOtpError(validateOTP(otp))}
                className={otpError ? "input-error" : ""}
              />
              {otpError && <p className="error-msg">{otpError}</p>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Verifying…" : "Verify OTP"}
            </button>

            <p style={{ marginTop: "10px", fontSize: "13px" }}>
              Didn't receive it?{" "}
              <span
                className="link-btn"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setApiMessage("");
                }}
              >
                Resend OTP
              </span>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSetPassword} noValidate>
            <p className="step-desc">
              Choose a strong new password for your account.
            </p>
            <div className="field-wrap">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={() => setPasswordError(validatePassword(newPassword))}
                className={passwordError ? "input-error" : ""}
              />
              {passwordError && <p className="error-msg">{passwordError}</p>}
            </div>
            <div className="field-wrap">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                onBlur={() =>
                  setConfirmPasswordError(
                    validateConfirmPassword(newPassword, confirmPassword),
                  )
                }
                className={confirmPasswordError ? "input-error" : ""}
              />
              {confirmPasswordError && (
                <p className="error-msg">{confirmPasswordError}</p>
              )}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {apiMessage && (
          <p
            className={
              apiMessage.includes("sent") ||
              apiMessage.includes("verified") ||
              apiMessage.includes("reset")
                ? "success-msg"
                : "error-msg"
            }
          >
            {apiMessage}
          </p>
        )}

        <p style={{ marginTop: "16px" }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
