import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../redux/actions/authActions";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    const res = await dispatch(resetPassword(form));

    if (res.success) {
      setMessage(res.msg);
    } else {
      setMessage(res.msg);
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Current Password"
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button type="submit">Update Password</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
