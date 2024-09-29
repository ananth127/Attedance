import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [regNo, setRegNo] = useState('');
    const [dept, setDept] = useState('IT');
    const [section, setSection] = useState('A');
    const [year, setYear] = useState('1');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://attedance-lc2b.vercel.app/api/signup', {
                name,
                reg_no: regNo,
                dept,
                section,
                year,
                phone_no: phoneNo,
                password,
            });
            setSuccess(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Signup failed');
            setSuccess('');
        }
    };

    return (
        <div className="signup">
            <h1>Signup</h1>
            {error && <p>Error: {error}</p>}
            {success && <p>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Registration Number" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
                <select value={dept} onChange={(e) => setDept(e.target.value)}>
                    <option value="IT">IT</option>
                    <option value="CSE">CSE</option>
                    <option value="AIDS">AIDS</option>
                    <option value="EEE">EEE</option>
                    <option value="ECE">ECE</option>
                </select>
                <select value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <input type="text" placeholder="Phone Number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
