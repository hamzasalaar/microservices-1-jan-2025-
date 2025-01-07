import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [html, setHtml] = useState('');
    const [user, setUser] = useState(null);  // State to store user data
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Use useNavigate for redirection

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Unauthorized. Please log in.');
                navigate('/login');
                return;
            }

            try {
                // Fetch initial HTML content from the Django backend
                const response = await fetch('http://127.0.0.1:8000/render-page/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }

                const htmlData = await response.text();
                setHtml(htmlData);  // Store the HTML response in state
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            }
        };

        fetchDashboard();
    }, [navigate]);

    const fetchCourses = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized. Please log in.');
            navigate('/login');
            return;
        }

        try {
            // Fetch courses from Django backend upon button click
            const response = await fetch('http://127.0.0.1:8000/fetch-courses/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const htmlData = await response.text();
            setHtml(htmlData);  // Store the HTML response in state
        } catch (err) {
            setError(err.message || 'Failed to fetch courses');
        }
    };

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
        return <div>Loading courses...</div>;
    }

    return (
        <div>
            {/* Logout Button */}
            <button onClick={handleLogout}>Logout</button>

            {/* Button to fetch courses */}
            <button onClick={fetchCourses}>Fetch Courses</button>

            {/* Render HTML content from Django */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};

export default Dashboard;
