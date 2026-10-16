import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { HashLoader } from "react-spinners";

// const baseURL = "http://localhost:8080";
const baseURL = "https://gpt-backend-ot06.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/user/login`, options);

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Invalid Credentials");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.token) {
        alert("Invalid Credentials");
        setLoading(false);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.userId);
        setLoading(false);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="login-loading-overlay" role="status" aria-live="polite">
          <div className="login-loading-popup">
            <HashLoader color="#22d3ee" size={42} />
            <p>Signing you in...</p>
          </div>
        </div>
      )}

      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup"> Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
