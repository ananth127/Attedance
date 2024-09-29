require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User and Attendance models
const userSchema = new mongoose.Schema({
    name: String,
    reg_no: { type: String, unique: true },
    dept: String,
    section: String,
    year: String,
    phone_no: String,
    password: String,
}, { timestamps: true });

const attendanceSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    latitude: Number,
    longitude: Number,
    status: { type: String, enum: ['present', 'absent', 'on_duty'] },
    reason: String,
    fingerprint: String,
    ipAddress: String,  // New field for IP address
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Signup
app.post('/api/signup', async (req, res) => {
    const { name, reg_no, dept, section, year, phone_no, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, reg_no, dept, section, year, phone_no, password: hashedPassword });

    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { reg_no, password } = req.body;
    const user = await User.findOne({ reg_no });
    if (!user) return res.status(401).json({ message: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    // Create a token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const user_id = user._id;

    res.status(200).json({ token, reg_no, user_id });
});

// API endpoint to mark attendance
app.post('/api/attendance', async (req, res) => {
    const { user_id, latitude, longitude, status, reason, fingerprint } = req.body;
    const ipAddress = req.ip; // Get the user's IP address from the request

    // Check for the last attendance marking within 30 minutes
    const lastAttendance = await Attendance.findOne({ user_id }).sort({ createdAt: -1 });
    
    if (lastAttendance && (new Date() - lastAttendance.createdAt < 30 )) {
        return res.status(400).json({ message: 'Attendance already marked within the last 30 minutes.' });
    }

    // Check if attendance has already been marked for this user and IP address
    const existingAttendance = await Attendance.findOne({ user_id, ipAddress });
    if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance already marked from this IP address.' });
    }

    // Proceed to insert new attendance record
    const attendance = new Attendance({ user_id, latitude, longitude, status, reason, fingerprint, ipAddress });
    await attendance.save();
    res.status(200).json({ message: 'Attendance recorded successfully!', ipAddress });
});

// Proxy endpoint for reverse geocoding
app.get('/api/reverse-geocode', async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching place name' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
