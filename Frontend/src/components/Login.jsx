import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authActions";
import "../App.css";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(login(form));

    if (res && res.user) {
      setMessage(" Login successful! Email and password are correct.");
    } else {
      setMessage(" Email or password is wrong.");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>

        {message && <p>{message}</p>}
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <p>
          Reset password? <Link to="/reset-password">Click here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
