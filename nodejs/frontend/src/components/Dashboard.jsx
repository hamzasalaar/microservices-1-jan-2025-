import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const Dashboard = () => {
    const [html, setHtml] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Use useNavigate for redirection

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
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

                if (!response.ok) {
                    throw new Error('Failed to fetch page');
                }

                const htmlData = await response.text();
                setHtml(htmlData);  // Store the HTML response in state
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!html) {
        return <div>Loading...</div>;
    }

    // Render raw HTML from Django directly into React
    return (
        <div>
            {/* Render raw HTML from Django directly into React */}
            <div dangerouslySetInnerHTML={{ __html: html }} />

            {/* Logout button */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );

};

export default Dashboard;
