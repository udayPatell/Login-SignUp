import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestReset } from "../redux/actions/authActions";
import { validateEmail } from "../utils/validators";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

function RequestReset() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    setApiMessage("");

    setSuccess(false);

    const res = await dispatch(requestReset(email.trim()));

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      toast.success("Reset link sent! Check your email inbox.");
    } else {
      setSuccess(false);
      toast.error(res.msg || "Failed to send reset email.");
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} noValidate>
        <h2>Reset Password</h2>

        <p className="step-desc">
          Enter your account email and we'll send you a reset link.
        </p>

        <div className="field-wrap">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              toast.dismiss();
              setSuccess(false);
            }}
            onBlur={() => setEmailError(validateEmail(email))}
            className={emailError ? "input-error" : ""}
            disabled={success}
          />
          {emailError && <p className="error-msg">{emailError}</p>}
        </div>
        {!success && (
          <button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        )}
        {apiMessage && (
          <p className={success ? "success-msg" : "error-msg"}>{apiMessage}</p>
        )}

        {success && (
          <div>
            <p className="success-msg">
              Reset link sent! Check your email inbox.
            </p>
          </div>
        )}

        <p style={{ marginTop: "16px" }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RequestReset;
