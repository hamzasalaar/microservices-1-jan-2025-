import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);  // Log token to verify it's being retrieved from localStorage

    if (!token) {
        alert('Unauthorized. Please log in.');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/render-page/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response status:', response.status);  // Log the response status
        console.log('Response Content-Type:', response.headers.get('Content-Type'));  // Log the Content-Type

        // Check if the response is JSON
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        // Check if the response is of type 'application/json'
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            const data = await response.json();
            console.log('Response data:', data);  // Log the received data
            setUser(data);  // Update the state with the received user data
        } else {
            throw new Error('Expected JSON response but received something else.');
        }

    } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error(err);  // Log any fetch errors
    }};


        fetchDashboard();
    }, []);

    if (error) {
        return <div>{error}</div>;  // Show the error message if there's an error
    }

    if (!user) {
        return <div>Loading...</div>;  // Show loading if user data is still being fetched
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>  {/* Display user email */}
            <p>User ID: {user.id}</p>  {/* Display user ID */}
        </div>
    );
};

export default Dashboard;
