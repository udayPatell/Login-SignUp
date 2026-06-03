import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/actions/authActions";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleBlur(field) {
    let error = "";
    if (field === "currentPassword")
      error = form.currentPassword ? "" : "Current password is required.";
    if (field === "newPassword") error = validatePassword(form.newPassword);
    if (field === "confirmPassword")
      error = validateConfirmPassword(form.newPassword, form.confirmPassword);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function validateAll() {
    const result = {
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

    if (!user?.email) {
      toast.error("You must be logged in.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const res = await dispatch(
      changePassword({
        email: user.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );

    setLoading(false);

    if (res.success) {
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      if (res.msg?.toLowerCase().includes("current")) {
        setErrors((prev) => ({ ...prev, currentPassword: res.msg }));
      } else {
        toast.error(res.msg || "Failed to change password.");
      }
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Change Password</h2>

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

        <button type="submit" disabled={loading}>
          {loading ? "Changing…" : "Change Password"}
        </button>

        <p style={{ marginTop: "16px" }}>
          <Link to="/dashboard">Back to Dashboard</Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;
