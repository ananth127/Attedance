import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Attendance from './components/Attendance.js';
import './App.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [showSignup, setShowSignup] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={showSignup ? <Signup /> : !token ? <Login setToken={setToken} setUserId={setUserId} /> : <Attendance token={token} userId={userId} />} />
            </Routes>
            <button onClick={() => setShowSignup(!showSignup)}>
                {showSignup ? 'Go to Login' : 'Go to Signup'}
            </button>
        </div>
    );
};

export default App;
