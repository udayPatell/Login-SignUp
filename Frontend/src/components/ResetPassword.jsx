import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../redux/actions/authActions";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import "../App.css";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [apiMessage, setApiMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleBlur(field) {
    let error = "";
    if (field === "email") error = validateEmail(form.email);
    if (field === "currentPassword")
      error = form.currentPassword ? "" : "Current password is required.";
    if (field === "newPassword") error = validatePassword(form.newPassword);
    if (field === "confirmPassword")
      error = validateConfirmPassword(form.newPassword, form.confirmPassword);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function validateAll() {
    const result = {
      email: validateEmail(form.email),
      currentPassword: form.currentPassword
        ? ""
        : "Current password is required.",
      newPassword: validatePassword(form.newPassword),
      confirmPassword: validateConfirmPassword(
        form.newPassword,
        form.confirmPassword,
      ),
    };
    setErrors(result);
    return Object.values(result).every((e) => e === "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setApiMessage("");
    setSuccess(false);

    const res = await dispatch(
      resetPassword({
        email: form.email.trim(),
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setApiMessage(res.msg || "Password updated successfully.");

      setForm({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setSuccess(false);
      setApiMessage(res.msg || "Failed to update password.");
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Reset Password</h2>

        <div className="field-wrap">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="field-wrap">
          <input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            onBlur={() => handleBlur("currentPassword")}
            className={errors.currentPassword ? "input-error" : ""}
          />
          {errors.currentPassword && (
            <p className="error-msg">{errors.currentPassword}</p>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            onBlur={() => handleBlur("newPassword")}
            className={errors.newPassword ? "input-error" : ""}
          />

          {errors.newPassword && (
            <p className="error-msg">{errors.newPassword}</p>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Updating…" : "Update Password"}
        </button>

        {apiMessage && (
          <p className={success ? "success-msg" : "error-msg"}>{apiMessage}</p>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
