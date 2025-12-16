import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const baseURL = "https://gpt-backend-ot06.onrender.com";
//   const baseURL = "http://localhost:8080";

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    };

    try {
      const link = `${baseURL}/user/signup`;
      const res = await fetch(link, options);

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "User already exists! Please login.");
        return;
      }

      const data = await res.json();
      if (!data.token) {
        alert("User already exists! Please login.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button className="signup-btn" type="submit">
            SignUP
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
