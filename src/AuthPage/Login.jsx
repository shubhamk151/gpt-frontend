import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Perform login logic here
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
            const res = await fetch('http://localhost:8080/user/login', options);
            const data = await res.json();
            if (!data.token) {
                alert("Invalid Credentials");
            } else {
                localStorage.setItem('token', data.token);
                navigate("/");
            }
        } catch (err) {
            console.error(err);
        }


    };

    return (
        <div className='login-container'>
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>
                        <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type='submit'>Login</button>
                </form>

                <p>Don't have an account? <Link to="/signup"> Signup</Link></p>

            </div >
        </div >
    );
}

export default Login;