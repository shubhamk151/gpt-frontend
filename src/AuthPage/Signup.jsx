import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
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
                username: username,
                email: email,
                password: password,
            }),
        };

        try {
            const res = await fetch('https://gpt-backend-ot06.onrender.com/user/signup', options);
            const data = await res.json();
            if (!data.token) {
                alert("User already exists! Please login.");
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate("/");
            }
        } catch (err) {
            console.error(err);
        }


    };

    return (
        <div className='signup-container'>
            <div className="signup-card">
                <h2>Signup</h2>
                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Username</label>
                        <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className='signup-btn' type='submit'>SignUP</button>
                </form>
                <p>Already have an account? <Link to="/login"> Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;