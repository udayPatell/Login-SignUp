import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordWithToken } from "../redux/actions/authActions";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { toast } from "react-toastify";
import "../App.css";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      setApiMessage("Invalid reset link. Please request a new one.");
    }
  }, [token]);
  function handleBlur(field) {
    if (field === "newPassword")
      setErrors((prev) => ({
        ...prev,
        newPassword: validatePassword(newPassword),
      }));
    if (field === "confirmPassword")
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
      }));
  }
  function validateAll() {
    const result = {
      newPassword: validatePassword(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    };
    setErrors(result);
    return Object.values(result).every((e) => e === "");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) return;

    if (!validateAll()) return;

    setLoading(true);
    setApiMessage("");
    setSuccess(false);
    const res = await dispatch(resetPasswordWithToken(token, newPassword));

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setApiMessage("Password reset! Redirecting to login…");
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setSuccess(false);
      setApiMessage(res.msg || "Failed to reset password.");
      toast.error(res.msg || "Failed to reset password.");
    }
  }

  if (!token) {
    return (
      <div className="container">
        <div className="form-box">
          <h2>Reset Password</h2>
          <p className="error-msg" style={{ marginTop: "12px" }}>
            Invalid or missing reset link.
          </p>
          <p style={{ marginTop: "16px", fontSize: "13px" }}>
            <Link to="/request-reset">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Set New Password</h2>

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
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            onBlur={() => handleBlur("newPassword")}
            className={errors.newPassword ? "input-error" : ""}
            disabled={success}
          />

          {errors.newPassword && (
            <p className="error-msg">{errors.newPassword}</p>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            onBlur={() => handleBlur("confirmPassword")}
            className={errors.confirmPassword ? "input-error" : ""}
            disabled={success}
          />
          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword}</p>
          )}
        </div>

        {!success && (
          <button type="submit" disabled={loading}>
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        )}

        {apiMessage && (
          <p className={success ? "success-msg" : "error-msg"}>{apiMessage}</p>
        )}

        <p style={{ marginTop: "16px" }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
