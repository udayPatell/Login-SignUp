import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestReset } from "../redux/actions/authActions";
import { validateEmail } from "../utils/validators";
import { Link } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function checkEmail() {
    const err = validateEmail(email);
    setEmailError(err);
    return !err;
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!checkEmail()) return;

    setLoading(true);
    setApiMessage("");
    setMessageType("");

    const res = await dispatch(requestReset(email.trim()));

    setLoading(false);

    if (res.success) {
      setForgotSent(true);
      setMessageType("forgot");
    } else {
      setMessageType("error");
      setApiMessage(res.msg || "Failed to send link.");
    }
  }

  // async function handleResetSubmit(e) {
  //   e.preventDefault();
  //   if (!checkEmail()) return;

  //   setResetLoading(true);
  //   setApiMessage("");
  //   setMessageType("");

  //   const res = await dispatch(requestReset(email.trim()));

  //   setResetLoading(false);

  //   if (res.success) {
  //     setResetSent(true);
  //     setMessageType("reset");
  //     setApiMessage("Reset password link sent! Check your email inbox.");
  //   } else {
  //     setMessageType("error");
  //     setApiMessage(res.msg || "Failed to send reset link.");
  //   }
  // }

  function InfoBox({ sentEmail, onTryAgain }) {
    return <div></div>;
  }

  return (
    <div className="container">
      <form className="form-box" noValidate>
        <h2>Forgot Password</h2>

        <p className="step-desc">
          Enter your account email and we'll send you a reset link.
        </p>

        <div className="field-wrap">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setApiMessage("");
              setForgotSent(false);
              setResetSent(false);
            }}
            onBlur={() => setEmailError(validateEmail(email))}
            className={emailError ? "input-error" : ""}
            disabled={forgotSent || resetSent}
          />
          {emailError && <p className="error-msg">{emailError}</p>}
        </div>

        {apiMessage && (
          <p className={messageType === "error" ? "error-msg" : "success-msg"}>
            {apiMessage}
          </p>
        )}

        {forgotSent && (
          <InfoBox
            sentEmail={email}
            onTryAgain={() => {
              setForgotSent(false);
              setApiMessage("");
              setEmail("");
            }}
          />
        )}

        {resetSent && (
          <InfoBox
            sentEmail={email}
            onTryAgain={() => {
              setResetSent(false);
              setApiMessage("");
              setEmail("");
            }}
          />
        )}

        {!forgotSent && !resetSent && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "4px",
            }}
          >
            <button
              type="button"
              onClick={handleForgotSubmit}
              disabled={loading || resetLoading}
            >
              {loading ? "Sending…" : "Send Forgot Password Link"}
            </button>

            {/* <button
              type="button"
              onClick={handleResetSubmit}
              disabled={loading || resetLoading}
              style={{
                background: "transparent",
                border: "1px solid #1a3d28",
                color: "#4ade80",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {resetLoading ? "Sending…" : "Reset Password"}
            </button> */}
          </div>
        )}

        <p style={{ marginTop: "16px" }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
