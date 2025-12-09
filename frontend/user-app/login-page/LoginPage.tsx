'use client'

import './LoginPage.css'; // optional styling
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      if (!email && !password) {
        alert('Please enter email and password');
        return;
      } else if (!password) {
        alert('Please enter password');
        return;
      }
    
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      // Read the token from the response body
      const token = await response.text(); // backend returns plain string JWT

      // Store it in localStorage
      localStorage.setItem("authToken", token);

      // Redirect to dashboard
      router.push('/user');
    } else {
      alert("Invalid credentials");
    }
};


    return (
        <div className="login-container">
            {/* Logo Placeholder */}
            <div className="logo-placeholder"><img src="lizard.png" alt="Logo" /></div>

            {/* Welcome Message */}
            <h2>Welcome to Eric's Appliance Logbook</h2>

            <p>Please log in to continue</p>

            {/* Input Fields */}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className="go-button">Login</button>
            </form>

            <div className="forgot-button">
            <button type="button" onClick={() => router.push('/forgot')}>
              Forgot Password?
            </button>
            </div>
        </div>
    );
}

export default LoginPage;