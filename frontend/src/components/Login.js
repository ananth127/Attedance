import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setUserId }) => {
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            const response = await axios.post('https://attedance-lc2b.vercel.app/api/login', { reg_no: regNo, password });
            const token = response.data.token;
            const userId = response.data.user_id; // Ensure this matches your API response structure
    
            // Store token and user ID using the passed functions
            setToken(token);
            setUserId(userId); // Store user ID
    
            // Navigate to Attendance with user ID
            //navigate("/attendance", { state: { userId } });
        } catch (err) {
            // Use a fallback error message if no specific message is provided
            const message = err.response?.data?.message || 'Please try again.';
            setError(message);
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Registration Number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
