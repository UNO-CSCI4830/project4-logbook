import React, { useState } from "react";
import './Forgotpage.css';
import { useNavigate } from "react-router-dom";

function ForgotPage() {
   const [email, setEmail] = useState('');
   const [newPass, setNewPassword] = useState('');
   const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
    const response = await fetch('http://localhost:8080/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPass })
    });

    if (response.ok) {
      alert("Password has been reset! Returning to Login.");
      navigate(-1);
    } else {
      alert("Invalid email!");
    }
}

   return(
    
    <div className="reset-things">
     <form onSubmit={handleSubmit}>
      <h1> Forgot your password? Reset it here!</h1>
                <input type="text" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="New Password" className="input-field" value={newPass} onChange={(e) => setNewPassword(e.target.value)}/>
                <button type="submit" className="reset-button">Click to reset</button>
            </form>
      <button type="button" className="back" onClick={() => navigate(-1)}>
        Click to return without resetting
      </button>
    </div>
    
    
        );
    }

export default ForgotPage;