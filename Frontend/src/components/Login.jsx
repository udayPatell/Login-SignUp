import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, checkEmail } from "../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "../App.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checking, setChecking] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setChecking(true);
    const res = await dispatch(checkEmail(email.trim()));
    setChecking(false);

    if (!res.success) {
      setEmailError(res.msg || "Error checking email.");
      return;
    }
    if (res.exists) {
      setStep(2);
    } else {
      setEmailError("This email is not registered. Please sign up.");
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const err = password ? "" : "Password is required.";
    setPasswordError(err);
    if (err) return;

    setLoading(true);
    const res = await dispatch(login({ email: email.trim(), password }));
    setLoading(false);

    if (res && res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setPasswordError(res?.msg || "Incorrect password. Please try again.");
    }
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2>Login</h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <div className="field-wrap">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                className={emailError ? "input-error" : ""}
              />
              {emailError && <p className="error-msg">{emailError}</p>}
            </div>

            <button type="submit" disabled={checking}>
              {checking ? "Checking…" : "Continue"}
            </button>

            <p style={{ marginTop: "12px" }}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p style={{ marginTop: "6px" }}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#161922",
                border: "1px solid #2a2f3d",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#e8eaf0" }}>
                {email}
              </span>
              <span
                onClick={() => {
                  setStep(1);
                  setPassword("");
                  setPasswordError("");
                }}
                style={{
                  fontSize: "12px",
                  color: "#4ade80",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Change
              </span>
            </div>

            <div className="field-wrap">
              <div className="input-eye-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  autoFocus
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onBlur={() =>
                    setPasswordError(password ? "" : "Password is required.")
                  }
                  className={passwordError ? "input-error" : ""}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>
              {passwordError && <p className="error-msg">{passwordError}</p>}
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
        )}
      </div>
    </div>
  );
}

export default Login;
