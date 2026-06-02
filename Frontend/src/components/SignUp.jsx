import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom";
import { validateSignupForm, isFormValid } from "../utils/validators";
import { toast } from "react-toastify";
import "../App.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleBlur(field) {
    const result = validateSignupForm(form);
    setErrors((prev) => ({ ...prev, [field]: result[field] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = validateSignupForm(form);
    setErrors(result);
    if (!isFormValid(result)) return;

    setLoading(true);
    // setApiMessage("");

    const res = await dispatch(
      signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }),
    );

    setLoading(false);

    if (res && res.msg === "User registered") {
      toast.success("Account created");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      toast.error(res?.msg || "Signup failed");
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Sign Up</h2>

        <div className="field-wrap">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

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

        <div className="field-wrap">
          <input
            type="password"
            placeholder="Confirm Password"
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
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
