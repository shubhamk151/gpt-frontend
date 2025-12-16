import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { SyncLoader } from "react-spinners";

// const baseURL = "http://localhost:8080";
const baseURL = "https://gpt-backend-ot06.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="login-card">
        <SyncLoader color="#09fa46ff" loading={loading} />
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
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/signup"> Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
