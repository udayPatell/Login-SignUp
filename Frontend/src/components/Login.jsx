import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom";
import { validateLoginForm, isFormValid } from "../utils/validators";
import { toast } from "react-toastify";
import "../App.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleBlur(field) {
    const result = validateLoginForm(form);
    setErrors((prev) => ({ ...prev, [field]: result[field] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = validateLoginForm(form);
    setErrors(result);
    if (!isFormValid(result)) return;

    setLoading(true);

    const res = await dispatch(
      login({ email: form.email.trim(), password: form.password }),
    );

    setLoading(false);

    if (res && res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast.error(res?.msg || "Email or password is wrong.");
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

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
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-msg">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>

        <p style={{ marginTop: "12px" }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <p style={{ marginTop: "6px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
