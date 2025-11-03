import './LoginPage.css'; // optional styling
import React, { useState } from 'react';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert("Login successful!");
    } else {
      alert("Invalid credentials");
    }
};


    return (
        <div className="login-container">
            {/* Logo Placeholder */}
            <div className="logo-placeholder">[Logo]</div>

            {/* Welcome Message */}
            <h2>Welcome to Our App</h2>

            {/* Input Fields */}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className="go-button">Go!</button>
            </form>
        </div>
    );
}

export default LoginPage;