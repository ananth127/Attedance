import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Attendance = ({ token, userId }) => {
    const [location, setLocation] = useState({});
    const [placeName, setPlaceName] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('present');
    const [reason, setReason] = useState('');
    const [warning, setWarning] = useState('Message');
    const [fingerprint, setFingerprint] = useState('');
    
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const coords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        setLocation(coords);
                        await fetchPlaceName(coords.latitude, coords.longitude);
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        };

        getLocation();

        FingerprintJS.load().then(fp => {
            fp.get().then(result => {
                setFingerprint(result.visitorId);
            });
        });
    }, []);

    // Function to fetch the place name using the proxy
    const fetchPlaceName = async (latitude, longitude) => {
        try {
            const response = await axios.get(`/api/reverse-geocode`, {
                params: { latitude, longitude }
            });
            setPlaceName(response.data.display_name);
        } catch (err) {
            console.error('Error fetching place name:', err);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                'http://172.16.17.8:5000/api/attendance',
                { user_id: userId, ...location, status, reason, fingerprint },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWarning("Attendance marked successfully!");
            console.log('Attendance marked:', response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error marking attendance. Please try again.';
            setWarning(errorMessage);
            console.error('Error marking attendance:', err);
        }
    };

    return (
        <div className="attendance">
            <h1>Mark Attendance</h1>
            {error && <p>Error: {error}</p>}

            {location.latitude && location.longitude ? (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                    {placeName && <p>Location: {placeName}</p>} {/* Display the place name */}
                    <select onChange={(e) => setStatus(e.target.value)} value={status}>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="on_duty">On Duty</option>
                    </select>
                    {status === 'absent' && (
                        <input
                            placeholder="Reason for absence"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    )}
                    <button onClick={handleSubmit}>Mark Attendance</button>
                    <p>{warning}</p>
                </div>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
};

export default Attendance;
